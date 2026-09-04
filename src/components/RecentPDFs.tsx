"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, Eye, Lock, ShieldCheck, X, BookOpen } from "lucide-react";
import { useRef, useState } from "react";

const recentNotesList = [
  {
    id: 1,
    subject: "Cell: The Unit of Life",
    chapter: "Chapter 8 · Class 11",
    pages: "18 pages",
    views: "4.2k views",
    isPaid: false,
    price: "FREE",
    image: "/hero_premium_clean.png",
    accent: "#8BC43F",
  },
  {
    id: 2,
    subject: "Photosynthesis in Higher Plants",
    chapter: "Chapter 13 · Class 11",
    pages: "22 pages",
    views: "3.8k views",
    isPaid: true,
    price: "₹49",
    image: "/hero_premium_clean.png",
    accent: "#016737",
  },
  {
    id: 3,
    subject: "Reproduction in Organisms",
    chapter: "Chapter 1 · Class 12",
    pages: "14 pages",
    views: "5.1k views",
    isPaid: false,
    price: "FREE",
    image: "/hero_premium_clean.png",
    accent: "#8BC43F",
  },
  {
    id: 4,
    subject: "Molecular Basis of Inheritance",
    chapter: "Chapter 6 · Class 12",
    pages: "28 pages",
    views: "6.7k views",
    isPaid: true,
    price: "₹49",
    image: "/hero_premium_clean.png",
    accent: "#016737",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 18 },
  },
};

export default function RecentPDFs() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedNote, setSelectedNote] = useState<(typeof recentNotesList)[0] | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  const titleOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);

  return (
    <section
      id="notes"
      ref={sectionRef}
      className="py-24 sm:py-32 bg-white relative overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute top-0 right-[-80px] w-[500px] h-[500px] bg-[#8BC43F]/12 rounded-full blur-[130px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* SECTION HEADER — Solid Crisp Typography & High Contrast */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-1 h-6 rounded-full bg-[#016737]" />
              <span className="text-xs font-bold text-[#016737] uppercase tracking-wider">
                Recent Study Notes
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] leading-tight">
              Recent Notes
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-600 max-w-xl leading-relaxed">
              Explore chapter notes and question sets freshly updated for NEET.
            </p>
          </div>

          <a
            href="/chapters"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#016737] hover:text-[#014d29] transition-colors self-start md:self-auto"
          >
            <span>View All Chapters</span>
            <BookOpen className="w-4 h-4" />
          </a>
        </motion.div>

        {/* CARDS GRID — 50/50 Image Top Half & Details Bottom Half */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {recentNotesList.map((note) => (
            <motion.div
              key={note.id}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200 hover:border-[#016737]/40 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full group"
            >
              {/* TOP 50% — BIOLOGY THUMBNAIL IMAGE BANNER */}
              <div className="h-40 relative overflow-hidden bg-gradient-to-br from-[#016737]/10 to-[#8BC43F]/20">
                <img
                  src={note.image}
                  alt={note.subject}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Price / Free Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-xs ${
                      note.isPaid
                        ? "bg-[#016737] text-white"
                        : "bg-[#8BC43F] text-[#111827]"
                    }`}
                  >
                    {note.price}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md">
                    {note.chapter}
                  </span>
                </div>
              </div>

              {/* BOTTOM 50% — DETAILS & SECURE READER BUTTON */}
              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#111827] leading-snug group-hover:text-[#016737] transition-colors">
                    {note.subject}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-2">
                    <span>{note.pages}</span>
                    <span>•</span>
                    <span>{note.views}</span>
                  </p>
                </div>

                <a
                  href={`/secure-reader?title=${encodeURIComponent(note.subject)}&subject=${encodeURIComponent(note.chapter)}&pages=${encodeURIComponent(note.pages)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl border border-[#016737] text-[#016737] text-xs font-bold hover:bg-[#016737] hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Open Secure Reader ↗</span>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
