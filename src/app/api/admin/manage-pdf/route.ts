import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from("pdfs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, pdfs: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id, currentStatus } = body;
    const supabaseAdmin = createAdminClient();

    if (action === "update") {
      const {
        id: pdfId,
        title,
        description,
        targetSection,
        classLevel,
        subject,
        chapterId,
        subHeading,
        unit,
        yearsCovered,
        highlightText,
        price,
        pageCount,
        questionsCount,
        durationMinutes,
        totalMarks,
        isRecent,
        isActive,
        thumbnailUrl,
        filePath,
      } = body;

      const isFreeCalc = targetSection === "short" || (targetSection === "test" && (Number(price) === 0 || !price));

      const updatePayload: any = {
        title,
        description,
        note_type: targetSection,
        is_free: isFreeCalc,
        class_level: classLevel,
        subject: subject || "Biology",
        price: isFreeCalc ? 0 : Number(price || 0),
        page_count: Number(pageCount || 12),
        questions_count: questionsCount !== undefined ? Number(questionsCount) : 45,
        duration_minutes: durationMinutes !== undefined ? Number(durationMinutes) : 45,
        total_marks: totalMarks !== undefined ? Number(totalMarks) : 180,
        is_recent: !!isRecent,
        updated_at: new Date().toISOString(),
      };

      if (chapterId !== undefined) updatePayload.chapter_id = chapterId || null;
      if (subHeading !== undefined) updatePayload.sub_heading = subHeading || null;
      if (unit !== undefined) updatePayload.unit = unit || null;
      if (yearsCovered !== undefined) updatePayload.years_covered = yearsCovered || null;
      if (highlightText !== undefined) updatePayload.highlight_text = highlightText || null;

      if (isActive !== undefined) {
        updatePayload.is_active = !!isActive;
      }
      if (thumbnailUrl) {
        updatePayload.thumbnail_url = thumbnailUrl;
      }
      if (filePath) {
        updatePayload.file_path = filePath;
      }

      const { data, error } = await supabaseAdmin
        .from("pdfs")
        .update(updatePayload)
        .eq("id", pdfId)
        .select("*")
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, pdf: data });
    }

    if (action === "toggle_recent") {
      const { data, error } = await supabaseAdmin
        .from("pdfs")
        .update({ is_recent: !currentStatus, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select("*")
        .single();

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, pdf: data });
    }

    if (action === "toggle_active") {
      const { data, error } = await supabaseAdmin
        .from("pdfs")
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select("*")
        .single();

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, pdf: data });
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
