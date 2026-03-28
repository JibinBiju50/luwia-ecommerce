import { Truck, Clock, MapPin } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-brand-primary tracking-widest uppercase mb-3">
            Delivery Information
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text">
            Shipping Policy
          </h1>
        </div>

        {/* Highlights */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="text-center p-5 bg-brand-bg/50 rounded-2xl">
            <Truck className="w-6 h-6 text-brand-primary mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-brand-text">Free Shipping</h3>
            <p className="text-xs text-gray-500 mt-1">On all orders</p>
          </div>
          <div className="text-center p-5 bg-brand-bg/50 rounded-2xl">
            <Clock className="w-6 h-6 text-brand-primary mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-brand-text">1–3 Days Processing</h3>
            <p className="text-xs text-gray-500 mt-1">Quick dispatch</p>
          </div>
          <div className="text-center p-5 bg-brand-bg/50 rounded-2xl">
            <MapPin className="w-6 h-6 text-brand-primary mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-brand-text">Pan-India Delivery</h3>
            <p className="text-xs text-gray-500 mt-1">We deliver everywhere</p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="space-y-6 text-sm text-gray-600">
          <div className="bg-brand-bg/30 rounded-2xl p-6 border border-brand-primary/5">
            <h2 className="text-lg font-semibold text-brand-text mb-3">
              Processing Time
            </h2>
            <p>
              Orders are processed within <strong>1–3 business days</strong> after confirmation.
              Orders placed on weekends or holidays will be processed on the next business day.
            </p>
          </div>

          <div className="bg-brand-bg/30 rounded-2xl p-6 border border-brand-primary/5">
            <h2 className="text-lg font-semibold text-brand-text mb-3">
              Delivery Time
            </h2>
            <p>
              Delivery time is <strong>3–7 business days</strong> depending on your location.
              Metro cities typically receive orders faster than remote areas.
            </p>
          </div>

          <div className="bg-brand-bg/30 rounded-2xl p-6 border border-brand-primary/5">
            <h2 className="text-lg font-semibold text-brand-text mb-3">
              Tracking
            </h2>
            <p>
              Tracking details will be shared via email after dispatch. You can track your
              order status using the tracking link provided.
            </p>
          </div>

          <div className="bg-brand-bg/30 rounded-2xl p-6 border border-brand-primary/5">
            <h2 className="text-lg font-semibold text-brand-text mb-3">
              Delivery Charges
            </h2>
            <p>
              <strong>Free delivery</strong> on all orders across India. No minimum order value required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
