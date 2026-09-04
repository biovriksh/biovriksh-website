"use client";

import { useCheckout } from "@/hooks/useCheckout";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Lock, Target, Timer, BarChart2, CheckCircle, Sparkles, Flame } from "lucide-react";
import { useRef, useState } from "react";

const paidPDFs = [
  {
    id: 1,
    subject: "Cell Division & Cell Cycle",
    chapter: "Chapter 10 · Class 11",
    questions: 120,
    difficulty: "Medium",
    difficultyColor: "#F59E0B",
    time: "90 min",
    price: "₹49",
    topics: ["Mitosis", "Meiosis", "Checkpoints"],
    tag: "Bestseller",
    tagColor: "bg-amber-500",
    gradient: "from-amber-50 to-orange-50",
  },
  {
    id: 2,
    subject: "Human Reproduction",
    chapter: "Chapter 3 · Class 12",
    questions: 150,
    difficulty: "Hard",
    difficultyColor: "#EF4444",
    time: "110 min",
    price: "₹49",
    topics: ["Gametogenesis", "Fertilisation", "Implantation"],
    tag: "Most Tested",
    tagColor: "bg-red-500",
    gradient: "from-red-50 to-rose-50",
  },
  {
    id: 3,
    subject: "Ecology & Environment",
    chapter: "Chapter 13 & 14 · Class 12",
    questions: 200,
    difficulty: "Medium",
    difficultyColor: "#F59E0B",
    time: "120 min",
    price: "₹79",
    topics: ["Ecosystem", "Biodiversity", "Pollution"],
    tag: "High Weightage",
    tagColor: "bg-[#016737]",
    gradient: "from-green-50 to-emerald-50",
  },
  {
    id: 4,
    subject: "Genetics & Evolution Mega Pack",
    chapter: "Ch. 5–7 · Class 12",
    questions: 300,
    difficulty: "Hard",
    difficultyColor: "#EF4444",
    time: "180 min",
    price: "₹129",
    topics: ["Mendel's Laws", "DNA Replication", "Evolution"],
    tag: "🔥 Combo Pack",
    tagColor: "bg-[#8BC43F]",
    gradient: "from-lime-50 to-green-50",
  },
];

// 3D tilt card
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setTilt({ x, y });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      style={{
        transform: hovered
          ? `perspective(900px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(1.03)`
          : "perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)",
        transition: hovered ? "transform 0.08s linear" : "transform 0.5s ease",
        willChange: "transform",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { y: 70, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 18 },
  },
};

export default function PaidPDFs() {
  const { handleCheckout } = useCheckout();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const blobY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const titleX = useTransform(scrollYProgress, [0, 0.4], [-80, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const smoothTitleX = useSpring(titleX, { stiffness: 80, damping: 18 });

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="py-32 bg-white relative overflow-hidden"
    >
      {/* Mesh gradient + blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(at 70% 20%, rgba(139,196,63,0.09) 0px, transparent 55%), radial-gradient(at 10% 80%, rgba(1,103,55,0.07) 0px, transparent 50%)",
        }}
        aria-hidden="true"
      />
      <motion.div
        style={{ y: blobY }}
        className="absolute bottom-[-60px] left-[-60px] w-[550px] h-[420px] bg-[#016737]/8 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-16 right-[-40px] w-80 h-80 bg-[#8BC43F]/10 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Separator */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#8BC43F]/30 to-transparent" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* SECTION HEADER — Solid Crisp Typography & High Contrast */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-1 h-6 rounded-full bg-[#016737]" />
            <span className="text-xs font-bold text-[#016737] uppercase tracking-wider">
              Premium Practice
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] leading-tight">
                Paid Notes
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 max-w-xl leading-relaxed">
                High-density question banks crafted by NEET toppers. Pay once, practice infinitely.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#016737]/10 border border-[#016737]/20 text-[#016737] text-xs font-bold self-start md:self-auto">
              <Sparkles className="w-3.5 h-3.5" />
              Starting at ₹49 only
            </div>
          </div>
        </motion.div>

        {/* CARDS GRID — 50/50 Image Top Half & Details Bottom Half */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {paidPDFs.map((pdf) => (
            <motion.div
              key={pdf.id}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200 hover:border-[#016737]/40 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full group"
            >
              {/* TOP 50% — THUMBNAIL IMAGE BANNER */}
              <div className="h-40 relative overflow-hidden bg-gradient-to-br from-[#016737]/10 to-[#8BC43F]/20">
                <img
                  src="/hero_premium_clean.png"
                  alt={pdf.subject}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Price Tag */}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#016737] text-white shadow-xs">
                    {pdf.price}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md">
                    {pdf.chapter}
                  </span>
                </div>
              </div>

              {/* BOTTOM 50% — DETAILS & UNLOCK BUTTON */}
              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#111827] leading-snug group-hover:text-[#016737] transition-colors">
                    {pdf.subject}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {pdf.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-[10px] font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleCheckout(pdf.price, `paid-pdf-${pdf.id}`)}
                  className="w-full py-2.5 rounded-xl bg-[#016737] text-white text-xs font-bold hover:bg-[#014d29] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock Note ({pdf.price})</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 rounded-2xl bg-gradient-to-r from-[#016737]/[0.04] to-[#8BC43F]/[0.06] border border-[#8BC43F]/20 px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            <p className="font-bold text-[#2B2F2C] text-lg">
              Not sure yet?{" "}
              <span className="text-[#016737]">Try a free sample first.</span>
            </p>
            <p className="text-sm text-[#687269] mt-1">
              Every paid note set comes with a free 20-question preview — no login required.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 12px 32px rgba(139,196,63,0.35)" }}
            whileTap={{ scale: 0.97 }}
            className="btn-shimmer px-7 py-3 rounded-full bg-[#8BC43F] text-[#2B2F2C] font-semibold text-sm whitespace-nowrap shadow-md"
          >
            View Free Samples
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
