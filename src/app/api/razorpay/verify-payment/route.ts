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
      plan_id,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || (!pdf_id && !plan_id)) {
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

    // 2. Identify Authenticated User
    const supabaseUserClient = await createServerSupabaseClient();
    const { data: { user } } = await supabaseUserClient.auth.getUser();
    const activeStudentId = user?.id || student_id;

    if (!activeStudentId) {
      return NextResponse.json(
        { success: false, error: "User authentication required to complete purchase" },
        { status: 401 }
      );
    }

    const supabaseAdmin = createAdminClient();

    if (plan_id) {
      // Handle Subscription Plan Upgrade
      const normalizedPlan = plan_id.replace("plan-", "");
      const days = normalizedPlan === "yearly" ? 365 : 30;
      const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({
          subscription_plan: normalizedPlan === "yearly" ? "PREMIUM YEARLY" : "PREMIUM MONTHLY",
          subscription_status: "active",
          subscription_expires_at: expiresAt.toISOString(),
        })
        .eq("id", activeStudentId);

      if (profileError) {
        console.error("Failed to update profile subscription:", profileError);
        return NextResponse.json(
          { success: false, error: "Payment verified but subscription update failed. Contact support." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Subscription plan successfully activated! Valid till ${expiresAt.toLocaleDateString()}`,
        paymentId: razorpay_payment_id,
        expiresAt: expiresAt.toISOString(),
      });
    } else if (pdf_id) {
      // Handle Single PDF Purchase (3 Months / 90 Days Validity)
      const { data: pdf } = await supabaseAdmin
        .from("pdfs")
        .select("price")
        .eq("id", pdf_id)
        .single();

      const verifiedAmount = pdf?.price || 0;
      const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 3 months validity

      const { error: insertError } = await supabaseAdmin.from("purchases").upsert(
        {
          student_id: activeStudentId,
          pdf_id,
          amount_paid: verifiedAmount,
          payment_status: "success",
          payment_gateway_id: razorpay_payment_id,
          purchased_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
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
        message: `Payment verified! Note unlocked with 3-month validity (Valid till ${expiresAt.toLocaleDateString()})`,
        paymentId: razorpay_payment_id,
        expiresAt: expiresAt.toISOString(),
      });
    }
  } catch (error: any) {
    console.error("Razorpay verify-payment error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}

