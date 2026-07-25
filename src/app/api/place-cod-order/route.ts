import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendCAPIPurchase } from "@/lib/meta-capi";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { PRODUCTS } from "@/lib/products";
import { PRODUCT } from "@/lib/product";
import { sendConfirmationEmail } from "@/lib/email";

export const maxDuration = 60; // 60 seconds timeout (Vercel Pro)

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "luwia:place-cod-order",
});

export async function POST(request: NextRequest) {
  console.log("[COD] place-cod-order route hit");
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": new Date(reset).toISOString(),
          },
        }
      );
    }

    const { orderDetails } = await request.json();
    console.log("[COD] orderDetails received:", !!orderDetails);

    if (!orderDetails) {
      return NextResponse.json({ error: "Missing order details" }, { status: 400 });
    }

    if (!orderDetails.items || !Array.isArray(orderDetails.items) || orderDetails.items.length === 0) {
      return NextResponse.json({ error: "Invalid items in order" }, { status: 400 });
    }

    // Validate COD price on the server
    let serverTotal = 0;
    for (const item of orderDetails.items) {
      let productPrice = 0;
      const found = PRODUCTS.find((p) => p.id === item.productId);
      if (found) {
        productPrice = found.codPrice;
      } else if (item.productId === "luwia-cream" || item.productId === "default") {
        productPrice = PRODUCT.codPrice;
      }
      
      if (!productPrice) {
        return NextResponse.json({ error: "Invalid product in order" }, { status: 400 });
      }
      serverTotal += productPrice * item.quantity;
    }

    if (serverTotal !== orderDetails.amount) {
      console.warn(`[place-cod-order] Price mismatch. Client: ${orderDetails.amount}, Server: ${serverTotal}`);
      return NextResponse.json({ error: "Price validation failed. Please refresh your cart." }, { status: 400 });
    }

    // Save COD order to Supabase
    const { data: order, error: dbError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: orderDetails.fullName,
        email: orderDetails.email,
        phone: orderDetails.phone,
        address_line1: orderDetails.addressLine1,
        address_line2: orderDetails.addressLine2 || null,
        city: orderDetails.city,
        state: orderDetails.state,
        pincode: orderDetails.pincode,
        quantity: orderDetails.quantity,
        amount_paid: orderDetails.amount,
        items: orderDetails.items,
        payment_method: "cod",
        razorpay_payment_id: null,
        razorpay_order_id: null,
        payment_status: "pending",
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save order" },
        { status: 500 }
      );
    }

    // Trigger confirmation email (fire and forget)
    try {
      await sendConfirmationEmail({
        orderId: order.id,
        customerName: orderDetails.fullName,
        email: orderDetails.email,
        phone: orderDetails.phone,
        quantity: orderDetails.quantity,
        amount: orderDetails.amount,
        paymentMethod: "cod",
        address: `${orderDetails.addressLine1}${
          orderDetails.addressLine2 ? ", " + orderDetails.addressLine2 : ""
        }, ${orderDetails.city}, ${orderDetails.state} - ${orderDetails.pincode}`,
        items: orderDetails.items,
      });
    } catch (emailError) {
      console.error("Email trigger error:", emailError);
    }

    // Send Purchase event via Meta Conversions API
    // Must be awaited — serverless functions shut down immediately after response
    await sendCAPIPurchase({
      eventId: order.id,
      email: orderDetails.email,
      phone: orderDetails.phone,
      amount: orderDetails.amount,
      currency: "INR",
      contentIds: (orderDetails.items ?? []).map(
        (i: { productId: string }) => i.productId
      ),
      numItems: orderDetails.quantity,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
    });
  } catch (error) {
    console.error("COD order error:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}
