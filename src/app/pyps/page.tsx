"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  FileText,
  Search,
  Calendar,
  Lock,
  Sparkles,
  Download,
  Award,
  CheckCircle2,
  Clock,
  Layers,
  Flame,
  ArrowRight
} from "lucide-react";

interface PYPItem {
  id: string;
  year: number;
  title: string;
  paperType: "Full NEET Paper" | "Biology" | "Physics" | "Chemistry";
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  isFree: boolean;
  pdfId?: string;
  thumbnailUrl?: string;
  description: string;
  tags: string[];
}

const defaultPYPList: PYPItem[] = [
  // ─── 2024 ───
  {
    id: "pyp-2024-full",
    year: 2024,
    title: "NEET UG 2024 Official Question Paper with NCERT Solutions",
    paperType: "Full NEET Paper",
    totalQuestions: 200,
    totalMarks: 720,
    durationMinutes: 200,
    isFree: true, // Latest sample paper Free
    description: "Complete authentic NTA NEET 2024 paper with line-by-line NCERT references and step-by-step solutions for Physics, Chemistry, Botany & Zoology.",
    tags: ["Latest Paper", "NTA Official", "NCERT Line-by-Line"],
  },
  {
    id: "pyp-2024-bio",
    year: 2024,
    title: "NEET UG 2024 Biology Section (Botany & Zoology)",
    paperType: "Biology",
    totalQuestions: 100,
    totalMarks: 360,
    durationMinutes: 90,
    isFree: true,
    description: "All 100 questions from NEET 2024 Biology with statement-type, assertion-reason, and matching analysis.",
    tags: ["Botany & Zoology", "100 Questions"],
  },

  // ─── 2023 ───
  {
    id: "pyp-2023-full",
    year: 2023,
    title: "NEET UG 2023 Official Question Paper with Detailed Solutions",
    paperType: "Full NEET Paper",
    totalQuestions: 200,
    totalMarks: 720,
    durationMinutes: 200,
    isFree: false,
    description: "Authentic NEET 2023 exam paper. Includes answer key breakdown, error analysis, and formula applications.",
    tags: ["Full Syllabus", "200 Questions"],
  },
  {
    id: "pyp-2023-phy",
    year: 2023,
    title: "NEET UG 2023 Physics Section Paper with Formula Shortcuts",
    paperType: "Physics",
    totalQuestions: 50,
    totalMarks: 180,
    durationMinutes: 60,
    isFree: false,
    description: "Detailed step-by-step numerical derivations and diagram interpretations for NEET 2023 Physics.",
    tags: ["Formulas", "Section A & B"],
  },
  {
    id: "pyp-2023-chem",
    year: 2023,
    title: "NEET UG 2023 Chemistry Section Paper with Reaction Mechanisms",
    paperType: "Chemistry",
    totalQuestions: 50,
    totalMarks: 180,
    durationMinutes: 50,
    isFree: false,
    description: "Physical chemistry numericals, inorganic memory tables, and organic named reaction explanations.",
    tags: ["Organic & Inorganic"],
  },

  // ─── 2022 ───
  {
    id: "pyp-2022-full",
    year: 2022,
    title: "NEET UG 2022 Official Question Paper with Solved Answer Key",
    paperType: "Full NEET Paper",
    totalQuestions: 200,
    totalMarks: 720,
    durationMinutes: 200,
    isFree: false,
    description: "Complete 2022 NTA examination paper with subject-wise answer keys and question difficulty rating.",
    tags: ["Complete 720 Marks"],
  },
  {
    id: "pyp-2022-bio",
    year: 2022,
    title: "NEET UG 2022 Biology Solved Paper (Botany & Zoology)",
    paperType: "Biology",
    totalQuestions: 100,
    totalMarks: 360,
    durationMinutes: 90,
    isFree: false,
    description: "High-yield NCERT citations for every single biology question from the 2022 NEET examination.",
    tags: ["High NCERT Yield"],
  },

  // ─── 2021 ───
  {
    id: "pyp-2021-full",
    year: 2021,
    title: "NEET UG 2021 Question Paper with Question-by-Question Solutions",
    paperType: "Full NEET Paper",
    totalQuestions: 200,
    totalMarks: 720,
    durationMinutes: 180,
    isFree: false,
    description: "First year of Section A (35 Qs) and Section B (15 Qs) pattern. In-depth explanations for all questions.",
    tags: ["New Pattern Intro"],
  },

  // ─── 2020 ───
  {
    id: "pyp-2020-full",
    year: 2020,
    title: "NEET UG 2020 Official Solved Paper with Explanations",
    paperType: "Full NEET Paper",
    totalQuestions: 180,
    totalMarks: 720,
    durationMinutes: 180,
    isFree: false,
    description: "180 question pattern NEET 2020 solved paper with complete physics and chemistry calculation sheets.",
    tags: ["180 Qs Pattern"],
  },

  // ─── 2019 ───
  {
    id: "pyp-2019-full",
    year: 2019,
    title: "NEET UG 2019 Question Paper & NCERT Explanations",
    paperType: "Full NEET Paper",
    totalQuestions: 180,
    totalMarks: 720,
    durationMinutes: 180,
    isFree: false,
    description: "Complete 2019 solved paper with question-wise concept tagging and difficulty breakdown.",
    tags: ["NTA First Edition"],
  },

  // ─── 2018 ───
  {
    id: "pyp-2018-full",
    year: 2018,
    title: "NEET UG 2018 Question Paper with Complete Solutions",
    paperType: "Full NEET Paper",
    totalQuestions: 180,
    totalMarks: 720,
    durationMinutes: 180,
    isFree: false,
    description: "CBSE-conducted NEET 2018 complete question paper with comprehensive solutions and answer keys.",
    tags: ["CBSE NEET"],
  },

  // ─── 2017 ───
  {
    id: "pyp-2017-full",
    year: 2017,
    title: "NEET UG 2017 Solved Question Paper",
    paperType: "Full NEET Paper",
    totalQuestions: 180,
    totalMarks: 720,
    durationMinutes: 180,
    isFree: false,
    description: "Authentic NEET 2017 question paper with detailed step-by-step explanations.",
    tags: ["10-Year Archive"],
  },

  // ─── 2016 ───
  {
    id: "pyp-2016-full",
    year: 2016,
    title: "NEET UG 2016 Phase 1 & 2 Question Papers with Solutions",
    paperType: "Full NEET Paper",
    totalQuestions: 180,
    totalMarks: 720,
    durationMinutes: 180,
    isFree: false,
    description: "Both NEET 2016 Phase 1 and Phase 2 combined archive with verified solutions.",
    tags: ["Phase 1 & Phase 2"],
  },

  // ─── 2015 ───
  {
    id: "pyp-2015-full",
    year: 2015,
    title: "AIPMT / NEET UG 2015 Solved Question Paper",
    paperType: "Full NEET Paper",
    totalQuestions: 180,
    totalMarks: 720,
    durationMinutes: 180,
    isFree: false,
    description: "AIPMT/NEET 2015 re-exam question paper with full concept explanations.",
    tags: ["Foundational"],
  },
];

const availableYears = [
  "All Years",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
] as const;

function PYPsContent() {
  const searchParams = useSearchParams();
  const initialTypeParam = searchParams.get("type");
  const initialYearParam = searchParams.get("year");

  const [selectedYear, setSelectedYear] = useState<string>(initialYearParam || "All Years");
  const [selectedType, setSelectedType] = useState<string>(
    initialTypeParam?.toLowerCase() === "biology"
      ? "Biology"
      : initialTypeParam?.toLowerCase() === "physics"
      ? "Physics"
      : initialTypeParam?.toLowerCase() === "chemistry"
      ? "Chemistry"
      : initialTypeParam?.toLowerCase() === "full"
      ? "Full NEET Paper"
      : "All Papers"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [livePdfs, setLivePdfs] = useState<any[]>([]);

  useEffect(() => {
    async function loadLivePYPs() {
      try {
        const res = await fetch("/api/public/pdfs", { cache: "no-store" });
        const json = await res.json();
        if (json.success && json.pdfs) {
          const pypPdfs = json.pdfs.filter(
            (p: any) =>
              p.note_type === "pyp" ||
              p.title.toLowerCase().includes("pyp") ||
              p.title.toLowerCase().includes("previous year")
          );
          setLivePdfs(pypPdfs);
        }
      } catch (err) {
        console.error("Failed to fetch live PYP PDFs:", err);
      }
    }
    loadLivePYPs();
  }, []);

  // Merge live database PDFs if present
  const combinedPYPs = defaultPYPList.map((paper) => {
    const matched = livePdfs.find(
      (p) =>
        p.years_covered?.includes(String(paper.year)) ||
        p.title.toLowerCase().includes(String(paper.year))
    );
    if (matched) {
      return {
        ...paper,
        pdfId: matched.id,
        isFree: matched.is_free,
        thumbnailUrl: matched.thumbnail_url || paper.thumbnailUrl,
        title: matched.title,
      };
    }
    return paper;
  });

  const filteredPYPs = combinedPYPs.filter((p) => {
    if (selectedYear !== "All Years" && String(p.year) !== selectedYear) return false;
    if (selectedType !== "All Papers" && p.paperType !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        String(p.year).includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FDFEFD] text-[#2B2F2C] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-36 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ═══ CLEAN COMPACT HEADING ═══ */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight leading-tight mb-2">
              Previous Year Papers (PYP&apos;s)
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Official NEET UG solved papers from 2015 to 2024. NEET 2024 sample is free!
            </p>
          </div>

          {/* ═══ FILTER BAR: GROUPED ACCORDING TO YEAR ═══ */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs mb-8 space-y-4">
            {/* Year Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Select Exam Year:
                </span>
                <span className="text-xs font-semibold text-[#016737]">
                  10-Year Archive (2015 – 2024)
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {availableYears.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedYear === yr
                        ? "bg-[#016737] text-white shadow-xs font-black"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject / Paper Type & Search */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 shrink-0">
                  Section:
                </span>
                {(["All Papers", "Full NEET Paper", "Biology", "Physics", "Chemistry"] as const).map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                        selectedType === type
                          ? "bg-gray-900 text-white font-black"
                          : "text-gray-600 hover:text-gray-900 bg-gray-50"
                      }`}
                    >
                      {type}
                    </button>
                  )
                )}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search papers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#016737]"
                />
              </div>
            </div>
          </div>

          {/* ═══ PAPERS GRID ═══ */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              {selectedYear} Papers ({filteredPYPs.length})
            </h2>
            <span className="text-xs text-gray-500">
              Official papers with step-by-step solutions
            </span>
          </div>

          {filteredPYPs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No papers found</h3>
              <p className="text-xs text-gray-500 mt-1">Try selecting another year or section.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPYPs.map((paper, idx) => (
                <motion.div
                  key={paper.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md hover:border-[#016737]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  {/* ═══ SMALL THUMBNAIL IMAGE BANNER AT TOP ═══ */}
                  <div className="h-28 sm:h-32 w-full relative overflow-hidden bg-gradient-to-br from-[#016737]/10 via-[#8BC43F]/15 to-emerald-100 shrink-0">
                    <img
                      src={
                        paper.thumbnailUrl ||
                        (paper.paperType === "Biology"
                          ? "/ncert_root_decoding_3d.png"
                          : paper.paperType === "Physics"
                          ? "/neet_biology_study_desk.png"
                          : paper.paperType === "Chemistry"
                          ? "/intro_biology_ecosystem.png"
                          : "/educator_chalkboard_3d.png")
                      }
                      alt={paper.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                    {/* Status badges overlaid on image */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/20">
                        NEET {paper.year}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-400/20">
                        {paper.paperType}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      {paper.isFree ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8BC43F] text-[#014d29] shadow-xs">
                          Free Sample
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-amber-400/30 flex items-center gap-1 shadow-xs">
                          <Lock className="w-3 h-3 text-amber-400" />
                          Pass
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2 right-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white/95 flex items-center gap-1">
                        <Award className="w-3 h-3 text-[#8BC43F]" />
                        {paper.totalQuestions} Qs • {paper.totalMarks}M
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                    <div>
                      {/* Paper Title */}
                      <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-[#016737] transition-colors">
                        {paper.title}
                      </h3>

                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
                        {paper.description}
                      </p>

                      {/* Meta Row */}
                      <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50 text-[11px] text-gray-600 font-medium mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#016737]" />
                          <span>{paper.durationMinutes} Mins Exam</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1 font-bold text-gray-800">
                          <span>{paper.totalMarks} Marks</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                      {paper.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 text-gray-600"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {paper.isFree ? (
                      <a
                        href={
                          paper.pdfId
                            ? `/secure-reader?pdfId=${encodeURIComponent(paper.pdfId)}&title=${encodeURIComponent(paper.title)}`
                            : `/chapters`
                        }
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#016737] hover:bg-[#014d29] text-white flex items-center justify-center gap-2 transition duration-200 shadow-xs cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Read Solved PYP ↗</span>
                      </a>
                    ) : (
                      <a
                        href="/#pricing"
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gray-900 hover:bg-black text-white flex items-center justify-center gap-1.5 transition duration-200 cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5 text-[#8BC43F]" />
                        <span>Unlock with Subscription Pass</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default function PYPsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFEFD] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#016737] border-t-transparent animate-spin" />
        </div>
      }
    >
      <PYPsContent />
    </Suspense>
  );
}
