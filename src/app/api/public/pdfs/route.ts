import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();
    const { data: pdfs, error } = await supabaseAdmin
      .from("pdfs")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching public PDFs:", error);
      return NextResponse.json({ success: false, error: error.message, pdfs: [] }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, pdfs: pdfs || [] },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: any) {
    console.error("Public PDFs API error:", err);
    return NextResponse.json({ success: false, error: err.message, pdfs: [] }, { status: 500 });
  }
}
