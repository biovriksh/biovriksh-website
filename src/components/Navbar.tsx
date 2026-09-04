"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Leaf, Menu, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detect scroll for dynamic glass intensity
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { name: "Notes", href: "/#notes" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Chapters", href: "/chapters", isHighlight: true },
    { name: "About Us", href: "/#about" },
    { name: "Founder's Story", href: "/#founder-story" },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 px-3 md:px-6 py-2 transition-all duration-500"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="max-w-6xl mx-auto rounded-2xl py-2 px-3 sm:px-5 border transition-all duration-500 flex flex-col gap-1 relative"
        style={{
          background: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.90)",
          backdropFilter: "blur(24px) saturate(200%)",
          WebkitBackdropFilter: "blur(24px) saturate(200%)",
          boxShadow: scrolled
            ? "0 10px 30px rgba(1,103,55,0.1), 0 0 0 1px rgba(255,255,255,0.6) inset"
            : "0 4px 14px rgba(1,103,55,0.05)",
          borderColor: scrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.6)",
        }}
      >
        {/* ═══ ABSOLUTE LEFT: EXTRA LARGE BOLD LOGO ═══ */}
        <a
          href="/#home"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 group flex items-center"
          title="Bio Vriksha"
        >
          <img
            src="/logo_transparent.png"
            alt="Bio Vriksha Logo"
            className="w-16 h-16 sm:w-22 sm:h-22 md:w-26 md:h-26 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md -my-3"
          />
        </a>

        {/* ═══ TOP ROW INSIDE NAVBAR ═══ */}
        <div className="w-full flex items-center justify-between relative pl-20 sm:pl-28 pr-1 min-h-[38px]">
          {/* CENTER: ULTRA-ATTRACTIVE SHINY BRAND NAME (DARK 'B' TO LIGHT 'A' GRADIENT) */}
          <a
            href="/#home"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center group select-none z-20"
          >
            <span className="text-2xl sm:text-3xl font-black tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-r from-[#00381c] via-[#016737] via-[#359d52] to-[#8BC43F] drop-shadow-[0_2px_5px_rgba(1,103,55,0.20)] group-hover:scale-105 transition-transform duration-300">
              Bio Vriksha
            </span>
          </a>

          {/* RIGHT: SEARCH & LOGIN */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto relative z-20 translate-y-1.5 sm:translate-y-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-full text-[#2B2F2C] hover:text-[#016737] hover:bg-[#F8F9FA] transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#016737", color: "#FFFFFF" }}
              whileTap={{ scale: 0.96 }}
              className="hidden sm:block px-3.5 py-1 rounded-full border-2 border-[#016737] text-[#016737] text-xs font-bold transition-all duration-300 shadow-xs"
            >
              Login
            </motion.button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl text-[#016737] hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ═══ SUBTLE SHORT FAINT LINE UNDER NAME ═══ */}
        <div className="w-full flex justify-center py-0.5 pointer-events-none">
          <div className="w-24 sm:w-36 h-[1px] bg-gradient-to-r from-transparent via-[#8BC43F]/40 to-transparent rounded-full" />
        </div>

        {/* ═══ BOTTOM ROW: NAVIGATIONS ALIGNED SO CHAPTERS SITS UNDER 'Vr' OF BIO VRIKSHA ═══ */}
        <div className="hidden lg:flex items-center justify-center w-full text-center pb-0.5">
          <nav className="flex items-center justify-center gap-7 xl:gap-9 mx-auto text-center pl-12 sm:pl-16">
            {navLinks.map((link) => {
              const isActive = activeTab === link.name;
              const isChapters = link.name === "Chapters";
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setActiveTab(link.name)}
                  className={`relative text-xs xl:text-sm transition-colors duration-200 whitespace-nowrap text-center ${
                    isChapters
                      ? "text-[#8BC43F] font-bold hover:text-[#016737]"
                      : isActive
                      ? "text-[#016737] font-bold"
                      : "text-[#4B5563] font-semibold hover:text-[#016737]"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* MOBILE NAV DROPDOWN MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden max-w-7xl mx-auto mt-2 rounded-2xl bg-white/95 backdrop-blur-2xl border border-gray-200/80 p-4 shadow-xl flex flex-col gap-3"
          >
            {navLinks.map((link) => {
              const isChapters = link.name === "Chapters";
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setActiveTab(link.name);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isChapters
                      ? "bg-[#8BC43F]/15 text-[#016737] border border-[#8BC43F]/30"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#016737]"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#016737] text-white text-xs font-bold text-center shadow-sm"
              >
                Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
