"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  // Sequence stages:
  // "brand"    (0.0s - 1.8s): "Bio Vriksha" brand name with gradient glow
  // "opening"  (1.8s - 2.8s): Curtains slide open revealing the main page
  const [stage, setStage] = useState<"brand" | "opening">("brand");

  useEffect(() => {
    const timer1 = setTimeout(() => setStage("opening"), 1800);
    const timer2 = setTimeout(() => onComplete(), 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  const curtainEase = [0.76, 0, 0.24, 1] as const;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* ── LEFT CURTAIN PANEL (Pure White) ── */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full bg-white z-10 flex items-center justify-end"
        initial={{ x: "0%" }}
        animate={{ x: stage === "opening" ? "-100%" : "0%" }}
        transition={{ duration: 1.0, ease: curtainEase }}
        style={{
          boxShadow:
            stage === "opening"
              ? "25px 0 60px rgba(0,0,0,0.1)"
              : "5px 0 20px rgba(0,0,0,0.03)",
        }}
      >
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#016737]/20 to-transparent" />
      </motion.div>

      {/* ── RIGHT CURTAIN PANEL (Pure White) ── */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-white z-10 flex items-center justify-start"
        initial={{ x: "0%" }}
        animate={{ x: stage === "opening" ? "100%" : "0%" }}
        transition={{ duration: 1.0, ease: curtainEase }}
        style={{
          boxShadow:
            stage === "opening"
              ? "-25px 0 60px rgba(0,0,0,0.1)"
              : "-5px 0 20px rgba(0,0,0,0.03)",
        }}
      >
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#016737]/20 to-transparent" />
      </motion.div>

      {/* ── CENTER STAGE ── */}
      <div className="relative z-20 pointer-events-auto flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {/* ═══ BRAND NAME "Bio Vriksha" ═══ */}
          {stage === "brand" && (
            <motion.div
              key="brand-stage"
              className="flex flex-col items-center justify-center text-center px-4"
              initial={{ y: -40, opacity: 0, filter: "blur(12px)", scale: 1.08 }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Ambient glow behind text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[380px] h-[180px] bg-gradient-to-r from-[#016737]/15 via-[#8BC43F]/15 to-[#016737]/15 blur-[60px] rounded-full" />
              </div>

              {/* Official Transparent Logo Image */}
              <img
                src="/logo_transparent.png"
                alt="Bio Vriksha Official Logo"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain mb-4 relative z-10 filter drop-shadow-md"
              />

              <h1
                className="relative text-5xl sm:text-7xl font-extrabold tracking-tight drop-shadow-[0_8px_32px_rgba(1,103,55,0.25)]"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  backgroundImage:
                    "linear-gradient(135deg, #016737 0%, #016737 45%, #8BC43F 80%, #016737 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Bio Vriksha
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
