import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { PRODUCTS } from "@/lib/products";
import { PRODUCT } from "@/lib/product";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "luwia:create-order",
});

export async function POST(request: NextRequest) {
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

    const { amount, items } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid items in order" }, { status: 400 });
    }

    // Validate price on the server
    let serverTotal = 0;
    for (const item of items) {
      let productPrice = 0;
      const found = PRODUCTS.find((p) => p.id === item.productId);
      if (found) {
        productPrice = found.onlinePrice;
      } else if (item.productId === "luwia-cream" || item.productId === "default") {
        productPrice = PRODUCT.onlinePrice;
      }
      
      if (!productPrice) {
        return NextResponse.json({ error: "Invalid product in order" }, { status: 400 });
      }
      serverTotal += productPrice * item.quantity;
    }

    if (serverTotal !== amount) {
      console.warn(`[create-order] Price mismatch. Client: ${amount}, Server: ${serverTotal}`);
      return NextResponse.json({ error: "Price validation failed. Please refresh your cart." }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `luwia_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
