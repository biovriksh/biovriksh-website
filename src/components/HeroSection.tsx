"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { useRef } from "react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 600], [0, 80]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.18, delayChildren: 0.25 },
    },
  };

  const itemVariants = {
    hidden: { y: 36, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex flex-col justify-center items-center overflow-hidden bg-white"
      style={{ minHeight: "92vh" }}
    >
      {/* ── RIGHT-SIDE HERO VISUAL (Subtly Faded Floating Tree Below Navbar) ── */}
      <motion.div
        style={{ y: imgY }}
        className="absolute right-0 top-32 lg:top-36 h-[calc(100%-160px)] max-h-[480px] w-[48%] pointer-events-none hidden lg:block overflow-hidden"
        aria-hidden="true"
      >
        {/* Subtly Faded Soft Tree Visual */}
        <img
          src="/hero_pure_tree_light.png"
          alt="Bio Vriksha Realistic Tree of Biology"
          className="w-full h-full object-contain object-center opacity-75 transition-all duration-700 hover:opacity-90"
          draggable={false}
        />
      </motion.div>

      {/* ── SUBTLE BACKGROUND AMBIENT GLOW ─────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 10% 60%, rgba(139,196,63,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 10%, rgba(1,103,55,0.06) 0%, transparent 55%)",
        }}
      />

      {/* ── MAIN HERO CONTENT ─────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-16 lg:pt-40 lg:pb-24 flex flex-col justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl flex flex-col items-start justify-center mt-4 lg:mt-8"
        >

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-bold leading-[1.08] mb-5 text-[#1a1f1c]"
            style={{ fontSize: "clamp(2.6rem, 5vw, 4rem)" }}
          >
            Prepare Smarter.
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #016737 0%, #3aaa60 55%, #8BC43F 100%)",
              }}
            >
              Crack NEET.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-[#4a5240] text-lg leading-relaxed mb-9 max-w-lg"
          >
            Premium study material, NCERT-aligned MCQs and full-length
            practice sets — everything a NEET aspirant needs, in one place.
          </motion.p>

          {/* CTA row */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-start gap-4 mb-12"
          >
            <motion.a
              href="#notes"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(1,103,55,0.28)" }}
              whileTap={{ scale: 0.97 }}
              className="btn-shimmer px-8 py-4 rounded-full bg-[#016737] text-white font-semibold flex items-center gap-3 shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8BC43F] focus:ring-offset-2"
            >
              Explore Free Notes
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </motion.a>

            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139,196,63,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="btn-shimmer px-8 py-4 rounded-full bg-[#8BC43F] text-[#1a1f1c] font-semibold flex items-center gap-2.5 shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#016737] focus:ring-offset-2"
            >
              <Sparkles className="w-5 h-5" />
              Start Practising
            </motion.a>
          </motion.div>

          {/* Trust strip (Fully Visible Flex Wrap) */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-[#687269] py-1"
          >
            {[
              "All NEET Subjects Covered",
              "5,000+ Verified Questions",
              "NCERT Line-by-Line",
            ].map((txt) => (
              <div key={txt} className="flex items-center gap-1.5 shrink-0">
                <CheckCircle className="w-4 h-4 text-[#016737] shrink-0" />
                <span className="font-medium">{txt}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── MOBILE HERO BACKGROUND VISUAL (Behind text) ── */}
      <div className="lg:hidden absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <img
          src="/hero_pure_tree_light.png"
          alt="Bio Vriksha Realistic Tree of Biology"
          className="w-full h-full object-contain object-center opacity-30 brightness-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white" />
      </div>
    </section>
  );
}
