import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentIdParam = searchParams.get("studentId");

    const supabaseUser = await createServerSupabaseClient();
    const { data: { user } } = await supabaseUser.auth.getUser();
    const activeStudentId = user?.id || studentIdParam;

    if (!activeStudentId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createAdminClient();

    // 1. Fetch fresh Profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", activeStudentId)
      .single();

    // 2. Fetch Student Purchases
    const { data: purchases } = await supabaseAdmin
      .from("purchases")
      .select("*, pdf:pdfs(*)")
      .eq("student_id", activeStudentId)
      .eq("payment_status", "success")
      .order("purchased_at", { ascending: false });

    // 3. Fetch All Active PDFs
    const { data: allPdfs } = await supabaseAdmin
      .from("pdfs")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    const isSubActive =
      profile?.subscription_status === "active" &&
      profile?.subscription_expires_at &&
      new Date(profile.subscription_expires_at).getTime() > Date.now();

    return NextResponse.json({
      success: true,
      profile: profile || null,
      isSubscriptionActive: !!isSubActive,
      purchases: purchases || [],
      allPdfs: allPdfs || [],
    });
  } catch (error: any) {
    console.error("Error fetching student profile data:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load profile data" },
      { status: 500 }
    );
  }
}
