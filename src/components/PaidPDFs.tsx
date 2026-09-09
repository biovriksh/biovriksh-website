"use client";

import { useCheckout } from "@/hooks/useCheckout";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import AuthModal from "@/components/AuthModal";
import { motion, useScroll, useTransform } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const defaultPaidPDFs = [
  {
    id: "paid-1",
    rawId: "1",
    subject: "Cell Division & Cell Cycle",
    chapter: "Chapter 10 · Class 11",
    questions: 120,
    difficulty: "Medium",
    price: "₹49",
    topics: ["Mitosis", "Meiosis", "Checkpoints"],
    image: "/hero_premium_clean.png",
  },
  {
    id: "paid-2",
    rawId: "2",
    subject: "Human Reproduction",
    chapter: "Chapter 3 · Class 12",
    questions: 150,
    difficulty: "Hard",
    price: "₹49",
    topics: ["Gametogenesis", "Fertilisation", "Implantation"],
    image: "/hero_premium_clean.png",
  },
  {
    id: "paid-3",
    rawId: "3",
    subject: "Ecology & Environment",
    chapter: "Chapter 13 & 14 · Class 12",
    questions: 200,
    difficulty: "Medium",
    price: "₹79",
    topics: ["Ecosystem", "Biodiversity", "Pollution"],
    image: "/hero_premium_clean.png",
  },
  {
    id: "paid-4",
    rawId: "4",
    subject: "Genetics & Evolution Mega Pack",
    chapter: "Ch. 5–7 · Class 12",
    questions: 300,
    difficulty: "Hard",
    price: "₹129",
    topics: ["Mendel's Laws", "DNA Replication", "Evolution"],
    image: "/hero_premium_clean.png",
  },
];

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
  const { user } = useStudentAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [paidList, setPaidList] = useState(defaultPaidPDFs);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function loadLivePaidPDFs() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("pdfs")
          .select("*")
          .eq("is_active", true)
          .eq("is_free", false)
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          const mapped = data.map((pdf: any) => ({
            id: pdf.id,
            rawId: pdf.id,
            subject: pdf.title,
            chapter: pdf.sub_heading || `${pdf.class_level || 'NEET'} Paid Note`,
            questions: 150,
            difficulty: "Medium",
            price: `₹${pdf.price || 49}`,
            topics: [pdf.class_level || "NEET", "NCERT High Yield"],
            image: pdf.thumbnail_url || "/hero_premium_clean.png",
          }));
          setPaidList(mapped);
        }
      } catch (err) {
        console.error("Error fetching paid PDFs:", err);
      }
    }
    loadLivePaidPDFs();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const blobY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  const onUnlockClick = (pdfId: string) => {
    handleCheckout({
      pdfId: pdfId,
      onLoginRequired: () => setAuthModalOpen(true),
    });
  };

  return (
    <>
      <section
        id="paid-notes"
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
          {/* SECTION HEADER */}
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

          {/* CARDS GRID */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {paidList.map((pdf) => (
              <motion.div
                key={pdf.id}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-gray-200 hover:border-[#016737]/40 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full group"
              >
                {/* TOP 50% */}
                <div className="h-40 relative overflow-hidden bg-gradient-to-br from-[#016737]/10 to-[#8BC43F]/20">
                  <img
                    src={pdf.image}
                    alt={pdf.subject}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
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

                {/* BOTTOM 50% */}
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
                    onClick={() => onUnlockClick(pdf.id)}
                    className="w-full py-2.5 rounded-xl bg-[#016737] text-white text-xs font-bold hover:bg-[#014d29] transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlock Note ({pdf.price})</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        customTitle="Login Required to Unlock Note"
        customSubtitle="Please log in or create a student account to purchase and view this note."
      />
    </>
  );
}

