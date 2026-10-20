"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  User as UserIcon, 
  ChevronDown, 
  BookOpen, 
  FileCheck2, 
  GraduationCap, 
  Flame,
  MessageCircle,
  Atom,
  FlaskConical,
  Dna
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import AuthModal from "@/components/AuthModal";

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Dropdown states for desktop
  const [testsDropdownOpen, setTestsDropdownOpen] = useState(false);
  const [ncertDropdownOpen, setNcertDropdownOpen] = useState(false);

  // Dropdown states for mobile
  const [mobileTestsOpen, setMobileTestsOpen] = useState(false);
  const [mobileNcertOpen, setMobileNcertOpen] = useState(false);

  const testsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ncertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { user, profile } = useStudentAuth();

  // Detect scroll for dynamic glass intensity
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleTestsMouseEnter = () => {
    if (testsTimeoutRef.current) clearTimeout(testsTimeoutRef.current);
    setTestsDropdownOpen(true);
  };
  const handleTestsMouseLeave = () => {
    testsTimeoutRef.current = setTimeout(() => setTestsDropdownOpen(false), 200);
  };

  const handleNcertMouseEnter = () => {
    if (ncertTimeoutRef.current) clearTimeout(ncertTimeoutRef.current);
    setNcertDropdownOpen(true);
  };
  const handleNcertMouseLeave = () => {
    ncertTimeoutRef.current = setTimeout(() => setNcertDropdownOpen(false), 200);
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 px-3 md:px-6 py-2 transition-all duration-500"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="max-w-6xl mx-auto rounded-2xl py-2 px-3 sm:px-5 border transition-all duration-500 flex flex-col gap-1 relative"
          style={{
            background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.92)",
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
            title="Bio Vriksh"
          >
            <img
              src="/logo_transparent.png"
              alt="Bio Vriksh Logo"
              className="w-16 h-16 sm:w-22 sm:h-22 md:w-24 md:h-24 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md -my-3"
            />
          </a>

          {/* ═══ TOP ROW INSIDE NAVBAR ═══ */}
          <div className="w-full flex items-center justify-between relative pl-20 sm:pl-28 pr-1 min-h-[38px]">
            {/* CENTER: ULTRA-ATTRACTIVE SHINY BRAND NAME */}
            <a
              href="/#home"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center group select-none z-20"
            >
              <span className="text-2xl sm:text-3xl font-black tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-r from-[#00381c] via-[#016737] via-[#359d52] to-[#8BC43F] drop-shadow-[0_2px_5px_rgba(1,103,55,0.20)] group-hover:scale-105 transition-transform duration-300">
                Bio Vriksh
              </span>
            </a>

            {/* RIGHT: SEARCH & LOGIN / PROFILE */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto relative z-20 translate-y-1.5 sm:translate-y-2">
              <a
                href="/chapters"
                className="p-1.5 rounded-full text-[#2B2F2C] hover:text-[#016737] hover:bg-[#F8F9FA] transition-colors"
                aria-label="Search notes"
                title="Search notes"
              >
                <Search className="w-4 h-4 stroke-[2]" />
              </a>

              {user ? (
                <a
                  href="/profile"
                  className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#016737] text-white text-xs font-bold hover:bg-[#014d29] transition-all duration-300 shadow-sm"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#8BC43F]" />
                  <span>{profile?.full_name?.split(" ")[0] || "My Profile"}</span>
                </a>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#016737", color: "#FFFFFF" }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setAuthModalOpen(true)}
                  className="hidden sm:block px-3.5 py-1 rounded-full border-2 border-[#016737] text-[#016737] text-xs font-bold transition-all duration-300 shadow-xs cursor-pointer"
                >
                  Login / Signup
                </motion.button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-xl text-[#016737] hover:bg-gray-100 transition-colors cursor-pointer"
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

          {/* ═══ BOTTOM ROW: NAVIGATIONS WITH DROPDOWNS ═══ */}
          <div className="hidden lg:flex items-center justify-center w-full text-center pb-0.5">
            <nav className="flex items-center justify-center gap-6 xl:gap-8 mx-auto text-center pl-10 sm:pl-14">
              {/* 1. Chapters Link */}
              <a
                href="/chapters"
                className="relative text-xs xl:text-sm font-bold text-[#8BC43F] hover:text-[#016737] transition-colors duration-200 whitespace-nowrap"
              >
                Chapters
              </a>

              {/* 2. Tests Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleTestsMouseEnter}
                onMouseLeave={handleTestsMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setTestsDropdownOpen(!testsDropdownOpen)}
                  className="flex items-center gap-1 text-xs xl:text-sm font-semibold text-[#4B5563] hover:text-[#016737] transition-colors duration-200 cursor-pointer py-1"
                >
                  <span>Tests</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${testsDropdownOpen ? "rotate-180 text-[#016737]" : ""}`} />
                </button>

                <AnimatePresence>
                  {testsDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-xl border border-gray-100 shadow-xl p-2 z-50 text-left"
                    >
                      <a
                        href="/tests/chapter-wise"
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F4F9F2] transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#016737]/10 flex items-center justify-center text-[#016737] group-hover:bg-[#016737] group-hover:text-white transition-colors shrink-0">
                          <FileCheck2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 group-hover:text-[#016737] transition-colors">
                            Chapter-wise Tests
                          </div>
                          <div className="text-[11px] text-gray-500 leading-tight mt-0.5">
                            Class 11 & 12 PCB test PDFs with solutions
                          </div>
                        </div>
                      </a>

                      <div className="p-2.5 rounded-xl bg-gray-50/70 border border-gray-100 mt-1 flex items-start gap-3 opacity-90">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                          <Flame className="w-4 h-4 fill-amber-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-800">Test Series</span>
                            <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-wider">
                              HOT • Soon
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-400 leading-tight mt-0.5">
                            Full syllabus timed mock tests launching soon
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Annotated NCERT Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleNcertMouseEnter}
                onMouseLeave={handleNcertMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setNcertDropdownOpen(!ncertDropdownOpen)}
                  className="flex items-center gap-1 text-xs xl:text-sm font-semibold text-[#4B5563] hover:text-[#016737] transition-colors duration-200 cursor-pointer py-1"
                >
                  <span>Annotated NCERT</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${ncertDropdownOpen ? "rotate-180 text-[#016737]" : ""}`} />
                </button>

                <AnimatePresence>
                  {ncertDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-xl border border-gray-100 shadow-xl p-2 z-50 text-left"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                        PYQs & Annotations
                      </div>

                      <a
                        href="/annotated-ncert/biology"
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F4F9F2] transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <Dna className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                            Biology NCERT + PYQs
                          </div>
                          <div className="text-[10px] text-gray-500">Botany & Zoology high yield</div>
                        </div>
                      </a>

                      <a
                        href="/annotated-ncert/physics"
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-violet-50/60 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
                          <Atom className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 group-hover:text-violet-700 transition-colors">
                            Physics NCERT + PYQs
                          </div>
                          <div className="text-[10px] text-gray-500">Formulas, graph notes & questions</div>
                        </div>
                      </a>

                      <a
                        href="/annotated-ncert/chemistry"
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/60 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                          <FlaskConical className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                            Chemistry NCERT + PYQs
                          </div>
                          <div className="text-[10px] text-gray-500">Organic, Inorganic & Physical</div>
                        </div>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 4. One-to-One Session Button (Navigates directly to One-to-One section) */}
              <a
                href="/#one-to-one-session"
                className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#016737]/10 to-[#8BC43F]/20 text-[#016737] text-xs xl:text-sm font-bold border border-[#8BC43F]/30 hover:border-[#016737]/40 hover:bg-[#016737] hover:text-white transition-all duration-300 shadow-xs cursor-pointer group"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8BC43F] group-hover:text-white transition-colors" />
                <span>One-to-One Session</span>
              </a>

              {/* 5. Pricing */}
              <a
                href="/#pricing"
                className="text-xs xl:text-sm font-semibold text-[#4B5563] hover:text-[#016737] transition-colors duration-200 whitespace-nowrap"
              >
                Pricing
              </a>

              {/* 6. About Us */}
              <a
                href="/#about"
                className="text-xs xl:text-sm font-semibold text-[#4B5563] hover:text-[#016737] transition-colors duration-200 whitespace-nowrap"
              >
                About Us
              </a>
            </nav>
          </div>
        </div>

        {/* ═══ MOBILE NAV DRAWER ═══ */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden max-w-7xl mx-auto mt-2 rounded-2xl bg-white/98 backdrop-blur-2xl border border-gray-200/80 p-4 shadow-2xl flex flex-col gap-2.5 max-h-[85vh] overflow-y-auto"
            >
              <a
                href="/chapters"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold bg-[#8BC43F]/15 text-[#016737] border border-[#8BC43F]/30"
              >
                Chapters
              </a>

              {/* Mobile Tests Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileTestsOpen(!mobileTestsOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#016737]" />
                    Tests
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileTestsOpen ? "rotate-180" : ""}`} />
                </button>

                {mobileTestsOpen && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-gray-50/80 rounded-xl my-1">
                    <a
                      href="/tests/chapter-wise"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-xs font-semibold text-[#016737]"
                    >
                      • Chapter-wise Tests (Class 11 & 12)
                    </a>
                    <div className="py-1 text-xs text-gray-400 flex items-center gap-1.5">
                      <span>• NEET Test Series</span>
                      <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-600 text-[9px] font-bold">
                        HOT • Soon
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Annotated NCERT Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileNcertOpen(!mobileNcertOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#016737]" />
                    Annotated NCERT & PYQs
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileNcertOpen ? "rotate-180" : ""}`} />
                </button>

                {mobileNcertOpen && (
                  <div className="pl-6 pr-2 py-1 space-y-1 bg-gray-50/80 rounded-xl my-1">
                    <a
                      href="/annotated-ncert/biology"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-xs font-semibold text-emerald-700"
                    >
                      • Biology NCERT + PYQs
                    </a>
                    <a
                      href="/annotated-ncert/physics"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-xs font-semibold text-violet-700"
                    >
                      • Physics NCERT + PYQs
                    </a>
                    <a
                      href="/annotated-ncert/chemistry"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-xs font-semibold text-blue-700"
                    >
                      • Chemistry NCERT + PYQs
                    </a>
                  </div>
                )}
              </div>

              {/* Mobile One-to-One Session Link */}
              <a
                href="/#one-to-one-session"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#016737] to-[#0b381e] text-white text-xs font-bold shadow-md cursor-pointer hover:opacity-95 transition-opacity"
              >
                <Sparkles className="w-4 h-4 text-[#8BC43F]" />
                <span>One-to-One Session</span>
              </a>

              <a
                href="/#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Pricing
              </a>

              <a
                href="/#about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                About Us
              </a>

              {/* Bottom Auth Profile */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                {user ? (
                  <a
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-[#016737] text-white text-xs font-bold text-center shadow-sm flex items-center justify-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-[#8BC43F]" />
                    <span>My Profile ({profile?.full_name?.split(" ")[0] || "Student"})</span>
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#016737] text-white text-xs font-bold text-center shadow-sm"
                  >
                    Login / Signup
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
