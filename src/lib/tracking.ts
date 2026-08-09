/**
 * Client-side tracking helpers: UTM capture/persistence, Meta Pixel loading,
 * fbp/fbc reading and deduplicated event dispatch.
 * No secret tokens are used here — only the public Meta Pixel ID.
 */

export const META_PIXEL_ID = "2762565494141055";

export const UTM_KEYS = [
  "utm_source",
  "utm_campaign",
  "utm_medium",
  "utm_content",
  "utm_term",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type Utms = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = "lp_utms";
const CLICK_KEYS = ["fbclid", "gclid", "ttclid", "xcod", "sck"] as const;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[] };
    _fbq?: unknown;
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

/** Reads UTMs from the current URL, merges with the stored ones and persists. */
export function captureUtms(): Utms {
  if (!isBrowser()) return {};
  const params = new URLSearchParams(window.location.search);
  const stored = getStoredUtms();
  const fresh: Record<string, string> = {};

  for (const key of [...UTM_KEYS, ...CLICK_KEYS]) {
    const value = params.get(key);
    if (value) fresh[key] = value;
  }

  const merged = { ...stored, ...fresh };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    /* storage unavailable — keep working without persistence */
  }
  return merged;
}

export function getStoredUtms(): Utms {
  if (!isBrowser()) return {};
  try {
    const raw =
      window.sessionStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Utms) : {};
  } catch {
    return {};
  }
}

/** Current UTMs: URL params always win, storage is the fallback. */
export function getUtms(): Utms {
  return { ...getStoredUtms(), ...captureUtms() };
}

/** Appends the captured UTMs (and click ids) to an outbound URL, e.g. checkout. */
export function withUtms(url: string): string {
  if (!isBrowser()) return url;
  try {
    const target = new URL(url, window.location.href);
    const utms = getUtms() as Record<string, string>;
    for (const [key, value] of Object.entries(utms)) {
      if (value && !target.searchParams.has(key)) target.searchParams.set(key, value);
    }
    return target.toString();
  } catch {
    return url;
  }
}

export function getCookie(name: string): string | undefined {
  if (!isBrowser()) return undefined;
  const match = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]!) : undefined;
}

export function getFbp() {
  return getCookie("_fbp");
}

/** _fbc cookie, or one derived from fbclid when the pixel hasn't written it yet. */
export function getFbc() {
  const cookie = getCookie("_fbc");
  if (cookie) return cookie;
  const fbclid = isBrowser()
    ? new URLSearchParams(window.location.search).get("fbclid") ??
      (getStoredUtms() as Record<string, string>)["fbclid"]
    : undefined;
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
}

export function newEventId(name: string) {
  const rand =
    isBrowser() && window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${name}.${Date.now()}.${rand}`;
}

/** Loads the Meta Pixel base code once (no duplicate insertion). */
export function initMetaPixel() {
  if (!isBrowser()) return;
  if (!window.fbq) {
    const fbq: any = function (...args: unknown[]) {
      fbq.callMethod ? fbq.callMethod.apply(fbq, args) : fbq.queue.push(args);
    };
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    window.fbq = fbq;
    window._fbq = fbq;
  }
  if (!document.getElementById("meta-pixel-script")) {
    const script = document.createElement("script");
    script.id = "meta-pixel-script";
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }
  const w = window as unknown as { __metaPixelInit?: boolean };
  if (!w.__metaPixelInit) {
    w.__metaPixelInit = true;
    window.fbq?.("init", META_PIXEL_ID);
  }
}

const firedOnce = new Set<string>();

/** Fires a browser pixel event. `once` guards against duplicates per page load. */
export function trackPixel(
  eventName: string,
  params: Record<string, unknown> = {},
  options: { eventId?: string; once?: boolean } = {},
) {
  if (!isBrowser()) return undefined;
  const eventId = options.eventId ?? newEventId(eventName);
  const dedupeKey = options.once ? eventName : `${eventName}:${eventId}`;
  if (firedOnce.has(dedupeKey)) return undefined;
  firedOnce.add(dedupeKey);
  window.fbq?.("track", eventName, params, { eventID: eventId });
  return eventId;
}

/** Context sent to the server for Conversions API / UTMify attribution. */
export function getTrackingContext() {
  if (!isBrowser()) return {};
  return {
    utms: getUtms(),
    pageUrl: window.location.href,
    referrer: document.referrer || undefined,
    fbp: getFbp(),
    fbc: getFbc(),
    userAgent: navigator.userAgent,
  };
}
