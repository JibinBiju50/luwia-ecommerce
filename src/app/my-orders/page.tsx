"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  CreditCard,
  Banknote,
  Calendar,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ClipboardList,
  Hash,
  IndianRupee,
  Layers,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase-client";
import { PRODUCTS } from "@/lib/products";

interface OrderItem {
  productId: string;
  quantity: number;
}

interface Order {
  id: string;
  created_at: string;
  amount_paid: number;
  payment_method: "online" | "cod";
  payment_status: string;
  quantity: number;
  items: OrderItem[];
  customer_name: string;
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(dateStr));
}

function PaymentBadge({ method }: { method: "online" | "cod" }) {
  const isCod = method === "cod";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${
        isCod
          ? "bg-amber-50 text-amber-700 border border-amber-200"
          : "bg-blue-50 text-blue-700 border border-blue-200"
      }`}
    >
      {isCod ? (
        <Banknote className="w-3 h-3" />
      ) : (
        <CreditCard className="w-3 h-3" />
      )}
      {isCod ? "COD" : "Online"}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isPaid = status === "paid";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
        isPaid
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-orange-50 text-orange-700 border border-orange-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-green-500" : "bg-orange-400"}`}
      />
      {isPaid ? "Paid" : "Pending"}
    </span>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-brand hover:border-brand-primary/15">

      {/* ── Always-visible: product rows ─────────────────────────── */}
      <div className="p-4 sm:p-5 space-y-3">
        {items.length === 0 ? (
          <div className="flex items-center gap-3 py-2 text-sm text-gray-400 italic">
            <Package className="w-5 h-5" />
            No item details available.
          </div>
        ) : (
          items.map((item, i) => {
            const product = PRODUCTS.find((p) => p.id === item.productId);
            const unitPrice =
              order.payment_method === "cod"
                ? product?.codPrice
                : product?.onlinePrice;

            return (
              <div
                key={i}
                className="flex items-center gap-3 sm:gap-4"
              >
                {/* Product image */}
                <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
                  {product ? (
                    <Image
                      src={product.cardImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-text leading-snug line-clamp-2">
                    {product?.name ?? item.productId}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {/* Qty pill */}
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                      <Layers className="w-3 h-3" />
                      Qty: {item.quantity}
                    </span>
                    {/* Payment badge */}
                    <PaymentBadge method={order.payment_method} />
                  </div>
                </div>

                {/* Amount */}
                <div className="shrink-0 text-right">
                  <p className="text-base font-bold text-brand-text">
                    {unitPrice !== undefined
                      ? `₹${(unitPrice * item.quantity).toLocaleString("en-IN")}`
                      : `₹${order.amount_paid.toLocaleString("en-IN")}`}
                  </p>
                  {item.quantity > 1 && unitPrice !== undefined && (
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      ₹{unitPrice} each
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Divider ───────────────────────────────────────────────── */}
      <div className="mx-4 sm:mx-5 border-t border-dashed border-gray-100" />

      {/* ── Order total strip ─────────────────────────────────────── */}
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusBadge status={order.payment_status} />
          <span className="text-xs text-gray-400">
            {items.reduce((acc, i) => acc + i.quantity, 0) || order.quantity} item
            {(items.reduce((acc, i) => acc + i.quantity, 0) || order.quantity) !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Total Paid</p>
          <p className="text-lg font-extrabold text-brand-text leading-tight">
            ₹{order.amount_paid.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* ── Expanded: order meta ──────────────────────────────────── */}
      {expanded && (
        <div className="mx-4 sm:mx-5 mb-4 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Order ID */}
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 p-1.5 rounded-lg bg-brand-primary/8 shrink-0">
                <Hash className="w-3.5 h-3.5 text-brand-primary" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                  Order ID
                </p>
                <p className="text-xs font-bold font-mono text-brand-primary mt-0.5">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Ordered On */}
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 p-1.5 rounded-lg bg-brand-primary/8 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-brand-primary" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                  Ordered On
                </p>
                <p className="text-xs font-semibold text-brand-text mt-0.5">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>

            {/* Per-item breakdown */}
            {items.map((item, i) => {
              const product = PRODUCTS.find((p) => p.id === item.productId);
              const unitPrice =
                order.payment_method === "cod"
                  ? product?.codPrice
                  : product?.onlinePrice;
              if (unitPrice === undefined) return null;
              return (
                <div key={i} className="flex items-start gap-2.5 sm:col-span-2">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-brand-primary/8 shrink-0">
                    <IndianRupee className="w-3.5 h-3.5 text-brand-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">
                      {product?.name.split(" - ")[0].split(" — ")[0] ?? "Product"} · Pricing
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                      <span className="text-xs text-gray-500">
                        Unit Price:{" "}
                        <span className="font-bold text-brand-text">
                          ₹{unitPrice.toLocaleString("en-IN")}
                        </span>
                      </span>
                      <span className="text-xs text-gray-500">
                        Qty:{" "}
                        <span className="font-bold text-brand-text">
                          {item.quantity}
                        </span>
                      </span>
                      <span className="text-xs text-gray-500">
                        Subtotal:{" "}
                        <span className="font-bold text-green-700">
                          ₹{(unitPrice * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Toggle button ─────────────────────────────────────────── */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-center gap-1.5 py-3 text-xs font-bold text-brand-primary border-t border-gray-50 hover:bg-brand-primary/3 transition-colors"
      >
        {expanded ? (
          <>
            <ChevronUp className="w-3.5 h-3.5" />
            Hide Details
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5" />
            View Details
          </>
        )}
      </button>
    </div>
  );
}

export default function MyOrdersPage() {
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        setLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/my-orders", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders ?? []);
      } catch {
        setError("Could not load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user, authLoading]);

  // ─── Not logged in ─────────────────────────────────────────────────────────
  if (!authLoading && !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-primary/5 mb-5">
            <ClipboardList className="w-9 h-9 text-brand-primary" />
          </div>
          <h1 className="text-2xl font-bold text-brand-text mb-2">
            Sign in to view your orders
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Track all your Luwia orders in one place. Sign in with the email you
            used at checkout.
          </p>
          <button
            onClick={openAuthModal}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white gradient-brand rounded-full shadow-brand hover:opacity-90 transition-opacity"
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-gray-50/50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-8 w-36 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-44 bg-white border border-gray-100 rounded-2xl animate-pulse"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 text-sm font-semibold text-white gradient-brand rounded-full"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-brand-primary/10">
              <ShoppingBag className="w-5 h-5 text-brand-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-text">
              My Orders
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-1">
            {user?.email && (
              <span className="font-medium text-brand-text">{user.email}</span>
            )}
            {orders.length > 0 && (
              <span className="ml-2 text-gray-400">
                · {orders.length} order{orders.length !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-5">
              <Package className="w-9 h-9 text-gray-300" />
            </div>
            <h2 className="text-lg font-semibold text-brand-text mb-2">
              No orders yet
            </h2>
            <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
              Looks like you haven&apos;t placed any orders yet. Explore our
              products and start your glow journey!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white gradient-brand rounded-full shadow-brand hover:opacity-90 transition-opacity"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <div
                key={order.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        )}

        {/* Help CTA */}
        {orders.length > 0 && (
          <div className="mt-10 p-5 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-semibold text-brand-text">
                Need help with an order?
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Reach out to us on WhatsApp for fast support.
              </p>
            </div>
            <a
              href="https://wa.me/917025459137"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#25D366] rounded-full hover:bg-[#128C7E] transition-colors shadow-sm"
            >
              Chat on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
