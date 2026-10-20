"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function OneToOneSession() {
  const whatsappNumber = "918278071134";
  const whatsappMessage = encodeURIComponent(
    "Hi BioVriksh Academic Team, I want to book a Live 1-on-1 Faculty Mentorship Session for NEET preparation. Please share available slots!"
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section
      id="one-to-one-session"
      className="py-14 md:py-20 bg-gradient-to-b from-[#F9FBF8] via-white to-[#F4F9F2] relative overflow-hidden scroll-mt-24"
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#8BC43F]/12 via-[#016737]/6 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Clean, Minimal & Bright Card */}
        <div className="relative rounded-3xl bg-white/95 backdrop-blur-xl border border-emerald-100 shadow-[0_16px_40px_rgba(1,103,55,0.06)] p-8 sm:p-12 text-center overflow-hidden">
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#8BC43F]/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-[#016737]/5 blur-2xl pointer-events-none" />

          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#016737] text-xs sm:text-sm font-bold tracking-wide mb-5">
            <Sparkles className="w-4 h-4 text-[#8BC43F]" />
            <span>Live 1-on-1 Faculty Mentorship</span>
          </div>

          {/* Clean Heading */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.2] max-w-2xl mx-auto">
            Need Personal Guidance?
            <br />
            <span className="bg-gradient-to-r from-[#016737] via-[#018749] to-[#8BC43F] bg-clip-text text-transparent">
              Book a 1-on-1 Mentorship Session
            </span>
          </h2>

          {/* Short, crisp subtitle */}
          <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Direct doubt clearing in Physics, Chemistry & Biology, mock test mistake analysis, and a personalized revision roadmap tailored just for you.
          </p>

          {/* Quick 3 Feature Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 my-6">
            <span className="px-3.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200/80 text-xs sm:text-sm font-medium text-gray-700">
              🎯 Direct Doubt Solving
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200/80 text-xs sm:text-sm font-medium text-gray-700">
              📅 Custom Revision Plan
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200/80 text-xs sm:text-sm font-medium text-gray-700">
              📊 Mock Mistakes Audit
            </span>
          </div>

          {/* WhatsApp Direct Action Button */}
          <div className="flex flex-col items-center gap-2.5">
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#25D366]/25 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-300 cursor-pointer group"
            >
              {/* WhatsApp Official SVG Icon */}
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.705 1.754zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>Book Session on WhatsApp</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <span className="text-xs text-gray-500 font-medium">
              Click to connect directly with our faculty team on WhatsApp
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
