"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AuthModal from "@/components/AuthModal";
import { useCheckout } from "@/hooks/useCheckout";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import {
  BookOpen,
  FileText,
  HelpCircle,
  Download,
  Search,
  Lock,
  Sparkles,
  ChevronRight,
  X,
  CheckCircle2,
  XCircle,
  Award,
  Zap,
  ArrowLeft,
  Layers,
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Chapter {
  id: string;
  title: string;
  classLevel: "Class 11" | "Class 12";
  unit: string;
  chapterNumber: number;
  weightage: string;
  isPaid: boolean;
  price?: string;
  summary: string;
  notes: { title: string; content: string[] }[];
  questions: Question[];
  keyTopics: string[];
  pdfPages: number;
}

export default function ChaptersPage() {
  const { handleCheckout } = useCheckout();
  const { user } = useStudentAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<"ALL" | "Class 11" | "Class 12">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [activeTab, setActiveTab] = useState<"NOTES" | "MCQS">("NOTES");
  const [chaptersList, setChaptersList] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLiveChapters() {
      try {
        const supabase = createClient();
        const { data: pdfsData } = await supabase
          .from("pdfs")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (pdfsData && pdfsData.length > 0) {
          const mappedChapters: Chapter[] = pdfsData.map((pdf: any, idx: number) => ({
            id: pdf.id,
            title: pdf.title,
            classLevel: pdf.class_level === "Class 11" ? "Class 11" : "Class 12",
            unit: pdf.sub_heading || `Unit ${idx + 1} · Biology`,
            chapterNumber: idx + 1,
            weightage: "High Weightage",
            isPaid: !pdf.is_free,
            price: pdf.is_free ? "FREE" : `₹${pdf.price || 49}`,
            pdfPages: pdf.page_count || 14,
            summary: pdf.description || `${pdf.title} — High yield study notes for NEET exam preparation.`,
            keyTopics: [pdf.class_level || "NEET", "NCERT High Yield", "Revision Notes"],
            notes: [
              {
                title: "1. Chapter Overview & Concepts",
                content: [
                  pdf.description || "Comprehensive NCERT key points and summary.",
                  "Key formulas, diagrams, and memory tricks included.",
                ],
              },
            ],
            questions: [],
          }));
          setChaptersList(mappedChapters);
        } else {
          setChaptersList([]);
        }
      } catch (err) {
        console.error("Error fetching live chapters:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLiveChapters();
  }, []);

  const onCheckoutClick = (price: string, chapterId: string) => {
    handleCheckout({
      pdfId: chapterId,
      onLoginRequired: () => setAuthModalOpen(true),
    });
  };

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  const filteredChapters = chaptersList.filter((ch) => {
    const matchesClass = selectedClass === "ALL" || ch.classLevel === selectedClass;
    const matchesQuery =
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.unit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesQuery;
  });

  const handleSelectOption = (qId: number, optionIdx: number) => {
    if (submittedQuiz) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  return (
    <div className="min-h-screen bg-white text-[#2B2F2C] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight mb-3 font-sans">
            Chapter-Wise Notes &amp; Practice
          </h1>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Select any chapter to access NCERT bullet summaries, instant practice MCQs, and revision materials.
          </p>

          {/* SEARCH & CLASS FILTERS */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search chapter or unit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#016737] focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-full border border-gray-200">
              {(["ALL", "Class 11", "Class 12"] as const).map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedClass === cls
                      ? "bg-[#016737] text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CHAPTERS GRID — Live Chapters or Clean Empty State */}
        {loading ? (
          <div className="py-12 text-center text-sm font-medium text-gray-500">
            Loading chapters...
          </div>
        ) : filteredChapters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChapters.map((ch) => (
              <motion.div
                key={ch.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  setActiveChapter(ch);
                  setActiveTab("NOTES");
                  setSelectedAnswers({});
                  setSubmittedQuiz(false);
                }}
                className="bg-white rounded-2xl border border-gray-200 hover:border-[#016737]/40 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full group cursor-pointer"
              >
                {/* TOP 50% — THUMBNAIL IMAGE BANNER */}
                <div className="h-44 relative overflow-hidden bg-gradient-to-br from-[#016737]/10 to-[#8BC43F]/20">
                  <img
                    src="/hero_premium_clean.png"
                    alt={ch.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Header Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#016737] text-white shadow-xs">
                      {ch.classLevel}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-[#8BC43F] text-[#111827] px-2.5 py-1 rounded-full shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {ch.isPaid ? ch.price : "Free Notes"}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md">
                      {ch.unit}
                    </span>
                  </div>
                </div>

                {/* BOTTOM 50% — DETAILS */}
                <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#111827] leading-snug group-hover:text-[#016737] transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {ch.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-[#016737]" />
                      {ch.pdfPages} Pages
                    </span>
                    <span className="flex items-center gap-1 text-[#016737] font-bold group-hover:translate-x-1 transition-transform">
                      View Chapter Notes &rarr;
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-gray-50 border border-gray-200 text-center max-w-lg mx-auto">
            <BookOpen className="w-10 h-10 text-[#016737] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Chapters Uploaded Yet</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              When you upload PDFs or create chapters from the Admin Panel, they will appear here automatically.
            </p>
          </div>
        )}
      </main>

      {/* FULL-SCREEN SLIDING CHAPTER MODAL / DRAWER */}
      <AnimatePresence>
        {activeChapter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 flex flex-col my-auto relative"
            >
              {/* MODAL HEADER */}
              <div className="p-6 bg-[#F4F3F0] border-b border-gray-200 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-[#016737] bg-white px-2.5 py-0.5 rounded-full border border-gray-200">
                      {activeChapter.classLevel}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      {activeChapter.unit}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">
                    {activeChapter.title}
                  </h2>
                </div>

                <button
                  onClick={() => setActiveChapter(null)}
                  className="p-2 rounded-full bg-white hover:bg-gray-100 text-gray-700 transition-colors shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* TAB SELECTION BAR — Responsive */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 sm:px-6 py-2 sm:py-0 border-b border-gray-200 bg-white gap-2">
                <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setActiveTab("NOTES")}
                    className={`py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === "NOTES"
                        ? "border-[#016737] text-[#016737]"
                        : "border-transparent text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>NCERT Short Notes (FREE)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("MCQS")}
                    className={`py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === "MCQS"
                        ? "border-[#016737] text-[#016737]"
                        : "border-transparent text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Practice MCQs (Paid)</span>
                  </button>
                </div>

                <button
                  onClick={() => onCheckoutClick(activeChapter.price || "₹49", activeChapter.id)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-full bg-[#016737] text-white text-xs font-bold hover:bg-[#014d29] transition-colors shadow-sm my-1 sm:my-0"
                >
                  <Lock className="w-3 h-3" />
                  <span>Unlock Practice &amp; Full Notes ({activeChapter.price || "₹49"})</span>
                </button>
              </div>

              {/* MODAL BODY CONTENT */}
              <div className="p-6 overflow-y-auto flex-1 bg-white">
                {activeTab === "NOTES" && (
                  <div className="space-y-6">
                    {/* Chapter Overview Box */}
                    <div className="p-4 rounded-2xl bg-[#f6fdf0] border border-[#8BC43F]/40 text-[#016737]">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-[#8BC43F]" />
                          Chapter High-Yield Overview
                        </h4>
                        <a
                          href={`/secure-reader?title=${encodeURIComponent(activeChapter.title)}&subject=${encodeURIComponent(activeChapter.classLevel + " · " + activeChapter.unit)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-extrabold px-3 py-1.5 rounded-full bg-[#016737] text-white hover:bg-[#014d29] transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open Secure Reader ↗</span>
                        </a>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed font-normal">
                        {activeChapter.summary}
                      </p>
                    </div>

                    {/* Key Topics List */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                        Key NEET Focus Areas
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeChapter.keyTopics.map((topic) => (
                          <span
                            key={topic}
                            className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700"
                          >
                            • {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Detailed Notes Blocks */}
                    <div className="space-y-6 pt-2">
                      {activeChapter.notes.map((section, idx) => (
                        <div key={idx} className="border-l-2 border-[#016737] pl-4">
                          <h4 className="text-base font-bold text-[#111827] mb-2">
                            {section.title}
                          </h4>
                          <ul className="space-y-1.5">
                            {section.content.map((bullet, bIdx) => (
                              <li
                                key={bIdx}
                                className="text-sm text-gray-700 leading-relaxed flex items-start gap-2"
                              >
                                <span className="text-[#016737] font-bold">•</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "MCQS" && (
                  <div className="space-y-6">
                    {/* Free Preview Question */}
                    {activeChapter.questions.slice(0, 1).map((q, idx) => {
                      const userSelection = selectedAnswers[q.id];
                      const isSelected = userSelection !== undefined;

                      return (
                        <div
                          key={q.id}
                          className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col gap-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                              Free Sample Question
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-[#111827] leading-snug">
                            Q{idx + 1}. {q.question}
                          </h4>

                          {/* Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
                            {q.options.map((opt, optIdx) => {
                              let btnStyle = "bg-white border-gray-200 text-gray-800 hover:border-[#016737]";
                              if (submittedQuiz || isSelected) {
                                if (optIdx === q.correctIndex) {
                                  btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                                } else if (userSelection === optIdx) {
                                  btnStyle = "bg-red-50 border-red-500 text-red-900 font-bold";
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleSelectOption(q.id, optIdx)}
                                  className={`px-4 py-2.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                                >
                                  <span>{opt}</span>
                                  {submittedQuiz && optIdx === q.correctIndex && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {/* Lock Banner for Full Question Bank */}
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-center flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
                        <Lock className="w-6 h-6" />
                      </div>

                      <div>
                        <h4 className="text-xl font-black text-gray-900 mb-1">
                          Unlock Full Chapter Question Bank &amp; MCQs
                        </h4>
                        <p className="text-sm text-gray-600 max-w-md mx-auto">
                          Get 150+ high-yield NCERT practice questions, detailed solutions, and past NEET paper MCQs for {activeChapter.title}.
                        </p>
                      </div>

                      <button
                        onClick={() => onCheckoutClick(activeChapter.price || "₹49", activeChapter.id)}
                        className="px-6 py-3 rounded-full bg-[#016737] text-white text-sm font-bold hover:bg-[#014d29] transition-all shadow-md flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Unlock Practice MCQs for {activeChapter.price || "₹49"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* MODAL FOOTER */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-xs text-gray-500 font-medium">
                  NCERT Biology 2026 • BioVriksh Series
                </div>

                <button
                  onClick={() => onCheckoutClick(activeChapter.price || "₹49", activeChapter.id)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#016737] text-white text-xs font-bold hover:bg-[#014d29] transition-colors shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Download Full PDF ({activeChapter.price || "₹49"})</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppButton />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        customTitle="Student Login Required"
        customSubtitle="Please log in to your student account to unlock practice MCQs and view notes."
      />
    </div>
  );
}
