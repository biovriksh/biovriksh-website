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
        price,
        pageCount,
        isRecent,
        isActive,
        thumbnailUrl,
        filePath,
      } = body;

      const updatePayload: any = {
        title,
        description,
        note_type: targetSection,
        is_free: targetSection === "short",
        class_level: classLevel,
        price: targetSection === "short" ? 0 : price,
        page_count: pageCount,
        is_recent: !!isRecent,
        updated_at: new Date().toISOString(),
      };

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

