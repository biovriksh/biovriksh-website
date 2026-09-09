"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Upload,
  Image as ImageIcon,
  Lock,
  Unlock,
  CheckCircle2,
  X,
  Trash2,
  Flame,
  Search,
  Pencil,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PDFNote, NoteType, ClassLevel } from "@/types/database";

export default function AdminPDFsPage() {
  const [pdfs, setPdfs] = useState<PDFNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSectionTab, setActiveSectionTab] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPdf, setEditingPdf] = useState<PDFNote | null>(null);

  // Form State
  const [targetSection, setTargetSection] = useState<NoteType>("paid"); // "paid" | "short"
  const [classLevel, setClassLevel] = useState<ClassLevel>("Class 12");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isRecent, setIsRecent] = useState(false);
  const [price, setPrice] = useState(49);
  const [pageCount, setPageCount] = useState(12);

  // Files State
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/manage-pdf");
      const json = await res.json();
      if (json.success && json.pdfs) {
        setPdfs(json.pdfs as any);
      }
    } catch (e) {
      console.error("Error fetching PDFs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenUploadModal = () => {
    setEditingPdf(null);
    setTitle("");
    setDescription("");
    setTargetSection("paid");
    setClassLevel("Class 12");
    setPrice(49);
    setPageCount(12);
    setIsRecent(false);
    setPdfFile(null);
    setThumbnailFile(null);
    setStatusMessage("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pdf: PDFNote) => {
    setEditingPdf(pdf);
    setTitle(pdf.title || "");
    setDescription(pdf.description || "");
    setTargetSection(pdf.note_type === "short" || pdf.is_free ? "short" : "paid");
    setClassLevel((pdf.class_level as ClassLevel) || "Class 12");
    setPrice(pdf.price || (pdf.is_free ? 0 : 49));
    setPageCount(pdf.page_count || 12);
    setIsRecent(pdf.is_recent || false);
    setPdfFile(null);
    setThumbnailFile(null);
    setStatusMessage("");
    setIsModalOpen(true);
  };

  // Upload or Update PDF Handler
  const handleSavePDF = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setStatusMessage("Preparing secure file upload...");

    try {
      let thumbnailUrl: string | undefined = undefined;
      let filePath: string | undefined = undefined;

      // 1. Upload Cover Image if new file selected
      if (thumbnailFile) {
        setStatusMessage("Uploading Cover Image...");
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
          const uploadRes = await fetch(urlJson.signedUrl, {
            method: "PUT",
            headers: { "Content-Type": thumbnailFile.type || "image/png" },
            body: thumbnailFile,
          });

          if (uploadRes.ok) {
            thumbnailUrl = urlJson.publicUrl;
          } else {
            console.warn("Thumbnail upload failed, status:", uploadRes.status);
          }
        }
      }

      // 2. Upload PDF Document if new file selected
      if (pdfFile) {
        setStatusMessage("Uploading PDF Document to Storage...");
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
          const uploadRes = await fetch(urlJson.signedUrl, {
            method: "PUT",
            headers: { "Content-Type": pdfFile.type || "application/pdf" },
            body: pdfFile,
          });

          if (uploadRes.ok) {
            filePath = urlJson.path;
          } else {
            console.warn("PDF upload failed, status:", uploadRes.status);
          }
        }
      }

      if (editingPdf) {
        // UPDATE EXISTING NOTE RECORD
        setStatusMessage("Updating Note Record in Database...");
        const res = await fetch("/api/admin/manage-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update",
            id: editingPdf.id,
            title,
            description,
            targetSection,
            classLevel,
            price: targetSection === "short" ? 0 : price,
            pageCount,
            isRecent,
            thumbnailUrl: thumbnailUrl || editingPdf.thumbnail_url,
            filePath: filePath || editingPdf.file_path,
          }),
        });

        const text = await res.text();
        let result: any = {};
        try {
          result = JSON.parse(text);
        } catch (parseErr) {
          throw new Error(text || "Server update error occurred");
        }

        if (!res.ok || !result.success) {
          throw new Error(result.error || "Failed to update note");
        }

        if (result.pdf) {
          setPdfs((prev) => prev.map((p) => (p.id === result.pdf.id ? result.pdf : p)));
          alert("PDF Note Updated Successfully!");
        }
      } else {
        // CREATE NEW NOTE RECORD
        if (!pdfFile && !filePath) {
          throw new Error("Please select a PDF document file to upload.");
        }

        setStatusMessage("Saving Note Record to Database...");
        const res = await fetch("/api/admin/upload-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            targetSection,
            classLevel,
            price: targetSection === "short" ? 0 : price,
            pageCount,
            isRecent,
            thumbnailUrl: thumbnailUrl || "/hero_premium_clean.png",
            filePath: filePath || `notes_${Date.now()}.pdf`,
          }),
        });

        const text = await res.text();
        let result: any = {};
        try {
          result = JSON.parse(text);
        } catch (parseErr) {
          throw new Error(text || "Server upload error occurred");
        }

        if (!res.ok || !result.success) {
          throw new Error(result.error || "Failed to upload note");
        }

        if (result.pdf) {
          setPdfs((prev) => [result.pdf, ...prev]);
          alert("PDF Note & Cover Image Uploaded Successfully!");
        }
      }

      // Reset Form & Close Modal
      setIsModalOpen(false);
      setEditingPdf(null);
      setTitle("");
      setDescription("");
      setPdfFile(null);
      setThumbnailFile(null);
      setIsRecent(false);
      setStatusMessage("");
    } catch (e: any) {
      console.error("Save failed:", e);
      setStatusMessage(`Error: ${e.message || "Failed to save note"}`);
      alert(`Save Failed: ${e.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Showcase in Recents / Trending Section
  const toggleRecentStatus = async (id: string, currentStatus: boolean) => {
    setPdfs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_recent: !currentStatus } : p))
    );
    try {
      await fetch("/api/admin/manage-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_recent", id, currentStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Active Visibility
  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    setPdfs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !currentStatus } : p))
    );
    try {
      await fetch("/api/admin/manage-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_active", id, currentStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Delete PDF Note
  const handleDeletePdf = async (id: string) => {
    if (!confirm("Are you sure you want to delete this PDF note?")) return;
    setPdfs((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch("/api/admin/manage-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered PDFs List according to Website Section Tabs
  const filteredPdfs = pdfs.filter((pdf) => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeSectionTab === "all") return true;
    if (activeSectionTab === "paid") return pdf.note_type === "paid" && !pdf.is_free;
    if (activeSectionTab === "short") return pdf.note_type === "short" || pdf.is_free;
    if (activeSectionTab === "recent") return pdf.is_recent === true;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* ═══ EXECUTIVE BANNER ═══ */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-[#016737]" />
            <span>Study Notes &amp; PDF Manager</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Upload, edit, manage Paid PDF Notes, Free Short Notes &amp; Mindmaps, and toggle Trending items.
          </p>
        </div>

        <button
          onClick={handleOpenUploadModal}
          className="px-4 py-2.5 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-[#016737]/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#8BC43F]" />
          <span>Upload New PDF Note</span>
        </button>
      </div>

      {/* ═══ WEBSITE SECTION NAVIGATION TABS ═══ */}
      <div className="bg-white border border-slate-200 p-2 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1">
          {[
            { id: "all", label: "All Study Notes", icon: FileText, count: pdfs.length },
            {
              id: "paid",
              label: "Paid PDF Notes Section",
              icon: Lock,
              count: pdfs.filter((p) => p.note_type === "paid" && !p.is_free).length,
            },
            {
              id: "short",
              label: "Free Short Notes Section",
              icon: Unlock,
              count: pdfs.filter((p) => p.note_type === "short" || p.is_free).length,
            },
            {
              id: "recent",
              label: "Recently Uploaded & Trending",
              icon: Flame,
              count: pdfs.filter((p) => p.is_recent).length,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSectionTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSectionTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#016737] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md font-mono text-[10px] ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-60 px-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search note by title..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
          />
        </div>
      </div>

      {/* ═══ PDF NOTES GRID ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPdfs.length > 0 ? (
          filteredPdfs.map((pdf) => (
            <div
              key={pdf.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative h-36 bg-slate-100 border-b border-slate-100 overflow-hidden">
                  <img
                    src={pdf.thumbnail_url || "/hero_biology_ultra_wow.png"}
                    alt={pdf.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Section Target Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {pdf.is_free ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] shadow-xs">
                        Free Short Note
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-mono font-bold text-[10px] shadow-xs">
                        Paid Note ₹{pdf.price}
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-md bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-bold">
                      {pdf.class_level || "Class 12"}
                    </span>
                  </div>

                  {/* Trending Badge Indicator */}
                  {pdf.is_recent && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-rose-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs animate-pulse">
                      <Flame className="w-3 h-3 fill-white" />
                      <span>Recent / Trending</span>
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                    {pdf.title}
                  </h3>

                  {pdf.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {pdf.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Controls Footer */}
              <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                {/* Recent / Trending Button */}
                <button
                  onClick={() => toggleRecentStatus(pdf.id, pdf.is_recent)}
                  className={`px-2 py-1 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 border cursor-pointer ${
                    pdf.is_recent
                      ? "bg-rose-500 text-white border-rose-600 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600"
                  }`}
                  title={pdf.is_recent ? "Remove from Recent/Trending" : "Feature in Recent/Trending on Homepage"}
                >
                  <Flame className={`w-3 h-3 ${pdf.is_recent ? "fill-white" : ""}`} />
                  <span>{pdf.is_recent ? "Trending" : "+ Trending"}</span>
                </button>

                <div className="flex items-center gap-1">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEditModal(pdf)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-[#016737] hover:bg-[#016737]/10 transition-colors border border-slate-200 bg-white cursor-pointer"
                    title="Edit Note Details / Replace File"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  {/* Active Toggle */}
                  <button
                    onClick={() => toggleActiveStatus(pdf.id, pdf.is_active)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      pdf.is_active
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {pdf.is_active ? "Published" : "Hidden"}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeletePdf(pdf.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-2">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No PDF Notes Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No notes uploaded in this section tab yet. Click &quot;Upload New PDF Note&quot; to add notes directly to your website.
            </p>
          </div>
        )}
      </div>

      {/* ═══ UPLOAD & EDIT MODAL ═══ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#016737] bg-[#016737]/10 px-2.5 py-0.5 rounded-md uppercase font-mono">
                  {editingPdf ? "Edit Note Record" : "Website Upload Manager"}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-[#016737]" />
                  <span>{editingPdf ? `Edit Note: ${editingPdf.title}` : "Upload PDF Study Note"}</span>
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form id="pdf-upload-form" onSubmit={handleSavePDF} className="flex-1 overflow-y-auto py-5 space-y-5">
              {/* STEP 1: Choose Target Website Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  1. Target Website Section
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Paid Section Card */}
                  <button
                    type="button"
                    onClick={() => setTargetSection("paid")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      targetSection === "paid"
                        ? "border-[#016737] bg-[#016737]/5 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Lock className="w-4 h-4 text-amber-600" />
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.2 rounded font-mono">
                        PAID
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900">Paid PDF Notes Section</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Premium unlocked notes for ₹49, ₹99 etc.
                    </p>
                  </button>

                  {/* Free Short Notes Card */}
                  <button
                    type="button"
                    onClick={() => setTargetSection("short")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      targetSection === "short"
                        ? "border-[#016737] bg-[#016737]/5 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Unlock className="w-4 h-4 text-emerald-600" />
                      <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.2 rounded">
                        100% FREE
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900">Free Short Notes Section</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Free revision mindmaps for all students.
                    </p>
                  </button>
                </div>
              </div>

              {/* STEP 2: General Information */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  2. Note Title &amp; Details
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Note Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Class 12 Genetics High Yield Revision Note"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description (Short Summary)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Key concepts covered in this PDF note..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Class Level
                    </label>
                    <select
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value as ClassLevel)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
                    >
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                      <option value="NEET Special">NEET Special</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      disabled={targetSection === "short"}
                      value={targetSection === "short" ? 0 : price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-bold font-mono focus:outline-none focus:border-[#016737] disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Page Count
                    </label>
                    <input
                      type="number"
                      value={pageCount}
                      onChange={(e) => setPageCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
                    />
                  </div>
                </div>

                {/* Showcase in Homepage Trending Toggle */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                      <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Feature in Homepage Recent / Trending Section?
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Shows this note in the &quot;Recently Uploaded &amp; Trending Notes&quot; section on the homepage.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsRecent(!isRecent)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 cursor-pointer ${
                      isRecent ? "bg-rose-500" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        isRecent ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* STEP 3: File Upload Zones */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  3. Select Files (PDF Document &amp; Cover Image)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* PDF Upload File Zone */}
                  <div className="bg-slate-50 border-2 border-dashed border-slate-300 p-4 rounded-xl text-center space-y-2 hover:border-[#016737] transition-all">
                    <Upload className="w-6 h-6 text-[#016737] mx-auto" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block truncate">
                        {pdfFile
                          ? pdfFile.name
                          : editingPdf
                          ? "Replace PDF File (Optional)"
                          : "Choose PDF Document"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {pdfFile
                          ? `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB`
                          : editingPdf
                          ? "Leave blank to keep existing PDF"
                          : ".pdf files up to 50MB"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      required={!editingPdf}
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#016737] file:text-white hover:file:bg-[#014d29] cursor-pointer"
                    />
                  </div>

                  {/* Cover Image Upload Zone */}
                  <div className="bg-slate-50 border-2 border-dashed border-slate-300 p-4 rounded-xl text-center space-y-2 hover:border-[#016737] transition-all">
                    <ImageIcon className="w-6 h-6 text-slate-400 mx-auto" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block truncate">
                        {thumbnailFile
                          ? thumbnailFile.name
                          : editingPdf
                          ? "Replace Thumbnail Image (Optional)"
                          : "Cover Thumbnail Image"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {thumbnailFile
                          ? `${(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB`
                          : "Leave blank to keep existing cover"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              {statusMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-xl border border-emerald-200">
                  {statusMessage}
                </div>
              )}
            </form>

            {/* Modal Controls Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                Changes will reflect live on website instantly.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="pdf-upload-form"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs font-bold transition-all shadow-md shadow-[#016737]/20 disabled:opacity-50 cursor-pointer"
                >
                  {editingPdf ? "Save & Update Note" : "Publish PDF Note"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

