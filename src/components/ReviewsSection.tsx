"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Priya Verma",
    location: "Jaipur, Rajasthan",
    date: "2 Months Ago",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    text: "BioVriksha completely changed how I prepared for NEET. The notes are super crisp and the MCQs mirror real exam questions. Scored 650+ in NEET 2024!",
  },
  {
    id: 2,
    name: "Aryan Mishra",
    location: "Lucknow, UP",
    date: "1 Month Ago",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    text: "Chapter-wise notes saved so much revision time. Quality feels like premium coaching but at a fraction of the cost. Absolutely worth it!",
  },
  {
    id: 3,
    name: "Sneha Patel",
    location: "Ahmedabad, Gujarat",
    date: "3 Weeks Ago",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    text: "The NEET practice sets are incredibly well-crafted. Every question has a clear explanation. This platform is a game changer for serious aspirants!",
  },
  {
    id: 4,
    name: "Rohan Gupta",
    location: "New Delhi",
    date: "1 Month Ago",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    text: "Best decision in my NEET prep journey. Free notes better than many paid platforms. Cleared NEET on first attempt with AIR under 5000!",
  },
  {
    id: 5,
    name: "Kavya Nair",
    location: "Kochi, Kerala",
    date: "2 Weeks Ago",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    text: "BioVriksha makes NEET prep feel achievable. Structured, clean notes and MCQs that actually test your concepts. I recommend this to every aspirant!",
  },
  {
    id: 6,
    name: "Ishaan Chauhan",
    location: "Pune, Maharashtra",
    date: "3 Months Ago",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    text: "The quality of material here is unmatched. BioVriksha has everything in one place. No more hunting for resources across the internet!",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          fill={i < rating ? "#D99B26" : "#E2E8F0"}
          stroke="none"
        />
      ))}
    </div>
  );
}

// Gold "//" Quote Symbol
function DoubleSlashQuote() {
  return (
    <div className="text-[#D99B26] font-serif font-black italic text-xl tracking-tighter leading-none mb-3 select-none">
      //
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof reviews)[0] }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-[0_6px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all duration-300">
      {/* Quote Symbol */}
      <DoubleSlashQuote />

      {/* Review Text */}
      <p className="text-[#333333] text-sm md:text-[15px] leading-relaxed mb-5 font-normal">
        {review.text}
      </p>

      {/* Thin Line Divider */}
      <div className="h-px w-full bg-gray-150 mb-4" />

      {/* Author Details */}
      <div className="flex items-center gap-3">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-9 h-9 rounded-full object-cover border border-gray-200"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-[#1A1A1A] font-bold text-xs sm:text-sm truncate">
            {review.name}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating rating={review.rating} />
            <span className="text-[11px] text-gray-400 font-medium">• {review.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  // Tripled array for smooth vertical marquee loop
  const looped = [...reviews, ...reviews, ...reviews];

  return (
    <section id="reviews" className="py-24 bg-[#F5F4F0] relative overflow-hidden">
      {/* Abstract Background Wavy Lines (Matching reference image) */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg
          className="w-full h-full text-gray-400/50"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100 150 C300 50, 600 450, 1540 250"
            stroke="currentColor"
            strokeWidth="60"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M-50 750 C400 550, 800 850, 1500 650"
            stroke="currentColor"
            strokeWidth="45"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Floating White Card Box */}
        <div className="bg-white rounded-[32px] p-4 sm:p-6 md:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.06)] border border-[#EFECE6] relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT CONTAINER (Inside White Box) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 bg-[#FAF9F6] rounded-[24px] p-6 sm:p-8 md:p-10 border border-[#F0EDE6] flex flex-col justify-between relative z-10 min-h-[460px]"
            >
              <div>
                {/* Gold Tagline */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-[2px] bg-[#D99B26]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D99B26]">
                    TESTIMONIALS
                  </span>
                </div>

                {/* Main Headline */}
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#016737] leading-[1.18] mb-6">
                  See What Our <br />
                  <span className="text-[#1A1A1A]">Students Say</span>
                </h2>

                {/* Description */}
                <p className="text-[#666666] text-sm leading-relaxed mb-8 max-w-md">
                  Discover how thousands of NEET aspirants use BioVriksha to simplify complex concepts, score higher in practice tests, and crack the exam with confidence.
                </p>
              </div>

              {/* Bottom Spotlight Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-[#EFECE6]">
                <img
                  src={reviews[0].avatar}
                  alt={reviews[0].name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A]">
                    {reviews[0].name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <StarRating rating={reviews[0].rating} />
                    <span className="text-[11px] text-gray-400 font-medium">• {reviews[0].date}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE: REVIEWS TRACK (Smooth Motion for Mobile & Desktop) */}
            <div className="lg:col-span-7 relative h-[420px] sm:h-[480px] lg:h-[520px] flex items-center justify-center overflow-hidden px-2 sm:px-4">
              {/* Top Fade Gradient Mask */}
              <div className="absolute top-0 inset-x-0 h-16 sm:h-20 bg-gradient-to-b from-white via-white/80 to-transparent z-20 pointer-events-none" />

              {/* Bottom Fade Gradient Mask */}
              <div className="absolute bottom-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none" />

              {/* Infinite Animated Marquee Track */}
              <div className="w-full max-w-md mx-auto animate-marquee-up space-y-4 sm:space-y-5 py-6">
                {looped.map((item, idx) => (
                  <ReviewCard key={`scrolling-card-${idx}`} review={item} />
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
