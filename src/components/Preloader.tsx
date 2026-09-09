"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isBlurring, setIsBlurring] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Speed up video slightly to finish in ~4 seconds
    video.playbackRate = 1.3;

    // Immediately play muted video
    video.play().catch((err) => {
      console.log("Autoplay note:", err);
    });

    // Safety fallback timer to ensure transition completes in ~4s
    const timer = setTimeout(() => {
      handleFinish();
    }, 4200);

    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    if (isBlurring) return;
    setIsBlurring(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-white flex items-center justify-center overflow-hidden pointer-events-auto w-full h-full"
      initial={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      animate={
        isBlurring
          ? {
              opacity: 0,
              filter: "blur(40px)",
              scale: 1.05,
            }
          : {
              opacity: 1,
              filter: "blur(0px)",
              scale: 1,
            }
      }
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => {
        if (isBlurring) {
          onComplete();
        }
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center bg-white px-4">
        <video
          ref={videoRef}
          src="/Elephant_bumps_logo_tree_animation.mp4"
          playsInline
          autoPlay
          muted
          preload="auto"
          onEnded={handleFinish}
          className="max-w-2xl md:max-w-3xl w-full h-auto object-contain bg-white mix-blend-multiply select-none"
        />
      </div>
    </motion.div>
  );
}
