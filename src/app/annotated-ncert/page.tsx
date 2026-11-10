"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  BookOpen,
  Search,
  Sparkles,
  Lock,
  FileText,
  CheckCircle2,
  ChevronRight,
  Dna,
  Atom,
  FlaskConical,
  Calendar,
  Layers
} from "lucide-react";

interface AnnotatedChapterItem {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  subject: "Biology" | "Physics" | "Chemistry";
  classLevel: "Class 11" | "Class 12";
  unit: string;
  yearsCovered: string;
  solvedQuestions: number;
  totalPages: number;
  isFree: boolean;
  pdfId?: string;
  thumbnailUrl?: string;
  highlightText: string;
}

const defaultAnnotatedSyllabus: AnnotatedChapterItem[] = [
  // ─── BIOLOGY CLASS 11 ───
  {
    id: "ncert-bio-11-1",
    chapterNumber: 1,
    chapterTitle: "The Living World",
    subject: "Biology",
    classLevel: "Class 11",
    unit: "Diversity in Living World",
    yearsCovered: "NEET 2015-2024",
    solvedQuestions: 42,
    totalPages: 16,
    isFree: true, // 1st Chapter Free
    highlightText: "Line-by-line highlights of taxonomic hierarchy, binomial nomenclature rules, and specimen preservation.",
  },
  {
    id: "ncert-bio-11-2",
    chapterNumber: 2,
    chapterTitle: "Biological Classification",
    subject: "Biology",
    classLevel: "Class 11",
    unit: "Diversity in Living World",
    yearsCovered: "NEET 2016-2024",
    solvedQuestions: 68,
    totalPages: 22,
    isFree: false,
    highlightText: "Tables of 5 kingdoms, mycorrhiza, lichens, and fungal reproduction line annotations.",
  },
  {
    id: "ncert-bio-11-3",
    chapterNumber: 3,
    chapterTitle: "Plant Kingdom",
    subject: "Biology",
    classLevel: "Class 11",
    unit: "Diversity in Living World",
    yearsCovered: "NEET 2015-2024",
    solvedQuestions: 75,
    totalPages: 24,
    isFree: false,
    highlightText: "Pigment tables in algae, bryophyte & pteridophyte alternation of generation life-cycle diagrams.",
  },
  {
    id: "ncert-bio-11-4",
    chapterNumber: 4,
    chapterTitle: "Animal Kingdom",
    subject: "Biology",
    classLevel: "Class 11",
    unit: "Diversity in Living World",
    yearsCovered: "NEET 2015-2024",
    solvedQuestions: 85,
    totalPages: 28,
    isFree: false,
    highlightText: "Comprehensive phylum comparison charts, chordate vs non-chordate features, and exemplar diagrams.",
  },
  {
    id: "ncert-bio-11-5",
    chapterNumber: 5,
    chapterTitle: "Morphology of Flowering Plants",
    subject: "Biology",
    classLevel: "Class 11",
    unit: "Structural Organisation",
    yearsCovered: "NEET 2016-2024",
    solvedQuestions: 64,
    totalPages: 20,
    isFree: false,
    highlightText: "Flower parts, aestivation, placentation diagrams and Solanaceae/Fabaceae floral formula highlights.",
  },
  {
    id: "ncert-bio-11-6",
    chapterNumber: 6,
    chapterTitle: "Cell: The Unit of Life",
    subject: "Biology",
    classLevel: "Class 11",
    unit: "Cell Structure and Function",
    yearsCovered: "NEET 2015-2024",
    solvedQuestions: 92,
    totalPages: 26,
    isFree: false,
    highlightText: "Fluid mosaic membrane model, organelle functions, and chromosome morphology annotations.",
  },

  // ─── BIOLOGY CLASS 12 ───
  {
    id: "ncert-bio-12-1",
    chapterNumber: 1,
    chapterTitle: "Sexual Reproduction in Flowering Plants",
    subject: "Biology",
    classLevel: "Class 12",
    unit: "Reproduction",
    yearsCovered: "NEET 2016-2024",
    solvedQuestions: 78,
    totalPages: 25,
    isFree: true, // 1st Chapter Free
    highlightText: "Pollen development, embryo sac structure, double fertilisation, and apomixis annotated notes.",
  },
  {
    id: "ncert-bio-12-2",
    chapterNumber: 2,
    chapterTitle: "Human Reproduction",
    subject: "Biology",
    classLevel: "Class 12",
    unit: "Reproduction",
    yearsCovered: "NEET 2015-2024",
    solvedQuestions: 88,
    totalPages: 28,
    isFree: false,
    highlightText: "Spermatogenesis vs oogenesis hormonal control, menstrual cycle graph, and blastocyst implantation.",
  },
  {
    id: "ncert-bio-12-3",
    chapterNumber: 3,
    chapterTitle: "Principles of Inheritance and Variation",
    subject: "Biology",
    classLevel: "Class 12",
    unit: "Genetics and Evolution",
    yearsCovered: "NEET 2015-2024",
    solvedQuestions: 98,
    totalPages: 32,
    isFree: false,
    highlightText: "Dihybrid crosses, Morgan's linkage experiment charts, pedigree symbols, and aneuploidy syndromes.",
  },
  {
    id: "ncert-bio-12-4",
    chapterNumber: 4,
    chapterTitle: "Molecular Basis of Inheritance",
    subject: "Biology",
    classLevel: "Class 12",
    unit: "Genetics and Evolution",
    yearsCovered: "NEET 2015-2024",
    solvedQuestions: 110,
    totalPages: 35,
    isFree: false,
    highlightText: "Meselson-Stahl experiment, replication fork, genetic code table, transcription units, and lac operon.",
  },

  // ─── PHYSICS CLASS 11 ───
  {
    id: "ncert-phy-11-1",
    chapterNumber: 1,
    chapterTitle: "Units and Measurements",
    subject: "Physics",
    classLevel: "Class 11",
    unit: "Physical World & Measurement",
    yearsCovered: "NEET 2015-2024",
    solvedQuestions: 48,
    totalPages: 18,
    isFree: true, // 1st Chapter Free
    highlightText: "Dimensional formulas table, Vernier & screw gauge least count, and error analysis formulas.",
  },
  {
    id: "ncert-phy-11-2",
    chapterNumber: 2,
    chapterTitle: "Motion in a Straight Line",
    subject: "Physics",
    classLevel: "Class 11",
    unit: "Kinematics",
    yearsCovered: "NEET 2016-2024",
    solvedQuestions: 55,
    totalPages: 20,
    isFree: false,
    highlightText: "Slope and area interpretations of kinematic graphs, stopping distance, and relative velocity.",
  },
  {
    id: "ncert-phy-11-3",
    chapterNumber: 3,
    chapterTitle: "Laws of Motion",
    subject: "Physics",
    classLevel: "Class 11",
    unit: "Laws of Motion",
    yearsCovered: "NEET 2015-2024",
    solvedQuestions: 65,
    totalPages: 24,
    isFree: false,
    highlightText: "Free body diagrams (FBD), friction coefficient values, and connected bodies tension shortcuts.",
  },

  // ─── PHYSICS CLASS 12 ───
  {
    id: "ncert-phy-12-1",
    chapterNumber: 1,
    chapterTitle: "Electric Charges and Fields",
    subject: "Physics",
    classLevel: "Class 12",
    unit: "Electrostatics",
    yearsCovered: "NEET 2015-2024",
    solvedQuestions: 62,
    totalPages: 22,
    isFree: true, // 1st Chapter Free
    highlightText: "Electric flux, Gauss's law symmetrical surfaces, dipole torque and potential energy derivations.",
  },
  {
    id: "ncert-phy-12-2",
    chapterNumber: 2,
    chapterTitle: "Current Electricity",
    subject: "Physics",
    classLevel: "Class 12",
    unit: "Current Electricity",
    yearsCovered: "NEET 2015-2024",
    solvedQuestions: 74,
    totalPages: 26,
    isFree: false,
    highlightText: "Colour code shortcuts, internal resistance formula, Kirchhoff's loop rules, and meter bridge.",
  },

  // ─── CHEMISTRY CLASS 11 ───
  {
    id: "ncert-chem-11-1",
    chapterNumber: 1,
    chapterTitle: "Some Basic Concepts of Chemistry",
    subject: "Chemistry",
    classLevel: "Class 11",
    unit: "Physical Chemistry",
    yearsCovered: "NEET 2015-2024",
    solvedQuestions: 52,
    totalPages: 18,
    isFree: true, // 1st Chapter Free
    highlightText: "Mole conversion chart, mass percent, molarity vs molality formulas, and limiting reagent tricks.",
  },
  {
    id: "ncert-chem-11-2",
    chapterNumber: 2,
    chapterTitle: "Structure of Atom",
    subject: "Chemistry",
    classLevel: "Class 11",
    unit: "Physical Chemistry",
    yearsCovered: "NEET 2016-2024",
    solvedQuestions: 58,
    totalPages: 21,
    isFree: false,
    highlightText: "Bohr's radius & energy derivations, quantum numbers rules, and electronic configuration exceptions.",
  },
  {
    id: "ncert-chem-11-3",
    chapterNumber: 3,
    chapterTitle: "Chemical Bonding and Molecular Structure",
    subject: "Chemistry",
    classLevel: "Class 11",
    unit: "Inorganic Chemistry",
    yearsCovered: "NEET 2015-2024",
    solvedQuestions: 80,
    totalPages: 28,
    isFree: false,
    highlightText: "VSEPR lone pair table, hybridization determinations, dipole moments, and MOT diagrams.",
  },

  // ─── CHEMISTRY CLASS 12 ───
  {
    id: "ncert-chem-12-1",
    chapterNumber: 1,
    chapterTitle: "Solutions",
    subject: "Chemistry",
    classLevel: "Class 12",
    unit: "Physical Chemistry",
    yearsCovered: "NEET 2015-2024",
    solvedQuestions: 66,
    totalPages: 22,
    isFree: true, // 1st Chapter Free
    highlightText: "Henry's Law, Raoult's law deviations, colligative properties formulas, and van't Hoff factor (i).",
  },
  {
    id: "ncert-chem-12-2",
    chapterNumber: 2,
    chapterTitle: "Electrochemistry",
    subject: "Chemistry",
    classLevel: "Class 12",
    unit: "Physical Chemistry",
    yearsCovered: "NEET 2015-2024",
    solvedQuestions: 72,
    totalPages: 25,
    isFree: false,
    highlightText: "Standard electrode potentials electrochemical series, Nernst equation calculations, and batteries.",
  },
];

function AnnotatedNcertContent() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get("subject");

  const [selectedClass, setSelectedClass] = useState<"Class 11" | "Class 12">("Class 11");
  const [selectedSubject, setSelectedSubject] = useState<"Biology" | "Physics" | "Chemistry">(
    initialSubject?.toLowerCase() === "physics"
      ? "Physics"
      : initialSubject?.toLowerCase() === "chemistry"
      ? "Chemistry"
      : "Biology"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [livePdfs, setLivePdfs] = useState<any[]>([]);

  useEffect(() => {
    async function loadLiveAnnotatedPDFs() {
      try {
        const res = await fetch("/api/public/pdfs", { cache: "no-store" });
        const json = await res.json();
        if (json.success && json.pdfs) {
          const ncertPdfs = json.pdfs.filter(
            (p: any) =>
              p.note_type === "annotated_ncert" ||
              p.title.toLowerCase().includes("annotated") ||
              p.title.toLowerCase().includes("ncert")
          );
          setLivePdfs(ncertPdfs);
        }
      } catch (err) {
        console.error("Failed to fetch live annotated NCERT PDFs:", err);
      }
    }
    loadLiveAnnotatedPDFs();
  }, []);

  // Merge live database PDFs with starter structured syllabus
  const combinedChapters = defaultAnnotatedSyllabus.map((ch) => {
    const matched = livePdfs.find(
      (p) =>
        p.class_level === ch.classLevel &&
        p.subject?.toLowerCase() === ch.subject.toLowerCase() &&
        p.title.toLowerCase().includes(ch.chapterTitle.toLowerCase())
    );
    if (matched) {
      return {
        ...ch,
        pdfId: matched.id,
        isFree: matched.is_free,
        thumbnailUrl: matched.thumbnail_url || ch.thumbnailUrl,
        totalPages: matched.page_count || ch.totalPages,
        highlightText: matched.highlight_text || ch.highlightText,
      };
    }
    return ch;
  });

  const filteredChapters = combinedChapters.filter((ch) => {
    if (ch.classLevel !== selectedClass) return false;
    if (ch.subject !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ch.chapterTitle.toLowerCase().includes(q) ||
        ch.unit.toLowerCase().includes(q) ||
        ch.highlightText.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSubjectIcon = (sub: string) => {
    if (sub === "Biology") return <Dna className="w-4 h-4 text-emerald-600" />;
    if (sub === "Physics") return <Atom className="w-4 h-4 text-violet-600" />;
    return <FlaskConical className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-[#FDFEFD] text-[#2B2F2C] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-36 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ═══ CLEAN COMPACT HEADING ═══ */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight leading-tight mb-2">
              Annotated NCERT
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Line-by-line NCERT highlights &amp; high-yield diagrams for NEET. 1st chapter is free!
            </p>
          </div>

          {/* ═══ 2-LEVEL HIERARCHY SELECTOR ═══ */}
          {/* Level 1: Class 11 / Class 12 */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs mb-8 space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Class:</span>
                <div className="flex items-center p-1 rounded-xl bg-gray-100 border border-gray-200/80">
                  {(["Class 11", "Class 12"] as const).map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setSelectedClass(cls)}
                      className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        selectedClass === cls
                          ? "bg-[#016737] text-white shadow-xs font-black"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chapters or highlights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#016737]"
                />
              </div>
            </div>

            {/* Level 2: Physics - Chemistry - Biology */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 shrink-0">
                Subject:
              </span>
              {(["Biology", "Physics", "Chemistry"] as const).map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedSubject === subj
                      ? "bg-gray-900 text-white shadow-sm font-black"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {getSubjectIcon(subj)}
                  <span>{subj}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ═══ CHAPTERS & ANNOTATED NCERT PDF CARDS ═══ */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              {selectedClass} • {selectedSubject} NCERT Chapters ({filteredChapters.length})
            </h2>
            <span className="text-xs text-gray-500">
              Highlighted textbook notes with solved past questions
            </span>
          </div>

          {filteredChapters.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No chapters found</h3>
              <p className="text-xs text-gray-500 mt-1">Try resetting your search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredChapters.map((ch, idx) => (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md hover:border-[#016737]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  {/* ═══ SMALL THUMBNAIL IMAGE BANNER AT TOP ═══ */}
                  <div className="h-28 sm:h-32 w-full relative overflow-hidden bg-gradient-to-br from-[#016737]/10 via-[#8BC43F]/15 to-emerald-100 shrink-0">
                    <img
                      src={
                        ch.thumbnailUrl ||
                        (ch.subject === "Biology"
                          ? "/ncert_root_decoding_3d.png"
                          : ch.subject === "Physics"
                          ? "/neet_biology_study_desk.png"
                          : "/intro_biology_ecosystem.png")
                      }
                      alt={ch.chapterTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                    {/* Status badges overlaid on image */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/20">
                        Ch {ch.chapterNumber} • {ch.unit}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      {ch.isFree ? (
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
                        <BookOpen className="w-3 h-3 text-[#8BC43F]" />
                        {ch.totalPages} Pgs
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                    <div>
                      {/* Chapter Title */}
                      <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-[#016737] transition-colors">
                        {ch.chapterTitle}
                      </h3>

                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
                        {ch.highlightText}
                      </p>

                      {/* Meta Specs */}
                      <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50 text-[11px] text-gray-600 font-medium mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#016737]" />
                          <span>{ch.yearsCovered}</span>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-gray-800">
                          <span>{ch.solvedQuestions} PYQs</span>
                          <span className="text-gray-400 font-normal">({ch.totalPages} pgs)</span>
                        </div>
                      </div>
                    </div>

                  {/* Action Button */}
                  <div>
                    {ch.isFree ? (
                      <a
                        href={
                          ch.pdfId
                            ? `/secure-reader?pdfId=${encodeURIComponent(ch.pdfId)}&title=${encodeURIComponent(ch.chapterTitle)}`
                            : `/secure-reader?title=${encodeURIComponent(ch.chapterTitle)}&subject=${encodeURIComponent(ch.subject)}`
                        }
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#016737] hover:bg-[#014d29] text-white flex items-center justify-center gap-2 transition duration-200 shadow-xs cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Read Annotated NCERT ↗</span>
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

export default function AnnotatedNcertPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFEFD] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#016737] border-t-transparent animate-spin" />
        </div>
      }
    >
      <AnnotatedNcertContent />
    </Suspense>
  );
}
