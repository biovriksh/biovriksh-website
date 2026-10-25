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
    let subject = "Biology";
    let chapterId: string | null = null;
    let subHeading: string | null = null;
    let unit: string | null = null;
    let yearsCovered: string = "NEET 2016 - 2024";
    let highlightText: string = "";
    let price = 0;
    let pageCount = 12;
    let questionsCount = 45;
    let durationMinutes = 45;
    let totalMarks = 180;
    let isRecent = false;
    let thumbnailUrl = "/hero_premium_clean.png";
    let filePath = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      title = (formData.get("title") as string) || "";
      description = (formData.get("description") as string) || "";
      noteType = (formData.get("targetSection") as string) || (formData.get("noteType") as string) || "paid";
      classLevel = (formData.get("classLevel") as string) || "Class 12";
      subject = (formData.get("subject") as string) || "Biology";
      chapterId = (formData.get("chapterId") as string) || (formData.get("chapter_id") as string) || null;
      subHeading = (formData.get("subHeading") as string) || (formData.get("sub_heading") as string) || null;
      unit = (formData.get("unit") as string) || null;
      yearsCovered = (formData.get("yearsCovered") as string) || (formData.get("years_covered") as string) || "NEET 2016 - 2024";
      highlightText = (formData.get("highlightText") as string) || (formData.get("highlight_text") as string) || "";
      price = Number(formData.get("price") || 0);
      pageCount = Number(formData.get("pageCount") || 12);
      questionsCount = Number(formData.get("questionsCount") || 45);
      durationMinutes = Number(formData.get("durationMinutes") || 45);
      totalMarks = Number(formData.get("totalMarks") || 180);
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
        const uniqueFileName = `${Date.now()}_${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());

        const { data: pdfUpload, error: pdfErr } = await supabaseAdmin.storage
          .from("pdf-files")
          .upload(uniqueFileName, pdfBuffer, {
            contentType: "application/pdf",
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
      subject = body.subject || "Biology";
      chapterId = body.chapterId || body.chapter_id || null;
      subHeading = body.subHeading || body.sub_heading || null;
      unit = body.unit || null;
      yearsCovered = body.yearsCovered || body.years_covered || "NEET 2016 - 2024";
      highlightText = body.highlightText || body.highlight_text || "";
      price = Number(body.price || 0);
      pageCount = Number(body.pageCount || 12);
      questionsCount = Number(body.questionsCount || 45);
      durationMinutes = Number(body.durationMinutes || 45);
      totalMarks = Number(body.totalMarks || 180);
      isRecent = Boolean(body.isRecent);
      thumbnailUrl = body.thumbnailUrl || "/hero_premium_clean.png";
      filePath = body.filePath || `notes_${Date.now()}.pdf`;
    }

    if (!title.trim()) {
      return NextResponse.json({ success: false, error: "Title is required." }, { status: 400 });
    }

    const isActuallyFree = noteType === "short" || (noteType === "test" && price === 0) || price === 0;

    // 3. Insert PDF record into Supabase Database
    const newPdfRow: any = {
      chapter_id: chapterId || null,
      sub_heading: subHeading || null,
      unit: unit || null,
      years_covered: yearsCovered || null,
      highlight_text: highlightText || null,
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
      subject: subject,
      page_count: pageCount,
      questions_count: questionsCount,
      duration_minutes: durationMinutes,
      total_marks: totalMarks,
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
