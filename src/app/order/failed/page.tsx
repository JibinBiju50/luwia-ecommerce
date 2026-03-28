import Link from "next/link";
import { XCircle } from "lucide-react";

export default function OrderFailedPage() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-red-50/30 to-white flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center animate-fade-in-up">
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-brand-text mb-3">
          Payment Failed
        </h1>
        <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
          We couldn&apos;t process your payment. Don&apos;t worry — your cart is safe
          and no amount was deducted.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-white gradient-brand rounded-full hover:opacity-90 transition-opacity shadow-brand"
          >
            Retry Payment
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-brand-primary border-2 border-brand-primary/20 rounded-full hover:border-brand-primary/40 transition-colors"
          >
            Return to Cart
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          If the issue persists, please contact us at{" "}
          <a href="mailto:luwiaskinscience@gmail.com" className="text-brand-primary hover:underline">
            luwiaskinscience@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
