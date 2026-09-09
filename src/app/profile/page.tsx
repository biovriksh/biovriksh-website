"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Zap,
  BookOpen,
  ArrowRight,
  LogOut,
  Sparkles,
  CheckCircle2,
  Lock,
  Clock,
  FileText,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { createClient } from "@/lib/supabase/client";
import { PDFNote, Purchase } from "@/types/database";

export default function StudentProfilePage() {
  const { user, profile, isLoading, isSubscriptionActive, signOut, refreshProfile } = useStudentAuth();
  const [purchasedNotes, setPurchasedNotes] = useState<Purchase[]>([]);
  const [allPdfs, setAllPdfs] = useState<PDFNote[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const userId = user.id;

    async function loadStudentContent() {
      setFetchingData(true);
      try {
        // 1. Fetch user's individual purchases
        const { data: purchasesData } = await supabase
          .from("purchases")
          .select("*, pdf:pdfs(*)")
          .eq("student_id", userId)
          .eq("payment_status", "success");

        if (purchasesData) {
          setPurchasedNotes(purchasesData as any);
        }

        // 2. Fetch all PDFs for overall dashboard view
        const { data: pdfsData } = await supabase
          .from("pdfs")
          .select("*, chapter:chapters(name)")
          .eq("is_active", true);

        if (pdfsData) {
          setAllPdfs(pdfsData as any);
        }
      } catch (err) {
        console.error("Error loading student profile data:", err);
      } finally {
        setFetchingData(false);
      }
    }

    loadStudentContent();
  }, [user, supabase]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#016737] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-gray-600">Loading student profile...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto my-auto px-4 py-32 text-center">
          <div className="w-16 h-16 rounded-full bg-[#016737]/10 flex items-center justify-center mx-auto mb-4 text-[#016737]">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Student Access Required</h2>
          <p className="text-xs text-gray-600 mb-6">
            Please log in or sign up for a Bio Vriksh student account to access your personal dashboard and unlocked notes.
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="w-full py-3 rounded-xl bg-[#016737] text-white text-xs font-bold shadow-md hover:bg-[#014d29] transition-all"
          >
            Log In / Sign Up
          </button>
        </div>
        <Footer />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => window.location.reload()}
        />
      </main>
    );
  }

  // Calculate validity formatting
  const formattedValidity = profile?.subscription_expires_at
    ? new Date(profile.subscription_expires_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const daysRemaining = profile?.subscription_expires_at
    ? Math.max(
        0,
        Math.ceil(
          (new Date(profile.subscription_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-[#2B2F2C]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        
        {/* HEADER WELCOME BANNER */}
        {(() => {
          const rawName = profile?.full_name || user.user_metadata?.full_name || (user.email ? user.email.split("@")[0] : "Future Doctor");
          
          // Clean & capitalize student display name dynamically
          const cleanName = rawName.replace(/[0-9_]/g, " ").trim();
          const displayName = cleanName
            .split(" ")
            .filter(Boolean)
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ") || "Student";

          const initialLetter = displayName.charAt(0).toUpperCase() || "S";

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#00381c] via-[#016737] to-[#014d29] p-6 sm:p-8 text-white shadow-xl mb-8 border border-emerald-800/40"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#8BC43F]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* Avatar Icon */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#8BC43F] to-[#016737] text-white font-black text-2xl sm:text-3xl shrink-0 flex items-center justify-center shadow-lg border-2 border-white/40">
                    {initialLetter}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white px-3 py-0.5 rounded-full border border-white/20 shadow-xs" style={{ color: "#ffffff" }}>
                        NEET Aspirant
                      </span>
                      <span className="text-[10px] font-mono text-emerald-200" style={{ color: "#a7f3d0" }}>
                        ID: {user.id.slice(0, 8)}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight" style={{ color: "#ffffff", textShadow: "0 2px 4px rgba(0,0,0,0.4)" }}>
                      Welcome, Future Doctor {displayName}! 👨‍⚕️
                    </h1>

                    <p className="text-xs sm:text-sm text-emerald-100 mt-1 flex items-center gap-3 flex-wrap font-semibold" style={{ color: "#e2e8f0" }}>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-[#8BC43F]" />
                        <span style={{ color: "#ffffff" }}>{user.email}</span>
                      </span>
                      {profile?.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-[#8BC43F]" />
                          <span style={{ color: "#ffffff" }}>{profile.phone}</span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-start md:self-auto">
                  <button
                    onClick={refreshProfile}
                    title="Refresh Profile Data"
                    className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors border border-white/20 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className="w-4 h-4 text-white" />
                  </button>

                  <button
                    onClick={signOut}
                    className="px-4 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition-all border border-rose-400/40 flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <LogOut className="w-4 h-4" />
                    <span style={{ color: "#ffffff" }}>Log Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* 2-COLUMN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* SUBSCRIPTION & PLAN STATUS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`rounded-2xl border p-6 flex flex-col justify-between relative overflow-hidden bg-white shadow-sm ${
              isSubscriptionActive
                ? "border-[#8BC43F] ring-2 ring-[#8BC43F]/30"
                : "border-gray-200"
            }`}
          >
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-[#8BC43F]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#016737]/10 text-[#016737]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Current Plan
                    </h3>
                    <p className="text-base font-black text-gray-900">
                      {profile?.subscription_plan || "FREE PASS"}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                    isSubscriptionActive
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {isSubscriptionActive ? "Active Plan" : "Free Plan"}
                </span>
              </div>

              {isSubscriptionActive ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#016737]/5 to-[#8BC43F]/10 border border-[#8BC43F]/20 my-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-medium">Valid Until:</span>
                    <span className="font-extrabold text-[#016737]">{formattedValidity}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-medium">Days Remaining:</span>
                    <span className="font-extrabold text-[#016737]">{daysRemaining} Days</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-gradient-to-r from-[#016737] to-[#8BC43F] rounded-full"
                      style={{ width: `${Math.min(100, Math.max(10, (daysRemaining / 365) * 100))}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 my-4 text-left">
                  <p className="text-xs font-bold text-gray-800 mb-1">Unlock Unlimited Notes</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Upgrade to Premium Monthly or Yearly to access all 38 Biology chapters and NEET test series.
                  </p>
                </div>
              )}
            </div>

            <a
              href="/#pricing"
              className="w-full py-3 rounded-xl bg-[#016737] text-white text-xs font-bold text-center hover:bg-[#014d29] transition-all shadow-sm flex items-center justify-center gap-1.5 mt-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8BC43F]" />
              <span>{isSubscriptionActive ? "Extend Subscription" : "Upgrade to Premium"}</span>
            </a>
          </motion.div>

          {/* STATS OVERVIEW CARDS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* STAT 1: UNLOCKED NOTES */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Unlocked Notes
                </span>
                <div className="p-2 rounded-xl bg-emerald-50 text-[#016737]">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4">
                <span className="text-3xl font-black text-gray-900">
                  {isSubscriptionActive ? allPdfs.length : purchasedNotes.length}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {isSubscriptionActive
                    ? "Full Access: All active PDFs unlocked"
                    : `${purchasedNotes.length} individual notes purchased`}
                </p>
              </div>
            </div>

            {/* STAT 2: ACCOUNT STATUS */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Account Status
                </span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4">
                <span className="text-3xl font-black text-gray-900">Verified</span>
                <p className="text-xs text-gray-500 mt-1">
                  Student Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* BANNER PROMO */}
            <div className="sm:col-span-2 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 p-5 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-amber-500 text-white px-2 py-0.5 rounded-md">
                  NEET 2026 Target
                </span>
                <h4 className="text-sm font-extrabold text-gray-900 mt-1">
                  Complete 38-Chapter High Yield Notes
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Handcrafted NCERT line-by-line summaries with 3D diagrams.
                </p>
              </div>
              <a
                href="/chapters"
                className="px-4 py-2 rounded-xl bg-[#016737] text-white text-xs font-bold whitespace-nowrap hover:bg-[#014d29] transition-colors shrink-0"
              >
                Explore Chapters
              </a>
            </div>
          </motion.div>
        </div>

        {/* MY UNLOCKED NOTES & PURCHASES SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-[#016737]" />
                <h2 className="text-xl font-black text-gray-900">My Unlocked & Purchased Notes</h2>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Direct access to study notes unlocked via your subscription or direct purchase.
              </p>
            </div>

            <a
              href="/chapters"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#016737] hover:underline"
            >
              <span>Browse All Chapters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {fetchingData ? (
            <div className="py-12 text-center text-xs font-bold text-gray-500">
              Loading your study notes library...
            </div>
          ) : isSubscriptionActive ? (
            /* ALL ACTIVE NOTES AVAILABLE UNDER ACTIVE SUBSCRIPTION */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="rounded-2xl border border-gray-200 hover:border-[#016737]/40 p-4 transition-all duration-300 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50/50 shadow-xs hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#016737] bg-[#016737]/10 px-2.5 py-0.5 rounded-full">
                        {pdf.class_level || "Class 12"}
                      </span>
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                        ✓ Unlocked via Subscription
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 leading-snug">
                      {pdf.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {pdf.description || "Comprehensive NCERT line-by-line notes with diagrams."}
                    </p>
                  </div>

                  <a
                    href={`/secure-reader?pdfId=${pdf.id}&title=${encodeURIComponent(pdf.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full py-2 rounded-xl bg-[#016737] text-white text-xs font-bold hover:bg-[#014d29] transition-all flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Note Now ↗</span>
                  </a>
                </div>
              ))}
            </div>
          ) : purchasedNotes.length > 0 ? (
            /* INDIVIDUAL PURCHASED NOTES */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchasedNotes.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-200 p-4 transition-all flex flex-col justify-between bg-white shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-[#016737] bg-[#016737]/10 px-2.5 py-0.5 rounded-full">
                        Paid Note
                      </span>
                      <span className="text-[10px] font-medium text-gray-400">
                        {new Date(item.purchased_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 leading-snug">
                      {item.pdf?.title || "Purchased PDF Note"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Paid: ₹{item.amount_paid} • Status: {item.payment_status}
                    </p>
                  </div>

                  {item.pdf && (
                    <a
                      href={`/secure-reader?pdfId=${item.pdf.id}&title=${encodeURIComponent(item.pdf.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full py-2 rounded-xl bg-[#016737] text-white text-xs font-bold hover:bg-[#014d29] transition-all flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Note Now ↗</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-800">No Unlocked Notes Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-1 mb-4">
                You have not purchased any individual notes or activated a subscription plan yet.
              </p>
              <a
                href="/#pricing"
                className="px-5 py-2.5 rounded-xl bg-[#016737] text-white text-xs font-bold hover:bg-[#014d29] transition-all shadow-sm"
              >
                View Premium Plans & Notes
              </a>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
