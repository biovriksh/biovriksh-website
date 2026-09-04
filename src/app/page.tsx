"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RecentPDFs from "@/components/RecentPDFs";
import PaidPDFs from "@/components/PaidPDFs";
import ShortNotes from "@/components/ShortNotes";
import AboutSection from "@/components/AboutSection";
import FounderStory from "@/components/FounderStory";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import IntroVideo from "@/components/IntroVideo";
import ReviewsSection from "@/components/ReviewsSection";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <main className="min-h-screen bg-white text-[#2B2F2C] overflow-x-hidden font-sans">
      {/* PHASE 1: PRE-LOADER ANIMATION */}
      {showPreloader && (
        <Preloader onComplete={() => setShowPreloader(false)} />
      )}

      {/* PHASE 2+: MAIN PAGE CONTENT */}
      <div className={`transition-opacity duration-700 ${showPreloader ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <Navbar />
        <HeroSection />
        <RecentPDFs />
        <PaidPDFs />
        <ShortNotes />
        <AboutSection />
        <FounderStory />
        <IntroVideo />
        <ReviewsSection />
        <SubscriptionPlans />
        <FAQSection />
        <Footer />
        <WhatsAppButton />
      </div>
    </main>
  );
}



