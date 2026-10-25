"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  Upload,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  X,
  Trash2,
  Pencil,
  FileText,
  ExternalLink,
  Flame,
  Layers,
  Dna,
  Atom,
  FlaskConical,
  HelpCircle,
  Eye,
  Loader2,
} from "lucide-react";
import { PDFNote, ClassLevel, SubjectType } from "@/types/database";

type AnnotatedNCERTItem = Omit<PDFNote, "chapter"> & {
  chapter?: { id: string; name: string } | null;
};

export default function AdminAnnotatedNCERTPage() {
  const [notes, setNotes] = useState<AnnotatedNCERTItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<"ALL" | "Biology" | "Physics" | "Chemistry">("ALL");
  const [selectedClassFilter, setSelectedClassFilter] = useState<"ALL" | "Class 11" | "Class 12">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<AnnotatedNCERTItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<SubjectType>("Biology");
  const [classLevel, setClassLevel] = useState<ClassLevel>("Class 12");
  const [unit, setUnit] = useState("");
  const [yearsCovered, setYearsCovered] = useState("NEET 2016 - 2024");
  const [solvedQuestions, setSolvedQuestions] = useState(50);
  const [totalPages, setTotalPages] = useState(24);
  const [highlightText, setHighlightText] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState(49);
  const [isRecent, setIsRecent] = useState(false);

  // File Uploads
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // Fetch all Annotated NCERT notes from Supabase
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/manage-annotated-ncert");
      const json = await res.json();
      if (json.success && json.notes) {
        setNotes(json.notes);
      }
    } catch (e) {
      console.error("Error fetching annotated NCERT notes:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleOpenAddModal = () => {
    setEditingNote(null);
    setTitle("");
    setSubject("Biology");
    setClassLevel("Class 12");
    setUnit("");
    setYearsCovered("NEET 2016 - 2024");
    setSolvedQuestions(60);
    setTotalPages(24);
    setHighlightText("");
    setIsFree(false);
    setPrice(49);
    setIsRecent(false);
    setPdfFile(null);
    setThumbnailFile(null);
    setStatusMessage("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: AnnotatedNCERTItem) => {
    setEditingNote(note);
    setTitle(note.title || "");
    setSubject((note.subject as SubjectType) || "Biology");
    setClassLevel((note.class_level as ClassLevel) || "Class 12");
    setUnit(note.unit || note.sub_heading || "");
    setYearsCovered(note.years_covered || "NEET 2016 - 2024");
    setSolvedQuestions(note.questions_count || 50);
    setTotalPages(note.page_count || 24);
    setHighlightText(note.highlight_text || note.description || "");
    setIsFree(Boolean(note.is_free));
    setPrice(note.price || 49);
    setIsRecent(Boolean(note.is_recent));
    setPdfFile(null);
    setThumbnailFile(null);
    setStatusMessage("");
    setIsModalOpen(true);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter the chapter title.");
      return;
    }

    setLoading(true);
    setStatusMessage("Saving Annotated NCERT note...");

    try {
      let thumbnailUrl = editingNote?.thumbnail_url || "/hero_premium_clean.png";
      let filePath = editingNote?.file_path || "";

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

      // 2. Upload PDF document if selected
      if (pdfFile) {
        setStatusMessage("Uploading Annotated PDF Document...");
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

      // 3. Save to database via dedicated API
      setStatusMessage("Writing to database...");
      const res = await fetch("/api/admin/manage-annotated-ncert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: editingNote ? "update" : "create",
          id: editingNote?.id,
          title,
          subject,
          classLevel,
          unit: unit || "General Unit",
          yearsCovered: yearsCovered || "NEET 2016 - 2024",
          solvedQuestions: Number(solvedQuestions),
          totalPages: Number(totalPages),
          highlightText,
          description: highlightText,
          isFree,
          price: isFree ? 0 : Number(price || 49),
          isRecent,
          thumbnailUrl,
          filePath: filePath || `annotated_${Date.now()}.pdf`,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        fetchNotes();
      } else {
        alert("Failed to save note: " + (json.error || "Unknown error"));
      }
    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
      setStatusMessage("");
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_active: !currentStatus } : n))
    );
    try {
      await fetch("/api/admin/manage-annotated-ncert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_active", id, currentStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleRecent = async (id: string, currentStatus: boolean) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_recent: !currentStatus } : n))
    );
    try {
      await fetch("/api/admin/manage-annotated-ncert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_recent", id, currentStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Annotated NCERT note? This cannot be undone.")) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    try {
      await fetch("/api/admin/manage-annotated-ncert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered Notes
  const filteredNotes = notes.filter((n) => {
    if (selectedSubjectFilter !== "ALL" && n.subject !== selectedSubjectFilter) return false;
    if (selectedClassFilter !== "ALL" && n.class_level !== selectedClassFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title?.toLowerCase().includes(q);
      const matchUnit = (n.unit || n.sub_heading || "")?.toLowerCase().includes(q);
      const matchHighlight = (n.highlight_text || n.description || "")?.toLowerCase().includes(q);
      if (!matchTitle && !matchUnit && !matchHighlight) return false;
    }
    return true;
  });

  const bioCount = notes.filter((n) => n.subject === "Biology").length;
  const phyCount = notes.filter((n) => n.subject === "Physics").length;
  const chemCount = notes.filter((n) => n.subject === "Chemistry").length;

  return (
    <div className="space-y-6">
      {/* ═══ EXECUTIVE HEADER BANNER ═══ */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#016737]" />
              <span>Annotated NCERT &amp; PYQs Manager</span>
            </h1>
            <span className="text-[10px] font-bold text-[#016737] bg-[#016737]/10 px-2 py-0.5 rounded-md border border-[#016737]/20 uppercase">
              Dedicated Section
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage line-by-line annotated NCERT highlights, past year NEET questions, and margin notes for Biology, Physics &amp; Chemistry.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#8BC43F]" />
          <span>Add Annotated NCERT</span>
        </button>
      </div>

      {/* ═══ SUBJECT COUNTERS & FILTERS ═══ */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Subject Pills */}
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
                {notes.length}
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

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Chapter name, Unit (e.g. Genetics), or key highlights..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
          />
        </div>
      </div>

      {/* ═══ LIST OF ANNOTATED NCERT NOTES ═══ */}
      {loading && notes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#016737] mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-500">Loading Annotated NCERT notes from Supabase...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No Annotated NCERT Notes Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedSubjectFilter !== "ALL" || selectedClassFilter !== "ALL"
              ? "No notes match your selected filters. Try resetting search."
              : "Get started by adding your first line-by-line NCERT highlight note."}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 px-4 py-2 rounded-xl bg-[#016737] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Note</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => {
            const subjectColor =
              note.subject === "Biology"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : note.subject === "Physics"
                ? "border-violet-200 bg-violet-50 text-violet-800"
                : "border-sky-200 bg-sky-50 text-sky-800";

            return (
              <div
                key={note.id}
                className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs hover:shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges & Actions */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${subjectColor}`}>
                        {note.subject || "Biology"}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {note.class_level || "Class 12"}
                      </span>
                      {note.is_recent && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                          <span>Trending</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleRecent(note.id, Boolean(note.is_recent))}
                        title={note.is_recent ? "Remove from Trending" : "Feature in Trending"}
                        className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                          note.is_recent
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            : "bg-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleStatus(note.id, Boolean(note.is_active))}
                        title={note.is_active ? "Make Inactive" : "Make Active"}
                        className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                          note.is_active
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {note.is_active ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Chapter Title */}
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {note.title}
                  </h3>

                  {/* Unit & Metadata */}
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span className="font-semibold text-slate-700">
                      Unit: {note.unit || note.sub_heading || "General"}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">
                      {note.years_covered || "NEET 2016 - 2024"}
                    </span>
                  </div>

                  {/* Solved Questions & Pages Pills */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {note.questions_count || 50} Solved PYQs
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {note.page_count || 24} Pages
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        note.is_free
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {note.is_free ? "FREE" : `₹${note.price || 49}`}
                    </span>
                  </div>

                  {/* High Yield Highlight Box */}
                  {(note.highlight_text || note.description) && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-relaxed line-clamp-2 italic">
                      "{note.highlight_text || note.description}"
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/secure-reader?pdfId=${encodeURIComponent(note.id)}`}
                    target="_blank"
                    className="text-[11px] font-bold text-[#016737] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Test Reader</span>
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(note)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ ADD / EDIT MODAL ═══ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#016737]" />
                <h2 className="text-sm font-bold text-slate-900">
                  {editingNote ? "Edit Annotated NCERT Note" : "Add Annotated NCERT & PYQs Note"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4 mt-4 text-xs font-medium text-slate-700">
              {/* Subject & Class */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-slate-700">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as SubjectType)}
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
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value as ClassLevel)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#016737]"
                  >
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                    <option value="NEET Special">NEET Special</option>
                  </select>
                </div>
              </div>

              {/* Chapter Name / Title */}
              <div>
                <label className="block mb-1 font-bold text-slate-700">Chapter Name / Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cell: The Unit of Life & Cell Cycle"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#016737]"
                />
              </div>

              {/* Unit Name & Years Covered */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-slate-700">Unit Name</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. Cell Biology, Genetics, Optics"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#016737]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-700">Years Covered</label>
                  <input
                    type="text"
                    value={yearsCovered}
                    onChange={(e) => setYearsCovered(e.target.value)}
                    placeholder="e.g. NEET 2016 - 2024"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#016737]"
                  />
                </div>
              </div>

              {/* Solved Questions & Total Pages */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-slate-700">Solved PYQs Count</label>
                  <input
                    type="number"
                    min="1"
                    value={solvedQuestions}
                    onChange={(e) => setSolvedQuestions(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#016737]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-700">Total PDF Pages</label>
                  <input
                    type="number"
                    min="1"
                    value={totalPages}
                    onChange={(e) => setTotalPages(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#016737]"
                  />
                </div>
              </div>

              {/* High Yield Highlight Line */}
              <div>
                <label className="block mb-1 font-bold text-slate-700">
                  High-Yield Line Annotation / Highlights
                </label>
                <textarea
                  rows={2}
                  value={highlightText}
                  onChange={(e) => setHighlightText(e.target.value)}
                  placeholder="e.g. Endomembrane system organelle markers, action potential mechanisms, and direct formula shortcuts."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#016737]"
                />
              </div>

              {/* Free vs Paid & Price */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block mb-1 font-bold text-slate-700">Access Mode</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={isFree}
                        onChange={() => setIsFree(true)}
                        name="access_mode"
                      />
                      <span className="font-semibold text-emerald-700">FREE</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={!isFree}
                        onChange={() => setIsFree(false)}
                        name="access_mode"
                      />
                      <span className="font-semibold text-blue-700">PAID</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-700">Price (₹ INR)</label>
                  <input
                    type="number"
                    disabled={isFree}
                    min="0"
                    value={isFree ? 0 : price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className={`w-full p-2 rounded-lg border border-slate-200 ${
                      isFree ? "bg-slate-200 text-slate-400" : "bg-white text-slate-900"
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
                  {editingNote && !pdfFile && (
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Current file: {editingNote.file_path || "Existing"}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block mb-1 font-bold text-slate-700">Cover Image (.png/.jpg)</label>
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
                  id="trending_check"
                  checked={isRecent}
                  onChange={(e) => setIsRecent(e.target.checked)}
                  className="rounded border-slate-300 text-[#016737] focus:ring-[#016737]"
                />
                <label htmlFor="trending_check" className="font-semibold text-slate-700 cursor-pointer">
                  Feature in Trending / Recent Showcase
                </label>
              </div>

              {statusMessage && (
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                  <span>{editingNote ? "Update Note" : "Save Annotated NCERT"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
