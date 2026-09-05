import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { pdfId, planId } = await req.json();

    if (!pdfId && !planId) {
      return NextResponse.json({ success: false, error: "PDF ID or Plan ID is required" }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.includes("placeholder")) {
      return NextResponse.json(
        { success: false, error: "Razorpay credentials not configured" },
        { status: 500 }
      );
    }

    let amountInPaise = 0;
    let orderNotes: Record<string, string> = {};

    if (planId) {
      // Subscription Plan Order
      const normalizedPlan = planId.replace("plan-", "");
      if (normalizedPlan === "yearly") {
        amountInPaise = 2388 * 100; // ₹2,388
        orderNotes = { planId: "yearly", title: "PREMIUM YEARLY PASS" };
      } else if (normalizedPlan === "monthly") {
        amountInPaise = 249 * 100; // ₹249
        orderNotes = { planId: "monthly", title: "PREMIUM MONTHLY PASS" };
      } else {
        return NextResponse.json({ success: false, error: "Invalid subscription plan" }, { status: 400 });
      }
    } else if (pdfId) {
      // Individual PDF Order
      const supabaseAdmin = createAdminClient();
      const { data: pdf, error: dbError } = await supabaseAdmin
        .from("pdfs")
        .select("id, price, is_free, is_active, title")
        .eq("id", pdfId)
        .single();

      if (dbError || !pdf || !pdf.is_active) {
        return NextResponse.json(
          { success: false, error: "Note not found or inactive" },
          { status: 404 }
        );
      }

      if (pdf.is_free) {
        return NextResponse.json(
          { success: false, error: "This note is free. No payment required." },
          { status: 400 }
        );
      }

      amountInPaise = Math.round(Number(pdf.price || 49) * 100);
      orderNotes = { pdfId, title: pdf.title };
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${(planId || pdfId).slice(0, 8)}`,
      notes: orderNotes,
    };

    const order = await instance.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error: any) {
    console.error("Razorpay create-order error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}

