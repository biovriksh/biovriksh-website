"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  EyeOff,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  Lock,
} from "lucide-react";

function SecureReaderContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Class 12 Biology - High Yield NCERT Notes";
  const subject = searchParams.get("subject") || "NEET / Board Exam Special Edition";
  const pagesCount = parseInt(searchParams.get("pages") || "18", 10) || 18;

  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Prevent Right Click / Context Menu
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // 2. Prevent Copy / Cut / Drag
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handleDrag = (e: DragEvent) => e.preventDefault();
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCopy);
    document.addEventListener("dragstart", handleDrag);

    // 3. Detect Screenshot & Recording Shortcuts (PrintScreen, Win+Shift+S, Cmd+Shift+4, Ctrl+P, F12)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isPrintScreen = e.key === "PrintScreen";
      const isMacScreenshot = e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5" || e.key === "s");
      const isWinSnipping = e.key === "s" && (e.metaKey || e.ctrlKey) && e.shiftKey;
      const isPrint = (e.ctrlKey || e.metaKey) && e.key === "p";
      const isSave = (e.ctrlKey || e.metaKey) && e.key === "s";
      const isDevTools = e.key === "F12" || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I");

      if (isPrintScreen || isMacScreenshot || isWinSnipping || isPrint || isSave || isDevTools) {
        e.preventDefault();
        setIsProtected(true);
        setTimeout(() => setIsProtected(false), 3500);
        return false;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        setIsProtected(true);
        setTimeout(() => setIsProtected(false), 3500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // 4. Blur / Blackout when window loses focus (Snipping tool / OS screenshot capture mode)
    const handleMouseLeave = () => setIsProtected(true);
    const handleMouseEnter = () => setIsProtected(false);
    const handleBlur = () => setIsProtected(true);
    const handleFocus = () => setIsProtected(false);
    const handleVisibilityChange = () => {
      if (document.hidden) setIsProtected(true);
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCopy);
      document.removeEventListener("dragstart", handleDrag);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col select-none relative overflow-x-hidden font-sans transition-colors duration-300 ${
        isDarkMode ? "bg-[#0B0F17] text-gray-100" : "bg-[#F4F5F7] text-gray-900"
      }`}
    >
      {/* ═══ PRINT LOCK CSS STYLES (Blanks output if printed or screen-dumped) ═══ */}
      <style jsx global>{`
        @media print {
          body {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>

      {/* ═══ TOP FULL-WIDTH HEADER BAR ═══ */}
      <header
        className={`sticky top-0 z-40 px-4 sm:px-8 py-3 flex flex-col gap-2.5 shadow-xs border-b transition-colors duration-300 ${
          isDarkMode
            ? "bg-[#131B2A] border-gray-800 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        {/* ROW 1: FULL PDF HEADING IN TOP LINE */}
        <div className="w-full flex items-center justify-between gap-3 border-b border-gray-200/50 dark:border-gray-800 pb-2">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <BookOpen className="w-5 h-5 text-[#016737] shrink-0" />
            <h1 className="text-base sm:text-lg md:text-xl font-black text-[#016737] dark:text-[#8BC43F] leading-tight font-sans tracking-tight">
              {title}
            </h1>
          </div>

          <span className="bg-[#8BC43F]/20 text-[#016737] dark:text-[#8BC43F] border border-[#8BC43F]/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
            🔒 DRM Protected
          </span>
        </div>

        {/* ROW 2: CONTROLS & NAVIGATION */}
        <div className="w-full flex items-center justify-between gap-3 flex-wrap">
          {/* Left: Close Button & Subject */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.close()}
              className="px-3.5 py-1.5 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-xs"
              title="Close Reader"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Close Reader</span>
            </button>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {subject}
            </span>
          </div>

          {/* Right: Page Selector, Theme & Zoom */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Pages Indicator - 100% Theme Synced */}
            <div
              className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                isDarkMode
                  ? "bg-[#1E293B] border-gray-700 text-gray-200"
                  : "bg-gray-100 border-gray-200 text-gray-800"
              }`}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-1 rounded disabled:opacity-30 transition-colors ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2 font-mono">
                Page {currentPage} / {pagesCount}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(pagesCount, p + 1))}
                disabled={currentPage === pagesCount}
                className={`p-1 rounded disabled:opacity-30 transition-colors ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border transition-colors ${
                isDarkMode
                  ? "bg-[#1E293B] border-gray-700 text-amber-400 hover:bg-gray-800"
                  : "bg-gray-100 border-gray-200 text-[#016737] hover:bg-gray-200"
              }`}
              title="Toggle Light/Dark Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Zoom Controls */}
            <div
              className={`flex items-center gap-1 border rounded-xl p-1 font-mono font-bold text-xs transition-colors ${
                isDarkMode
                  ? "bg-[#1E293B] border-gray-700 text-gray-200"
                  : "bg-gray-100 border-gray-200 text-gray-800"
              }`}
            >
              <button
                onClick={() => setZoom((z) => Math.max(80, z - 10))}
                className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(140, z + 10))}
                className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ INSTANT SCREENSHOT / RECORDING BLACKOUT SHIELD ═══ */}
      {isProtected && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-[#8BC43F]">
            <EyeOff className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Security Shield Active</h2>
          <p className="text-xs text-gray-400 max-w-sm mb-4">
            Screen capture, screenshot shortcuts, or window focus loss detected. Document content is hidden for copyright protection.
          </p>
          <div className="px-4 py-2 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-[#8BC43F] text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Click anywhere on this tab to resume reading</span>
          </div>
        </div>
      )}

      {/* ═══ MAIN DOCUMENT VIEWER CANVAS ═══ */}
      <main
        ref={readerRef}
        className="flex-1 p-4 sm:p-8 flex justify-center items-start relative overflow-y-auto"
      >
        {/* Sleek Watermark Overlay */}
        <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.035] overflow-hidden flex flex-wrap justify-around p-12 select-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="text-xs sm:text-sm font-black font-sans tracking-widest text-[#016737] rotate-[-30deg] m-16 uppercase whitespace-nowrap"
            >
              Bio Vriksha Official Reader • Copyright Protected
            </div>
          ))}
        </div>

        {/* ═══ ELEGANT HIGH-QUALITY PDF PAPER ═══ */}
        <div
          className={`w-full max-w-4xl rounded-2xl shadow-xl p-6 sm:p-12 transition-all duration-300 relative border ${
            isDarkMode
              ? "bg-[#131B2A] border-gray-800 text-gray-100 shadow-emerald-950/20"
              : "bg-white border-gray-200 text-gray-900 shadow-gray-200/80"
          }`}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          {/* Header Bar inside Paper */}
          <div className="flex items-center justify-between border-b border-gray-200/40 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#016737]" />
              <span className="font-extrabold text-sm text-[#016737]">Bio Vriksha Official Study Notes</span>
            </div>
            <span className="text-xs font-bold text-gray-400">Page {currentPage} of {pagesCount}</span>
          </div>

          {/* Chapter Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#016737]/10 text-[#016737] text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#8BC43F]" />
              <span>{subject}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-[#016737] dark:text-[#8BC43F]">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              NEET / Board High-Yield Summary • Fully NCERT Aligned
            </p>
          </div>

          {/* Beautiful Document Content */}
          <div className="space-y-6 text-sm leading-relaxed">
            {/* High-Yield Alert Box */}
            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-[#016737] font-medium text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#016737] shrink-0" />
              <span>NCERT Exam Priority: Chapter key concepts &amp; diagrammatic flowcharts carefully structured for quick revision.</span>
            </div>

            {/* Concept Section 1 */}
            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#016737] border-b border-emerald-100/60 pb-1.5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#016737] text-white text-xs flex items-center justify-center font-bold">1</span>
                <span>Core Biological Principles</span>
              </h3>
              <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                Biological organization exhibits structural hierarchy ranging from sub-atomic particles to complex biomes. Cellular metabolism is governed by enzymatic kinetics and precise genetic regulation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-[#1C2638] border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <h4 className="font-bold text-xs text-[#016737] mb-1">Mendelian Genetics Ratio</h4>
                  <p className="text-xs text-gray-500 mb-2">Monohybrid phenotypic ratio 3:1, Genotypic ratio 1:2:1.</p>
                  <span className="inline-block text-[11px] font-mono font-bold bg-[#016737]/10 text-[#016737] px-2 py-0.5 rounded">
                    Dihybrid = 9 : 3 : 3 : 1
                  </span>
                </div>

                <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-[#1C2638] border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <h4 className="font-bold text-xs text-[#016737] mb-1">Cell Cycle Checkpoints</h4>
                  <p className="text-xs text-gray-500 mb-2">G₁/S transition is the primary restriction point controlled by Cyclin D-CDK4.</p>
                  <span className="inline-block text-[11px] font-mono font-bold bg-[#016737]/10 text-[#016737] px-2 py-0.5 rounded">
                    G₁ → S → G₂ → M
                  </span>
                </div>
              </div>
            </section>

            {/* Concept Section 2 */}
            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#016737] border-b border-emerald-100/60 pb-1.5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#016737] text-white text-xs flex items-center justify-center font-bold">2</span>
                <span>Important Exam Diagrams &amp; Flowcharts</span>
              </h3>

              <div className={`p-5 rounded-xl border flex flex-col items-center justify-center text-center ${isDarkMode ? "bg-[#1C2638] border-gray-700" : "bg-emerald-50/40 border-emerald-200/60"}`}>
                <div className="w-14 h-14 rounded-2xl bg-[#016737]/15 flex items-center justify-center text-[#016737] mb-3">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1">NCERT Figure 8.4 — Ultra-Structure of Plant Cell</h4>
                <p className="text-xs text-gray-500 max-w-md">
                  Demonstrates Chloroplast thylakoid stacking (Grana), Plasmodesmata cell wall junctions, and Central Vacuole membrane (Tonoplast).
                </p>
              </div>
            </section>

            {/* Concept Section 3 */}
            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#016737] border-b border-emerald-100/60 pb-1.5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#016737] text-white text-xs flex items-center justify-center font-bold">3</span>
                <span>High-Yield Revision Points</span>
              </h3>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-[#016737] font-bold">•</span>
                  <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                    <strong className="text-[#016737]">RuBisCO:</strong> Most abundant enzyme on Earth. Possesses both oxygenase and carboxylase activity.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#016737] font-bold">•</span>
                  <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                    <strong className="text-[#016737]">C₄ Plants:</strong> Possess Kranz Anatomy. Avoid photorespiration and show higher temperature tolerance.
                  </span>
                </li>
              </ul>
            </section>
          </div>

          {/* Paper Footer */}
          <div className="mt-12 pt-4 border-t border-gray-200/40 flex items-center justify-between text-xs text-gray-400">
            <span>Bio Vriksha Digital Learning Platform</span>
            <span>Protected DRM • Student Edition</span>
          </div>
        </div>
      </main>

      {/* ═══ BOTTOM NAVIGATION BAR — 100% Theme Synced ═══ */}
      <footer
        className={`px-4 py-2.5 flex items-center justify-between shadow-xs sticky bottom-0 z-40 text-xs border-t transition-colors duration-300 ${
          isDarkMode
            ? "bg-[#131B2A] border-gray-800 text-gray-300"
            : "bg-white border-gray-200 text-gray-600"
        }`}
      >
        <span className="font-semibold">
          Bio Vriksha DRM Secure Reader
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3.5 py-1.5 rounded-lg bg-[#016737] text-white disabled:opacity-40 font-bold transition-colors shadow-xs"
          >
            ← Previous Page
          </button>
          <span className="font-mono font-bold text-[#016737] dark:text-[#8BC43F]">
            {currentPage} / {pagesCount}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(pagesCount, p + 1))}
            disabled={currentPage === pagesCount}
            className="px-3.5 py-1.5 rounded-lg bg-[#016737] text-white disabled:opacity-40 font-bold transition-colors shadow-xs"
          >
            Next Page →
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function SecureReaderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 text-gray-700 flex items-center justify-center text-sm font-semibold">
          Loading Secure Reader...
        </div>
      }
    >
      <SecureReaderContent />
    </Suspense>
  );
}
