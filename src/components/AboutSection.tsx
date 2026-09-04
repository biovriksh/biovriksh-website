"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="relative bg-white overflow-hidden">
      
      {/* ── TOP SECTION: PURE WHITE CANVAS ────────────────────────── */}
      <div className="relative pt-16 pb-14 px-6 md:px-12 max-w-4xl mx-auto text-center">
        
        {/* Top Label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono font-bold tracking-widest text-[#016737] uppercase mb-5"
        >
          About BioVriksha
        </motion.div>

        {/* Hand-drawn Sketch Icon on Left */}
        <div className="absolute top-6 left-2 md:left-6 hidden lg:block pointer-events-none select-none opacity-90">
          <svg className="w-20 h-20 text-[#111827]" viewBox="0 0 100 100" fill="none">
            <rect x="25" y="20" width="50" height="60" rx="4" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="25" y1="36" x2="75" y2="36" stroke="currentColor" strokeWidth="2" />
            <line x1="25" y1="52" x2="75" y2="52" stroke="currentColor" strokeWidth="2" />
            <line x1="25" y1="66" x2="60" y2="66" stroke="currentColor" strokeWidth="2" />
            <path d="M15 15 L85 85" stroke="#8BC43F" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M85 15 L15 85" stroke="#8BC43F" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.1] mb-5"
        >
          We&apos;re building smarter <br />
          <span className="text-[#016737] font-extrabold">
            notes for NEET 2026
          </span>
        </motion.h2>

        {/* Description Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="text-[#4B5563] text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8 font-normal"
        >
          BioVriksha is a premier NEET learning platform designed to make complex concepts simple, visual, and exam-ready. We craft high-precision NCERT chapter summaries and practice sets so every aspirant can study efficiently without getting overwhelmed.
        </motion.p>

        {/* CTA Button with Doodle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative inline-flex flex-col items-center"
        >
          <a
            href="#notes"
            className="px-7 py-3 rounded-full bg-white border border-gray-200 text-[#111827] font-bold text-xs sm:text-sm shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-[#016737] hover:text-[#016737] transition-all duration-300 flex items-center gap-2 group"
          >
            explore <span className="text-[#016737] underline decoration-[#8BC43F] decoration-2 underline-offset-4">chapter notes</span>.
          </a>

          {/* Hand-drawn Scribble + Arrow */}
          <div className="absolute left-[104%] top-[-12px] hidden sm:flex items-center gap-1.5 pointer-events-none select-none">
            <svg className="w-14 h-10 text-[#8BC43F] transform rotate-[-10deg]" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M90 10 Q50 50 10 30" strokeLinecap="round" strokeDasharray="3 3" />
              <path d="M20 18 L10 30 L25 38" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-marker text-[#016737] text-sm md:text-base tracking-wider transform rotate-[5deg] whitespace-nowrap">
              NO MORE OVERWHELM
            </span>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="mt-10 flex justify-center">
          <div className="w-3 h-3 bg-[#111827] rounded-sm animate-bounce" />
        </div>

      </div>


      {/* ── BOTTOM DARK SECTION: SLANTED DIAGONAL CUT WITH HIGHLY HIGHLIGHTED PURE WHITE TEXT ────── */}
      <div className="relative bg-[#0A0E0B] text-white pt-24 pb-20 px-6 md:px-12 clip-diagonal">
        
        {/* Container inside dark section */}
        <div className="max-w-5xl mx-auto pt-8 md:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            
            {/* LEFT COLUMN: Number + Headline (Moved slightly toward middle with left padding) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 flex items-start gap-3 pl-2 sm:pl-6 lg:pl-10"
            >
              <span className="font-mono text-sm font-bold text-[#8BC43F] opacity-100 mt-1.5">
                01
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-md">
                Deep Clarity <br />
                = Higher <br />
                Ranks
              </h3>
            </motion.div>

            {/* RIGHT COLUMN: Tilted Scribble (NO BOX) + Pure White Description */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              {/* CONCEPT OVER CRAMMING - Tilted Marker Style (NO BOX, exact reference style) */}
              <div className="font-marker text-3xl sm:text-4xl md:text-5xl text-[#8BC43F] transform -rotate-3 mb-5 select-none tracking-wider drop-shadow-[0_2px_12px_rgba(139,196,63,0.45)]">
                CONCEPT OVER CRAMMING
              </div>

              {/* High Contrast Pure White Body Text */}
              <p className="text-[#F3F4F6] text-base sm:text-lg leading-relaxed font-normal max-w-lg font-sans drop-shadow-sm">
                Traditional coaching often forces students to memorize endless facts without understanding the core principles. At BioVriksha, we focus on line-by-line NCERT clarity, visual diagrams, and pattern-matched practice questions. Our mission is to transform how you prepare, ensuring every minute of study translates into real NEET exam performance.
              </p>
            </motion.div>

          </div>
        </div>

      </div>

    </section>
  );
}
