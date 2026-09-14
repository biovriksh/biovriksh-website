"use client";

import { motion } from "framer-motion";

export default function FounderStory() {
  return (
    <section id="founder-story" className="relative bg-[#F4F3F0] py-16 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        {/* ── MOBILE LAYOUT (stacked: image on top, content below) ── */}
        <div className="md:hidden flex flex-col items-center">
          {/* Image with name overlay at bottom */}
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-sm mb-8">
            <img
              src="/yashika_tarar.jpg"
              alt="Yashika Tarar - Founder of BioVriksh"
              className="w-full aspect-[3/4] object-cover object-top contrast-[102%]"
            />
            {/* Subtle blend overlay */}
            <div className="absolute inset-0 bg-[#4A3E34]/5 mix-blend-multiply pointer-events-none" />
            {/* Name overlaid at bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#4A3E34]/80 via-[#4A3E34]/40 to-transparent pt-12 pb-4 px-5">
              <span className="font-signature text-3xl sm:text-4xl text-white block leading-none tracking-wide drop-shadow-md">
                Yashika Tarar
              </span>
            </div>
          </div>

          {/* Content below image */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full text-left"
          >
            <h2 className="font-editorial text-5xl sm:text-6xl text-[#4A3E34] tracking-tight leading-[0.88] uppercase mb-6 select-none">
              FOUNDER <br />
              STORY
            </h2>

            <p className="text-[#65574A] text-sm leading-relaxed mb-6 max-w-sm font-sans font-normal">
              Every NEET aspirant carries a dream of wearing that white coat. BioVriksh was born from the exact same passion — to simplify complex concepts into crystal-clear notes and empower every student to crack NEET with confidence.
            </p>
          </motion.div>
        </div>

        {/* ── DESKTOP LAYOUT (original overlapping editorial style) ── */}
        <div className="hidden md:flex relative min-h-[580px] items-center">
          {/* RIGHT SIDE PORTRAIT IMAGE */}
          <div className="absolute right-0 md:right-12 top-0 bottom-0 w-[52%] z-0 overflow-hidden shadow-sm rounded-3xl">
            <img
              src="/yashika_tarar.jpg"
              alt="Yashika Tarar - Founder of BioVriksh"
              className="w-full h-full object-cover object-top contrast-[102%]"
            />
            <div className="absolute inset-0 bg-[#4A3E34]/5 mix-blend-multiply pointer-events-none" />
          </div>

          {/* LEFT SIDE CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[62%] py-6"
          >
            <h2 className="font-editorial text-8xl lg:text-[105px] text-[#4A3E34] tracking-tight leading-[0.88] uppercase mb-10 select-none">
              FOUNDER <br />
              STORY
            </h2>

            <p className="text-[#65574A] text-base leading-relaxed mb-10 max-w-sm font-sans font-normal">
              Every NEET aspirant carries a dream of wearing that white coat. BioVriksh was born from the exact same passion — to simplify complex concepts into crystal-clear notes and empower every student to crack NEET with confidence.
            </p>

            <div className="pt-2">
              <span className="font-signature text-5xl md:text-6xl text-[#4A3E34] block leading-none tracking-wide">
                Yashika Tarar
              </span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
