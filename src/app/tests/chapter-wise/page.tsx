"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AuthModal from "@/components/AuthModal";
import { useCheckout } from "@/hooks/useCheckout";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { 
  FileCheck2, 
  Search, 
  Sparkles, 
  Lock, 
  Download, 
  Flame, 
  BookOpen, 
  Clock, 
  Award, 
  Dna, 
  Atom, 
  FlaskConical,
  Filter,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

interface TestItem {
  id: string;
  title: string;
  subject: "Biology" | "Physics" | "Chemistry";
  classLevel: "Class 11" | "Class 12";
  questionsCount: number;
  durationMinutes: number;
  totalMarks: number;
  isFree: boolean;
  price?: number;
  downloadUrl?: string;
  pdfId?: string;
  description: string;
}

const defaultMockTests: TestItem[] = [
  // Biology - Class 11
  {
    id: "bio-11-1",
    title: "The Living World & Biological Classification",
    subject: "Biology",
    classLevel: "Class 11",
    questionsCount: 45,
    durationMinutes: 45,
    totalMarks: 180,
    isFree: true,
    description: "Taxonomic hierarchy, binomial nomenclature, 5-kingdom classification high-yield test.",
  },
  {
    id: "bio-11-2",
    title: "Plant Kingdom & Animal Kingdom",
    subject: "Biology",
    classLevel: "Class 11",
    questionsCount: 50,
    durationMinutes: 45,
    totalMarks: 200,
    isFree: false,
    price: 49,
    description: "Detailed NCERT questions on algae, bryophytes, pteridophytes, gymnosperms & chordates.",
  },
  {
    id: "bio-11-3",
    title: "Cell: The Unit of Life & Cell Cycle",
    subject: "Biology",
    classLevel: "Class 11",
    questionsCount: 45,
    durationMinutes: 45,
    totalMarks: 180,
    isFree: true,
    description: "Endomembrane system, mitochondria, chloroplasts, mitosis and meiosis stages.",
  },
  // Biology - Class 12
  {
    id: "bio-12-1",
    title: "Principles of Inheritance and Variation (Genetics)",
    subject: "Biology",
    classLevel: "Class 12",
    questionsCount: 50,
    durationMinutes: 50,
    totalMarks: 200,
    isFree: false,
    price: 49,
    description: "Mendelian genetics, pedigree analysis, chromosomal disorders & linkage calculations.",
  },
  {
    id: "bio-12-2",
    title: "Molecular Basis of Inheritance",
    subject: "Biology",
    classLevel: "Class 12",
    questionsCount: 50,
    durationMinutes: 50,
    totalMarks: 200,
    isFree: false,
    price: 49,
    description: "DNA replication, transcription, genetic code, translation and Lac operon model.",
  },
  {
    id: "bio-12-3",
    title: "Human Reproduction & Reproductive Health",
    subject: "Biology",
    classLevel: "Class 12",
    questionsCount: 45,
    durationMinutes: 45,
    totalMarks: 180,
    isFree: true,
    description: "Gametogenesis, menstrual cycle, fertilization, embryonic development & ART techniques.",
  },

  // Physics - Class 11
  {
    id: "phy-11-1",
    title: "Units, Dimensions & Kinematics",
    subject: "Physics",
    classLevel: "Class 11",
    questionsCount: 45,
    durationMinutes: 50,
    totalMarks: 180,
    isFree: true,
    description: "Dimensional analysis, projectile motion, relative velocity, and graphs practice.",
  },
  {
    id: "phy-11-2",
    title: "Laws of Motion & Work, Energy, Power",
    subject: "Physics",
    classLevel: "Class 11",
    questionsCount: 45,
    durationMinutes: 50,
    totalMarks: 180,
    isFree: false,
    price: 49,
    description: "Friction, pulley constraints, spring potential energy, work-energy theorem numericals.",
  },

  // Physics - Class 12
  {
    id: "phy-12-1",
    title: "Electrostatics & Current Electricity",
    subject: "Physics",
    classLevel: "Class 12",
    questionsCount: 45,
    durationMinutes: 55,
    totalMarks: 180,
    isFree: false,
    price: 49,
    description: "Coulomb's Law, Gauss's Theorem, capacitors with dielectric, Kirchhoff's rules.",
  },
  {
    id: "phy-12-2",
    title: "Ray Optics & Optical Instruments",
    subject: "Physics",
    classLevel: "Class 12",
    questionsCount: 45,
    durationMinutes: 50,
    totalMarks: 180,
    isFree: true,
    description: "Refraction through prisms, lens maker formula, microscope and telescope resolving power.",
  },

  // Chemistry - Class 11
  {
    id: "chem-11-1",
    title: "Some Basic Concepts & Structure of Atom",
    subject: "Chemistry",
    classLevel: "Class 11",
    questionsCount: 45,
    durationMinutes: 45,
    totalMarks: 180,
    isFree: true,
    description: "Mole concept, stoichiometry, Bohr model, de Broglie wavelength & quantum numbers.",
  },
  {
    id: "chem-11-2",
    title: "Chemical Bonding & Molecular Structure",
    subject: "Chemistry",
    classLevel: "Class 11",
    questionsCount: 45,
    durationMinutes: 45,
    totalMarks: 180,
    isFree: false,
    price: 49,
    description: "VSEPR theory, hybridization, dipole moment, MOT configurations & bond order.",
  },

  // Chemistry - Class 12
  {
    id: "chem-12-1",
    title: "Solutions & Electrochemistry",
    subject: "Chemistry",
    classLevel: "Class 12",
    questionsCount: 45,
    durationMinutes: 50,
    totalMarks: 180,
    isFree: false,
    price: 49,
    description: "Colligative properties, van't Hoff factor, Nernst equation & Kohlrausch's law.",
  },
  {
    id: "chem-12-2",
    title: "Aldehydes, Ketones & Carboxylic Acids",
    subject: "Chemistry",
    classLevel: "Class 12",
    questionsCount: 45,
    durationMinutes: 50,
    totalMarks: 180,
    isFree: true,
    description: "Nucleophilic addition reactions, Aldol condensation, Cannizzaro reaction & tests.",
  },
];

export default function ChapterWiseTestsPage() {
  const [selectedClass, setSelectedClass] = useState<"All Tests" | "Class 11" | "Class 12">("All Tests");
  const [selectedSubject, setSelectedSubject] = useState<"All" | "Biology" | "Physics" | "Chemistry">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [testsList, setTestsList] = useState<TestItem[]>(defaultMockTests);

  const { user } = useStudentAuth();
  const { handleCheckout } = useCheckout();

  // Try to load any dynamically uploaded test PDFs from API
  useEffect(() => {
    async function loadDynamicTests() {
      try {
        const res = await fetch("/api/public/pdfs", { cache: "no-store" });
        const json = await res.json();
        if (json.success && json.pdfs && json.pdfs.length > 0) {
          const testPdfs = json.pdfs.filter((p: any) => 
            p.note_type === "test" || 
            (p.title && p.title.toLowerCase().includes("test")) ||
            (p.sub_heading && p.sub_heading.toLowerCase().includes("test"))
          );

          if (testPdfs.length > 0) {
            const mappedDynamic: TestItem[] = testPdfs.map((p: any, idx: number) => ({
              id: p.id,
              pdfId: p.id,
              title: p.title,
              subject: (p.subject as any) || "Biology",
              classLevel: p.class_level === "Class 11" ? "Class 11" : "Class 12",
              questionsCount: 45,
              durationMinutes: 45,
              totalMarks: 180,
              isFree: p.is_free,
              price: p.price || 49,
              description: p.description || `${p.title} - Official NEET Pattern Chapter Test Paper`,
            }));

            // Merge dynamic tests with defaults
            setTestsList([...mappedDynamic, ...defaultMockTests]);
          }
        }
      } catch (err) {
        console.error("Error loading tests:", err);
      }
    }
    loadDynamicTests();
  }, []);

  // Filter logic
  const filteredTests = testsList.filter((test) => {
    // Class filter
    if (selectedClass === "Class 11" && test.classLevel !== "Class 11") return false;
    if (selectedClass === "Class 12" && test.classLevel !== "Class 12") return false;

    // Subject filter
    if (selectedSubject !== "All" && test.subject !== selectedSubject) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = test.title.toLowerCase().includes(q);
      const matchSubject = test.subject.toLowerCase().includes(q);
      const matchDesc = test.description.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject && !matchDesc) return false;
    }

    return true;
  });

  const handleTestClick = (test: TestItem) => {
    if (test.isFree) {
      if (test.pdfId) {
        window.location.href = `/secure-reader?pdfId=${encodeURIComponent(test.pdfId)}`;
      } else {
        window.location.href = `/chapters`;
      }
      return;
    }

    // Paid test
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if (test.pdfId) {
      handleCheckout({
        pdfId: test.pdfId,
        onLoginRequired: () => setAuthModalOpen(true),
        onSuccess: () => {
          window.location.href = `/secure-reader?pdfId=${encodeURIComponent(test.pdfId!)}`;
        },
      });
    } else {
      window.location.href = "/#pricing";
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFEFD] text-[#2B2F2C] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-36 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ═══ PAGE HEADER ═══ */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#016737]/10 text-[#016737] text-xs font-bold tracking-wider uppercase mb-3">
              <FileCheck2 className="w-4 h-4 text-[#016737]" />
              NEET Exam Evaluation
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight leading-[1.15] mb-3">
              Chapter-wise Tests
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Master every topic with NEET-standard timed tests for Class 11 & Class 12 across Biology, Physics, and Chemistry.
            </p>
          </div>

          {/* ═══ FUTURE TEST SERIES HIGHLIGHT BANNER (HOT TAG) ═══ */}
          <div className="mb-10 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 p-5 sm:p-7 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  HOT • Official Launch Ahead
                </span>
                <span className="text-xs font-bold text-amber-900">NEET All-India Test Series</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Full-Portion Mock Test Series with AIR Rank Predictor
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Our comprehensive 20-test simulated NEET series is in final preparation. Complete syllabus tests with video explanations will unlock automatically for all Premium members at launch.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <a
                href="/#pricing"
                className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition shadow-sm whitespace-nowrap cursor-pointer"
              >
                Included in Premium Pass
              </a>
            </div>
          </div>

          {/* ═══ FILTERS & CONTROLS ROW ═══ */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-xs mb-8 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Class Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100/90 border border-gray-200/60 self-start sm:self-auto overflow-x-auto max-w-full">
                {(["All Tests", "Class 11", "Class 12"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedClass(tab)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      selectedClass === tab
                        ? "bg-white text-[#016737] shadow-sm font-extrabold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search test by chapter or topic..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#016737] transition"
                />
              </div>
            </div>

            {/* Subject Filters */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Subject:
              </span>

              <button
                onClick={() => setSelectedSubject("All")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                  selectedSubject === "All"
                    ? "bg-[#016737] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Subjects
              </button>

              <button
                onClick={() => setSelectedSubject("Biology")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  selectedSubject === "Biology"
                    ? "bg-emerald-700 text-white"
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                <Dna className="w-3.5 h-3.5" />
                Biology
              </button>

              <button
                onClick={() => setSelectedSubject("Physics")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  selectedSubject === "Physics"
                    ? "bg-violet-700 text-white"
                    : "bg-violet-50 text-violet-800 hover:bg-violet-100"
                }`}
              >
                <Atom className="w-3.5 h-3.5" />
                Physics
              </button>

              <button
                onClick={() => setSelectedSubject("Chemistry")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  selectedSubject === "Chemistry"
                    ? "bg-blue-700 text-white"
                    : "bg-blue-50 text-blue-800 hover:bg-blue-100"
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                Chemistry
              </button>
            </div>
          </div>

          {/* ═══ TESTS GRID ═══ */}
          {filteredTests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No tests matched your filters</h3>
              <p className="text-xs text-gray-500 mt-1">Try switching the class or clearing the search query.</p>
              <button
                onClick={() => {
                  setSelectedClass("All Tests");
                  setSelectedSubject("All");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#016737] text-white text-xs font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTests.map((test) => {
                const isBio = test.subject === "Biology";
                const isPhy = test.subject === "Physics";
                const isChem = test.subject === "Chemistry";

                const badgeBg = isBio 
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                  : isPhy 
                  ? "bg-violet-50 text-violet-800 border-violet-200" 
                  : "bg-blue-50 text-blue-800 border-blue-200";

                return (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md hover:border-[#016737]/40 transition-all duration-300 p-5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeBg}`}>
                            {test.subject}
                          </span>
                          <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {test.classLevel}
                          </span>
                        </div>

                        {test.isFree ? (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8BC43F]/25 text-[#014d29]">
                            Free Test
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Premium
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-2">
                        {test.title}
                      </h3>

                      <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4">
                        {test.description}
                      </p>

                      {/* Specs Row */}
                      <div className="flex items-center gap-3 text-[11px] text-gray-600 font-medium py-2 px-3 rounded-xl bg-gray-50/80 mb-4">
                        <div className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-[#016737]" />
                          <span>{test.questionsCount} Qs</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#016737]" />
                          <span>{test.durationMinutes} Mins</span>
                        </div>
                        <span>•</span>
                        <span>{test.totalMarks} Marks</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleTestClick(test)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
                        test.isFree
                          ? "bg-[#016737] hover:bg-[#014d29] text-white shadow-xs"
                          : "bg-gray-900 hover:bg-black text-white"
                      }`}
                    >
                      {test.isFree ? (
                        <>
                          <span>Start Test / View PDF</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-[#8BC43F]" />
                          <span>Unlock with Premium Pass</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        customTitle="Login to Access Tests"
        customSubtitle="Create your free student profile to attempt NEET tests and download solution PDFs."
      />
    </div>
  );
}
