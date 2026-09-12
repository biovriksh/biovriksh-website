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

    // Play intro video naturally
    video.play().catch((err) => {
      console.log("Autoplay note:", err);
    });

    // Safety fallback timer if video metadata or end event stalls
    const timer = setTimeout(() => {
      handleFinish();
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    if (isBlurring) return;
    setIsBlurring(true);
  };

  return (
    <motion.div
      id="preloader-overlay"
      className="fixed inset-0 z-[999999] bg-[#F2F2ED] flex items-center justify-center overflow-hidden pointer-events-auto w-full h-full"
      style={{ backgroundColor: "#F2F2ED" }}
      initial={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      animate={
        isBlurring
          ? {
              opacity: 0,
              filter: "blur(30px)",
              scale: 1.04,
            }
          : {
              opacity: 1,
              filter: "blur(0px)",
              scale: 1,
            }
      }
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => {
        if (isBlurring) {
          onComplete();
        }
      }}
    >
      {/* Video Container (Medium balanced size with #F2F2ED & mix-blend-darken) */}
      <div
        className="relative w-full max-w-3xl md:max-w-4xl px-4 sm:px-8 flex items-center justify-center bg-[#F2F2ED]"
        style={{ backgroundColor: "#F2F2ED" }}
      >
        <video
          ref={videoRef}
          src="/hero_intro_video.mp4"
          playsInline
          autoPlay
          muted
          preload="auto"
          onEnded={handleFinish}
          className="w-full h-auto max-h-[68vh] md:max-h-[540px] object-contain select-none bg-[#F2F2ED] mix-blend-darken"
          style={{ backgroundColor: "#F2F2ED" }}
        />
      </div>
    </motion.div>
  );
}
