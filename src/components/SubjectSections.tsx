"use client";

import { motion } from "framer-motion";
import { BookOpen, FileText, Calendar, ArrowRight, Dna, Atom, FlaskConical, CheckCircle2 } from "lucide-react";

interface SubjectConfig {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  accentColor: string;
  accentBg: string;
  borderColor: string;
  icon: typeof Dna;
  cards: {
    title: string;
    description: string;
    badge: string;
    link: string;
    ctaText: string;
    icon: typeof FileText;
  }[];
}

const subjects: SubjectConfig[] = [
  {
    id: "biology",
    name: "Biology",
    subtitle: "Class 11 & 12 • Botany & Zoology",
    tag: "360 Marks",
    accentColor: "#016737",
    accentBg: "bg-emerald-50",
    borderColor: "border-emerald-200/80 hover:border-[#016737]",
    icon: Dna,
    cards: [
      {
        title: "Per Topic Questions",
        description: "Topic-wise NCERT question sets with line references. 1st chapter free sample.",
        badge: "Chapter MCQs",
        link: "/questions?subject=Biology",
        ctaText: "Open Questions",
        icon: FileText,
      },
      {
        title: "Annotated NCERT",
        description: "Line-by-line highlighted textbook PDFs, high-yield tables, and diagrams.",
        badge: "Textbook Notes",
        link: "/annotated-ncert?subject=Biology",
        ctaText: "Read NCERT",
        icon: BookOpen,
      },
      {
        title: "Previous Year Papers (PYP's)",
        description: "2015–2024 authentic NEET Biology question papers and full solutions.",
        badge: "10-Year Archive",
        link: "/pyps?type=Biology",
        ctaText: "Solve PYPs",
        icon: Calendar,
      },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    subtitle: "Class 11 & 12 • Mechanics, Electrodynamics & Modern Physics",
    tag: "180 Marks",
    accentColor: "#6d28d9",
    accentBg: "bg-violet-50",
    borderColor: "border-violet-200/80 hover:border-violet-600",
    icon: Atom,
    cards: [
      {
        title: "Per Topic Questions",
        description: "Numerical and concept practice sheets chapter-by-chapter for NEET.",
        badge: "Numerical MCQs",
        link: "/questions?subject=Physics",
        ctaText: "Open Questions",
        icon: FileText,
      },
      {
        title: "Annotated NCERT",
        description: "Highlighted formula sheets, graph interpretations, and exemplar notes.",
        badge: "Formula & Theory",
        link: "/annotated-ncert?subject=Physics",
        ctaText: "Read NCERT",
        icon: BookOpen,
      },
      {
        title: "Previous Year Papers (PYP's)",
        description: "2015–2024 NEET Physics questions with step-by-step derivations.",
        badge: "10-Year Archive",
        link: "/pyps?type=Physics",
        ctaText: "Solve PYPs",
        icon: Calendar,
      },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    subtitle: "Class 11 & 12 • Physical, Inorganic & Organic Chemistry",
    tag: "180 Marks",
    accentColor: "#0284c7",
    accentBg: "bg-blue-50",
    borderColor: "border-blue-200/80 hover:border-blue-600",
    icon: FlaskConical,
    cards: [
      {
        title: "Per Topic Questions",
        description: "Reaction mechanisms, equilibrium numericals, and periodic trend MCQs.",
        badge: "Topic Problem Sets",
        link: "/questions?subject=Chemistry",
        ctaText: "Open Questions",
        icon: FileText,
      },
      {
        title: "Annotated NCERT",
        description: "Line annotations for inorganic trends, named reactions, and tables.",
        badge: "NCERT Highlights",
        link: "/annotated-ncert?subject=Chemistry",
        ctaText: "Read NCERT",
        icon: BookOpen,
      },
      {
        title: "Previous Year Papers (PYP's)",
        description: "2015–2024 NEET Chemistry papers with reaction mechanisms and answer keys.",
        badge: "10-Year Archive",
        link: "/pyps?type=Chemistry",
        ctaText: "Solve PYPs",
        icon: Calendar,
      },
    ],
  },
];

export default function SubjectSections() {
  return (
    <div className="space-y-16 py-12 bg-white">
      {subjects.map((subj, index) => {
        const IconComponent = subj.icon;
        return (
          <section
            key={subj.id}
            id={subj.id}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
              index !== 0 ? "pt-12 border-t border-gray-100" : ""
            }`}
          >
            {/* ═══ CLEAN SORTED SECTION HEADING ═══ */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl ${subj.accentBg} flex items-center justify-center shrink-0`}
                    style={{ color: subj.accentColor }}
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
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                  {subj.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {subj.subtitle}
                </p>
              </div>

              {/* Quick links to Class 11 & Class 12 */}
              <div className="flex items-center gap-2">
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
              </div>
            </div>

            {/* ═══ 3 SORTED CARDS (Questions, Annotated NCERT, PYPs) ═══ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {subj.cards.map((card) => {
                const CardIcon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-white rounded-2xl border ${subj.borderColor} p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-gray-100 text-gray-600">
                          {card.badge}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-lg ${subj.accentBg} flex items-center justify-center`}
                          style={{ color: subj.accentColor }}
                        >
                          <CardIcon className="w-4 h-4" />
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {card.title}
                      </h3>

                      <p className="text-xs text-gray-500 leading-relaxed mb-6">
                        {card.description}
                      </p>
                    </div>

                    <a
                      href={card.link}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition duration-200 shadow-xs"
                      style={{ backgroundColor: subj.accentColor }}
                    >
                      <span>{card.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
