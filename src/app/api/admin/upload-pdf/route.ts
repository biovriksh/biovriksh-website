import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = (formData.get("title") as string) || "";
    const description = (formData.get("description") as string) || "";
    const noteType = (formData.get("targetSection") as string) || "paid";
    const classLevel = (formData.get("classLevel") as string) || "Class 12";
    const price = Number(formData.get("price") || 0);
    const pageCount = Number(formData.get("pageCount") || 12);
    const isRecent = formData.get("isRecent") === "true";

    const pdfFile = formData.get("pdfFile") as File | null;
    const thumbnailFile = formData.get("thumbnailFile") as File | null;

    if (!title.trim()) {
      return NextResponse.json({ success: false, error: "Title is required." }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    let thumbnailUrl = "/hero_premium_clean.png";
    let filePath = `notes_${Date.now()}.pdf`;

    // 1. Upload Thumbnail to Storage Bucket
    if (thumbnailFile && thumbnailFile.size > 0) {
      const thumbExt = thumbnailFile.name.split(".").pop() || "png";
      const thumbName = `thumb_${Date.now()}_${Math.random().toString(36).substring(7)}.${thumbExt}`;
      const thumbBuffer = Buffer.from(await thumbnailFile.arrayBuffer());

      const { data: thumbUpload, error: thumbErr } = await supabaseAdmin.storage
        .from("pdf-thumbnails")
        .upload(thumbName, thumbBuffer, {
          contentType: thumbnailFile.type || "image/png",
          upsert: true,
        });

      if (!thumbErr && thumbUpload) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from("pdf-thumbnails")
          .getPublicUrl(thumbName);
        thumbnailUrl = publicUrlData.publicUrl;
      } else {
        console.error("Thumbnail upload warning:", thumbErr);
      }
    }

    // 2. Upload Private PDF File to Storage Bucket
    if (pdfFile && pdfFile.size > 0) {
      const pdfExt = pdfFile.name.split(".").pop() || "pdf";
      const pdfName = `pdf_${Date.now()}_${Math.random().toString(36).substring(7)}.${pdfExt}`;
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());

      const { data: pdfUpload, error: pdfErr } = await supabaseAdmin.storage
        .from("pdf-files")
        .upload(pdfName, pdfBuffer, {
          contentType: pdfFile.type || "application/pdf",
          upsert: true,
        });

      if (!pdfErr && pdfUpload) {
        filePath = pdfUpload.path;
      } else {
        console.error("PDF file upload error:", pdfErr);
      }
    }

    const isActuallyFree = noteType === "short" || price === 0;

    // 3. Insert PDF record into Supabase Database
    const newPdfRow = {
      chapter_id: null,
      sub_heading: null,
      title: title.trim(),
      description: description.trim(),
      thumbnail_url: thumbnailUrl,
      file_path: filePath,
      is_free: isActuallyFree,
      price: isActuallyFree ? 0 : price,
      is_active: true,
      is_recent: isRecent,
      note_type: noteType,
      class_level: classLevel,
      page_count: pageCount,
    };

    const { data: insertedPdf, error: dbErr } = await supabaseAdmin
      .from("pdfs")
      .insert(newPdfRow)
      .select("*")
      .single();

    if (dbErr) {
      console.error("Database insert error:", dbErr);
      return NextResponse.json({ success: false, error: dbErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, pdf: insertedPdf });
  } catch (err: any) {
    console.error("Admin upload API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server upload error" },
      { status: 500 }
    );
  }
}
