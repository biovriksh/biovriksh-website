import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectParam = searchParams.get("subject");
    const classParam = searchParams.get("class");

    const supabaseAdmin = createAdminClient();
    let query = supabaseAdmin
      .from("pdfs")
      .select("*")
      .eq("note_type", "annotated_ncert")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (subjectParam && subjectParam.toLowerCase() !== "all") {
      // Capitalize first letter (biology -> Biology)
      const capitalized = subjectParam.charAt(0).toUpperCase() + subjectParam.slice(1).toLowerCase();
      query = query.ilike("subject", capitalized);
    }

    if (classParam && classParam !== "All") {
      query = query.eq("class_level", classParam);
    }

    const { data: notes, error } = await query;

    if (error) {
      console.error("Error fetching public annotated NCERT notes:", error);
      return NextResponse.json({ success: false, error: error.message, notes: [] }, { status: 500 });
    }

    // Format for student view
    const formattedResources = (notes || []).map((n) => ({
      id: n.id,
      pdfId: n.id,
      chapter: n.title,
      unit: n.unit || n.sub_heading || "General Unit",
      subject: n.subject || "Biology",
      classLevel: n.class_level || "Class 12",
      yearsCovered: n.years_covered || "NEET 2016 - 2024",
      solvedQuestions: n.questions_count || 50,
      totalPages: n.page_count || 24,
      isFree: Boolean(n.is_free),
      price: n.is_free ? 0 : Number(n.price || 49),
      highlightText: n.highlight_text || n.description || "Line-by-line NCERT highlights and NEET PYQs.",
      thumbnailUrl: n.thumbnail_url || "/hero_premium_clean.png",
      filePath: n.file_path,
    }));

    return NextResponse.json(
      { success: true, notes: formattedResources },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: any) {
    console.error("Public Annotated NCERT API error:", err);
    return NextResponse.json({ success: false, error: err.message, notes: [] }, { status: 500 });
  }
}
