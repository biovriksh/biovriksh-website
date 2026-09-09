import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pdfId = searchParams.get("pdfId") || searchParams.get("id");
    const studentIdParam = searchParams.get("studentId");

    if (!pdfId) {
      return NextResponse.json({ error: "Missing pdfId parameter" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // 1. Fetch PDF Metadata
    const { data: pdf, error: pdfError } = await supabaseAdmin
      .from("pdfs")
      .select("id, title, sub_heading, class_level, file_path, is_free, is_active, page_count, price")
      .eq("id", pdfId)
      .single();

    if (pdfError || !pdf || !pdf.is_active) {
      return NextResponse.json({ error: "PDF Note not found or deactivated" }, { status: 404 });
    }

    let isAuthorized = false;

    if (pdf.is_free) {
      isAuthorized = true;
    } else {
      // For paid PDFs, check user authentication and subscription/purchase
      const supabaseUser = await createServerSupabaseClient();
      const { data: { user } } = await supabaseUser.auth.getUser();
      const activeStudentId = user?.id || studentIdParam;

      if (activeStudentId) {
        // Check active subscription
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("subscription_status, subscription_expires_at")
          .eq("id", activeStudentId)
          .single();

        if (profile?.subscription_status === "active" && profile?.subscription_expires_at) {
          if (new Date(profile.subscription_expires_at).getTime() > Date.now()) {
            isAuthorized = true;
          }
        }

        // Check individual Purchases table in DB
        if (!isAuthorized) {
          const { data: purchase } = await supabaseAdmin
            .from("purchases")
            .select("id")
            .eq("student_id", activeStudentId)
            .eq("pdf_id", pdfId)
            .eq("payment_status", "success")
            .maybeSingle();

          if (purchase) {
            isAuthorized = true;
          }
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        {
          error: "Access Denied: Payment required to unlock this PDF note.",
          title: pdf.title,
          price: pdf.price,
          is_free: pdf.is_free,
          class_level: pdf.class_level,
          sub_heading: pdf.sub_heading,
        },
        { status: 403 }
      );
    }

    // Generate 1-hour Signed URL from private 'pdf-files' bucket
    const { data: signedData, error: signError } = await supabaseAdmin.storage
      .from("pdf-files")
      .createSignedUrl(pdf.file_path, 3600); // 3600 seconds = 1 hour expiry

    if (signError || !signedData?.signedUrl) {
      console.error("Storage signError:", signError);
      return NextResponse.json(
        { error: "Failed to generate secure access token for file" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      signedUrl: signedData.signedUrl,
      title: pdf.title,
      sub_heading: pdf.sub_heading,
      class_level: pdf.class_level,
      page_count: pdf.page_count,
      is_free: pdf.is_free,
      price: pdf.price,
      expiresInSeconds: 3600,
    });
  } catch (error: any) {
    console.error("PDF access error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve secure PDF URL" },
      { status: 500 }
    );
  }
}


