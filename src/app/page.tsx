"use client";

import { useState, useEffect } from "react";
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
  const [showPreloader, setShowPreloader] = useState(false);
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeen = sessionStorage.getItem("biovriksh_preloader_seen");
      if (!hasSeen) {
        setShowPreloader(true);
      }
      setCheckedSession(true);
    }
  }, []);

  const handlePreloaderComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("biovriksh_preloader_seen", "true");
    }
    setShowPreloader(false);
  };

  return (
    <main className="min-h-screen bg-white text-[#2B2F2C] overflow-x-hidden font-sans">
      {/* PHASE 1: PRE-LOADER ANIMATION (Only shown once per browser session) */}
      {checkedSession && showPreloader && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* PHASE 2+: MAIN PAGE CONTENT */}
      <div className={showPreloader ? "pointer-events-none select-none" : ""}>
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
