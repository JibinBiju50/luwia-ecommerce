"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import { CreditCard, Banknote, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PRODUCT } from "@/lib/product";
import { INDIAN_STATES } from "@/lib/indian-states";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

const initialFormData: FormData = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

type PaymentMethod = "online" | "cod";

export default function CheckoutPage() {
  const router = useRouter();
  const { quantity, clearCart } = useCart();
  const [form, setForm] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [processing, setProcessing] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (quantity === 0) {
      router.push("/cart");
    }
  }, [quantity, router]);

  const unitPrice = paymentMethod === "online" ? PRODUCT.onlinePrice : PRODUCT.codPrice;
  const total = quantity * unitPrice;
  const savings = paymentMethod === "online" ? quantity * (PRODUCT.codPrice - PRODUCT.onlinePrice) : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    if (!form.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(form.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    setProcessing(true);

    if (paymentMethod === "online") {
      await handleOnlinePayment();
    } else {
      await handleCodOrder();
    }
  };

  const handleOnlinePayment = async () => {
    try {
      // Create Razorpay order
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Luwia Skin Science",
        description: PRODUCT.name,
        order_id: data.orderId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: {
                  ...form,
                  quantity,
                  amount: total,
                  paymentMethod: "online",
                },
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              // Store order info for success page
              sessionStorage.setItem(
                "luwia-order",
                JSON.stringify({
                  orderId: verifyData.orderId,
                  ...form,
                  quantity,
                  amount: total,
                  paymentMethod: "online",
                })
              );
              clearCart();
              router.push("/order/success");
            } else {
              router.push("/order/failed");
            }
          } catch {
            router.push("/order/failed");
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#8B8FBF",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setProcessing(false);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleCodOrder = async () => {
    try {
      const res = await fetch("/api/place-cod-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderDetails: {
            ...form,
            quantity,
            amount: total,
            paymentMethod: "cod",
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      sessionStorage.setItem(
        "luwia-order",
        JSON.stringify({
          orderId: data.orderId,
          ...form,
          quantity,
          amount: total,
          paymentMethod: "cod",
        })
      );
      clearCart();
      router.push("/order/success");
    } catch {
      setProcessing(false);
      alert("Something went wrong. Please try again.");
    }
  };

  if (quantity === 0) return null;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="bg-gray-50/50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-text mb-8">
            Checkout
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Form + Payment Method */}
            <div className="lg:col-span-2 space-y-6">
              {/* Address Form */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-brand-text mb-5">
                  Delivery Address
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all ${
                        errors.fullName ? "border-red-300 bg-red-50/50" : "border-gray-200"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all ${
                        errors.email ? "border-red-300 bg-red-50/50" : "border-gray-200"
                      }`}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all ${
                        errors.phone ? "border-red-300 bg-red-50/50" : "border-gray-200"
                      }`}
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Address Line 1 */}
                  <div className="sm:col-span-2">
                    <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      id="addressLine1"
                      name="addressLine1"
                      type="text"
                      value={form.addressLine1}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all ${
                        errors.addressLine1 ? "border-red-300 bg-red-50/50" : "border-gray-200"
                      }`}
                      placeholder="House number, building, street"
                    />
                    {errors.addressLine1 && (
                      <p className="text-xs text-red-500 mt-1">{errors.addressLine1}</p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div className="sm:col-span-2">
                    <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2 <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      id="addressLine2"
                      name="addressLine2"
                      type="text"
                      value={form.addressLine2}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                      placeholder="Landmark, area (optional)"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all ${
                        errors.city ? "border-red-300 bg-red-50/50" : "border-gray-200"
                      }`}
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all ${
                        errors.state ? "border-red-300 bg-red-50/50" : "border-gray-200"
                      }`}
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-xs text-red-500 mt-1">{errors.state}</p>
                    )}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      value={form.pincode}
                      onChange={handleChange}
                      maxLength={6}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all ${
                        errors.pincode ? "border-red-300 bg-red-50/50" : "border-gray-200"
                      }`}
                      placeholder="6-digit pincode"
                    />
                    {errors.pincode && (
                      <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-brand-text mb-5">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {/* Online Payment */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("online")}
                    className={`w-full relative flex items-start gap-4 px-5 py-4 rounded-xl border-2 transition-all text-left ${
                      paymentMethod === "online"
                        ? "border-brand-primary bg-brand-bg/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      paymentMethod === "online" ? "border-brand-primary" : "border-gray-300"
                    }`}>
                      {paymentMethod === "online" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-brand-primary" />
                        <span className="text-sm font-semibold text-brand-text">
                          Online Payment
                        </span>
                        <span className="text-[10px] font-bold text-white bg-brand-primary px-2 py-0.5 rounded-full">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {PRODUCT.currencySymbol}{PRODUCT.onlinePrice}/unit
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Sparkles className="w-3 h-3 text-green-600" />
                        <span className="text-xs font-medium text-green-600">
                          Save {PRODUCT.currencySymbol}{PRODUCT.codPrice - PRODUCT.onlinePrice} per unit!
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`w-full relative flex items-start gap-4 px-5 py-4 rounded-xl border-2 transition-all text-left ${
                      paymentMethod === "cod"
                        ? "border-brand-primary bg-brand-bg/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      paymentMethod === "cod" ? "border-brand-primary" : "border-gray-300"
                    }`}>
                      {paymentMethod === "cod" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-semibold text-brand-text">
                          Cash on Delivery
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {PRODUCT.currencySymbol}{PRODUCT.codPrice}/unit
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-lg font-semibold text-brand-text mb-5">
                  Order Summary
                </h2>

                {/* Product */}
                <div className="flex gap-3 pb-4 border-b border-gray-100">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={PRODUCT.image}
                      alt={PRODUCT.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-brand-text line-clamp-2">
                      {PRODUCT.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {quantity}</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-3 mt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Price ({quantity} × {PRODUCT.currencySymbol}{unitPrice})
                    </span>
                    <span className="font-medium">{PRODUCT.currencySymbol}{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Online Discount</span>
                      <span className="font-medium">-{PRODUCT.currencySymbol}{savings}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-semibold text-brand-text text-base">Total</span>
                    <span className="font-bold text-xl text-brand-text">
                      {PRODUCT.currencySymbol}{total}
                    </span>
                  </div>
                </div>

                {/* Free delivery */}
                <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <Truck className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-medium">Free Delivery • 3–7 business days</span>
                </div>

                {/* Place Order */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="mt-5 w-full py-3.5 text-sm font-semibold text-white gradient-brand rounded-full hover:opacity-90 transition-opacity shadow-brand disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing
                    ? "Processing..."
                    : paymentMethod === "online"
                    ? `Pay ${PRODUCT.currencySymbol}${total}`
                    : "Place Order (COD)"}
                </button>

                <div className="mt-3 flex items-center justify-center gap-1 text-gray-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Secure & encrypted checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
