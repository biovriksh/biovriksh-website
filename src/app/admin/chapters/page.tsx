"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderTree,
  Plus,
  Search,
  FileText,
  Upload,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  X,
  Trash2,
  Pencil,
  Eye,
  Flame,
  Layers,
  Dna,
  Atom,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Loader2,
  FilePlus2,
} from "lucide-react";
import { Chapter, PDFNote, ClassLevel, SubjectType } from "@/types/database";

export default function AdminChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<"ALL" | "Biology" | "Physics" | "Chemistry">("ALL");
  const [selectedClassFilter, setSelectedClassFilter] = useState<"ALL" | "Class 11" | "Class 12">("ALL");

  // Chapter Modal State
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [chapterName, setChapterName] = useState("");
  const [chapterSubject, setChapterSubject] = useState<SubjectType>("Biology");
  const [chapterClass, setChapterClass] = useState<ClassLevel>("Class 12");
  const [chapterOrder, setChapterOrder] = useState(1);

  // Add PDF to Chapter Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [targetChapterForPdf, setTargetChapterForPdf] = useState<Chapter | null>(null);
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfSubHeading, setPdfSubHeading] = useState("");
  const [pdfPageCount, setPdfPageCount] = useState(14);
  const [pdfIsFree, setPdfIsFree] = useState(true);
  const [pdfPrice, setPdfPrice] = useState(49);
  const [pdfIsRecent, setPdfIsRecent] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // Expanded chapter cards (accordion style or always open)
  const [collapsedChapterIds, setCollapsedChapterIds] = useState<Record<string, boolean>>({});

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/manage-chapter");
      const json = await res.json();
      if (json.success && json.chapters) {
        setChapters(json.chapters);
      }
    } catch (e) {
      console.error("Error fetching chapters:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const toggleChapterCollapse = (id: string) => {
    setCollapsedChapterIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ═══ CHAPTER MANAGEMENT ═══
  const handleOpenNewChapterModal = () => {
    setEditingChapter(null);
    setChapterName("");
    setChapterSubject(selectedSubjectFilter !== "ALL" ? selectedSubjectFilter : "Biology");
    setChapterClass("Class 12");
    setChapterOrder(chapters.length + 1);
    setIsChapterModalOpen(true);
  };

  const handleOpenEditChapterModal = (ch: Chapter) => {
    setEditingChapter(ch);
    setChapterName(ch.name);
    setChapterSubject((ch.subject as SubjectType) || "Biology");
    setChapterClass((ch.class_level as ClassLevel) || "Class 12");
    setChapterOrder(ch.order_index || 1);
    setIsChapterModalOpen(true);
  };

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterName.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/manage-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_chapter",
          editingChapterId: editingChapter?.id || null,
          name: chapterName.trim(),
          subject: chapterSubject,
          classLevel: chapterClass,
          orderIndex: chapterOrder,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsChapterModalOpen(false);
        fetchChapters();
      } else {
        alert("Failed to save chapter: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleChapterStatus = async (id: string, currentStatus: boolean) => {
    setChapters((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, is_active: !currentStatus } : ch))
    );
    try {
      await fetch("/api/admin/manage-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_active", id, currentStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const deleteChapter = async (id: string) => {
    if (!confirm("Are you sure you want to delete this chapter? Attached PDFs will be detached safely.")) return;
    setChapters((prev) => prev.filter((ch) => ch.id !== id));
    try {
      await fetch("/api/admin/manage-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_chapter", id }),
      });
      fetchChapters();
    } catch (e) {
      console.error(e);
    }
  };

  // ═══ DEDICATED CHAPTER PDF MANAGEMENT ═══
  const handleOpenAddPdfModal = (ch: Chapter) => {
    setTargetChapterForPdf(ch);
    setPdfTitle("");
    setPdfSubHeading("Part 1: Key Concepts & Theory");
    setPdfPageCount(14);
    setPdfIsFree(true);
    setPdfPrice(49);
    setPdfIsRecent(false);
    setPdfFile(null);
    setThumbnailFile(null);
    setStatusMessage("");
    setIsPdfModalOpen(true);
  };

  const handleSavePdfToChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetChapterForPdf || !pdfTitle.trim()) {
      alert("Please provide a title for the chapter PDF.");
      return;
    }

    setLoading(true);
    setStatusMessage("Uploading files and attaching PDF to chapter...");

    try {
      let thumbnailUrl = "/hero_premium_clean.png";
      let filePath = "";

      // 1. Upload thumbnail if selected
      if (thumbnailFile) {
        setStatusMessage("Uploading Cover Thumbnail...");
        const urlRes = await fetch("/api/admin/create-upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: thumbnailFile.name,
            bucket: "pdf-thumbnails",
          }),
        });
        const urlJson = await urlRes.json();
        if (urlJson.success && urlJson.signedUrl) {
          await fetch(urlJson.signedUrl, {
            method: "PUT",
            headers: { "Content-Type": thumbnailFile.type || "image/png" },
            body: thumbnailFile,
          });
          thumbnailUrl = urlJson.publicUrl;
        }
      }

      // 2. Upload PDF file
      if (pdfFile) {
        setStatusMessage("Uploading PDF Document...");
        const urlRes = await fetch("/api/admin/create-upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: pdfFile.name,
            bucket: "pdf-files",
          }),
        });
        const urlJson = await urlRes.json();
        if (urlJson.success && urlJson.signedUrl) {
          await fetch(urlJson.signedUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/pdf" },
            body: pdfFile,
          });
          filePath = urlJson.filePath;
        }
      }

      // 3. Save into PDFs table with chapter_id attached!
      setStatusMessage("Attaching PDF to Chapter...");
      const res = await fetch("/api/admin/upload-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId: targetChapterForPdf.id,
          subHeading: pdfSubHeading.trim() || targetChapterForPdf.name,
          title: pdfTitle.trim(),
          description: `${pdfTitle.trim()} — Complete chapter study notes and NCERT bullet points.`,
          noteType: "chapter",
          subject: targetChapterForPdf.subject || "Biology",
          classLevel: targetChapterForPdf.class_level || "Class 12",
          pageCount: Number(pdfPageCount || 14),
          price: pdfIsFree ? 0 : Number(pdfPrice || 49),
          isRecent: pdfIsRecent,
          thumbnailUrl,
          filePath: filePath || `chapter_note_${Date.now()}.pdf`,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsPdfModalOpen(false);
        fetchChapters();
      } else {
        alert("Failed to attach PDF: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
      setStatusMessage("");
    }
  };

  const removePdfFromChapter = async (pdfId: string) => {
    if (!confirm("Remove this PDF from this chapter?")) return;
    try {
      await fetch("/api/admin/manage-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove_pdf", pdfId }),
      });
      fetchChapters();
    } catch (e) {
      console.error(e);
    }
  };

  const deletePdf = async (pdfId: string) => {
    if (!confirm("Permanently delete this PDF document? This cannot be undone.")) return;
    try {
      await fetch("/api/admin/manage-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_pdf", pdfId }),
      });
      fetchChapters();
    } catch (e) {
      console.error(e);
    }
  };

  const togglePdfRecent = async (pdfId: string, currentStatus: boolean) => {
    try {
      await fetch("/api/admin/manage-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_pdf_recent", id: pdfId, currentStatus }),
      });
      fetchChapters();
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered Chapters
  const filteredChapters = chapters.filter((ch) => {
    if (selectedSubjectFilter !== "ALL" && ch.subject !== selectedSubjectFilter) return false;
    if (selectedClassFilter !== "ALL" && ch.class_level !== selectedClassFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ch.name.toLowerCase().includes(q);
      const matchPdf = ch.pdfs?.some((p) => p.title.toLowerCase().includes(q) || (p.sub_heading && p.sub_heading.toLowerCase().includes(q)));
      if (!matchName && !matchPdf) return false;
    }
    return true;
  });

  const bioCount = chapters.filter((ch) => ch.subject === "Biology").length;
  const phyCount = chapters.filter((ch) => ch.subject === "Physics").length;
  const chemCount = chapters.filter((ch) => ch.subject === "Chemistry").length;

  return (
    <div className="space-y-6">
      {/* ═══ EXECUTIVE HEADER BANNER ═══ */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-[#016737]" />
              <span>Chapters &amp; Chapter PDFs Manager</span>
            </h1>
            <span className="text-[10px] font-bold text-[#016737] bg-[#016737]/10 px-2 py-0.5 rounded-md border border-[#016737]/20 uppercase">
              Curriculum Core
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Organize chapters by Subject and Class, and directly add or manage PDF study notes for each chapter.
          </p>
        </div>

        <button
          onClick={handleOpenNewChapterModal}
          className="px-4 py-2 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#8BC43F]" />
          <span>Add New Chapter</span>
        </button>
      </div>

      {/* ═══ SUBJECT COUNTERS & FILTERS ═══ */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Subject Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedSubjectFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedSubjectFilter === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>All Subjects</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {chapters.length}
              </span>
            </button>

            <button
              onClick={() => setSelectedSubjectFilter("Biology")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedSubjectFilter === "Biology"
                  ? "bg-[#016737] text-white"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              <Dna className="w-3.5 h-3.5" />
              <span>Biology</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-200/50">
                {bioCount}
              </span>
            </button>

            <button
              onClick={() => setSelectedSubjectFilter("Physics")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedSubjectFilter === "Physics"
                  ? "bg-violet-700 text-white"
                  : "bg-violet-50 text-violet-800 hover:bg-violet-100 border border-violet-200"
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Physics</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-violet-200/50">
                {phyCount}
              </span>
            </button>

            <button
              onClick={() => setSelectedSubjectFilter("Chemistry")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedSubjectFilter === "Chemistry"
                  ? "bg-sky-700 text-white"
                  : "bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Chemistry</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-200/50">
                {chemCount}
              </span>
            </button>
          </div>

          {/* Class Filters */}
          <div className="flex items-center gap-1.5">
            {(["ALL", "Class 11", "Class 12"] as const).map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClassFilter(cls)}
                className={`px-2.5 py-1.2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedClassFilter === cls
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters or attached PDF titles..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
          />
        </div>
      </div>

      {/* ═══ CHAPTERS LIST ═══ */}
      {loading && chapters.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#016737] mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-500">Loading chapters from Supabase...</p>
        </div>
      ) : filteredChapters.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <FolderTree className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No Chapters Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedSubjectFilter !== "ALL" || selectedClassFilter !== "ALL"
              ? "No chapters match your search filter."
              : "Create your first chapter to start organizing study PDFs."}
          </p>
          <button
            onClick={handleOpenNewChapterModal}
            className="mt-4 px-4 py-2 rounded-xl bg-[#016737] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Chapter</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredChapters.map((chapter) => {
            const isCollapsed = collapsedChapterIds[chapter.id];
            const pdfsCount = chapter.pdfs?.length || 0;

            const subjectBadge =
              chapter.subject === "Biology"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : chapter.subject === "Physics"
                ? "bg-violet-50 text-violet-800 border-violet-200"
                : "bg-sky-50 text-sky-800 border-sky-200";

            return (
              <div
                key={chapter.id}
                className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs hover:border-slate-300 transition"
              >
                {/* ═══ CHAPTER HEADER ROW ═══ */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <button
                      onClick={() => toggleChapterCollapse(chapter.id)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer transition mt-0.5 sm:mt-0"
                    >
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${subjectBadge}`}>
                          {chapter.subject || "Biology"}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {chapter.class_level || "Class 12"}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200">
                          Order #{chapter.order_index}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#016737] border border-emerald-200">
                          {pdfsCount} {pdfsCount === 1 ? "PDF Note" : "PDF Notes"}
                        </span>
                      </div>

                      <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                        {chapter.name}
                      </h2>
                    </div>
                  </div>

                  {/* Chapter Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {/* Add PDF to Chapter button */}
                    <button
                      onClick={() => handleOpenAddPdfModal(chapter)}
                      className="px-3 py-1.5 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <FilePlus2 className="w-3.5 h-3.5 text-[#8BC43F]" />
                      <span>Add PDF to Chapter</span>
                    </button>

                    {/* Edit Chapter */}
                    <button
                      onClick={() => handleOpenEditChapterModal(chapter)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    {/* Active toggle */}
                    <button
                      onClick={() => toggleChapterStatus(chapter.id, Boolean(chapter.is_active))}
                      title={chapter.is_active ? "Make Inactive" : "Make Active"}
                      className={`p-1.5 rounded-xl text-xs transition cursor-pointer ${
                        chapter.is_active
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {chapter.is_active ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    </button>

                    {/* Delete Chapter */}
                    <button
                      onClick={() => deleteChapter(chapter.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ═══ CHAPTER ATTACHED PDFS (ACCORDION BODY) ═══ */}
                {!isCollapsed && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    {pdfsCount === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
                        <FileText className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                        <p className="text-xs font-medium text-slate-500">
                          No PDF notes attached to this chapter yet.
                        </p>
                        <button
                          onClick={() => handleOpenAddPdfModal(chapter)}
                          className="mt-2 text-xs font-bold text-[#016737] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Upload first PDF for this chapter</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Attached Study Notes ({pdfsCount})
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {chapter.pdfs?.map((pdf) => (
                            <div
                              key={pdf.id}
                              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-xs transition flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1.5">
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                                    {pdf.sub_heading || "Chapter Note"}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {pdf.is_recent && (
                                      <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-0.5">
                                        <Flame className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                        <span>Trend</span>
                                      </span>
                                    )}
                                    <span
                                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                        pdf.is_free
                                          ? "bg-emerald-100 text-emerald-800"
                                          : "bg-blue-100 text-blue-800"
                                      }`}
                                    >
                                      {pdf.is_free ? "FREE" : `₹${pdf.price || 49}`}
                                    </span>
                                  </div>
                                </div>

                                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                                  {pdf.title}
                                </h4>

                                <div className="mt-1 text-[10px] text-slate-500 font-medium">
                                  {pdf.page_count || 14} Pages • {pdf.class_level || "Class 12"}
                                </div>
                              </div>

                              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                                <Link
                                  href={`/secure-reader?pdfId=${encodeURIComponent(pdf.id)}`}
                                  target="_blank"
                                  className="text-[10px] font-bold text-[#016737] hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-2.5 h-2.5" />
                                  <span>Reader</span>
                                </Link>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => togglePdfRecent(pdf.id, Boolean(pdf.is_recent))}
                                    title={pdf.is_recent ? "Remove Trending" : "Mark Trending"}
                                    className={`p-1 rounded text-[10px] transition cursor-pointer ${
                                      pdf.is_recent
                                        ? "text-amber-600 bg-amber-50"
                                        : "text-slate-400 hover:text-amber-600"
                                    }`}
                                  >
                                    <Flame className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => removePdfFromChapter(pdf.id)}
                                    title="Detach from Chapter"
                                    className="p-1 rounded text-[10px] text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => deletePdf(pdf.id)}
                                    title="Delete PDF permanently"
                                    className="p-1 rounded text-[10px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ CREATE / EDIT CHAPTER MODAL ═══ */}
      {isChapterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#016737]" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingChapter ? "Edit Chapter" : "Create New Chapter"}
                </h3>
              </div>
              <button
                onClick={() => setIsChapterModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveChapter} className="space-y-4 mt-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block mb-1 font-bold text-slate-700">Chapter Name</label>
                <input
                  type="text"
                  required
                  value={chapterName}
                  onChange={(e) => setChapterName(e.target.value)}
                  placeholder="e.g. Molecular Basis of Inheritance"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#016737]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-slate-700">Subject</label>
                  <select
                    value={chapterSubject}
                    onChange={(e) => setChapterSubject(e.target.value as SubjectType)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#016737]"
                  >
                    <option value="Biology">Biology</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-700">Class Level</label>
                  <select
                    value={chapterClass}
                    onChange={(e) => setChapterClass(e.target.value as ClassLevel)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#016737]"
                  >
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                    <option value="NEET Special">NEET Special</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-700">Order Index (Sort)</label>
                <input
                  type="number"
                  min="1"
                  value={chapterOrder}
                  onChange={(e) => setChapterOrder(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#016737]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsChapterModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white font-bold cursor-pointer shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingChapter ? "Update Chapter" : "Create Chapter"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ ADD PDF DIRECTLY TO CHAPTER MODAL ═══ */}
      {isPdfModalOpen && targetChapterForPdf && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FilePlus2 className="w-5 h-5 text-[#016737]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add PDF Note to Chapter</h3>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    Target: {targetChapterForPdf.name} ({targetChapterForPdf.subject})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePdfToChapter} className="space-y-4 mt-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block mb-1 font-bold text-slate-700">PDF Title</label>
                <input
                  type="text"
                  required
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  placeholder="e.g. Complete Theory, Formulas & Key Diagrams"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#016737]"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-700">Sub-Topic / Section Title</label>
                <input
                  type="text"
                  value={pdfSubHeading}
                  onChange={(e) => setPdfSubHeading(e.target.value)}
                  placeholder="e.g. Part 1: Gametogenesis & Fertilization"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#016737]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-slate-700">Page Count</label>
                  <input
                    type="number"
                    min="1"
                    value={pdfPageCount}
                    onChange={(e) => setPdfPageCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#016737]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-700">Subject &amp; Class</label>
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold border border-slate-200">
                    {targetChapterForPdf.subject} • {targetChapterForPdf.class_level}
                  </div>
                </div>
              </div>

              {/* Free vs Paid */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block mb-1 font-bold text-slate-700">Access Mode</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={pdfIsFree}
                        onChange={() => setPdfIsFree(true)}
                        name="ch_pdf_access"
                      />
                      <span className="font-semibold text-emerald-700">FREE</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={!pdfIsFree}
                        onChange={() => setPdfIsFree(false)}
                        name="ch_pdf_access"
                      />
                      <span className="font-semibold text-blue-700">PAID</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-700">Price (₹ INR)</label>
                  <input
                    type="number"
                    disabled={pdfIsFree}
                    min="0"
                    value={pdfIsFree ? 0 : pdfPrice}
                    onChange={(e) => setPdfPrice(Number(e.target.value))}
                    className={`w-full p-2 rounded-lg border border-slate-200 ${
                      pdfIsFree ? "bg-slate-200 text-slate-400" : "bg-white text-slate-900"
                    }`}
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-slate-700">Upload PDF (.pdf)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#016737]/10 file:text-[#016737] hover:file:bg-[#016737]/20 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-700">Cover Thumbnail (.png/.jpg)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer"
                  />
                </div>
              </div>

              {/* Trending toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="ch_pdf_trending"
                  checked={pdfIsRecent}
                  onChange={(e) => setPdfIsRecent(e.target.checked)}
                  className="rounded border-slate-300 text-[#016737] focus:ring-[#016737]"
                />
                <label htmlFor="ch_pdf_trending" className="font-semibold text-slate-700 cursor-pointer">
                  Feature this PDF in Trending / Recent Showcase
                </label>
              </div>

              {statusMessage && (
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white font-bold cursor-pointer shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save PDF to Chapter</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
