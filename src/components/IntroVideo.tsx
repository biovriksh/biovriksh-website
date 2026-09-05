"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, X } from "lucide-react";
import { useState } from "react";

export default function IntroVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section
      id="intro-video"
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(139,196,63,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(1,103,55,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f6fdf0] border border-[#8BC43F]/40 text-[#016737] text-xs md:text-sm font-semibold tracking-wider uppercase mb-5 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#8BC43F]" />
            Introduction
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.1] mb-5">
            See What{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #016737 0%, #3aaa60 50%, #8BC43F 100%)",
              }}
            >
              BioVriksha
            </span>{" "}
            Offers
          </h2>

          {/* Subtitle */}
          <p className="text-[#6B7280] text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            Watch our quick walkthrough to understand how our structured syllabus helps NEET aspirants score higher — faster.
          </p>
        </motion.div>

        {/* ── VIDEO CONTAINER ──────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_24px_60px_rgba(1,103,55,0.14)] border border-gray-200/80 bg-black group cursor-pointer"
          style={{ aspectRatio: "16/9" }}
          onClick={() => setIsPlaying(true)}
        >
          {!isPlaying ? (
            <>
              {/* Clean Thumbnail */}
              <img
                src="/hero_premium_clean.png"
                alt="BioVriksha Introduction Video"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
              />

              {/* Subtle Dark Overlay */}
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-300" />

              {/* Clean Centered Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/90 backdrop-blur-md border border-white/40 shadow-2xl flex items-center justify-center text-[#016737] group-hover:scale-110 group-hover:bg-[#016737] group-hover:text-white transition-all duration-300">
                  <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-current ml-1" />
                </div>
              </div>
            </>
          ) : (
            <video
              src="/Elephant_bumps_logo_tree_animation.mp4"
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>

      </div>

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsPlaying(false)}
          >
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-transform hover:scale-110 cursor-pointer"
            >
              <X className="w-7 h-7" />
            </button>
            <div
              className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src="/Elephant_bumps_logo_tree_animation.mp4"
                controls
                autoPlay
                className="w-full aspect-video object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

