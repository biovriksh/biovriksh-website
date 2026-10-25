import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();

    const { data: chaptersData, error: chErr } = await supabaseAdmin
      .from("chapters")
      .select("*, pdfs(*)")
      .order("order_index", { ascending: true });

    if (chErr) {
      return NextResponse.json({ success: false, error: chErr.message }, { status: 500 });
    }

    const { data: pdfsData, error: pdfErr } = await supabaseAdmin
      .from("pdfs")
      .select("*")
      .order("title", { ascending: true });

    if (pdfErr) {
      return NextResponse.json({ success: false, error: pdfErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      chapters: chaptersData || [],
      pdfs: pdfsData || [],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, name, subject, classLevel, orderIndex, editingChapterId, subHeadings, id, currentStatus } = body;
    const supabaseAdmin = createAdminClient();

    if (action === "save_chapter") {
      let targetChapterId = editingChapterId;

      if (!editingChapterId) {
        const { data: newCh, error: insertErr } = await supabaseAdmin
          .from("chapters")
          .insert({
            name,
            subject,
            class_level: classLevel,
            order_index: Number(orderIndex),
            is_active: true,
          })
          .select("*")
          .single();

        if (insertErr || !newCh) {
          return NextResponse.json({ success: false, error: insertErr?.message || "Failed to create chapter" }, { status: 500 });
        }
        targetChapterId = newCh.id;
      } else {
        const { error: updateErr } = await supabaseAdmin
          .from("chapters")
          .update({
            name,
            subject,
            class_level: classLevel,
            order_index: Number(orderIndex),
          })
          .eq("id", editingChapterId);

        if (updateErr) {
          return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
        }
      }

      if (targetChapterId && Array.isArray(subHeadings)) {
        for (const sub of subHeadings) {
          if (sub.pdfIds && sub.pdfIds.length > 0) {
            await supabaseAdmin
              .from("pdfs")
              .update({
                chapter_id: targetChapterId,
                sub_heading: sub.title,
              })
              .in("id", sub.pdfIds);
          }
        }
      }

      return NextResponse.json({ success: true, targetChapterId });
    }

    if (action === "toggle_active") {
      const { data, error } = await supabaseAdmin
        .from("chapters")
        .update({ is_active: !currentStatus })
        .eq("id", id)
        .select("*")
        .single();

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, chapter: data });
    }

    if (action === "toggle_pdf_recent") {
      const { data, error } = await supabaseAdmin
        .from("pdfs")
        .update({ is_recent: !currentStatus })
        .eq("id", id)
        .select("*")
        .single();

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, pdf: data });
    }

    if (action === "attach_pdf") {
      const { chapterId, pdfId, subHeading } = body;
      const updateData: any = { chapter_id: chapterId };
      if (subHeading) updateData.sub_heading = subHeading;

      const { data, error } = await supabaseAdmin
        .from("pdfs")
        .update(updateData)
        .eq("id", pdfId)
        .select("*")
        .single();

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, pdf: data });
    }

    if (action === "remove_pdf") {
      const { pdfId } = body;
      const { data, error } = await supabaseAdmin
        .from("pdfs")
        .update({ chapter_id: null })
        .eq("id", pdfId)
        .select("*")
        .single();

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, pdf: data });
    }

    if (action === "delete_pdf") {
      const { pdfId } = body;
      const { error } = await supabaseAdmin.from("pdfs").delete().eq("id", pdfId);
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    if (action === "delete_chapter") {
      // First disassociate any attached PDFs
      await supabaseAdmin.from("pdfs").update({ chapter_id: null }).eq("chapter_id", id);
      const { error } = await supabaseAdmin.from("chapters").delete().eq("id", id);
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
