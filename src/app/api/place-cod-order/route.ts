import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendCAPIPurchase } from "@/lib/meta-capi";

export async function POST(request: NextRequest) {
  console.log("[COD] place-cod-order route hit");
  try {
    const { orderDetails } = await request.json();
    console.log("[COD] orderDetails received:", !!orderDetails);

    if (!orderDetails) {
      return NextResponse.json({ error: "Missing order details" }, { status: 400 });
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
          paymentMethod: "cod",
          address: `${orderDetails.addressLine1}${
            orderDetails.addressLine2 ? ", " + orderDetails.addressLine2 : ""
          }, ${orderDetails.city}, ${orderDetails.state} - ${orderDetails.pincode}`,
          items: orderDetails.items,
        }),
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
