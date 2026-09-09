"use client";

import { motion } from "framer-motion";
import { Sparkles, Compass } from "lucide-react";

export default function IntroVideo() {
  return (
    <section
      id="intro-video"
      className="py-20 bg-white relative overflow-hidden"
    >
      {/* Ambient background lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(139,196,63,0.09) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 80% 80%, rgba(1,103,55,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* ── PREMIUM WIDE FRAME CARD CONTAINER ──────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 md:p-12 bg-gradient-to-b from-[#f4faf0] via-white to-white border border-[#8BC43F]/35 shadow-[0_24px_70px_rgba(1,103,55,0.1)] text-center relative overflow-hidden"
        >
          {/* Subtle Corner Accent Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#8BC43F]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#016737]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#8BC43F]/40 text-[#016737] text-xs sm:text-sm font-extrabold tracking-wider uppercase mb-4 shadow-xs backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#8BC43F]" />
              <span>BioVriksh Ecosystem</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight leading-[1.15] mb-8">
              Introduction{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #016737 0%, #3aaa60 50%, #8BC43F 100%)",
                }}
              >
                Overview
              </span>
            </h2>

            {/* Inner Showcase Frame */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white aspect-[848/478] border border-gray-200/80 shadow-[0_12px_40px_rgba(1,103,55,0.06)] flex items-center justify-center p-2 sm:p-4 group">
              <img
                src="/intro_frame_sample.png"
                alt="Introduction Overview"
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
