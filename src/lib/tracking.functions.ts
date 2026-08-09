import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

/**
 * Server-side tracking. Secrets (META_ACCESS_TOKEN, UTMIFY_API_TOKEN) are read
 * inside the handlers only — they never reach the browser bundle.
 */

const META_PIXEL_ID = "2762565494141055";
const META_API_VERSION = "v21.0";
const UTMIFY_ORDERS_URL = "https://api.utmify.com.br/api-credentials/orders";

type Utms = Record<string, string | undefined>;

type EventInput = {
  eventName: "PageView" | "ViewContent" | "InitiateCheckout" | "Purchase" | "Lead";
  eventId: string;
  pageUrl?: string;
  referrer?: string;
  fbp?: string;
  fbc?: string;
  userAgent?: string;
  utms?: Utms;
  value?: number;
  currency?: string;
  transactionId?: string;
  contentName?: string;
  email?: string;
  phone?: string;
};

function validateEvent(input: unknown): EventInput {
  const data = input as EventInput;
  const allowed = ["PageView", "ViewContent", "InitiateCheckout", "Purchase", "Lead"];
  if (!data || typeof data !== "object" || !allowed.includes(data.eventName)) {
    throw new Error("Invalid event");
  }
  if (typeof data.eventId !== "string" || data.eventId.length === 0) {
    throw new Error("Missing eventId");
  }
  return data;
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Sends a Conversions API event to Meta (deduplicated with the browser pixel
 * through the shared event_id) and, for purchases, an order to UTMify.
 */
export const trackServerEvent = createServerFn({ method: "POST" })
  .inputValidator(validateEvent)
  .handler(async ({ data }) => {
    const metaToken = process.env["META_ACCESS_TOKEN"];
    const utmifyToken = process.env["UTMIFY_API_TOKEN"];

    const ip = getRequestIP({ xForwardedFor: true });
    const userAgent = data.userAgent ?? getRequestHeader("user-agent") ?? undefined;
    const timestamp = Math.floor(Date.now() / 1000);

    const results: { meta?: string; utmify?: string } = {};

    if (metaToken) {
      const userData: Record<string, unknown> = {
        client_ip_address: ip,
        client_user_agent: userAgent,
        fbp: data.fbp,
        fbc: data.fbc,
      };
      if (data.email) userData["em"] = [await sha256(data.email)];
      if (data.phone) userData["ph"] = [await sha256(data.phone.replace(/\D/g, ""))];

      const payload = {
        data: [
          {
            event_name: data.eventName,
            event_time: timestamp,
            event_id: data.eventId,
            event_source_url: data.pageUrl,
            action_source: "website",
            referrer_url: data.referrer,
            user_data: userData,
            custom_data: {
              currency: data.currency ?? "BRL",
              value: data.value,
              content_name: data.contentName,
              order_id: data.transactionId,
              ...data.utms,
            },
          },
        ],
      };

      try {
        const response = await fetch(
          `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${metaToken}`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
        results.meta = response.ok ? "ok" : `error_${response.status}`;
        if (!response.ok) console.error("Meta CAPI error", await response.text());
      } catch (error) {
        console.error("Meta CAPI request failed", error);
        results.meta = "failed";
      }
    } else {
      results.meta = "missing_token";
    }

    if (utmifyToken && (data.eventName === "Purchase" || data.eventName === "Lead")) {
      const utms = data.utms ?? {};
      const nowUtc = new Date().toISOString().replace("T", " ").slice(0, 19);
      const amountCents = Math.round((data.value ?? 0) * 100);

      const order = {
        orderId: data.transactionId ?? data.eventId,
        platform: "LandingPage",
        paymentMethod: "pix",
        status: data.eventName === "Purchase" ? "paid" : "waiting_payment",
        createdAt: nowUtc,
        approvedDate: data.eventName === "Purchase" ? nowUtc : null,
        refundedAt: null,
        customer: {
          name: null,
          email: data.email ?? null,
          phone: data.phone ?? null,
          document: null,
          country: "BR",
          ip,
        },
        products: [
          {
            id: data.contentName ?? "produto",
            name: data.contentName ?? "Produto",
            planId: null,
            planName: null,
            quantity: 1,
            priceInCents: amountCents,
          },
        ],
        trackingParameters: {
          src: utms["src"] ?? null,
          sck: utms["sck"] ?? null,
          utm_source: utms["utm_source"] ?? null,
          utm_campaign: utms["utm_campaign"] ?? null,
          utm_medium: utms["utm_medium"] ?? null,
          utm_content: utms["utm_content"] ?? null,
          utm_term: utms["utm_term"] ?? null,
        },
        commission: {
          totalPriceInCents: amountCents,
          gatewayFeeInCents: 0,
          userCommissionInCents: amountCents,
        },
        isTest: false,
      };

      try {
        const response = await fetch(UTMIFY_ORDERS_URL, {
          method: "POST",
          headers: { "content-type": "application/json", "x-api-token": utmifyToken },
          body: JSON.stringify(order),
        });
        results.utmify = response.ok ? "ok" : `error_${response.status}`;
        if (!response.ok) console.error("UTMify error", await response.text());
      } catch (error) {
        console.error("UTMify request failed", error);
        results.utmify = "failed";
      }
    }

    return { ok: true, ...results };
  });
