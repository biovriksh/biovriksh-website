"use client";

import { motion } from "framer-motion";

interface DoctorElephantProps {
  className?: string;
  animated?: boolean;
}

/**
 * 3D Doctor Elephant Mascot with Pure Hand Waving Motion (Zero Cloth Distortion).
 * Base 3D model remains 100% clean and pristine.
 * Only the elephant hand paw itself rotates at the wrist for an authentic wave greeting.
 */
export default function DoctorElephant({
  className = "",
  animated = true,
}: DoctorElephantProps) {
  return (
    <div className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}>
      {/* ── GROUND CONTACT SHADOW ── */}
      <motion.div
        animate={
          animated
            ? {
                scaleX: [1, 1.12, 0.92, 1.1, 1],
                opacity: [0.15, 0.26, 0.15, 0.24, 0.15],
              }
            : {}
        }
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1 w-[65%] h-5 bg-black/25 rounded-full blur-md pointer-events-none z-0"
      />

      {/* ── 3D DOCTOR ELEPHANT MASCOT CONTAINER WITH GENTLE BODY STEPPING ── */}
      <motion.div
        animate={
          animated
            ? {
                // Gentle body stepping & bounce
                y: [0, -10, 2, -6, 0],
                scaleY: [1, 1.015, 0.985, 1.01, 1],
              }
            : {}
        }
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        {/* 1. DOCTOR ELEPHANT BODY */}
        <img
          src="/doctor_elephant_rig_body.png"
          alt="3D Doctor Elephant Mascot"
          className="w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(1,103,55,0.22)]"
          loading="eager"
        />

        {/* 2. REALISTIC ARM & HAND WAVING MOTION ("Hii!" Wave Greeting 👋) */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            transformOrigin: "67% 50%", // Shoulder joint pivot point
          }}
          animate={
            animated
              ? {
                  // Direct arm & hand wave back & forth ("Hii!" 👋)
                  rotate: [-20, 24, -14, 28, -20],
                  scale: [0.98, 1.04, 0.96, 1.03, 0.98],
                }
              : {}
          }
          transition={{
            duration: 0.75, // Fast, cheerful wave greeting!
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none z-20"
        >
          <img
            src="/doctor_elephant_rig_arm.png"
            alt="Waving Arm"
            className="w-full h-full object-contain"
            loading="eager"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
