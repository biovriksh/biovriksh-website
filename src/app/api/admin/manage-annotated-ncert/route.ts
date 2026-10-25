import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from("pdfs")
      .select("*, chapter:chapters(id, name)")
      .eq("note_type", "annotated_ncert")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, notes: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id, currentStatus } = body;
    const supabaseAdmin = createAdminClient();

    if (action === "create" || action === "update") {
      const {
        title,
        subject = "Biology",
        classLevel = "Class 12",
        chapterId = null,
        unit = "General",
        yearsCovered = "NEET 2016 - 2024",
        solvedQuestions = 50,
        totalPages = 20,
        highlightText = "",
        description = "",
        isFree = false,
        price = 49,
        thumbnailUrl = "/hero_premium_clean.png",
        filePath,
        isRecent = false,
        isActive = true,
      } = body;

      if (!title || !title.trim()) {
        return NextResponse.json({ success: false, error: "Chapter / Title is required" }, { status: 400 });
      }

      const payload: any = {
        title: title.trim(),
        subject,
        class_level: classLevel,
        chapter_id: chapterId || null,
        note_type: "annotated_ncert",
        unit: unit?.trim() || "General",
        sub_heading: unit?.trim() || "General",
        years_covered: yearsCovered || "NEET 2016 - 2024",
        questions_count: Number(solvedQuestions || 0),
        page_count: Number(totalPages || 12),
        highlight_text: highlightText || "",
        description: description || highlightText || "",
        is_free: Boolean(isFree || Number(price) === 0),
        price: isFree ? 0 : Number(price || 0),
        is_recent: Boolean(isRecent),
        is_active: Boolean(isActive),
        thumbnail_url: thumbnailUrl || "/hero_premium_clean.png",
        updated_at: new Date().toISOString(),
      };

      if (filePath) {
        payload.file_path = filePath;
      }

      if (action === "create") {
        if (!payload.file_path) {
          payload.file_path = `annotated_ncert_${Date.now()}.pdf`;
        }
        const { data, error } = await supabaseAdmin
          .from("pdfs")
          .insert(payload)
          .select("*")
          .single();

        if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        return NextResponse.json({ success: true, note: data });
      } else {
        const { data, error } = await supabaseAdmin
          .from("pdfs")
          .update(payload)
          .eq("id", id)
          .select("*")
          .single();

        if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        return NextResponse.json({ success: true, note: data });
      }
    }

    if (action === "toggle_active") {
      const { data, error } = await supabaseAdmin
        .from("pdfs")
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select("*")
        .single();

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, note: data });
    }

    if (action === "toggle_recent") {
      const { data, error } = await supabaseAdmin
        .from("pdfs")
        .update({ is_recent: !currentStatus, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select("*")
        .single();

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, note: data });
    }

    if (action === "delete") {
      const { error } = await supabaseAdmin.from("pdfs").delete().eq("id", id);
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
