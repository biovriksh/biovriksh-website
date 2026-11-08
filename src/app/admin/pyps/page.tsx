"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Upload,
  Trash2,
  FileText,
  CheckCircle2,
  Lock,
  Search,
  Loader2,
  ExternalLink,
  Award,
  Clock,
  Flame
} from "lucide-react";

interface PYPItem {
  id: string;
  title: string;
  years_covered?: string;
  sub_heading?: string;
  subject: string;
  questions_count?: number;
  total_marks?: number;
  duration_minutes?: number;
  is_free: boolean;
  is_recent?: boolean;
  thumbnail_url?: string;
  file_path: string;
  created_at: string;
}

const years = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"];

export default function AdminPYPsPage() {
  const [pypsList, setPypsList] = useState<PYPItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [examYear, setExamYear] = useState("2024");
  const [title, setTitle] = useState("NEET UG 2024 Question Paper with NCERT Solutions");
  const [sectionType, setSectionType] = useState<"Full NEET Paper" | "Biology" | "Physics" | "Chemistry">("Full NEET Paper");
  const [questionsCount, setQuestionsCount] = useState("200");
  const [totalMarks, setTotalMarks] = useState("720");
  const [durationMinutes, setDurationMinutes] = useState("200");
  const [isFree, setIsFree] = useState(false);
  const [isRecent, setIsRecent] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState("All");

  const loadPYPs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/public/pdfs", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.pdfs) {
        const filtered = json.pdfs.filter(
          (p: any) =>
            p.note_type === "pyp" ||
            p.title.toLowerCase().includes("pyp") ||
            p.title.toLowerCase().includes("previous year") ||
            p.sub_heading?.toLowerCase().includes("pyp")
        );
        setPypsList(filtered);
      }
    } catch (e: any) {
      console.error("Failed to load PYPs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPYPs();
  }, []);

  const handleYearChange = (yr: string) => {
    setExamYear(yr);
    setTitle(`NEET UG ${yr} Official Question Paper with NCERT Solutions`);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!title.trim()) {
      setErrorMsg("Please enter paper title.");
      return;
    }
    if (!pdfFile) {
      setErrorMsg("Please select a PYP PDF file.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("noteType", "pyp");
      formData.append("targetSection", "pyp");
      formData.append("classLevel", "NEET Special");
      formData.append("subject", sectionType === "Full NEET Paper" ? "Biology" : sectionType);
      formData.append("unit", `NEET ${examYear} Solved Paper`);
      formData.append("subHeading", `NEET ${examYear} • ${sectionType}`);
      formData.append("yearsCovered", examYear);
      formData.append("questionsCount", questionsCount);
      formData.append("totalMarks", totalMarks);
      formData.append("durationMinutes", durationMinutes);
      formData.append("isFree", String(isFree));
      formData.append("isRecent", String(isRecent));
      formData.append("price", isFree ? "0" : "299");
      formData.append("pdfFile", pdfFile);
      if (thumbnailFile) {
        formData.append("thumbnailFile", thumbnailFile);
      }

      const res = await fetch("/api/admin/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccessMsg(`NEET ${examYear} Paper uploaded successfully!`);
      setPdfFile(null);
      setThumbnailFile(null);
      setIsFree(false);
      setIsRecent(false);
      loadPYPs();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload PYP PDF.");
    } finally {
      setUploading(false);
    }
  };

  const handleToggleRecent = async (id: string, currentStatus?: boolean) => {
    try {
      const isCurrentlyRecent = Boolean(currentStatus);
      const res = await fetch("/api/admin/manage-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_recent", id, currentStatus: isCurrentlyRecent }),
      });
      const data = await res.json();
      if (data.success) {
        setPypsList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, is_recent: !isCurrentlyRecent } : item))
        );
      } else {
        alert(data.error || "Failed to toggle recent status.");
      }
    } catch (err: any) {
      console.error("Toggle recent error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this PYP paper?")) return;
    try {
      const res = await fetch(`/api/admin/manage-pdf?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setPypsList((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data.error || "Failed to delete PYP paper.");
      }
    } catch (e: any) {
      alert("Error deleting PYP: " + e.message);
    }
  };

  const filteredList = pypsList.filter((item) => {
    if (filterYear !== "All" && item.years_covered !== filterYear && !item.title.includes(filterYear)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || (item.years_covered && item.years_covered.includes(q));
    }
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 font-sans">
      {/* ═══ HEADER ═══ */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#016737] uppercase tracking-wider mb-1">
          <Calendar className="w-4 h-4" />
          Dedicated Upload Section
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          PYP&apos;s by Year
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Upload official NEET previous year question papers and line-by-line solution PDFs according to year.
        </p>
      </div>

      {/* ═══ UPLOAD FORM CARD ═══ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-[#016737]" />
          Upload Previous Year Paper (PYP)
        </h2>

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Exam Year */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Exam Year *
              </label>
              <select
                value={examYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#016737]"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    NEET {y}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Paper Section / Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Section / Paper Type *
              </label>
              <select
                value={sectionType}
                onChange={(e) => setSectionType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#016737]"
              >
                <option value="Full NEET Paper">Full NEET Paper (PCB)</option>
                <option value="Biology">Biology Section</option>
                <option value="Physics">Physics Section</option>
                <option value="Chemistry">Chemistry Section</option>
              </select>
            </div>

            {/* 3. Paper Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Paper Display Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#016737]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 4. Total Questions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Total Questions Count
              </label>
              <input
                type="number"
                value={questionsCount}
                onChange={(e) => setQuestionsCount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#016737]"
              />
            </div>

            {/* 5. Total Marks */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Total Marks
              </label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#016737]"
              />
            </div>

            {/* 6. Duration Minutes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Exam Duration (Minutes)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#016737]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* 7. PDF File */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Solved Paper PDF File *
              </label>
              <input
                type="file"
                accept=".pdf"
                required
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#016737]/10 file:text-[#016737] hover:file:bg-[#016737]/20 cursor-pointer"
              />
            </div>

            {/* 8. Thumbnail Image File */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Small Thumbnail Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#8BC43F]/20 file:text-[#016737] hover:file:bg-[#8BC43F]/30 cursor-pointer"
              />
            </div>

            {/* 9. Free Sample & Recent Toggles */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFreePYP"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                  className="w-4 h-4 rounded text-[#016737] focus:ring-[#016737] cursor-pointer"
                />
                <label htmlFor="isFreePYP" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Mark as Free Sample Paper (e.g. Free preview for NEET 2024)
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isRecentPYP"
                  checked={isRecent}
                  onChange={(e) => setIsRecent(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-600 cursor-pointer"
                />
                <label htmlFor="isRecentPYP" className="text-xs font-bold text-slate-800 cursor-pointer flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  Show in Homepage Recent Row
                </label>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2.5 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading Solved Paper...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload PYP Paper PDF</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ═══ LIVE PYPS TABLE ═══ */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Uploaded Previous Year Papers ({filteredList.length})
            </h3>
            <p className="text-xs text-slate-500">
              Live database records visible on the student PYP&apos;s page
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            {/* Filter Year */}
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700"
            >
              <option value="All">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#016737]"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#016737]" />
            <span>Loading previous year papers...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No previous year papers uploaded yet. Use the simple form above to upload NEET papers!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3.5">Exam Year &amp; Paper Title</th>
                  <th className="p-3.5">Section</th>
                  <th className="p-3.5">Questions</th>
                  <th className="p-3.5">Marks</th>
                  <th className="p-3.5">Access Type</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.thumbnail_url || "/neet_biology_study_desk.png"}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="px-1.5 py-0.2 rounded font-black text-[9px] bg-[#016737] text-white">
                              {item.years_covered || "NEET"}
                            </span>
                          </div>
                          <span className="block leading-snug line-clamp-1">{item.title}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-700">
                        {item.subject}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">
                      {item.questions_count || 200} Qs
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">
                      {item.total_marks || 720} Marks
                    </td>
                    <td className="p-3.5">
                      {item.is_free ? (
                        <span className="px-2 py-0.5 rounded-full font-black text-[10px] bg-[#8BC43F]/25 text-[#014d29]">
                          FREE Sample
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full font-black text-[10px] bg-amber-100 text-amber-800 flex items-center gap-1 w-max">
                          <Lock className="w-3 h-3" />
                          Subscription Pass
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleToggleRecent(item.id, item.is_recent)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                          item.is_recent
                            ? "bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100"
                            : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                        }`}
                        title={item.is_recent ? "Remove from Homepage Recent" : "Pin to Homepage Recent"}
                      >
                        <Flame className={`w-3 h-3 ${item.is_recent ? "text-orange-500 fill-orange-500" : "text-slate-400"}`} />
                        <span>{item.is_recent ? "Recent" : "Pin Recent"}</span>
                      </button>
                      <a
                        href={`/secure-reader?pdfId=${item.id}&title=${encodeURIComponent(item.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors font-bold text-[11px]"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </a>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Paper"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

