"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AuthModal from "@/components/AuthModal";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useCheckout } from "@/hooks/useCheckout";
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Lock, 
  Download, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  Dna, 
  Atom, 
  FlaskConical, 
  Layers, 
  Calendar,
  Award
} from "lucide-react";

interface PYQResource {
  id: string;
  pdfId?: string;
  chapter: string;
  unit: string;
  classLevel: "Class 11" | "Class 12";
  yearsCovered: string;
  solvedQuestions: number;
  totalPages: number;
  isFree: boolean;
  price?: number;
  highlightText: string;
}

const mockDataBySubject: Record<string, {
  title: string;
  description: string;
  colorTheme: {
    primary: string;
    light: string;
    border: string;
    text: string;
    badgeBg: string;
  };
  resources: PYQResource[];
}> = {
  biology: {
    title: "Biology Annotated NCERT & PYQs",
    description: "Line-by-line NCERT highlights, diagrams, and NEET previous year questions (2015-2024) for Botany and Zoology.",
    colorTheme: {
      primary: "#016737",
      light: "#8BC43F",
      border: "border-emerald-200",
      text: "text-emerald-800",
      badgeBg: "bg-emerald-50",
    },
    resources: [
      {
        id: "bio-pyq-1",
        chapter: "Cell: The Unit of Life",
        unit: "Cell Biology",
        classLevel: "Class 11",
        yearsCovered: "NEET 2016 - 2024",
        solvedQuestions: 68,
        totalPages: 24,
        isFree: true,
        highlightText: "High yield NCERT lines on Endomembrane system and organelle markers.",
      },
      {
        id: "bio-pyq-2",
        chapter: "Human Physiology: Chemical Coordination & Neural Control",
        unit: "Human Physiology",
        classLevel: "Class 11",
        yearsCovered: "NEET 2015 - 2024",
        solvedQuestions: 92,
        totalPages: 32,
        isFree: false,
        price: 49,
        highlightText: "Action potential mechanism, endocrine feedback loops with NCERT annotated figures.",
      },
      {
        id: "bio-pyq-3",
        chapter: "Genetics: Principles of Inheritance & Variation",
        unit: "Genetics & Evolution",
        classLevel: "Class 12",
        yearsCovered: "NEET 2015 - 2024",
        solvedQuestions: 115,
        totalPages: 38,
        isFree: false,
        price: 49,
        highlightText: "Direct pedigree analysis shortcuts & linkage exceptions line annotations.",
      },
      {
        id: "bio-pyq-4",
        chapter: "Molecular Basis of Inheritance",
        unit: "Genetics & Evolution",
        classLevel: "Class 12",
        yearsCovered: "NEET 2016 - 2024",
        solvedQuestions: 104,
        totalPages: 34,
        isFree: true,
        highlightText: "Meselson-Stahl experiment, lac operon regulatory proteins annotated text.",
      },
      {
        id: "bio-pyq-5",
        chapter: "Ecology: Organisms and Populations & Ecosystem",
        unit: "Ecology",
        classLevel: "Class 12",
        yearsCovered: "NEET 2015 - 2024",
        solvedQuestions: 75,
        totalPages: 28,
        isFree: false,
        price: 49,
        highlightText: "Population interaction tables, ecological pyramids & nutrient cycles annotated.",
      },
      {
        id: "bio-pyq-6",
        chapter: "Morphology & Anatomy of Flowering Plants",
        unit: "Structural Organisation",
        classLevel: "Class 11",
        yearsCovered: "NEET 2016 - 2024",
        solvedQuestions: 84,
        totalPages: 30,
        isFree: true,
        highlightText: "Floral diagrams, placentation types and vascular bundle trick charts.",
      },
    ],
  },
  physics: {
    title: "Physics Annotated NCERT & PYQs",
    description: "Core concept notes, formula derivations, graphs, and line-by-line NCERT exam exemplars with 10-year PYQs.",
    colorTheme: {
      primary: "#6d28d9",
      light: "#a78bfa",
      border: "border-violet-200",
      text: "text-violet-800",
      badgeBg: "bg-violet-50",
    },
    resources: [
      {
        id: "phy-pyq-1",
        chapter: "Kinematics & Laws of Motion",
        unit: "Mechanics",
        classLevel: "Class 11",
        yearsCovered: "NEET 2015 - 2024",
        solvedQuestions: 94,
        totalPages: 36,
        isFree: true,
        highlightText: "Free-body diagram techniques, friction limits & trajectory equations.",
      },
      {
        id: "phy-pyq-2",
        chapter: "Gravitation & Mechanical Properties of Solids",
        unit: "Properties of Matter",
        classLevel: "Class 11",
        yearsCovered: "NEET 2016 - 2024",
        solvedQuestions: 72,
        totalPages: 28,
        isFree: false,
        price: 49,
        highlightText: "Kepler's laws, escape velocity and stress-strain curve NCERT annotations.",
      },
      {
        id: "phy-pyq-3",
        chapter: "Electrostatics & Capacitance",
        unit: "Electromagnetism",
        classLevel: "Class 12",
        yearsCovered: "NEET 2015 - 2024",
        solvedQuestions: 110,
        totalPages: 42,
        isFree: false,
        price: 49,
        highlightText: "Electric flux calculations, dielectric insertion energy changes annotated.",
      },
      {
        id: "phy-pyq-4",
        chapter: "Current Electricity & Circuits",
        unit: "Electromagnetism",
        classLevel: "Class 12",
        yearsCovered: "NEET 2016 - 2024",
        solvedQuestions: 88,
        totalPages: 32,
        isFree: true,
        highlightText: "Wheatstone bridge, potentiometer concepts and color code summary.",
      },
      {
        id: "phy-pyq-5",
        chapter: "Optics (Ray & Wave Optics)",
        unit: "Optics",
        classLevel: "Class 12",
        yearsCovered: "NEET 2015 - 2024",
        solvedQuestions: 96,
        totalPages: 38,
        isFree: false,
        price: 49,
        highlightText: "Prism formula, interference fringe shifts & Young's double slit problem set.",
      },
      {
        id: "phy-pyq-6",
        chapter: "Modern Physics & Semiconductors",
        unit: "Modern Physics",
        classLevel: "Class 12",
        yearsCovered: "NEET 2016 - 2024",
        solvedQuestions: 120,
        totalPages: 40,
        isFree: true,
        highlightText: "Photoelectric equation, Bohr spectra transitions & p-n diode graphs.",
      },
    ],
  },
  chemistry: {
    title: "Chemistry Annotated NCERT & PYQs",
    description: "Inorganic NCERT trends, Organic named reactions & mechanisms, and Physical Chemistry formulas with NEET PYQs.",
    colorTheme: {
      primary: "#0284c7",
      light: "#38bdf8",
      border: "border-sky-200",
      text: "text-sky-800",
      badgeBg: "bg-sky-50",
    },
    resources: [
      {
        id: "chem-pyq-1",
        chapter: "Chemical Bonding & Molecular Structure",
        unit: "Inorganic Chemistry",
        classLevel: "Class 11",
        yearsCovered: "NEET 2015 - 2024",
        solvedQuestions: 98,
        totalPages: 35,
        isFree: true,
        highlightText: "Isoelectronic species bond orders, dipole moments and hybridization chart.",
      },
      {
        id: "chem-pyq-2",
        chapter: "Equilibrium (Chemical & Ionic)",
        unit: "Physical Chemistry",
        classLevel: "Class 11",
        yearsCovered: "NEET 2016 - 2024",
        solvedQuestions: 85,
        totalPages: 30,
        isFree: false,
        price: 49,
        highlightText: "Buffer solutions pH calculations, solubility product (Ksp) trick sheets.",
      },
      {
        id: "chem-pyq-3",
        chapter: "Coordination Compounds",
        unit: "Inorganic Chemistry",
        classLevel: "Class 12",
        yearsCovered: "NEET 2015 - 2024",
        solvedQuestions: 90,
        totalPages: 32,
        isFree: true,
        highlightText: "CFT splitting diagrams, isomerism types, magnetic moments and IUPAC naming.",
      },
      {
        id: "chem-pyq-4",
        chapter: "Aldehydes, Ketones & Carboxylic Acids",
        unit: "Organic Chemistry",
        classLevel: "Class 12",
        yearsCovered: "NEET 2015 - 2024",
        solvedQuestions: 110,
        totalPages: 44,
        isFree: false,
        price: 49,
        highlightText: "Complete named reactions breakdown, Tollens & Fehling tests distinction tables.",
      },
      {
        id: "chem-pyq-5",
        chapter: "Electrochemistry & Chemical Kinetics",
        unit: "Physical Chemistry",
        classLevel: "Class 12",
        yearsCovered: "NEET 2016 - 2024",
        solvedQuestions: 82,
        totalPages: 34,
        isFree: false,
        price: 49,
        highlightText: "Nernst equation numericals, first-order reaction graphs and Arrhenius equation.",
      },
      {
        id: "chem-pyq-6",
        chapter: "p-Block & d-and-f-Block Elements",
        unit: "Inorganic Chemistry",
        classLevel: "Class 12",
        yearsCovered: "NEET 2015 - 2024",
        solvedQuestions: 105,
        totalPages: 40,
        isFree: true,
        highlightText: "Oxidizing powers of KMnO4 & K2Cr2O7, lanthanoid contraction trends annotated.",
      },
    ],
  },
};

export default function AnnotatedNcertSubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const resolvedParams = use(params);
  const rawSubject = (resolvedParams?.subject || "biology").toLowerCase();
  const currentSubjectKey = mockDataBySubject[rawSubject] ? rawSubject : "biology";
  const subjectData = mockDataBySubject[currentSubjectKey];

  const [selectedClass, setSelectedClass] = useState<"All" | "Class 11" | "Class 12">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [liveResources, setLiveResources] = useState<PYQResource[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);

  const { user } = useStudentAuth();
  const { handleCheckout } = useCheckout();

  // Load live notes from Supabase
  useEffect(() => {
    async function loadLiveAnnotatedNotes() {
      try {
        setLoadingLive(true);
        const res = await fetch(`/api/public/annotated-ncert?subject=${currentSubjectKey}`, { cache: "no-store" });
        const json = await res.json();
        if (json.success && json.notes && json.notes.length > 0) {
          setLiveResources(json.notes);
        } else {
          setLiveResources([]);
        }
      } catch (e) {
        console.error("Error fetching live annotated NCERT notes:", e);
      } finally {
        setLoadingLive(false);
      }
    }
    loadLiveAnnotatedNotes();
  }, [currentSubjectKey]);

  // Use live resources if present in database; fallback to curated starter resources
  const activeResourcesList = liveResources.length > 0 ? liveResources : subjectData.resources;

  // Filter resources
  const filteredResources = activeResourcesList.filter((res) => {
    if (selectedClass === "Class 11" && res.classLevel !== "Class 11") return false;
    if (selectedClass === "Class 12" && res.classLevel !== "Class 12") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchChapter = res.chapter.toLowerCase().includes(q);
      const matchUnit = res.unit.toLowerCase().includes(q);
      const matchHighlight = res.highlightText.toLowerCase().includes(q);
      if (!matchChapter && !matchUnit && !matchHighlight) return false;
    }

    return true;
  });

  const handleResourceClick = (res: PYQResource) => {
    if (res.isFree) {
      window.location.href = res.pdfId 
        ? `/secure-reader?pdfId=${encodeURIComponent(res.pdfId)}`
        : `/chapters`;
      return;
    }

    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if (res.pdfId) {
      handleCheckout({
        pdfId: res.pdfId,
        onLoginRequired: () => setAuthModalOpen(true),
        onSuccess: () => {
          window.location.href = `/secure-reader?pdfId=${encodeURIComponent(res.pdfId!)}`;
        },
      });
    } else {
      window.location.href = "/#pricing";
    }
  };

  const SubjectIcon = currentSubjectKey === "biology" 
    ? Dna 
    : currentSubjectKey === "physics" 
    ? Atom 
    : FlaskConical;

  return (
    <div className="min-h-screen bg-[#FDFEFD] text-[#2B2F2C] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-36 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ═══ SUBJECT SWITCHER TABS ═══ */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
            <Link
              href="/annotated-ncert/biology"
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                currentSubjectKey === "biology"
                  ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Dna className="w-4 h-4" />
              <span>Biology</span>
            </Link>

            <Link
              href="/annotated-ncert/physics"
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                currentSubjectKey === "physics"
                  ? "bg-violet-700 text-white shadow-md shadow-violet-700/20"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Atom className="w-4 h-4" />
              <span>Physics</span>
            </Link>

            <Link
              href="/annotated-ncert/chemistry"
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
                currentSubjectKey === "chemistry"
                  ? "bg-blue-700 text-white shadow-md shadow-blue-700/20"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>Chemistry</span>
            </Link>
          </div>

          {/* ═══ HEADER ═══ */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full ${subjectData.colorTheme.badgeBg} ${subjectData.colorTheme.text} text-xs font-bold tracking-wider uppercase mb-3`}>
              <SubjectIcon className="w-4 h-4" />
              Line-by-Line NCERT Annotation
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight leading-[1.15] mb-3">
              {subjectData.title}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {subjectData.description}
            </p>
          </div>

          {/* ═══ PREVIOUS YEAR QUESTIONS (PYQs) HEADING & FILTERS ═══ */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#016737]" />
                  Previous Year Questions (PYQs) & NCERT Analysis
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Filtered by NEET recurring question patterns & textbook annotations
                </p>
              </div>

              {/* Class Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200/60 shrink-0">
                {(["All", "Class 11", "Class 12"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedClass(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedClass === tab
                        ? "bg-white text-[#016737] shadow-xs font-extrabold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PYQs by chapter name..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#016737] transition"
              />
            </div>
          </div>

          {/* ═══ PYQ CARDS GRID ═══ */}
          {filteredResources.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No resources found</h3>
              <p className="text-xs text-gray-500 mt-1">Try resetting the class or search filter.</p>
              <button
                onClick={() => {
                  setSelectedClass("All");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#016737] text-white text-xs font-bold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredResources.map((res) => (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md hover:border-[#016737]/40 transition-all duration-300 p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${subjectData.colorTheme.badgeBg} ${subjectData.colorTheme.text} ${subjectData.colorTheme.border}`}>
                        {res.classLevel} • {res.unit}
                      </span>

                      {res.isFree ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8BC43F]/25 text-[#014d29]">
                          Free Access
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Premium
                        </span>
                      )}
                    </div>

                    {/* Chapter Title */}
                    <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-2">
                      {res.chapter}
                    </h3>

                    {/* Highlights */}
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                      {res.highlightText}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50/80 text-[11px] text-gray-600 font-medium mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#016737]" />
                        <span>{res.yearsCovered}</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-gray-800">
                        <span>{res.solvedQuestions} PYQs</span>
                        <span className="text-gray-400 font-normal">({res.totalPages} pgs)</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleResourceClick(res)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
                      res.isFree
                        ? "bg-[#016737] hover:bg-[#014d29] text-white shadow-xs"
                        : "bg-gray-900 hover:bg-black text-white"
                    }`}
                  >
                    {res.isFree ? (
                      <>
                        <span>Read Annotated Notes / PYQs</span>
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
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        customTitle="Login to Access PYQs"
        customSubtitle="Create your free student profile to view annotated NCERT notes and previous year questions."
      />
    </div>
  );
}
