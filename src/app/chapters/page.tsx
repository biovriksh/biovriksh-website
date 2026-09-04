"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useCheckout } from "@/hooks/useCheckout";
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

const chaptersData: Chapter[] = [
  {
    id: "cell-unit-life",
    title: "Cell: The Unit of Life",
    classLevel: "Class 11",
    unit: "Unit 3 · Cell Structure and Function",
    chapterNumber: 8,
    weightage: "High (3-4 Qs)",
    isPaid: false,
    pdfPages: 18,
    summary:
      "All living organisms are composed of cells. Unicellular organisms are capable of independent existence and performing essential functions of life.",
    keyTopics: ["Prokaryotic vs Eukaryotic", "Endomembrane System", "Mitochondria & Chloroplasts", "Ribosomes & Inclusion Bodies"],
    notes: [
      {
        title: "1. Cell Theory & Overview",
        content: [
          "Schleiden (botanist, 1838) & Schwann (zoologist, 1839) formulated Cell Theory.",
          "Rudolf Virchow (1855) added 'Omnis cellula-e-cellula' (cells arise from pre-existing cells).",
          "Mycoplasma (PPLO) is the smallest cell (0.3 µm); Ostrich egg is the largest isolated single cell.",
        ],
      },
      {
        title: "2. Organelles & Membranes",
        content: [
          "Fluid Mosaic Model proposed by Singer & Nicolson (1972).",
          "Mitochondria and Chloroplasts are semi-autonomous with 70S ribosomes & circular DNA.",
          "Lysosomes contain hydrolytic enzymes active at acidic pH (hydrolases).",
        ],
      },
    ],
    questions: [
      {
        id: 1,
        question: "Which of the following cellular organelle is called semi-autonomous?",
        options: ["Ribosome", "Mitochondria", "Golgi Apparatus", "Lysosome"],
        correctIndex: 1,
        explanation: "Mitochondria contain their own circular DNA and 70S ribosomes, allowing them to synthesize some of their own proteins.",
      },
      {
        id: 2,
        question: "Who modified the cell theory to include 'Omnis cellula-e-cellula'?",
        options: ["Matthias Schleiden", "Theodor Schwann", "Rudolf Virchow", "Robert Hooke"],
        correctIndex: 2,
        explanation: "Rudolf Virchow in 1855 explained that cells divide and new cells are formed from pre-existing cells.",
      },
    ],
  },
  {
    id: "human-reproduction",
    title: "Human Reproduction",
    classLevel: "Class 12",
    unit: "Unit 6 · Reproduction",
    chapterNumber: 3,
    weightage: "High (4-5 Qs)",
    isPaid: true,
    price: "₹49",
    pdfPages: 24,
    summary:
      "Comprehensive coverage of male and female reproductive systems, gametogenesis, menstrual cycle, fertilisation, implantation, pregnancy, and parturition.",
    keyTopics: ["Spermatogenesis vs Oogenesis", "Menstrual Cycle Hormones", "Fertilisation & Blastocyst", "Parturition & Lactation"],
    notes: [
      {
        title: "1. Male & Female Reproductive System",
        content: [
          "Sertoli cells provide nutrition to germ cells; Leydig cells secrete androgen (Testosterone).",
          "Graafian follicle ruptures during ovulation under peak LH surge (day 14).",
          "Corpus luteum secretes progesterone to maintain the endometrium layer.",
        ],
      },
      {
        title: "2. Fertilisation & Embryo Development",
        content: [
          "Acrosomal reaction releases hyaluronidase to penetrate Zona Pellucida.",
          "Implantation of Blastocyst occurs in endometrium around day 7 post fertilisation.",
          "hCG, hPL, and relaxin are produced only during pregnancy.",
        ],
      },
    ],
    questions: [
      {
        id: 101,
        question: "Ovulation in human female is induced by a surge of which hormone?",
        options: ["FSH", "LH", "Progesterone", "Estrogen"],
        correctIndex: 1,
        explanation: "A rapid secretion of LH leading to its maximum level during the mid-cycle (LH surge) induces rupture of Graafian follicle and release of ovum.",
      },
      {
        id: 102,
        question: "Secretory phase of human menstrual cycle is also known as:",
        options: ["Follicular phase", "Luteal phase", "Menstrual phase", "Proliferative phase"],
        correctIndex: 1,
        explanation: "The luteal phase is also known as the secretory phase, dominated by progesterone secreted by the corpus luteum.",
      },
    ],
  },
  {
    id: "photosynthesis",
    title: "Photosynthesis in Higher Plants",
    classLevel: "Class 11",
    unit: "Unit 4 · Plant Physiology",
    chapterNumber: 13,
    weightage: "Medium (3 Qs)",
    isPaid: false,
    pdfPages: 22,
    summary:
      "Photosynthesis is a physico-chemical process by which plants use light energy to drive the synthesis of organic compounds.",
    keyTopics: ["Light Reaction & Z-Scheme", "C3 Calvin Cycle", "C4 Hatch-Slack Pathway", "Photorespiration (C2 Cycle)"],
    notes: [
      {
        title: "1. Light-Dependent Reactions",
        content: [
          "PS II absorbs at 680 nm (P680); PS I absorbs at 700 nm (P700).",
          "Splitting of water (photolysis) is associated with PS II on the inner side of thylakoid membrane.",
          "Non-cyclic photophosphorylation produces ATP and NADPH + H+.",
        ],
      },
      {
        title: "2. C3 & C4 Carbon Fixation",
        content: [
          "Primary CO2 acceptor in C3 plants is RuBP (5-carbon ketose sugar).",
          "Primary CO2 acceptor in C4 plants is PEP (phosphoenolpyruvate, 3-carbon).",
          "Kranz anatomy is characteristic of C4 plants (dimorphic chloroplasts).",
        ],
      },
    ],
    questions: [
      {
        id: 201,
        question: "Which of the following is the primary CO2 acceptor in C4 plants?",
        options: ["RuBP", "PEP", "PGA", "OAA"],
        correctIndex: 1,
        explanation: "In C4 plants, the primary CO2 acceptor is phosphoenolpyruvate (PEP), present in mesophyll cells.",
      },
    ],
  },
  {
    id: "molecular-inheritance",
    title: "Molecular Basis of Inheritance",
    classLevel: "Class 12",
    unit: "Unit 7 · Genetics and Evolution",
    chapterNumber: 6,
    weightage: "High (5-6 Qs)",
    isPaid: true,
    price: "₹79",
    pdfPages: 28,
    summary:
      "Detailed molecular structure of DNA, RNA, Meselson-Stahl replication, transcription, genetic code, translation, and Lac Operon regulation.",
    keyTopics: ["DNA Double Helix Structure", "Replication & Transcription", "Genetic Code & tRNA", "Lac Operon Model"],
    notes: [
      {
        title: "1. DNA Structure & Transformation Experiments",
        content: [
          "Watson & Crick proposed DNA double helix model in 1953.",
          "Griffith's experiment (1928) proved transforming principle; Hershey & Chase (1952) proved DNA as genetic material using 32P and 35S.",
          "Chargaff's Rule: A+G = T+C (purines equal pyrimidines).",
        ],
      },
      {
        title: "2. Lac Operon",
        content: [
          "Lac operon consists of 1 regulatory gene (i gene) and 3 structural genes (z, y, a).",
          "z gene codes for beta-galactosidase, y gene for permease, a gene for transacetylase.",
          "Lactose acts as the inducer for the lac operon.",
        ],
      },
    ],
    questions: [
      {
        id: 301,
        question: "In the lac operon, the 'z' structural gene codes for:",
        options: ["Permease", "Transacetylase", "Beta-galactosidase", "Repressor protein"],
        correctIndex: 2,
        explanation: "The z gene codes for beta-galactosidase which breaks down lactose into glucose and galactose.",
      },
    ],
  },
  {
    id: "cell-cycle-division",
    title: "Cell Cycle & Cell Division",
    classLevel: "Class 11",
    unit: "Unit 3 · Cell Structure",
    chapterNumber: 10,
    weightage: "Medium (3 Qs)",
    isPaid: false,
    pdfPages: 16,
    summary:
      "Mitosis and Meiosis cell division cycles, interphase stages (G1, S, G2), prophase I sub-stages, and significance of crossing over.",
    keyTopics: ["Interphase (G1, S, G2)", "Mitosis Stages", "Prophase I Sub-stages", "Significance of Meiosis"],
    notes: [
      {
        title: "1. Stages of Prophase I (Meiosis I)",
        content: [
          "Leptotene: Chromosomes become visible under light microscope.",
          "Zygotene: Synapsis occurs; formation of bivalents / tetrads with synaptonemal complex.",
          "Pachytene: Crossing over between non-sister chromatids mediated by Recombinase enzyme.",
          "Diplotene: Dissolution of synaptonemal complex; formation of Chiasmata.",
          "Diakinesis: Terminalisation of chiasmata.",
        ],
      },
    ],
    questions: [
      {
        id: 401,
        question: "Crossing over takes place during which stage of prophase I?",
        options: ["Leptotene", "Zygotene", "Pachytene", "Diplotene"],
        correctIndex: 2,
        explanation: "Crossing over between non-sister chromatids occurs during the Pachytene stage of Meiosis I.",
      },
    ],
  },
  {
    id: "ecology-environment",
    title: "Ecology & Environment Mega Pack",
    classLevel: "Class 12",
    unit: "Unit 10 · Ecology",
    chapterNumber: 13,
    weightage: "High (5-6 Qs)",
    isPaid: true,
    price: "₹79",
    pdfPages: 32,
    summary:
      "Ecosystem dynamics, energy flow, ecological pyramids, biodiversity conservation strategies (In-situ & Ex-situ), and environmental protocols.",
    keyTopics: ["Energy Flow & Pyramids", "In-situ vs Ex-situ Conservation", "Biodiversity Hotspots", "Environmental Protocols"],
    notes: [
      {
        title: "1. Biodiversity & Conservation",
        content: [
          "In-situ conservation: National Parks, Wildlife Sanctuaries, Biosphere Reserves, Sacred Groves.",
          "Ex-situ conservation: Zoological Parks, Botanical Gardens, Cryopreservation (-196°C in liquid N2), Seed Banks.",
          "Earth Summit held in Rio de Janeiro (1992); World Summit held in Johannesburg (2002).",
        ],
      },
    ],
    questions: [
      {
        id: 501,
        question: "Cryopreservation of gametes at -196°C is an example of:",
        options: ["In-situ conservation", "Ex-situ conservation", "In-vitro fertilisation", "Sacred grove"],
        correctIndex: 1,
        explanation: "Cryopreservation preserves biological samples outside their natural habitat, making it an Ex-situ conservation technique.",
      },
    ],
  },
];

export default function ChaptersPage() {
  const { handleCheckout } = useCheckout();
  const [selectedClass, setSelectedClass] = useState<"ALL" | "Class 11" | "Class 12">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [activeTab, setActiveTab] = useState<"NOTES" | "MCQS">("NOTES");

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  const filteredChapters = chaptersData.filter((ch) => {
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

  const calculateScore = (questions: Question[]) => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
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
            {/* Search Input */}
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

            {/* Class Pill Filters */}
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

        {/* CHAPTERS GRID */}
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
              {/* TOP 50% — BIOLOGY THUMBNAIL IMAGE BANNER */}
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
                    Free Notes
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
                  onClick={() => handleCheckout(activeChapter.price || "₹49", activeChapter.id)}
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
                        onClick={() => handleCheckout(activeChapter.price || "₹49", activeChapter.id)}
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
                  NCERT Biology 2026 • BioVriksha Series
                </div>

                <button
                  onClick={() => handleCheckout(activeChapter.price || "₹49", activeChapter.id)}
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
    </div>
  );
}
