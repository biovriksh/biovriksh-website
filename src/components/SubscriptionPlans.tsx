"use client";

import { useCheckout } from "@/hooks/useCheckout";
import { motion } from "framer-motion";
import { CheckCircle2, Zap, ShieldCheck } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "FREE PASS",
    badge: "100% Free",
    price: "₹0",
    period: "Forever free access",
    description: "Access free chapter summaries & concept notes.",
    features: [
      "All free chapter short notes",
      "NCERT line-by-line summaries",
      "Instant PDF downloads",
      "Topic-wise concept notes",
    ],
    cta: "Start Free",
    btnStyle: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200",
    isHighlighted: false,
  },
  {
    id: "yearly",
    name: "PREMIUM YEARLY",
    badge: "BEST VALUE • SAVE 60%",
    price: "₹199",
    period: "per month (billed ₹2,388/yr)",
    description: "Unlimited access to all paid notes & test series.",
    featuresHeader: "Everything in FREE, plus:",
    features: [
      "All paid chapter notes unlocked",
      "1,500+ practice MCQs",
      "Full NEET mock test series",
      "AIR rank analytics dashboard",
      "Priority content updates",
    ],
    cta: "Unlock Premium Access",
    btnStyle: "bg-[#016737] text-white hover:bg-[#014d29] shadow-md shadow-[#016737]/20",
    isHighlighted: true,
  },
  {
    id: "monthly",
    name: "PREMIUM MONTHLY",
    badge: "FLEXIBLE PASS",
    price: "₹249",
    period: "per month (cancel anytime)",
    description: "Full access with no long-term commitment.",
    featuresHeader: "Everything in FREE, plus:",
    features: [
      "All paid chapter notes unlocked",
      "1,500+ practice MCQs",
      "Topic-wise test papers",
      "Cancel anytime flexibility",
      "Unlimited PDF views",
    ],
    cta: "Get Monthly Pass",
    btnStyle: "bg-gray-900 text-white hover:bg-black shadow-sm",
    isHighlighted: false,
  },
];

export default function SubscriptionPlans() {
  const { handleCheckout } = useCheckout();

  return (
    <section id="pricing" className="py-20 bg-white relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(139,196,63,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(1,103,55,0.05) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          {/* Main Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight leading-[1.1] mb-3">
            Invest in Your NEET Success
          </h2>

          {/* Subtitle - Fits in 2 lines */}
          <p className="text-[#6B7280] text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
            Choose a plan that fits your preparation strategy. Get unlimited access to NCERT summaries, practice sets, and rank-boosting analytics.
          </p>
        </motion.div>

        {/* ── COMPACT SINGLE-FRAME CARDS GRID ───────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] border flex flex-col justify-between overflow-hidden p-5 relative ${
                plan.isHighlighted
                  ? "border-[#8BC43F] ring-2 ring-[#8BC43F]/60 shadow-[0_16px_40px_rgba(1,103,55,0.12)]"
                  : "border-gray-200/80"
              }`}
            >
              <div>
                {/* Badge & Title */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                      plan.isHighlighted
                        ? "bg-[#8BC43F] text-[#013d20]"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {plan.badge}
                  </span>
                  {plan.isHighlighted && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#016737]">
                      <Zap className="w-3 h-3 fill-[#016737]" />
                      Popular
                    </span>
                  )}
                </div>

                {/* Tier Name */}
                <h3 className="text-base font-extrabold text-gray-900 tracking-tight mb-2">
                  {plan.name}
                </h3>
                
                {/* Price */}
                <div className="flex items-baseline gap-1 mb-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                    {plan.price}
                  </span>
                </div>

                {/* Period */}
                <span className="text-[10px] font-medium text-gray-500 block mb-4">
                  {plan.period}
                </span>

                {/* CTA Button */}
                <button
                  onClick={() =>
                    plan.id !== "free"
                      ? handleCheckout(plan.price, `plan-${plan.id}`)
                      : undefined
                  }
                  className={`w-full py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 ${plan.btnStyle}`}
                >
                  {plan.cta}
                </button>

                {/* Description */}
                <p className="text-gray-500 text-xs leading-relaxed mt-3.5 text-left font-normal">
                  {plan.description}
                </p>

                {/* Divider Line */}
                <div className="h-px bg-gray-100 my-4" />

                {/* Feature Header */}
                {plan.featuresHeader && (
                  <p className="text-[11px] font-bold text-gray-900 mb-2.5 text-left">
                    {plan.featuresHeader}
                  </p>
                )}

                {/* Compact Checkmark Feature List */}
                <div className="space-y-2 text-left">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#016737] fill-[#8BC43F]/30 shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-700 font-medium leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footnote */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-center gap-1 text-gray-400 text-[10px] font-medium">
                <ShieldCheck className="w-3 h-3 text-[#016737]" />
                <span>Razorpay Secure</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
