"use client";

import { useState, useEffect } from "react";
import {
  HelpCircle,
  Upload,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  Lock,
  Search,
  Filter,
  Loader2,
  ExternalLink,
  Sparkles
} from "lucide-react";

interface QuestionPDF {
  id: string;
  title: string;
  sub_heading?: string;
  unit?: string;
  subject: string;
  class_level: string;
  questions_count?: number;
  page_count?: number;
  is_free: boolean;
  file_path: string;
  created_at: string;
}

export default function AdminQuestionsPage() {
  const [questionsList, setQuestionsList] = useState<QuestionPDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [classLevel, setClassLevel] = useState<"Class 11" | "Class 12">("Class 11");
  const [subject, setSubject] = useState<"Biology" | "Physics" | "Chemistry">("Biology");
  const [unit, setUnit] = useState("");
  const [questionsCount, setQuestionsCount] = useState("150");
  const [pageCount, setPageCount] = useState("16");
  const [isFree, setIsFree] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("All");

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/public/pdfs", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.pdfs) {
        const filtered = json.pdfs.filter(
          (p: any) =>
            p.note_type === "questions" ||
            p.title.toLowerCase().includes("question") ||
            p.sub_heading?.toLowerCase().includes("question")
        );
        setQuestionsList(filtered);
      }
    } catch (e: any) {
      console.error("Failed to load question PDFs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!title.trim()) {
      setErrorMsg("Please enter a chapter title.");
      return;
    }
    if (!pdfFile) {
      setErrorMsg("Please select a question PDF file.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("noteType", "questions");
      formData.append("targetSection", "questions");
      formData.append("classLevel", classLevel);
      formData.append("subject", subject);
      formData.append("unit", unit.trim() || `${classLevel} ${subject}`);
      formData.append("subHeading", `Per Topic Questions • ${subject}`);
      formData.append("questionsCount", questionsCount);
      formData.append("pageCount", pageCount);
      formData.append("isFree", String(isFree));
      formData.append("price", isFree ? "0" : "299");
      formData.append("pdfFile", pdfFile);

      const res = await fetch("/api/admin/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccessMsg("Question PDF uploaded successfully!");
      // Reset form
      setTitle("");
      setUnit("");
      setPdfFile(null);
      setIsFree(false);
      // Reload table
      loadQuestions();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload question PDF.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Question PDF?")) return;
    try {
      const res = await fetch(`/api/admin/manage-pdf?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setQuestionsList((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(data.error || "Failed to delete PDF.");
      }
    } catch (e: any) {
      alert("Error deleting PDF: " + e.message);
    }
  };

  const filteredList = questionsList.filter((item) => {
    if (filterSubject !== "All" && item.subject !== filterSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.class_level.toLowerCase().includes(q) ||
        (item.unit && item.unit.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 font-sans">
      {/* ═══ HEADER ═══ */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#016737] uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4" />
          Dedicated Upload Section
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Per Topic Questions
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Upload chapter-wise question PDFs for Class 11 &amp; 12 across Physics, Chemistry, and Biology.
        </p>
      </div>

      {/* ═══ UPLOAD FORM CARD ═══ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-[#016737]" />
          Upload New Chapter Question PDF
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
            {/* 1. Class */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Class Level *
              </label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#016737]"
              >
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
              </select>
            </div>

            {/* 2. Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#016737]"
              >
                <option value="Biology">Biology</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
              </select>
            </div>

            {/* 3. Chapter Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Chapter Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. The Living World"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#016737]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 4. Unit */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Unit / Category (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Diversity in Living World"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#016737]"
              />
            </div>

            {/* 5. Questions Count */}
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

            {/* 6. Page Count */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                PDF Pages Count
              </label>
              <input
                type="number"
                value={pageCount}
                onChange={(e) => setPageCount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#016737]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* 7. PDF File */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Question PDF File *
              </label>
              <input
                type="file"
                accept=".pdf"
                required
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#016737]/10 file:text-[#016737] hover:file:bg-[#016737]/20 cursor-pointer"
              />
            </div>

            {/* 8. Free Sample Checkbox */}
            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="isFreeToggle"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                className="w-4 h-4 rounded text-[#016737] focus:ring-[#016737] cursor-pointer"
              />
              <label htmlFor="isFreeToggle" className="text-xs font-bold text-slate-800 cursor-pointer">
                Mark as 1st / Free Chapter (Free sample for students without subscription)
              </label>
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
                  <span>Uploading to Secure Storage...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Question PDF</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ═══ LIVE QUESTIONS PDFS LIST TABLE ═══ */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Uploaded Question PDFs ({filteredList.length})
            </h3>
            <p className="text-xs text-slate-500">
              Live database records visible on the student Questions page
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto">
            {/* Filter */}
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700"
            >
              <option value="All">All Subjects</option>
              <option value="Biology">Biology</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
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
            <span>Loading question PDFs...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No question PDFs uploaded yet. Use the simple form above to upload your first chapter question PDF!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="p-3.5">Chapter &amp; Title</th>
                  <th className="p-3.5">Class &amp; Subject</th>
                  <th className="p-3.5">Unit</th>
                  <th className="p-3.5">Questions</th>
                  <th className="p-3.5">Access Type</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#016737]" />
                        <span>{item.title}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-700 mr-1.5">
                        {item.class_level}
                      </span>
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-50 text-emerald-800">
                        {item.subject}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {item.unit || "—"}
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">
                      {item.questions_count || 150} Qs
                    </td>
                    <td className="p-3.5">
                      {item.is_free ? (
                        <span className="px-2 py-0.5 rounded-full font-black text-[10px] bg-[#8BC43F]/25 text-[#014d29]">
                          FREE 1st Ch
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full font-black text-[10px] bg-amber-100 text-amber-800 flex items-center gap-1 w-max">
                          <Lock className="w-3 h-3" />
                          Subscription Pass
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
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
                        title="Delete Question PDF"
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

