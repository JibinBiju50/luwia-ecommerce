import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = await request.json();

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Save order to Supabase
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
        payment_method: "online",
        razorpay_payment_id,
        razorpay_order_id,
        payment_status: "paid",
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { success: false, error: "Failed to save order" },
        { status: 500 }
      );
    }

    // Trigger confirmation email (fire and forget)
    try {
      await fetch(new URL("/api/send-confirmation", request.url).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          customerName: orderDetails.fullName,
          email: orderDetails.email,
          phone: orderDetails.phone,
          quantity: orderDetails.quantity,
          amount: orderDetails.amount,
          paymentMethod: "online",
          address: `${orderDetails.addressLine1}${
            orderDetails.addressLine2 ? ", " + orderDetails.addressLine2 : ""
          }, ${orderDetails.city}, ${orderDetails.state} - ${orderDetails.pincode}`,
          items: orderDetails.items,
        }),
      });
    } catch (emailError) {
      console.error("Email trigger error:", emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
