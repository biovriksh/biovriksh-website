import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      student_id,
      pdf_id,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !pdf_id) {
      return NextResponse.json(
        { success: false, error: "Missing required payment verification parameters" },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret || secret.includes("placeholder")) {
      return NextResponse.json(
        { success: false, error: "Razorpay secret key not configured" },
        { status: 500 }
      );
    }

    // 1. HMAC SHA-256 Cryptographic Signature Verification
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Timing-safe comparison to protect against timing attacks
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature, "utf-8"),
      Buffer.from(razorpay_signature, "utf-8")
    );

    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature verification. Fraud attempt detected." },
        { status: 400 }
      );
    }

    // 2. Identify Authenticated User (Fallback to provided student_id if auth session cookie is matching)
    const supabaseUserClient = await createServerSupabaseClient();
    const { data: { user } } = await supabaseUserClient.auth.getUser();
    const activeStudentId = user?.id || student_id;

    if (!activeStudentId) {
      return NextResponse.json(
        { success: false, error: "User authentication required to complete purchase" },
        { status: 401 }
      );
    }

    // 3. Fetch exact PDF details from DB for exact amount record
    const supabaseAdmin = createAdminClient();
    const { data: pdf } = await supabaseAdmin
      .from("pdfs")
      .select("price")
      .eq("id", pdf_id)
      .single();

    const verifiedAmount = pdf?.price || 0;

    // 4. Record verified purchase into Database using Service Role
    const { error: insertError } = await supabaseAdmin.from("purchases").upsert(
      {
        student_id: activeStudentId,
        pdf_id,
        amount_paid: verifiedAmount,
        payment_status: "success",
        payment_gateway_id: razorpay_payment_id,
        purchased_at: new Date().toISOString(),
      },
      { onConflict: "student_id,pdf_id" }
    );

    if (insertError) {
      console.error("Failed to record purchase in database:", insertError);
      return NextResponse.json(
        { success: false, error: "Payment verified but database record failed. Contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and note unlocked",
      paymentId: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error("Razorpay verify-payment error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}

