"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  BookOpen,
  HelpCircle,
  Zap,
  FileText,
  MapPin,
  ShieldCheck,
  Layers,
  Brain,
} from "lucide-react";

export default function IntroVideo() {
  const cards = [
    {
      step: "01",
      tag: "LOCATION & EXPERIENCE",
      title: "Educator & Origin Story",
      tagIcon: MapPin,
      image: "/educator_chalkboard_3d.png",
      imgAlt: "BioVriksh Educator Origin Story",
      badgeLeft: "Offline Teaching",
      badgeRight: "3.5+ Yrs Exp",
      desc: "Originally from a village in Haryana with 3.5+ years of offline teaching experience, helping students master complex NEET biology concepts.",
      highlightBox: "“No student is inherently weak; with right guidance & mentorship, every student can succeed.”",
    },
    {
      step: "02",
      tag: "CONCEPTUAL MASTERY",
      title: "Strong NCERT Foundation",
      tagIcon: BookOpen,
      image: "/ncert_root_decoding_3d.png",
      imgAlt: "NCERT Root Decoding & Zero to 350+ Marks",
      badgeLeft: "Line-by-Line NCERT",
      badgeRight: "From Scratch",
      desc: "Designed for students starting from zero. Taught line-by-line from NCERT roots with systematic revision to target 350+ marks in NEET.",
      highlightBox: "“We begin right from zero fundamentals to make Biology your highest-scoring NEET subject.”",
    },
    {
      step: "03",
      tag: "PRACTICE DRILLING",
      title: "250–300 Question Engine",
      tagIcon: Layers,
      image: "/question_practice_matrix_3d.png",
      imgAlt: "250-300 Question Practice Engine",
      badgeLeft: "250–300 Qs / Topic",
      badgeRight: "5 Formats",
      desc: "Every chapter followed by 250–300 curated questions covering conceptual, statement, assertion-reason, application & NEET mocks.",
      highlightBox: "“Developing clarity, consistency, accuracy, and true exam readiness in every single student.”",
    },
  ];

  return (
    <section id="intro-video" className="py-16 md:py-24 bg-[#FAFAF6] relative overflow-hidden font-sans">
      {/* Background Ambient Lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 50% 10%, rgba(139,196,63,0.12) 0%, transparent 75%), radial-gradient(ellipse 60% 60% at 85% 85%, rgba(1,103,55,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 relative z-10 space-y-10">
        
        {/* ── ONE LINE CLEAR HEADING ───────────────────────────────── */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0F7EB] text-[#016737] text-xs font-mono font-extrabold uppercase tracking-wider border border-[#8BC43F]/40 mb-3">
            <Sparkles className="w-4 h-4 text-[#8BC43F]" />
            <span>BioVriksh Teaching Methodology</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight">
            How BioVriksh Builds{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #016737 0%, #2e9352 50%, #8BC43F 100%)",
              }}
            >
              NEET Biology Success
            </span>
          </h2>
        </div>


        {/* ── 3 EQUAL-HEIGHT PERFECTLY ALIGNED CARDS GRID (NO HOVER MOVEMENT) ───── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {cards.map((card, idx) => {
            const TagIcon = card.tagIcon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-gray-200/90 shadow-sm overflow-hidden flex flex-col justify-between h-full"
              >
                {/* 1. Image Frame (Fixed Height h-44 across all cards, static image) */}
                <div className="relative w-full h-44 overflow-hidden bg-gradient-to-b from-[#F2F8EE] to-[#E2F0D9] shrink-0">
                  <img
                    src={card.image}
                    alt={card.imgAlt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-bold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                    <span>{card.badgeLeft}</span>
                    <span className="text-[#8BC43F] font-mono">{card.badgeRight}</span>
                  </div>
                </div>

                {/* 2. Middle Content Body (Equal Flex Growth) */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    {/* Category Tag */}
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-extrabold text-[#016737] uppercase tracking-wider">
                      <TagIcon className="w-3 h-3 text-[#016737]" />
                      <span>{card.tag}</span>
                    </div>

                    {/* Uniform 1-Line Card Title */}
                    <h3 className="text-sm font-extrabold text-[#111827] leading-snug">
                      {card.title}
                    </h3>

                    {/* Uniform 3-Line Description Box */}
                    <p className="text-xs text-gray-600 leading-relaxed font-normal min-h-[4.2rem]">
                      {card.desc}
                    </p>
                  </div>

                  {/* 3. Bottom Uniform Quote / Highlight Box */}
                  <div className="p-3 rounded-xl bg-[#FAFCF8] border border-[#8BC43F]/35 text-[11px] italic text-[#016737] font-semibold leading-relaxed min-h-[3.8rem] flex items-center">
                    {card.highlightBox}
                  </div>
                </div>
              </div>
            );
          })}
        </div>


        {/* ── SINGLE-BLOCK LUXURY PROMISE STAMP WITH EDITORIAL TYPOGRAPHY ── */}
        <div className="rounded-2xl bg-gradient-to-br from-[#F6F5F2] via-[#F1EFEA] to-[#F7F6F2] text-[#111827] p-5 sm:p-6 border border-[#016737]/20 shadow-xs text-center space-y-3 relative overflow-hidden">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#016737]/10 text-[#016737] text-[11px] font-mono font-extrabold uppercase tracking-widest border border-[#016737]/20">
            <Target className="w-3.5 h-3.5 text-[#016737]" />
            <span>BioVriksh Core Promise</span>
          </div>

          <p className="font-editorial text-lg sm:text-xl md:text-2xl text-[#016737] tracking-tight leading-snug max-w-3xl mx-auto">
            &ldquo;We will not be known merely for completing the syllabus, but for developing <span className="underline decoration-[#8BC43F] decoration-2 underline-offset-4 font-bold text-[#111827]">clarity, consistency, accuracy</span> and exam readiness in every student.&rdquo;
          </p>

          <p className="text-xs text-[#4B5563] font-medium italic pt-2 border-t border-[#016737]/10 max-w-2xl mx-auto">
            From understanding the roots of every concept to confidently answering every question—that is what BioVriksh will stand for.
          </p>

        </div>

      </div>
    </section>
  );
}
