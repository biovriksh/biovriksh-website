import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const supabaseAdmin = createAdminClient();
    const contentType = req.headers.get("content-type") || "";

    let title = "";
    let description = "";
    let noteType = "paid";
    let classLevel = "Class 12";
    let price = 0;
    let pageCount = 12;
    let isRecent = false;
    let thumbnailUrl = "/hero_premium_clean.png";
    let filePath = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      title = (formData.get("title") as string) || "";
      description = (formData.get("description") as string) || "";
      noteType = (formData.get("targetSection") as string) || "paid";
      classLevel = (formData.get("classLevel") as string) || "Class 12";
      price = Number(formData.get("price") || 0);
      pageCount = Number(formData.get("pageCount") || 12);
      isRecent = formData.get("isRecent") === "true";

      const thumbnailFile = formData.get("thumbnailFile") as File | null;
      const pdfFile = formData.get("pdfFile") as File | null;

      // 1. Upload Thumbnail Image on Server using Service Role Key
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

        if (thumbUpload) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from("pdf-thumbnails")
            .getPublicUrl(thumbName);
          thumbnailUrl = publicUrlData.publicUrl;
        } else {
          console.error("Server thumbnail upload error:", thumbErr);
        }
      }

      // 2. Upload Private PDF Document on Server using Service Role Key
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

        if (pdfUpload) {
          filePath = pdfUpload.path;
        } else {
          console.error("Server PDF file upload error:", pdfErr);
        }
      }
    } else {
      // JSON Payload handling fallback
      const body = await req.json();
      title = body.title || "";
      description = body.description || "";
      noteType = body.targetSection || body.noteType || "paid";
      classLevel = body.classLevel || "Class 12";
      price = Number(body.price || 0);
      pageCount = Number(body.pageCount || 12);
      isRecent = Boolean(body.isRecent);
      thumbnailUrl = body.thumbnailUrl || "/hero_premium_clean.png";
      filePath = body.filePath || `notes_${Date.now()}.pdf`;
    }

    if (!title.trim()) {
      return NextResponse.json({ success: false, error: "Title is required." }, { status: 400 });
    }

    const isActuallyFree = noteType === "short" || price === 0;

    // 3. Insert PDF record into Supabase Database
    const newPdfRow = {
      chapter_id: null,
      sub_heading: null,
      title: title.trim(),
      description: description.trim(),
      thumbnail_url: thumbnailUrl,
      file_path: filePath || `notes_${Date.now()}.pdf`,
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
