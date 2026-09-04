"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "Is BioVriksha free to use?",
    answer:
      "Yes! The free plan gives you unlimited access to all chapter short notes and NCERT summaries with no login required. Premium unlocks all paid notes and practice question sets.",
  },
  {
    id: 2,
    question: "Monthly vs Yearly Premium — what's the difference?",
    answer:
      "Both plans unlock identical content. Premium Monthly is ₹249/month with cancel-anytime flexibility. Premium Yearly is ₹199/month (billed ₹2,388 annually), saving you ₹600 for full NEET preparation.",
  },
  {
    id: 3,
    question: "Can I download the paid notes?",
    answer:
      "Premium notes are unlocked for high-quality, instant viewing directly inside the BioVriksha platform. This keeps content updated, secure, and fresh for all members.",
  },
  {
    id: 4,
    question: "Can I cancel anytime?",
    answer:
      "Yes. Premium Monthly can be cancelled at any time from your account settings — no questions asked. Your access remains active until the end of the billing cycle.",
  },
  {
    id: 5,
    question: "Is the content aligned with the latest NEET syllabus?",
    answer:
      "Absolutely. All notes and practice sets are strictly aligned with the latest NTA NEET Class 11 & 12 NCERT Biology syllabus.",
  },
  {
    id: 6,
    question: "What payment methods are accepted?",
    answer:
      "We accept all major payment options via Razorpay — UPI (Google Pay, PhonePe, Paytm), Credit/Debit cards, Net Banking, and Wallets.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b-2 border-[#111827]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-6 text-left group focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="text-base sm:text-lg font-extrabold text-[#111827] group-hover:text-[#016737] transition-colors">
          {faq.question}
        </span>
        <div className="flex-shrink-0 text-[#111827] font-bold text-xl ml-4">
          {isOpen ? <Minus className="w-5 h-5 stroke-[3]" /> : <Plus className="w-5 h-5 stroke-[3]" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-600 text-sm sm:text-base leading-relaxed pr-8 font-normal">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <section id="faq" className="bg-white">
      {/* ── TOP SECTION: GIANT EDITORIAL HEADER ─────────────────────── */}
      <div className="pt-24 pb-16 px-6 md:px-12 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-6xl sm:text-7xl md:text-8xl font-black text-[#111827] tracking-tight leading-none mb-4 select-none"
        >
          FAQs
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-500 text-sm sm:text-base leading-relaxed"
        >
          <p className="font-semibold text-gray-700">Frequently Asked Questions.</p>
          <p>Here are some common questions about BioVriksha.</p>
        </motion.div>
      </div>

      {/* ── MIDDLE ACCORDION SECTION WITH THICK BORDERS ─────────────── */}
      <div className="bg-[#F6F6F6] py-16 px-6 md:px-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto border-t-2 border-[#111827]">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>
      </div>

      {/* ── BOTTOM TRANSPARENT BANNER WITH UNIQUE LIGHT 3D BIOLOGY IMAGE ─────── */}
      <div className="relative bg-[#FAF9F6] py-20 px-6 md:px-12 overflow-hidden border-t border-gray-200">
        {/* Clearly Visible Light Background Image on Right Side */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[65%] md:w-[55%] pointer-events-none overflow-hidden">
          <img
            src="/hero_biology_no_character.png"
            alt="BioVriksha 3D Biology Visual"
            className="w-full h-full object-cover opacity-85"
          />
          {/* Left Fade Overlay to seamlessly blend with background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/80 to-transparent" />
        </div>

        {/* Content Area */}
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="max-w-2xl">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight mb-3">
              Still need help? Send us a note!
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal">
              For any other questions or assistance, feel free to reach out to our team directly through our contact channels.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
