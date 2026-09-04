import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pdfId = searchParams.get("pdfId");
    const studentIdParam = searchParams.get("studentId");

    if (!pdfId) {
      return NextResponse.json({ error: "Missing pdfId parameter" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();
    const supabaseUser = await createServerSupabaseClient();

    // 1. Get authenticated user from session cookie
    const { data: { user } } = await supabaseUser.auth.getUser();
    const activeStudentId = user?.id || studentIdParam;

    // 2. Fetch PDF Metadata
    const { data: pdf, error: pdfError } = await supabaseAdmin
      .from("pdfs")
      .select("file_path, is_free, is_active")
      .eq("id", pdfId)
      .single();

    if (pdfError || !pdf || !pdf.is_active) {
      return NextResponse.json({ error: "PDF Note not found or deactivated" }, { status: 404 });
    }

    let isAuthorized = false;

    if (pdf.is_free) {
      isAuthorized = true;
    } else if (activeStudentId) {
      // 3. Check Purchases table in DB
      const { data: purchase } = await supabaseAdmin
        .from("purchases")
        .select("id")
        .eq("student_id", activeStudentId)
        .eq("pdf_id", pdfId)
        .eq("payment_status", "success")
        .single();

      if (purchase) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Access Denied: Payment required to unlock this PDF note." },
        { status: 403 }
      );
    }

    // 4. Generate 5-minute Signed URL from private 'pdf-files' bucket
    const { data: signedData, error: signError } = await supabaseAdmin.storage
      .from("pdf-files")
      .createSignedUrl(pdf.file_path, 300); // 300 seconds = 5 minutes expiry

    if (signError || !signedData?.signedUrl) {
      return NextResponse.json(
        { error: "Failed to generate secure access token for file" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      signedUrl: signedData.signedUrl,
      expiresInSeconds: 300,
    });
  } catch (error: any) {
    console.error("PDF access error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve secure PDF URL" },
      { status: 500 }
    );
  }
}

