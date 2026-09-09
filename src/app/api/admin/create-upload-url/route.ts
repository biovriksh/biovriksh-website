import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { filename, bucket } = await req.json();

    if (!filename || !bucket) {
      return NextResponse.json({ success: false, error: "Missing filename or bucket" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Clean bucket name check
    const targetBucket = bucket === "pdf-thumbnails" ? "pdf-thumbnails" : "pdf-files";
    const ext = filename.split(".").pop() || (targetBucket === "pdf-thumbnails" ? "png" : "pdf");
    const path = `${targetBucket === "pdf-thumbnails" ? "thumb" : "pdf"}_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

    // Create signed upload URL valid for 10 minutes
    const { data, error } = await supabaseAdmin.storage
      .from(targetBucket)
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error("Signed URL creation error:", error);
      return NextResponse.json(
        { success: false, error: error?.message || "Failed to create signed upload URL" },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(targetBucket)
      .getPublicUrl(path);

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
      token: data.token,
      path: path,
      publicUrl: publicUrlData.publicUrl,
    });
  } catch (err: any) {
    console.error("Create upload URL error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
