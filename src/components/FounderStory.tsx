"use client";

import { motion } from "framer-motion";

export default function FounderStory() {
  return (
    <section id="founder-story" className="relative bg-[#F4F3F0] py-20 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative min-h-[500px] md:min-h-[580px] flex items-center">
        
        {/* RIGHT SIDE PORTRAIT IMAGE (Spans top to bottom on the right side) */}
        <div className="absolute right-4 sm:right-8 md:right-12 top-0 bottom-0 w-[48%] sm:w-[50%] md:w-[52%] z-0 overflow-hidden shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80"
            alt="Founder - BioVriksha"
            className="w-full h-full object-cover grayscale-[10%] contrast-[105%]"
          />
          {/* Subtle blend overlay */}
          <div className="absolute inset-0 bg-[#4A3E34]/5 mix-blend-multiply pointer-events-none" />
        </div>

        {/* LEFT SIDE CONTENT & OVERLAPPING HEADLINE */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[85%] sm:max-w-[70%] md:max-w-[62%] py-6"
        >
          {/* GIANT OVERLAPPING HEADLINE (Crosses directly onto the portrait image) */}
          <h2 className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[105px] text-[#4A3E34] tracking-tight leading-[0.88] uppercase mb-8 sm:mb-10 select-none">
            FOUNDER <br />
            STORY
          </h2>

          {/* CHARMING & INSPIRING STORY COPY */}
          <p className="text-[#65574A] text-xs sm:text-sm md:text-base leading-relaxed mb-8 sm:mb-10 max-w-xs sm:max-w-sm font-sans font-normal">
            Every NEET aspirant carries a dream of wearing that white coat. BioVriksha was born from the exact same passion — to simplify complex concepts into crystal-clear notes and empower every student to crack NEET with confidence.
          </p>

          {/* DELICATE HANDWRITTEN SIGNATURE (Matching Reference Image) */}
          <div className="pt-2">
            <span className="font-signature text-4xl sm:text-5xl md:text-6xl text-[#4A3E34] block leading-none tracking-wide">
              Arjun Sharma
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
