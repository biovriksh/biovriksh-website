"use client";

import { motion, useScroll } from "framer-motion";
import { FileText, BookOpen } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface ShortNoteItem {
  id: string;
  title: string;
  subtitle: string;
  pages: string;
  readTime: string;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { y: 48, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100, damping: 18 } },
};

export default function ShortNotes() {
  const sectionRef = useRef<HTMLElement>(null);
  const [shortList, setShortList] = useState<ShortNoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShortNotes() {
      try {
        const res = await fetch("/api/public/pdfs", { cache: "no-store" });
        const json = await res.json();

        if (json.success && json.pdfs && json.pdfs.length > 0) {
          const shortOnly = json.pdfs.filter((p: any) => p.note_type === "short" || p.is_free);
          const mapped = (shortOnly.length > 0 ? shortOnly : json.pdfs).map((pdf: any) => ({
            id: pdf.id,
            title: pdf.title,
            subtitle: pdf.sub_heading || `${pdf.class_level || 'Biology'} Short Note`,
            pages: `${pdf.page_count || 1} page`,
            readTime: "5 min",
            image: pdf.thumbnail_url || "/hero_premium_clean.png",
          }));
          setShortList(mapped);
        } else {
          setShortList([]);
        }
      } catch (err) {
        console.error("Error fetching short notes:", err);
      } finally {
        setLoading(false);
      }
    }
    loadShortNotes();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={sectionRef} className="py-32 bg-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[350px] bg-[#8BC43F]/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#016737]/6 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#8BC43F]/30 to-transparent" />

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
              Quick Revision
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] leading-tight tracking-tight">
                Short Notes{" "}
                <span className="text-[#016737] font-semibold text-xl sm:text-2xl">
                  (100% Free)
                </span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 max-w-xl leading-relaxed">
                One-pager cheatsheets designed for last-minute revision. No fluff, pure concepts.
              </p>
            </div>
          </div>
        </motion.div>

        {/* GRID — Live Short Notes or Clean Empty State */}
        {loading ? (
          <div className="py-12 text-center text-sm font-medium text-gray-500">
            Loading short notes...
          </div>
        ) : shortList.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {shortList.map((note) => (
              <motion.div key={note.id} variants={cardVariants}>
                <div className="bg-white rounded-2xl border border-gray-200 hover:border-[#016737]/40 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full group">
                  {/* TOP 50% — THUMBNAIL IMAGE BANNER */}
                  <div className="h-40 relative overflow-hidden bg-gradient-to-br from-[#016737]/10 to-[#8BC43F]/20">
                    <img
                      src={note.image || "/hero_premium_clean.png"}
                      alt={note.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#8BC43F] text-[#111827] shadow-xs">
                        FREE
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md">
                        {note.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* BOTTOM 50% — DETAILS & VIEW BUTTON */}
                  <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                      <h3 className="text-base font-bold text-[#111827] leading-snug group-hover:text-[#016737] transition-colors">
                        {note.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-2">
                        <span>{note.pages}</span>
                        <span>•</span>
                        <span>{note.readTime}</span>
                      </p>
                    </div>

                    <a
                      href={`/secure-reader?title=${encodeURIComponent(note.title)}&subject=${encodeURIComponent(note.subtitle)}&pages=${encodeURIComponent(note.pages)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl border border-[#016737] text-[#016737] text-xs font-bold hover:bg-[#016737] hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-2xs text-center"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open Secure Reader ↗</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="p-12 rounded-3xl bg-gray-50 border border-gray-200 text-center max-w-lg mx-auto">
            <FileText className="w-10 h-10 text-[#016737] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Short Notes Uploaded Yet</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Short revision notes added from the Admin Panel will appear here instantly.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

