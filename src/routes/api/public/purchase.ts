import { createFileRoute } from "@tanstack/react-router";

/**
 * Endpoint público para o gateway de checkout notificar a venda (Purchase/Lead).
 * O evento server-side só dispara aqui — nunca no carregamento da página.
 * Protegido por um segredo compartilhado opcional (header x-webhook-secret).
 */
export const Route = createFileRoute("/api/public/purchase")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expectedSecret = process.env["PURCHASE_WEBHOOK_SECRET"];
        if (expectedSecret && request.headers.get("x-webhook-secret") !== expectedSecret) {
          return new Response("Invalid secret", { status: 401 });
        }

        let payload: Record<string, unknown>;
        try {
          payload = (await request.json()) as Record<string, unknown>;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const eventName = payload["eventName"] === "Lead" ? "Lead" : "Purchase";
        const transactionId = String(payload["transactionId"] ?? payload["orderId"] ?? "");
        if (!transactionId) return new Response("Missing transactionId", { status: 400 });

        const { trackServerEvent } = await import("@/lib/tracking.functions");
        await trackServerEvent({
          data: {
            eventName,
            eventId: `${eventName}.${transactionId}`,
            transactionId,
            value: Number(payload["value"] ?? 0),
            currency: String(payload["currency"] ?? "BRL"),
            contentName: payload["contentName"] ? String(payload["contentName"]) : undefined,
            email: payload["email"] ? String(payload["email"]) : undefined,
            phone: payload["phone"] ? String(payload["phone"]) : undefined,
            pageUrl: payload["pageUrl"] ? String(payload["pageUrl"]) : undefined,
            referrer: payload["referrer"] ? String(payload["referrer"]) : undefined,
            fbp: payload["fbp"] ? String(payload["fbp"]) : undefined,
            fbc: payload["fbc"] ? String(payload["fbc"]) : undefined,
            utms: (payload["utms"] as Record<string, string> | undefined) ?? {},
          },
        });

        return Response.json({ ok: true });
      },
    },
  },
});
