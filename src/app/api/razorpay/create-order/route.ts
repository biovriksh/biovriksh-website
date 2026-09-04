import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { pdfId } = await req.json();

    if (!pdfId) {
      return NextResponse.json({ success: false, error: "PDF ID is required" }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.includes("placeholder")) {
      return NextResponse.json(
        { success: false, error: "Razorpay credentials not configured" },
        { status: 500 }
      );
    }

    // SERVER-SIDE SECURITY: Always fetch exact price from Database to prevent client price tampering
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

    const amountInPaise = Math.round(Number(pdf.price || 49) * 100);

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${pdfId.slice(0, 8)}`,
      notes: {
        pdfId,
        title: pdf.title,
      },
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

