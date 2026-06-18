"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Package, MapPin, CreditCard, Banknote } from "lucide-react";
import { purchase } from "@/lib/fbpixel";

interface OrderInfo {
  orderId: string;
  fullName: string;
  email: string;
  quantity: number;
  amount: number;
  paymentMethod: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<OrderInfo | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("luwia-order");
    if (stored) {
      const parsed: OrderInfo & { items?: { productId: string; quantity: number }[] } = JSON.parse(stored);
      setOrder(parsed);
      sessionStorage.removeItem("luwia-order");
      // Fire Meta Pixel Purchase event (eventId matches CAPI for deduplication)
      purchase({
        eventId: parsed.orderId,
        value: parsed.amount,
        currency: "INR",
        num_items: parsed.quantity,
        content_ids: parsed.items?.map((i) => i.productId) ?? [],
        content_type: "product",
      });
    }
  }, []);

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-brand-bg to-white flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-text">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Thank you for choosing Luwia. Your glow journey starts now!
          </p>
        </div>

        {order ? (
          <div className="bg-white rounded-2xl p-6 shadow-brand border border-gray-100 animate-fade-in-up space-y-5">
            {/* Order ID */}
            <div className="text-center pb-4 border-b border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-widest">Order ID</p>
              <p className="text-lg font-bold text-brand-primary mt-1">
                #{order.orderId?.slice(0, 8).toUpperCase()}
              </p>
            </div>

            {/* Order Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-brand-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-brand-text">
                    Luwia — Pearl Radiance Cream × {order.quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {order.paymentMethod === "cod" ? (
                  <Banknote className="w-4 h-4 text-brand-primary flex-shrink-0" />
                ) : (
                  <CreditCard className="w-4 h-4 text-brand-primary flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm text-gray-500">
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}
                  </p>
                  <p className="text-lg font-bold text-brand-text">₹{order.amount}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="text-sm font-medium text-brand-text">
                    {order.fullName}
                    <br />
                    {order.addressLine1}
                    {order.addressLine2 && <>, {order.addressLine2}</>}
                    <br />
                    {order.city}, {order.state} - {order.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery note */}
            <div className="bg-brand-bg/50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">
                📦 Estimated delivery: <span className="font-semibold">3-5 business days</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Tracking details will be shared via email after dispatch.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-brand text-center">
            <p className="text-gray-500 text-sm">
              Your order was placed successfully. Check your email for confirmation details.
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <a
            href={`https://wa.me/917025459137?text=${encodeURIComponent(
              `Hi Luwia! I just placed an order. My Order ID is #${order?.orderId?.slice(0, 8).toUpperCase() || 'unknown'}. Please send me order updates here!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#25D366] rounded-full hover:bg-[#128C7E] transition-colors shadow-lg"
          >
            Get Updates on WhatsApp
          </a>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-brand-primary bg-brand-light/10 border-2 border-brand-primary/20 rounded-full hover:border-brand-primary/40 hover:bg-brand-bg transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
