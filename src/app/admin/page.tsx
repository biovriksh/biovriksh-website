"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  FileText,
  FileCheck2,
  Users,
  CheckCircle2,
  RefreshCw,
  FolderPlus,
  UploadCloud,
  BookOpen,
  FolderTree,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DashboardStats } from "@/types/database";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    activePDFs: 0,
    totalStudents: 0,
    recentPurchases: [],
  });
  const [testCount, setTestCount] = useState(0);
  const [annotatedCount, setAnnotatedCount] = useState(0);
  const [chapterCount, setChapterCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [subjectCounts, setSubjectCounts] = useState({
    biology: 0,
    physics: 0,
    chemistry: 0,
  });

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Count chapters
      const { count: chCount } = await supabase
        .from("chapters")
        .select("*", { count: "exact", head: true });
      if (chCount !== null) setChapterCount(chCount);

      const { count: pdfCount, data: allPdfs } = await supabase
        .from("pdfs")
        .select("subject, note_type, title, sub_heading", { count: "exact" })
        .eq("is_active", true);

      if (allPdfs) {
        let bio = 0, phy = 0, chem = 0, tests = 0, ncerts = 0;
        allPdfs.forEach((p: any) => {
          if (p.subject === "Physics") phy++;
          else if (p.subject === "Chemistry") chem++;
          else bio++;

          if (p.note_type === "annotated_ncert") {
            ncerts++;
          }

          if (
            p.note_type === "test" ||
            (p.title && p.title.toLowerCase().includes("test")) ||
            (p.sub_heading && p.sub_heading.toLowerCase().includes("test"))
          ) {
            tests++;
          }
        });
        setSubjectCounts({ biology: bio, physics: phy, chemistry: chem });
        setTestCount(tests);
        setAnnotatedCount(ncerts);
      }

      const { count: studentCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "student");

      const { data: purchases } = await supabase
        .from("purchases")
        .select("*, student:profiles(*), pdf:pdfs(*)")
        .order("purchased_at", { ascending: false })
        .limit(6);

      const totalRevenue = purchases ? purchases.reduce((acc, curr) => acc + (curr.amount_paid || 0), 0) : 0;
      setStats({
        totalRevenue: totalRevenue,
        totalOrders: purchases ? purchases.length : 0,
        activePDFs: pdfCount || 0,
        totalStudents: studentCount || 0,
        recentPurchases: (purchases as any) || [],
      });
    } catch (e) {
      console.log("Error fetching stats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      subtitle: "Razorpay Sales",
      icon: DollarSign,
      iconBg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    },
    {
      title: "Notes Unlocked",
      value: stats.totalOrders.toString(),
      subtitle: "Orders Logged",
      icon: ShoppingCart,
      iconBg: "bg-blue-50 text-blue-700 border border-blue-200",
    },
    {
      title: "Chapters",
      value: chapterCount.toString(),
      subtitle: "Active Chapters",
      icon: FolderTree,
      iconBg: "bg-amber-50 text-amber-700 border border-amber-200",
    },
    {
      title: "Annotated NCERT",
      value: annotatedCount.toString(),
      subtitle: "Line-by-Line PYQs",
      icon: BookOpen,
      iconBg: "bg-emerald-50 text-emerald-800 border border-emerald-300",
    },
    {
      title: "Chapter Tests",
      value: testCount.toString(),
      subtitle: "Practice Sets",
      icon: FileCheck2,
      iconBg: "bg-teal-50 text-teal-700 border border-teal-200",
    },
    {
      title: "NEET Aspirants",
      value: `${stats.totalStudents}`,
      subtitle: "Registered Users",
      icon: Users,
      iconBg: "bg-purple-50 text-purple-700 border border-purple-200",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ═══ EXECUTIVE CLEAN GREETING BANNER ═══ */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Dashboard Overview
            </h1>
            <span className="text-[10px] font-bold text-[#016737] bg-[#016737]/10 px-2 py-0.5 rounded-md border border-[#016737]/20 uppercase">
              Live Systems
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time management for Chapters, Annotated NCERT, Mindmaps, Tests, and Sales.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/admin/annotated-ncert"
            className="px-3.5 py-2 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#8BC43F]" />
            <span>Annotated NCERT</span>
          </Link>
          <Link
            href="/admin/chapters"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-200"
          >
            <FolderPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>Manage Chapters</span>
          </Link>
          <Link
            href="/admin/pdfs"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-200"
          >
            <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
            <span>Mindmaps &amp; PDFs</span>
          </Link>
          <Link
            href="/admin/tests"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-200"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Tests</span>
          </Link>
        </div>
      </div>

      {/* ═══ COMPACT STATS CARDS GRID ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-medium text-slate-500 block">{card.title}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{card.value}</h3>
                <span className="text-[10px] font-semibold text-slate-400 mt-0.5 block">
                  {card.subtitle}
                </span>
              </div>
              <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ 3-SUBJECT CONTENT BREAKDOWN ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-emerald-200/80 p-4 rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌿</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Biology Materials</p>
              <p className="text-[11px] text-slate-500 font-medium">Zoology &amp; Botany</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
            {subjectCounts.biology} Items
          </span>
        </div>

        <div className="bg-white border border-violet-200/80 p-4 rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Physics Materials</p>
              <p className="text-[11px] text-slate-500 font-medium">Class 11 &amp; 12 Syllabus</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-100">
            {subjectCounts.physics} Items
          </span>
        </div>

        <div className="bg-white border border-blue-200/80 p-4 rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🧪</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Chemistry Materials</p>
              <p className="text-[11px] text-slate-500 font-medium">Organic, Inorganic &amp; Physical</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
            {subjectCounts.chemistry} Items
          </span>
        </div>
      </div>

      {/* ═══ RECENT ORDERS TABLE ═══ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-[#016737]" />
              <span>Recent Razorpay Orders</span>
            </h2>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Verified server-side student transactions.
            </p>
          </div>

          <button
            onClick={fetchDashboardStats}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium transition-all flex items-center gap-1.5 border border-slate-200 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider bg-slate-50">
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">PDF Material</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Razorpay Txn ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {stats.recentPurchases.length > 0 ? (
                stats.recentPurchases.map((purchase: any) => (
                  <tr key={purchase.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {purchase.student?.full_name || "Aspirant Student"}
                    </td>
                    <td className="py-3 px-3 text-[#016737] font-semibold">
                      {purchase.pdf?.title || "High Yield Biology Notes"}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      ₹{purchase.amount_paid}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Success</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {purchase.payment_gateway_id || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                    No order transactions recorded in Supabase yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
