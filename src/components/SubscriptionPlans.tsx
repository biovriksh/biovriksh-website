"use client";

import { useState } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import AuthModal from "@/components/AuthModal";
import { motion } from "framer-motion";
import { CheckCircle2, Zap } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "FREE TRIAL",
    badge: "100% Free Forever",
    price: "₹0",
    period: "Student Trial Access",
    featuresHeader: "Included in Free Trial:",
    features: [
      "1st Chapter Questions Free (Class 11 & 12)",
      "1st Chapter Annotated NCERT Free",
      "All 3 Subjects: Biology, Physics & Chemistry",
      "Instant access after student sign in",
      "Zero payment details needed",
    ],
    cta: "Start Free Trial",
    btnStyle: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200",
    isHighlighted: false,
  },
  {
    id: "2999",
    name: "BASIC PLAN",
    badge: "🔥 250 Qs / CHAPTER PASS",
    price: "₹2,999",
    period: "1-Year Full Access • One-Time Payment",
    featuresHeader: "Everything in Free Trial, plus:",
    features: [
      "250 Questions in each subject of all chapters",
      "Complete Class 11 & 12 Question Banks",
      "Biology, Physics & Chemistry with solutions",
      "Topic-wise MCQs for all chapters",
      "Full 1-Year access (No monthly renewals)",
    ],
    cta: "Get Basic Plan (₹2,999 / Year)",
    btnStyle: "bg-gray-900 text-white hover:bg-black shadow-md",
    isHighlighted: false,
  },
  {
    id: "3999",
    name: "PREMIUM PLAN",
    badge: "⭐ COMPLETE ALL-IN-ONE",
    price: "₹3,999",
    period: "1-Year Full Access • One-Time (Recommended)",
    featuresHeader: "Everything in Basic, plus:",
    features: [
      "Complete Comprehensive Notes & Short Notes",
      "250 Questions per chapter of all 3 subjects",
      "Topic-wise PYQs & Previous Year Papers (PYPs)",
      "Annotated NCERT highlights & diagrams",
      "Tests, Mock Test Series & 1-on-1 Mentorship",
      "Full 1-Year access (Single one-time payment)",
    ],
    cta: "Unlock Premium (₹3,999 / Year)",
    btnStyle: "bg-[#016737] text-white hover:bg-[#014d29] shadow-md shadow-[#016737]/20",
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
        window.location.href = "/questions?trial=true";
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
      <section id="pricing" className="py-10 md:py-16 bg-white relative overflow-hidden">
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
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-10"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8BC43F]/15 text-[#016737] text-xs font-bold tracking-wider uppercase mb-2.5">
              <Zap className="w-3.5 h-3.5 fill-[#016737]" />
              Transparent Pricing
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight leading-tight mb-2">
              Simple, Powerful Plans for NEET
            </h2>
            <p className="text-[#6B7280] text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Start with free trial access or unlock full 1-year access to all subjects, tests, and mock series with a single one-time payment.
            </p>
          </motion.div>

          {/* ── 3-PLAN SUBSCRIPTION GRID ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto items-stretch">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`bg-white rounded-2xl border flex flex-col justify-between overflow-hidden p-5 sm:p-6 relative transition-all duration-300 ${
                  plan.isHighlighted
                    ? "border-[#8BC43F] ring-2 ring-[#8BC43F]/60 shadow-[0_16px_40px_rgba(1,103,55,0.12)]"
                    : "border-gray-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:border-gray-300"
                }`}
              >
                {/* Highlight banner on top of Premium card */}
                {plan.isHighlighted && (
                  <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-[#016737] to-[#3aaa60] text-white text-[10px] font-extrabold tracking-widest text-center py-1 uppercase">
                    ⭐ Recommended for NEET
                  </div>
                )}

                <div className={plan.isHighlighted ? "pt-3" : ""}>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                        plan.isHighlighted
                          ? "bg-[#8BC43F]/25 text-[#014d29] border border-[#8BC43F]/40"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 tracking-tight mb-1">
                    {plan.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight font-sans">
                      {plan.price}
                    </span>
                    {plan.id !== "free" && (
                      <span className="text-[11px] font-bold text-[#016737] bg-[#8BC43F]/20 border border-[#8BC43F]/40 px-2 py-0.5 rounded-md">
                        One-Time • 1 Year
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-medium text-gray-500 block mb-3.5">
                    {plan.period}
                  </span>

                  <button
                    onClick={() => onPlanSelect(plan.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${plan.btnStyle}`}
                  >
                    {plan.cta}
                  </button>

                  <div className="h-px bg-gray-100 my-3.5" />

                  {plan.featuresHeader && (
                    <p className="text-[11px] font-bold text-gray-800 mb-2.5 text-left uppercase tracking-wider">
                      {plan.featuresHeader}
                    </p>
                  )}

                  <div className="space-y-2 text-left">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            plan.isHighlighted ? "text-[#016737] fill-[#8BC43F]/30" : "text-gray-400"
                          }`}
                        />
                        <span className="text-xs text-gray-700 font-medium leading-snug">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
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
