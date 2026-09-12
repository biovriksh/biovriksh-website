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
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeen = sessionStorage.getItem("biovriksh_preloader_seen");
      if (hasSeen === "true") {
        document.documentElement.classList.add("preloader-seen");
        setShowPreloader(false);
      }
    }
  }, []);

  const handlePreloaderComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("biovriksh_preloader_seen", "true");
      document.documentElement.classList.add("preloader-seen");
    }
    setShowPreloader(false);
  };

  return (
    <main className="min-h-screen bg-white text-[#2B2F2C] overflow-x-hidden font-sans">
      {/* ── ZERO-GLITCH INLINE SCRIPT (Runs before first browser paint on refresh) ── */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                if (sessionStorage.getItem('biovriksh_preloader_seen') === 'true') {
                  document.documentElement.classList.add('preloader-seen');
                }
              } catch (e) {}
            })();
          `,
        }}
      />

      {/* PHASE 1: PRE-LOADER VIDEO ANIMATION */}
      {showPreloader && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* PHASE 2+: MAIN PAGE CONTENT (Instant 0ms display on refresh via CSS rule) */}
      <div id="main-site-content" className={showPreloader ? "hidden" : "block"}>
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
