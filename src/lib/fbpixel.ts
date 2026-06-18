/* eslint-disable @typescript-eslint/no-explicit-any */

export const PIXEL_ID = "1531746671789593";

// Safe wrapper — only fires in browser and when fbq is loaded
function fbq(...args: any[]) {
  if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
    (window as any).fbq(...args);
  }
}

/** Fired automatically via the base pixel script on every page. */
export function pageview() {
  fbq("track", "PageView");
}

/** Product detail page viewed */
export function viewContent(params: {
  content_name: string;
  content_ids: string[];
  content_type: string;
  value: number;
  currency: string;
}) {
  // Deduplication key: product ID + timestamp (unique per view session)
  const eventID = `vc-${params.content_ids[0]}-${Date.now()}`;
  fbq("track", "ViewContent", params, { eventID });
}

/** Item added to cart */
export function addToCart(params: {
  content_name: string;
  content_ids: string[];
  content_type: string;
  value: number;
  currency: string;
  num_items: number;
}) {
  const eventID = `atc-${params.content_ids[0]}-${Date.now()}`;
  fbq("track", "AddToCart", params, { eventID });
}

/** User clicked Proceed to Checkout or Buy Now */
export function initiateCheckout(params: {
  num_items: number;
  value: number;
  currency: string;
}) {
  const eventID = `ic-${Date.now()}`;
  fbq("track", "InitiateCheckout", params, { eventID });
}

/** Order placed successfully */
export function purchase(params: {
  eventId: string;      // order ID — must match the CAPI event_id
  value: number;
  currency: string;
  num_items: number;
  content_ids: string[];
  content_type: string;
}) {
  fbq("track", "Purchase", {
    value: params.value,
    currency: params.currency,
    num_items: params.num_items,
    content_ids: params.content_ids,
    content_type: params.content_type,
  }, { eventID: params.eventId });
}
