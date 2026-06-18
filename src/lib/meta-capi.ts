import crypto from "crypto";

const PIXEL_ID = process.env.META_PIXEL_ID || "1531746671789593";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN!;
const API_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`;

/** SHA-256 hash a string (for email/phone — required by Meta) */
function hash(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** Normalise a phone number to E.164-style digits only, then hash */
function hashPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Prefix country code 91 if not already present
  const normalised = digits.startsWith("91") ? digits : `91${digits}`;
  return crypto.createHash("sha256").update(normalised).digest("hex");
}

interface CAPIPurchaseParams {
  eventId: string;        // order ID — used to deduplicate with browser pixel
  email: string;
  phone: string;
  amount: number;
  currency?: string;
  contentIds: string[];   // product IDs
  numItems: number;
}

/**
 * Send a Purchase event to Meta Conversions API.
 * Fire-and-forget — errors are logged but never thrown to avoid failing the order response.
 */
export async function sendCAPIPurchase(params: CAPIPurchaseParams): Promise<void> {
  console.log("[CAPI] sendCAPIPurchase called. Event ID:", params.eventId);
  console.log("[CAPI] ACCESS_TOKEN present:", !!ACCESS_TOKEN);
  console.log("[CAPI] PIXEL_ID:", PIXEL_ID);

  if (!ACCESS_TOKEN) {
    console.warn("[CAPI] META_CAPI_ACCESS_TOKEN is not set — skipping.");
    return;
  }

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: params.eventId,   // matches event_id sent from browser for deduplication
        action_source: "website",
        user_data: {
          em: [hash(params.email)],
          ph: [hashPhone(params.phone)],
        },
        custom_data: {
          currency: params.currency ?? "INR",
          value: params.amount,
          content_ids: params.contentIds,
          content_type: "product",
          num_items: params.numItems,
        },
      },
    ],
    access_token: ACCESS_TOKEN,
    test_event_code: "TEST71090",
  };

  try {
    console.log("[CAPI] Sending to Meta API:", API_URL);

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      console.error("[CAPI] ❌ Request timed out after 8 seconds");
    }, 8000);

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    console.log("[CAPI] Got response. Status:", res.status);

    const responseText = await res.text();
    if (!res.ok) {
      console.error("[CAPI] Meta API error (status", res.status, "):", responseText);
    } else {
      console.log("[CAPI] ✅ Purchase event sent successfully. Event ID:", params.eventId);
      console.log("[CAPI] Meta response:", responseText);
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      console.error("[CAPI] ❌ Fetch aborted — Meta API did not respond in time.");
    } else {
      console.error("[CAPI] ❌ Fetch failed:", err);
    }
  }
}
