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
  Sun,
  Moon,
  Sparkles,
  Lock,
} from "lucide-react";
import { useCheckout } from "@/hooks/useCheckout";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import AuthModal from "@/components/AuthModal";

function SecureReaderContent() {
  const searchParams = useSearchParams();
  const pdfId = searchParams.get("pdfId") || searchParams.get("id");
  const titleParam = searchParams.get("title") || "Bio Vriksh Study Note";
  const subjectParam = searchParams.get("subject") || "NEET Biology Series";
  const pagesCountParam = parseInt(searchParams.get("pages") || "1", 10) || 1;

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState<boolean>(true);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfMeta, setPdfMeta] = useState<any>(null);

  const [zoom, setZoom] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const readerRef = useRef<HTMLDivElement>(null);

  const { handleCheckout, loading: checkoutLoading } = useCheckout();
  const { user } = useStudentAuth();

  // 1. Fetch live signed PDF URL from Supabase storage
  const fetchPdf = async () => {
    if (!pdfId) {
      setLoadingPdf(false);
      setPdfError("No note selected. Please select a note from the Bio Vriksh website.");
      return;
    }

    try {
      setLoadingPdf(true);
      setPdfError(null);

      const res = await fetch(`/api/pdf-url?pdfId=${encodeURIComponent(pdfId)}`);
      const json = await res.json();

      if (res.ok && json.signedUrl) {
        setPdfUrl(json.signedUrl);
        setPdfMeta(json);
      } else {
        setPdfError(json.error || "Unable to open PDF document.");
        if (json.price !== undefined || json.title) {
          setPdfMeta(json);
        }
      }
    } catch (err: any) {
      setPdfError("Network error while connecting to secure PDF server.");
    } finally {
      setLoadingPdf(false);
    }
  };

  useEffect(() => {
    fetchPdf();
  }, [pdfId]);

  // 2. Direct Razorpay Checkout handler for this specific PDF note
  const onUnlockClick = () => {
    if (!pdfId) return;
    handleCheckout({
      pdfId: pdfId,
      onLoginRequired: () => setAuthModalOpen(true),
      onSuccess: () => {
        // Payment successful! Immediately reload signed URL to display unlocked PDF
        fetchPdf();
      },
    });
  };

  // 3. DRM Security Protections (Screenshot blackout, Right click disable, Print lock)
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handleDrag = (e: DragEvent) => e.preventDefault();
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCopy);
    document.addEventListener("dragstart", handleDrag);

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

  const displayTitle = pdfMeta?.title || titleParam;
  const displaySubject = pdfMeta?.sub_heading || pdfMeta?.class_level || subjectParam;

  return (
    <div
      className={`min-h-screen flex flex-col select-none relative overflow-x-hidden font-sans transition-colors duration-300 ${
        isDarkMode ? "bg-[#0B0F17] text-gray-100" : "bg-[#F4F5F7] text-gray-900"
      }`}
    >
      {/* ═══ PRINT LOCK CSS STYLES ═══ */}
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
            <h1 className="text-base sm:text-lg md:text-xl font-black text-[#016737] dark:text-[#8BC43F] leading-tight font-sans tracking-tight truncate">
              {displayTitle}
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
              className="px-3.5 py-1.5 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-xs cursor-pointer"
              title="Close Reader"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Close Reader</span>
            </button>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {displaySubject}
            </span>
          </div>

          {/* Right: Theme & Zoom */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
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
        className="flex-1 p-4 sm:p-6 flex justify-center items-start relative overflow-y-auto"
      >
        {/* Sleek Watermark Overlay */}
        <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.035] overflow-hidden flex flex-wrap justify-around p-12 select-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="text-xs sm:text-sm font-black font-sans tracking-widest text-[#016737] rotate-[-30deg] m-16 uppercase whitespace-nowrap"
            >
              Bio Vriksh Official Reader • Copyright Protected
            </div>
          ))}
        </div>

        {/* DOCUMENT CONTAINER */}
        {loadingPdf ? (
          <div className="flex flex-col items-center justify-center my-auto py-24 gap-3">
            <div className="w-12 h-12 border-4 border-[#016737] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-black text-[#016737] dark:text-[#8BC43F]">
              Decrypting &amp; Loading Secure Note...
            </p>
            <p className="text-xs text-gray-500">Preparing DRM protected document viewer</p>
          </div>
        ) : pdfError ? (
          <div className="flex flex-col items-center justify-center my-auto max-w-md mx-auto text-center p-8 bg-white dark:bg-[#131B2A] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-600">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold mb-2 text-gray-900 dark:text-white">Note Access Locked</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {pdfError}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => window.close()}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs font-bold transition-all cursor-pointer text-gray-700 dark:text-gray-300"
              >
                Close Reader
              </button>
              <button
                onClick={onUnlockClick}
                disabled={checkoutLoading}
                className="flex-1 py-2.5 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8BC43F]" />
                <span>
                  {checkoutLoading
                    ? "Opening Razorpay..."
                    : pdfMeta?.price
                    ? `Unlock Note (₹${pdfMeta.price})`
                    : "Unlock Note"}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div
            className="w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800 relative bg-white"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
            }}
          >
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&view=FitH`}
              className="w-full h-[78vh] sm:h-[84vh] border-0"
              title={displayTitle}
            />
          </div>
        )}
      </main>

      {/* ═══ BOTTOM NAVIGATION BAR ═══ */}
      <footer
        className={`px-4 py-2.5 flex items-center justify-between shadow-xs sticky bottom-0 z-40 text-xs border-t transition-colors duration-300 ${
          isDarkMode
            ? "bg-[#131B2A] border-gray-800 text-gray-300"
            : "bg-white border-gray-200 text-gray-600"
        }`}
      >
        <span className="font-semibold">
          Bio Vriksh DRM Secure Reader
        </span>

        <span className="font-mono font-bold text-[#016737] dark:text-[#8BC43F]">
          {displayTitle}
        </span>
      </footer>

      {/* Student Auth Modal for Reader */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        customTitle="Student Login Required"
        customSubtitle="Please log in to your student account to unlock and view this note."
      />
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


