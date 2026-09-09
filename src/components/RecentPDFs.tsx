"use client";

import { motion, useScroll } from "framer-motion";
import { BookOpen, FileText } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface NoteItem {
  id: string;
  subject: string;
  chapter: string;
  pages: string;
  views: string;
  isPaid: boolean;
  price: string;
  image: string;
  accent: string;
}

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
  const [notesList, setNotesList] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLivePDFs() {
      try {
        const res = await fetch("/api/public/pdfs", { cache: "no-store" });
        const json = await res.json();

        if (json.success && json.pdfs && json.pdfs.length > 0) {
          const liveNotes = json.pdfs.map((pdf: any) => ({
            id: pdf.id,
            subject: pdf.title,
            chapter: pdf.sub_heading || `${pdf.class_level || 'NEET'} Note`,
            pages: `${pdf.page_count || 12} pages`,
            views: "Live Note",
            isPaid: !pdf.is_free,
            price: pdf.is_free ? "FREE" : `₹${pdf.price || 49}`,
            image: pdf.thumbnail_url || "/hero_premium_clean.png",
            accent: pdf.is_free ? "#8BC43F" : "#016737",
          }));
          setNotesList(liveNotes);
        } else {
          setNotesList([]);
        }
      } catch (err) {
        console.error("Error fetching live PDFs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLivePDFs();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

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

        {/* CARDS GRID — Live Data or Empty State */}
        {loading ? (
          <div className="py-12 text-center text-sm font-medium text-gray-500">
            Loading recent study notes...
          </div>
        ) : notesList.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {notesList.map((note) => (
              <motion.div
                key={note.id}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-gray-200 hover:border-[#016737]/40 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full group"
              >
                {/* TOP 50% — THUMBNAIL IMAGE BANNER */}
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
        ) : (
          <div className="p-12 rounded-3xl bg-gray-50 border border-gray-200 text-center max-w-lg mx-auto">
            <FileText className="w-10 h-10 text-[#016737] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Notes Uploaded Yet</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              New NEET study notes added from the Admin Panel will appear here instantly.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}


