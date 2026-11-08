"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Dna,
  Atom,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  FileText,
  Lock,
  BookOpen,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface RecentPDFCard {
  id: string;
  title: string;
  subject: string;
  class_level: string;
  unit?: string | null;
  sub_heading?: string | null;
  note_type?: string;
  thumbnail_url?: string | null;
  is_free: boolean;
  page_count?: number;
  questions_count?: number;
  is_recent?: boolean;
}

interface SubjectConfig {
  id: string;
  name: string;
  tag: string;
  subtitle: string;
  accentColor: string;
  accentBg: string;
  borderColor: string;
  icon: typeof Dna;
  defaultPdfs: RecentPDFCard[];
}

const subjectConfigs: SubjectConfig[] = [
  {
    id: "biology",
    name: "Biology",
    tag: "360 Marks • Botany & Zoology",
    subtitle: "Recent question PDFs, annotated NCERT chapters & PYPs",
    accentColor: "#016737",
    accentBg: "bg-emerald-50 text-[#016737]",
    borderColor: "border-emerald-200/80 hover:border-[#016737]",
    icon: Dna,
    defaultPdfs: [
      {
        id: "default-bio-1",
        title: "The Living World: NCERT Complete MCQs",
        subject: "Biology",
        class_level: "Class 11",
        unit: "Diversity in Living World",
        sub_heading: "Chapter 1 • 250 Questions",
        note_type: "questions",
        thumbnail_url: "/question_practice_matrix_3d.png",
        is_free: true,
        page_count: 14,
        questions_count: 250,
      },
      {
        id: "default-bio-2",
        title: "Biological Classification: Line Highlights & PYQs",
        subject: "Biology",
        class_level: "Class 11",
        unit: "Diversity in Living World",
        sub_heading: "Chapter 2 • High Yield",
        note_type: "annotated_ncert",
        thumbnail_url: "/ncert_root_decoding_3d.png",
        is_free: false,
        page_count: 22,
        questions_count: 250,
      },
      {
        id: "default-bio-3",
        title: "Sexual Reproduction in Flowering Plants",
        subject: "Biology",
        class_level: "Class 12",
        unit: "Reproduction",
        sub_heading: "Chapter 1 • 250 Questions",
        note_type: "questions",
        thumbnail_url: "/intro_biology_ecosystem.png",
        is_free: true,
        page_count: 18,
        questions_count: 250,
      },
      {
        id: "default-bio-4",
        title: "Principles of Inheritance and Variation (Genetics)",
        subject: "Biology",
        class_level: "Class 12",
        unit: "Genetics & Evolution",
        sub_heading: "Chapter 4 • Pedigree Tricks",
        note_type: "annotated_ncert",
        thumbnail_url: "/educator_chalkboard_3d.png",
        is_free: false,
        page_count: 32,
        questions_count: 250,
      },
      {
        id: "default-bio-5",
        title: "NEET UG 2024 Biology Official Paper Solutions",
        subject: "Biology",
        class_level: "Class 12",
        unit: "NEET Exam Archive",
        sub_heading: "100 Qs Solved Paper",
        note_type: "pyp",
        thumbnail_url: "/neet_biology_study_desk.png",
        is_free: true,
        page_count: 24,
        questions_count: 100,
      },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    tag: "180 Marks • Mechanics & Modern Physics",
    subtitle: "Recent numerical sheets, formula notes & previous exam papers",
    accentColor: "#6d28d9",
    accentBg: "bg-violet-50 text-violet-700",
    borderColor: "border-violet-200/80 hover:border-violet-600",
    icon: Atom,
    defaultPdfs: [
      {
        id: "default-phy-1",
        title: "Units and Measurements: Practice Problem Sheet",
        subject: "Physics",
        class_level: "Class 11",
        unit: "General Physics",
        sub_heading: "Chapter 1 • 250 Questions",
        note_type: "questions",
        thumbnail_url: "/neet_biology_study_desk.png",
        is_free: true,
        page_count: 12,
        questions_count: 250,
      },
      {
        id: "default-phy-2",
        title: "Motion in a Straight Line: Graphs & Derivations",
        subject: "Physics",
        class_level: "Class 11",
        unit: "Kinematics",
        sub_heading: "Chapter 2 • Formula NCERT",
        note_type: "annotated_ncert",
        thumbnail_url: "/educator_chalkboard_3d.png",
        is_free: false,
        page_count: 16,
        questions_count: 250,
      },
      {
        id: "default-phy-3",
        title: "Electric Charges and Fields: Concept Problem Bank",
        subject: "Physics",
        class_level: "Class 12",
        unit: "Electrostatics",
        sub_heading: "Chapter 1 • 250 Questions",
        note_type: "questions",
        thumbnail_url: "/question_practice_matrix_3d.png",
        is_free: true,
        page_count: 18,
        questions_count: 250,
      },
      {
        id: "default-phy-4",
        title: "Current Electricity: Circuit Tricks & Kirchhoff Rules",
        subject: "Physics",
        class_level: "Class 12",
        unit: "Current Electricity",
        sub_heading: "Chapter 3 • Color Codes",
        note_type: "annotated_ncert",
        thumbnail_url: "/ncert_root_decoding_3d.png",
        is_free: false,
        page_count: 20,
        questions_count: 250,
      },
      {
        id: "default-phy-5",
        title: "NEET UG 2024 Physics Solved Paper with Shortcuts",
        subject: "Physics",
        class_level: "Class 12",
        unit: "NEET Exam Archive",
        sub_heading: "50 Qs Section A & B",
        note_type: "pyp",
        thumbnail_url: "/neet_biology_study_desk.png",
        is_free: true,
        page_count: 16,
        questions_count: 50,
      },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    tag: "180 Marks • Organic, Inorganic & Physical",
    subtitle: "Recent reaction mechanisms, NCERT highlights & topic MCQs",
    accentColor: "#0284c7",
    accentBg: "bg-blue-50 text-blue-700",
    borderColor: "border-blue-200/80 hover:border-blue-600",
    icon: FlaskConical,
    defaultPdfs: [
      {
        id: "default-chem-1",
        title: "Some Basic Concepts of Chemistry: Mole Concept MCQs",
        subject: "Chemistry",
        class_level: "Class 11",
        unit: "Physical Chemistry",
        sub_heading: "Chapter 1 • 250 Questions",
        note_type: "questions",
        thumbnail_url: "/intro_biology_ecosystem.png",
        is_free: true,
        page_count: 14,
        questions_count: 250,
      },
      {
        id: "default-chem-2",
        title: "Structure of Atom: Quantum Model NCERT Line Decoded",
        subject: "Chemistry",
        class_level: "Class 11",
        unit: "Physical Chemistry",
        sub_heading: "Chapter 2 • High Yield",
        note_type: "annotated_ncert",
        thumbnail_url: "/ncert_root_decoding_3d.png",
        is_free: false,
        page_count: 21,
        questions_count: 250,
      },
      {
        id: "default-chem-3",
        title: "Solutions: Raoult's Law & Colligative Properties",
        subject: "Chemistry",
        class_level: "Class 12",
        unit: "Physical Chemistry",
        sub_heading: "Chapter 1 • 250 Questions",
        note_type: "questions",
        thumbnail_url: "/question_practice_matrix_3d.png",
        is_free: true,
        page_count: 16,
        questions_count: 250,
      },
      {
        id: "default-chem-4",
        title: "Coordination Compounds: IUPAC & CFT Explanations",
        subject: "Chemistry",
        class_level: "Class 12",
        unit: "Inorganic Chemistry",
        sub_heading: "Chapter 5 • Solved Notes",
        note_type: "annotated_ncert",
        thumbnail_url: "/educator_chalkboard_3d.png",
        is_free: false,
        page_count: 22,
        questions_count: 250,
      },
      {
        id: "default-chem-5",
        title: "NEET UG 2024 Chemistry Solved Paper with Mechanisms",
        subject: "Chemistry",
        class_level: "Class 12",
        unit: "NEET Exam Archive",
        sub_heading: "50 Qs Section A & B",
        note_type: "pyp",
        thumbnail_url: "/neet_biology_study_desk.png",
        is_free: true,
        page_count: 18,
        questions_count: 50,
      },
    ],
  },
];

export default function SubjectSections() {
  const [livePdfs, setLivePdfs] = useState<RecentPDFCard[]>([]);
  const scrollRowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    async function loadPublicPDFs() {
      try {
        const res = await fetch("/api/public/pdfs", { cache: "no-store" });
        const json = await res.json();
        if (json.success && Array.isArray(json.pdfs)) {
          setLivePdfs(json.pdfs);
        }
      } catch (err) {
        console.error("Failed to load public PDFs:", err);
      }
    }
    loadPublicPDFs();
  }, []);

  const handleScroll = (subjectId: string, direction: "left" | "right") => {
    const container = scrollRowRefs.current[subjectId];
    if (container) {
      const scrollAmount = direction === "left" ? -320 : 320;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-16 py-12 bg-white">
      {subjectConfigs.map((subj, index) => {
        const IconComponent = subj.icon;

        // Match live PDFs for this subject where is_recent is true, or fallback to live subject PDFs
        const subjectLivePdfs = livePdfs.filter(
          (p) => p.subject?.toLowerCase() === subj.name.toLowerCase()
        );
        const recentFiltered = subjectLivePdfs.filter((p) => p.is_recent === true);

        // Display recent PDFs if any toggled, or latest live subject PDFs, or fallback defaults
        const displayCards: RecentPDFCard[] =
          recentFiltered.length > 0
            ? recentFiltered
            : subjectLivePdfs.length > 0
            ? subjectLivePdfs
            : subj.defaultPdfs;

        return (
          <section
            key={subj.id}
            id={subj.id}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
              index !== 0 ? "pt-12 border-t border-gray-100" : ""
            }`}
          >
            {/* ═══ CLEAN HEADER WITH SCROLL ARROWS ═══ */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl ${subj.accentBg} flex items-center justify-center shrink-0`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: `${subj.accentColor}15`, color: subj.accentColor }}
                  >
                    {subj.tag}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {subj.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {subj.subtitle}
                </p>
              </div>

              {/* Navigation Controls & Class Links */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <a
                  href={`/questions?subject=${subj.name}&class=Class+11`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Class 11
                </a>
                <a
                  href={`/questions?subject=${subj.name}&class=Class+12`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Class 12
                </a>

                {/* Left / Right Scroll Buttons */}
                <div className="flex items-center gap-1 pl-2 border-l border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleScroll(subj.id, "left")}
                    aria-label={`Scroll ${subj.name} left`}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScroll(subj.id, "right")}
                    aria-label={`Scroll ${subj.name} right`}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ═══ SINGLE HORIZONTAL ROW OF RECENT PDFS (NO WRAP) ═══ */}
            <div
              ref={(el) => {
                scrollRowRefs.current[subj.id] = el;
              }}
              className="flex flex-row flex-nowrap overflow-x-auto gap-4 sm:gap-5 pb-4 pt-1 px-1 scroll-smooth snap-x snap-mandatory"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: `${subj.accentColor}40 transparent`,
              }}
            >
              {displayCards.map((card, idx) => (
                <motion.div
                  key={card.id || idx}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`w-[270px] sm:w-[300px] shrink-0 flex-none bg-white rounded-2xl border ${subj.borderColor} shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group snap-start`}
                >
                  {/* Top Thumbnail Image Banner */}
                  <div className="h-28 sm:h-32 w-full relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shrink-0">
                    <img
                      src={
                        card.thumbnail_url ||
                        (subj.name === "Biology"
                          ? "/question_practice_matrix_3d.png"
                          : subj.name === "Physics"
                          ? "/neet_biology_study_desk.png"
                          : "/intro_biology_ecosystem.png")
                      }
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                    {/* Class & Unit Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {card.class_level || "Class 11"}
                      </span>
                    </div>

                    {/* Free Sample / Pass Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      {card.is_free ? (
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

                    {/* Note Type / Questions count */}
                    <div className="absolute bottom-2 right-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white/95 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-[#8BC43F]" />
                        {card.questions_count ? `${card.questions_count} Qs` : `${card.page_count || 14} Pgs`}
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Details */}
                  <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider line-clamp-1">
                        {card.unit || card.sub_heading || subj.name}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug line-clamp-2 mt-1 group-hover:text-[#016737] transition-colors">
                        {card.title}
                      </h3>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 border-t border-gray-100">
                      {card.is_free ? (
                        <a
                          href={
                            card.id && !card.id.startsWith("default-")
                              ? `/secure-reader?pdfId=${encodeURIComponent(card.id)}&title=${encodeURIComponent(card.title)}`
                              : `/questions?subject=${encodeURIComponent(subj.name)}`
                          }
                          className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition duration-200 shadow-xs cursor-pointer"
                          style={{ backgroundColor: subj.accentColor }}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Read Free PDF ↗</span>
                        </a>
                      ) : (
                        <a
                          href="/#pricing"
                          className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-gray-900 hover:bg-black text-white flex items-center justify-center gap-1.5 transition duration-200 cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5 text-[#8BC43F]" />
                          <span>Unlock with Plan</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
