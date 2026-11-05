"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  FileText,
  Search,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  ChevronRight,
  Flame,
  ArrowRight,
  Dna,
  Atom,
  FlaskConical,
  HelpCircle,
  Download
} from "lucide-react";

interface ChapterQuestionItem {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  subject: "Physics" | "Chemistry" | "Biology";
  classLevel: "Class 11" | "Class 12";
  unit: string;
  questionsCount: number;
  pageCount: number;
  isFree: boolean;
  pdfId?: string;
  thumbnailUrl?: string;
  description: string;
}

const defaultSyllabus: ChapterQuestionItem[] = [
  // ─── BIOLOGY CLASS 11 ───
  {
    id: "bio-11-1",
    chapterNumber: 1,
    chapterTitle: "The Living World",
    subject: "Biology",
    classLevel: "Class 11",
    unit: "Diversity in Living World",
    questionsCount: 120,
    pageCount: 14,
    isFree: true, // 1st Chapter Free
    description: "Taxonomic hierarchy, binomial nomenclature, botanical gardens and keys practice questions.",
  },
  {
    id: "bio-11-2",
    chapterNumber: 2,
    chapterTitle: "Biological Classification",
    subject: "Biology",
    classLevel: "Class 11",
    unit: "Diversity in Living World",
    questionsCount: 150,
    pageCount: 16,
    isFree: false,
    description: "5-Kingdom classification, Monera, Protista, Fungi, Viruses, Viroids & Lichens NCERT questions.",
  },
  {
    id: "bio-11-3",
    chapterNumber: 3,
    chapterTitle: "Plant Kingdom",
    subject: "Biology",
    classLevel: "Class 11",
    unit: "Diversity in Living World",
    questionsCount: 180,
    pageCount: 20,
    isFree: false,
    description: "Algae, Bryophytes, Pteridophytes, Gymnosperms, and Angiosperm life cycles with diagrams.",
  },
  {
    id: "bio-11-4",
    chapterNumber: 4,
    chapterTitle: "Animal Kingdom",
    subject: "Biology",
    classLevel: "Class 11",
    unit: "Diversity in Living World",
    questionsCount: 200,
    pageCount: 22,
    isFree: false,
    description: "Non-chordates to chordates: symmetry, coelom, segmentation, and NCERT exemplar questions.",
  },
  {
    id: "bio-11-5",
    chapterNumber: 5,
    chapterTitle: "Morphology of Flowering Plants",
    subject: "Biology",
    classLevel: "Class 11",
    unit: "Structural Organisation",
    questionsCount: 160,
    pageCount: 18,
    isFree: false,
    description: "Root, stem, leaf modifications, inflorescence, flower structure and floral formula questions.",
  },
  {
    id: "bio-11-6",
    chapterNumber: 6,
    chapterTitle: "Cell: The Unit of Life",
    subject: "Biology",
    classLevel: "Class 11",
    unit: "Cell Structure and Function",
    questionsCount: 175,
    pageCount: 19,
    isFree: false,
    description: "Prokaryotic & eukaryotic cell organelles, endomembrane system, ribosomes & cytoskeleton.",
  },
  {
    id: "bio-11-7",
    chapterNumber: 7,
    chapterTitle: "Biomolecules",
    subject: "Biology",
    classLevel: "Class 11",
    unit: "Cell Structure and Function",
    questionsCount: 140,
    pageCount: 15,
    isFree: false,
    description: "Amino acids, proteins, lipids, nucleic acids, and enzyme action kinetics with graphs.",
  },

  // ─── BIOLOGY CLASS 12 ───
  {
    id: "bio-12-1",
    chapterNumber: 1,
    chapterTitle: "Sexual Reproduction in Flowering Plants",
    subject: "Biology",
    classLevel: "Class 12",
    unit: "Reproduction",
    questionsCount: 190,
    pageCount: 20,
    isFree: true, // 1st Chapter Free
    description: "Microsporogenesis, megasporogenesis, double fertilisation, and seed development questions.",
  },
  {
    id: "bio-12-2",
    chapterNumber: 2,
    chapterTitle: "Human Reproduction",
    subject: "Biology",
    classLevel: "Class 12",
    unit: "Reproduction",
    questionsCount: 170,
    pageCount: 18,
    isFree: false,
    description: "Male & female reproductive systems, gametogenesis, menstrual cycle, and embryogenesis.",
  },
  {
    id: "bio-12-3",
    chapterNumber: 3,
    chapterTitle: "Principles of Inheritance and Variation",
    subject: "Biology",
    classLevel: "Class 12",
    unit: "Genetics and Evolution",
    questionsCount: 220,
    pageCount: 24,
    isFree: false,
    description: "Mendelian genetics, linkage & recombination, pedigree analysis, and genetic disorders.",
  },
  {
    id: "bio-12-4",
    chapterNumber: 4,
    chapterTitle: "Molecular Basis of Inheritance",
    subject: "Biology",
    classLevel: "Class 12",
    unit: "Genetics and Evolution",
    questionsCount: 240,
    pageCount: 26,
    isFree: false,
    description: "DNA structure, replication, transcription, genetic code, translation, and lac operon.",
  },

  // ─── PHYSICS CLASS 11 ───
  {
    id: "phy-11-1",
    chapterNumber: 1,
    chapterTitle: "Units and Measurements",
    subject: "Physics",
    classLevel: "Class 11",
    unit: "Physical World & Measurement",
    questionsCount: 110,
    pageCount: 12,
    isFree: true, // 1st Chapter Free
    description: "Dimensional analysis, significant figures, Vernier calipers, screw gauge, and error propagation.",
  },
  {
    id: "phy-11-2",
    chapterNumber: 2,
    chapterTitle: "Motion in a Straight Line",
    subject: "Physics",
    classLevel: "Class 11",
    unit: "Kinematics",
    questionsCount: 140,
    pageCount: 15,
    isFree: false,
    description: "Displacement, velocity-time graphs, equations of motion, and motion under gravity problems.",
  },
  {
    id: "phy-11-3",
    chapterNumber: 3,
    chapterTitle: "Laws of Motion",
    subject: "Physics",
    classLevel: "Class 11",
    unit: "Laws of Motion",
    questionsCount: 160,
    pageCount: 18,
    isFree: false,
    description: "Newton's laws, friction, tension in strings, pulleys, banking of roads, and momentum conservation.",
  },
  {
    id: "phy-11-4",
    chapterNumber: 4,
    chapterTitle: "Work, Energy and Power",
    subject: "Physics",
    classLevel: "Class 11",
    unit: "Work, Energy & Power",
    questionsCount: 150,
    pageCount: 16,
    isFree: false,
    description: "Work-energy theorem, potential energy of springs, power, and elastic/inelastic collisions.",
  },

  // ─── PHYSICS CLASS 12 ───
  {
    id: "phy-12-1",
    chapterNumber: 1,
    chapterTitle: "Electric Charges and Fields",
    subject: "Physics",
    classLevel: "Class 12",
    unit: "Electrostatics",
    questionsCount: 140,
    pageCount: 16,
    isFree: true, // 1st Chapter Free
    description: "Coulomb's Law, electric field lines, electric dipole, and Gauss's Law applications with diagrams.",
  },
  {
    id: "phy-12-2",
    chapterNumber: 2,
    chapterTitle: "Current Electricity",
    subject: "Physics",
    classLevel: "Class 12",
    unit: "Current Electricity",
    questionsCount: 165,
    pageCount: 18,
    isFree: false,
    description: "Ohm's law, drift velocity, resistivity, Kirchhoff's laws, and Wheatstone bridge problems.",
  },
  {
    id: "phy-12-3",
    chapterNumber: 3,
    chapterTitle: "Moving Charges and Magnetism",
    subject: "Physics",
    classLevel: "Class 12",
    unit: "Magnetic Effects of Current",
    questionsCount: 150,
    pageCount: 17,
    isFree: false,
    description: "Biot-Savart Law, Ampere's Circuital Law, Lorentz force, cyclotron, and torque on current loop.",
  },

  // ─── CHEMISTRY CLASS 11 ───
  {
    id: "chem-11-1",
    chapterNumber: 1,
    chapterTitle: "Some Basic Concepts of Chemistry",
    subject: "Chemistry",
    classLevel: "Class 11",
    unit: "Physical Chemistry",
    questionsCount: 130,
    pageCount: 14,
    isFree: true, // 1st Chapter Free
    description: "Mole concept, molar mass, empirical & molecular formula, stoichiometry, and limiting reagent.",
  },
  {
    id: "chem-11-2",
    chapterNumber: 2,
    chapterTitle: "Structure of Atom",
    subject: "Chemistry",
    classLevel: "Class 11",
    unit: "Physical Chemistry",
    questionsCount: 145,
    pageCount: 16,
    isFree: false,
    description: "Bohr's model, de Broglie relation, Heisenberg's principle, and quantum numbers orbital shapes.",
  },
  {
    id: "chem-11-3",
    chapterNumber: 3,
    chapterTitle: "Chemical Bonding and Molecular Structure",
    subject: "Chemistry",
    classLevel: "Class 11",
    unit: "Inorganic Chemistry",
    questionsCount: 180,
    pageCount: 20,
    isFree: false,
    description: "VSEPR theory, hybridization, dipole moment, and Molecular Orbital Theory (MOT) bond orders.",
  },

  // ─── CHEMISTRY CLASS 12 ───
  {
    id: "chem-12-1",
    chapterNumber: 1,
    chapterTitle: "Solutions",
    subject: "Chemistry",
    classLevel: "Class 12",
    unit: "Physical Chemistry",
    questionsCount: 140,
    pageCount: 15,
    isFree: true, // 1st Chapter Free
    description: "Raoult's law, colligative properties, van't Hoff factor, and ideal/non-ideal solutions calculations.",
  },
  {
    id: "chem-12-2",
    chapterNumber: 2,
    chapterTitle: "Electrochemistry",
    subject: "Chemistry",
    classLevel: "Class 12",
    unit: "Physical Chemistry",
    questionsCount: 160,
    pageCount: 18,
    isFree: false,
    description: "Nernst equation, Gibbs free energy, Kohlrausch's law, Faraday's electrolysis laws, and battery cells.",
  },
  {
    id: "chem-12-3",
    chapterNumber: 3,
    chapterTitle: "Coordination Compounds",
    subject: "Chemistry",
    classLevel: "Class 12",
    unit: "Inorganic Chemistry",
    questionsCount: 170,
    pageCount: 19,
    isFree: false,
    description: "IUPAC nomenclature, Werner's theory, Valence Bond Theory (VBT), and Crystal Field Theory (CFT).",
  },
];

function QuestionsContent() {
  const searchParams = useSearchParams();
  const initialSubjectParam = searchParams.get("subject");
  const initialClassParam = searchParams.get("class");

  const [selectedClass, setSelectedClass] = useState<"Class 11" | "Class 12">(
    initialClassParam === "Class 12" ? "Class 12" : "Class 11"
  );
  const [selectedSubject, setSelectedSubject] = useState<"Biology" | "Physics" | "Chemistry">(
    initialSubjectParam?.toLowerCase() === "physics"
      ? "Physics"
      : initialSubjectParam?.toLowerCase() === "chemistry"
      ? "Chemistry"
      : "Biology"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [livePdfs, setLivePdfs] = useState<any[]>([]);

  useEffect(() => {
    async function loadLiveQuestionPDFs() {
      try {
        const res = await fetch("/api/public/pdfs", { cache: "no-store" });
        const json = await res.json();
        if (json.success && json.pdfs) {
          const qPdfs = json.pdfs.filter(
            (p: any) => p.note_type === "questions" || p.note_type === "test" || p.title.toLowerCase().includes("question")
          );
          setLivePdfs(qPdfs);
        }
      } catch (err) {
        console.error("Failed to fetch live question PDFs:", err);
      }
    }
    loadLiveQuestionPDFs();
  }, []);

  // Merge live PDFs with default structured syllabus
  const combinedChapters = defaultSyllabus.map((ch) => {
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
        pageCount: matched.page_count || ch.pageCount,
        questionsCount: matched.questions_count || ch.questionsCount,
      };
    }
    return ch;
  });

  // Filter according to Class & Subject
  const filteredChapters = combinedChapters.filter((ch) => {
    if (ch.classLevel !== selectedClass) return false;
    if (ch.subject !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ch.chapterTitle.toLowerCase().includes(q) ||
        ch.unit.toLowerCase().includes(q) ||
        ch.description.toLowerCase().includes(q)
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
          {/* ═══ SECTION HEADING ═══ */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#016737]/10 text-[#016737] text-xs font-bold tracking-wider uppercase mb-3">
              <HelpCircle className="w-4 h-4 text-[#016737]" />
              NEET Question Banks
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight leading-[1.15] mb-3">
              Per Topic Questions
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              NCERT line-by-line question PDFs, chapter-wise problem sheets, and past year question sets.
              <span className="font-bold text-[#016737]"> 1st Chapter is 100% Free</span> — full question banks unlocked via Subscription.
            </p>
          </div>

          {/* ═══ PROMINENT SUBSCRIPTION NOTICE ═══ */}
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/60 border border-emerald-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#016737] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#8BC43F]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Zero Per-PDF Charges • Pure All-Access Subscription
                </h4>
                <p className="text-xs text-gray-600">
                  Basic Pass includes 1st chapter free. Upgrade to Standard (₹299/mo) or Premium (₹399/mo) to unlock all chapter PDFs.
                </p>
              </div>
            </div>
            <a
              href="/#pricing"
              className="px-5 py-2 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs font-bold transition-all shadow-sm shrink-0 whitespace-nowrap"
            >
              View Subscription Plans
            </a>
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
                  placeholder="Search chapters or topics..."
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

          {/* ═══ CHAPTERS & QUESTION PDF CARDS ═══ */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              {selectedClass} • {selectedSubject} Chapters ({filteredChapters.length})
            </h2>
            <span className="text-xs text-gray-500">
              Showing chapter-wise question PDF sets
            </span>
          </div>

          {filteredChapters.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
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
                          ? "/question_practice_matrix_3d.png"
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
                        <FileText className="w-3 h-3 text-[#8BC43F]" />
                        {ch.questionsCount}+ MCQs
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
                        {ch.description}
                      </p>

                      {/* Specs Pill */}
                      <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50 text-[11px] text-gray-600 font-medium mb-4">
                        <span className="font-bold text-[#016737]">{ch.questionsCount}+ Practice MCQs</span>
                        <span className="text-gray-400">•</span>
                        <span>{ch.pageCount} Pages PDF</span>
                      </div>
                    </div>

                  {/* Action Button */}
                  <div>
                    {ch.isFree ? (
                      <a
                        href={
                          ch.pdfId
                            ? `/secure-reader?pdfId=${encodeURIComponent(ch.pdfId)}&title=${encodeURIComponent(ch.chapterTitle)}`
                            : `/chapters`
                        }
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#016737] hover:bg-[#014d29] text-white flex items-center justify-center gap-2 transition duration-200 shadow-xs cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Read Free Question PDF ↗</span>
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

export default function QuestionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFEFD] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#016737] border-t-transparent animate-spin" />
        </div>
      }
    >
      <QuestionsContent />
    </Suspense>
  );
}
