"use client";

import { useState } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import AuthModal from "@/components/AuthModal";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Sparkles, Zap, Flame } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "BASIC PASS",
    badge: "100% Free Forever",
    price: "₹0",
    period: "Lifetime Free Access",
    description: "Ideal for beginners. Preview overview and first chapter free.",
    featuresHeader: "Included in Basic:",
    features: [
      "All chapter overviews & NCERT concept summaries",
      "1st Chapter Question PDFs 100% Free (Class 11 & 12)",
      "1st Chapter Annotated NCERT PDFs 100% Free",
      "Instant secure online PDF reader for free chapters",
      "Zero payment details needed",
    ],
    cta: "Start Free Learning",
    btnStyle: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200",
    isHighlighted: false,
  },
  {
    id: "299",
    name: "STANDARD PASS",
    badge: "🔥 ALL NOTES & QUESTIONS",
    price: "₹299",
    period: "/ month (Cancel anytime)",
    description: "Complete access to all per-topic questions, PYPs and annotated NCERT.",
    featuresHeader: "Everything in Basic, plus:",
    features: [
      "ALL Per-Topic Question PDFs (Class 11 & 12 PCB)",
      "ALL Annotated NCERT PDFs with diagrams & highlights",
      "Complete 10-Year Previous Year Question Papers (PYPs)",
      "Formula cheat sheets & reaction memory mindmaps",
      "No per-PDF fees — complete question bank unlocked",
      "Cancel anytime from your account settings",
    ],
    cta: "Subscribe for ₹299/mo",
    btnStyle: "bg-gray-900 text-white hover:bg-black shadow-md",
    isHighlighted: false,
  },
  {
    id: "399",
    name: "PREMIUM PASS",
    badge: "⭐ COMPLETE ALL-ACCESS",
    price: "₹399",
    period: "/ month (Recommended for NEET)",
    description: "The complete preparation suite with test series and personal mentorship.",
    featuresHeader: "Everything in Standard, plus:",
    features: [
      "Everything included in Standard Pass",
      "NEET All-India Mock Test Series with AIR Rank Predictor",
      "Chapter-wise Timed Practice Tests with full solutions",
      "Live 1-on-1 Faculty Mentorship & Doubt Resolution",
      "Video explanation walkthroughs for high-difficulty questions",
      "Personal revision checklist & mistake tracker",
    ],
    cta: "Unlock Premium (₹399/mo)",
    btnStyle: "bg-[#016737] text-white hover:bg-[#014d29] shadow-lg shadow-[#016737]/25",
    isHighlighted: true,
  },
];

export default function SubscriptionPlans() {
  const { handleCheckout } = useCheckout();
  const { user } = useStudentAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const onPlanSelect = (planId: string) => {
    if (planId === "free") {
      if (!user) {
        setAuthModalOpen(true);
      } else {
        window.location.href = "/chapters";
      }
      return;
    }

    handleCheckout({
      planId: `plan-${planId}`,
      onLoginRequired: () => setAuthModalOpen(true),
      onSuccess: () => {
        window.location.href = "/profile";
      },
    });
  };

  return (
    <>
      <section id="pricing" className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Background ambient lighting */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(139,196,63,0.1) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(1,103,55,0.06) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-14"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8BC43F]/15 text-[#016737] text-xs font-bold tracking-wider uppercase mb-3">
              <Zap className="w-3.5 h-3.5 fill-[#016737]" />
              Transparent Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight leading-[1.15] mb-3">
              Simple, Powerful Plans for NEET
            </h2>
            <p className="text-[#6B7280] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Start with free revision resources or upgrade to Premium for complete 1-year access to all subjects, tests, and upcoming test series.
            </p>
          </motion.div>

          {/* ── 3-PLAN SUBSCRIPTION GRID ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`bg-white rounded-3xl border flex flex-col justify-between overflow-hidden p-6 sm:p-8 relative transition-all duration-300 ${
                  plan.isHighlighted
                    ? "border-[#8BC43F] ring-2 ring-[#8BC43F]/60 shadow-[0_20px_50px_rgba(1,103,55,0.14)]"
                    : "border-gray-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:border-gray-300"
                }`}
              >
                {/* Highlight banner on top of Premium card */}
                {plan.isHighlighted && (
                  <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-[#016737] to-[#3aaa60] text-white text-[11px] font-extrabold tracking-widest text-center py-1.5 uppercase">
                    ⭐ Recommended for NEET 2025/2026
                  </div>
                )}

                <div className={plan.isHighlighted ? "pt-4" : ""}>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full ${
                        plan.isHighlighted
                          ? "bg-[#8BC43F]/25 text-[#014d29] border border-[#8BC43F]/40"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight font-sans">
                      {plan.price}
                    </span>
                    {plan.id !== "free" && (
                      <span className="text-sm font-bold text-gray-500">/ month</span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-gray-500 block mb-5">
                    {plan.period}
                  </span>

                  <button
                    onClick={() => onPlanSelect(plan.id)}
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${plan.btnStyle}`}
                  >
                    {plan.cta}
                  </button>

                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mt-4 text-left font-normal">
                    {plan.description}
                  </p>

                  <div className="h-px bg-gray-100 my-5" />

                  {plan.featuresHeader && (
                    <p className="text-xs font-bold text-gray-900 mb-3 text-left uppercase tracking-wider">
                      {plan.featuresHeader}
                    </p>
                  )}

                  <div className="space-y-2.5 text-left">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                          plan.isHighlighted ? "text-[#016737] fill-[#8BC43F]/30" : "text-gray-400"
                        }`} />
                        <span className="text-xs sm:text-sm text-gray-700 font-medium leading-snug">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-gray-400 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#016737]" />
                    <span>Instant Digital Activation</span>
                  </div>
                  <span>Razorpay Verified</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        customTitle="Login Required to Access Plan"
        customSubtitle="Please log in or sign up to activate your NEET preparation subscription plan."
      />
    </>
  );
}
