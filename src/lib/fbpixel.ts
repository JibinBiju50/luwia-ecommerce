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
  fbq("track", "ViewContent", params);
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
  fbq("track", "AddToCart", params);
}

/** User clicked Proceed to Checkout or Buy Now */
export function initiateCheckout(params: {
  num_items: number;
  value: number;
  currency: string;
}) {
  fbq("track", "InitiateCheckout", params);
}

/** Order placed successfully */
export function purchase(params: {
  value: number;
  currency: string;
  num_items: number;
  content_ids: string[];
  content_type: string;
}) {
  fbq("track", "Purchase", params);
}
