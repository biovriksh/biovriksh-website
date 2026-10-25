"use client";

import { useState, useEffect } from "react";
import {
  FileCheck2,
  Plus,
  Upload,
  Lock,
  Unlock,
  CheckCircle2,
  X,
  Trash2,
  Search,
  Pencil,
  Clock,
  Award,
  Layers,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { PDFNote, ClassLevel, SubjectType } from "@/types/database";

export default function AdminTestsPage() {
  const [tests, setTests] = useState<PDFNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<"ALL" | "Biology" | "Physics" | "Chemistry">("ALL");
  const [selectedClassFilter, setSelectedClassFilter] = useState<"ALL" | "Class 11" | "Class 12">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<PDFNote | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<SubjectType>("Biology");
  const [classLevel, setClassLevel] = useState<ClassLevel>("Class 12");
  const [questionsCount, setQuestionsCount] = useState(45);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [totalMarks, setTotalMarks] = useState(180);
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState(49);
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/manage-pdf");
      const json = await res.json();
      if (json.success && json.pdfs) {
        // Filter out PDFs that are tests
        const testList = (json.pdfs as PDFNote[]).filter(
          (p) =>
            p.note_type === "test" ||
            (p.title && p.title.toLowerCase().includes("test")) ||
            (p.sub_heading && p.sub_heading.toLowerCase().includes("test"))
        );
        setTests(testList);
      }
    } catch (e) {
      console.error("Error fetching tests:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleOpenUploadModal = () => {
    setEditingTest(null);
    setTitle("");
    setSubject("Biology");
    setClassLevel("Class 12");
    setQuestionsCount(45);
    setDurationMinutes(45);
    setTotalMarks(180);
    setIsFree(true);
    setPrice(49);
    setDescription("");
    setPdfFile(null);
    setStatusMessage("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (test: PDFNote) => {
    setEditingTest(test);
    setTitle(test.title || "");
    setSubject(((test.subject as any) || "Biology"));
    setClassLevel((test.class_level as ClassLevel) || "Class 12");
    setQuestionsCount(test.questions_count || 45);
    setDurationMinutes(test.duration_minutes || 45);
    setTotalMarks(test.total_marks || 180);
    setIsFree(test.is_free);
    setPrice(test.price || 49);
    setDescription(test.description || "");
    setPdfFile(null);
    setStatusMessage("");
    setIsModalOpen(true);
  };

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setStatusMessage("Saving test paper...");

    try {
      if (editingTest) {
        // Update existing test
        const res = await fetch("/api/admin/manage-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update",
            id: editingTest.id,
            title: title.trim(),
            description: description.trim(),
            targetSection: "test",
            classLevel,
            subject,
            price: isFree ? 0 : price,
            pageCount: 12,
            questionsCount,
            durationMinutes,
            totalMarks,
          }),
        });
        const json = await res.json();
        if (json.success) {
          setIsModalOpen(false);
          await fetchTests();
        } else {
          alert("Error: " + json.error);
        }
      } else {
        // Upload new test paper
        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("targetSection", "test");
        formData.append("classLevel", classLevel);
        formData.append("subject", subject);
        formData.append("price", isFree ? "0" : price.toString());
        formData.append("questionsCount", questionsCount.toString());
        formData.append("durationMinutes", durationMinutes.toString());
        formData.append("totalMarks", totalMarks.toString());

        if (pdfFile) {
          formData.append("pdfFile", pdfFile);
        }

        const res = await fetch("/api/admin/upload-pdf", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (json.success) {
          setIsModalOpen(false);
          await fetchTests();
        } else {
          alert("Error: " + json.error);
        }
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to save test: " + err.message);
    } finally {
      setLoading(false);
      setStatusMessage("");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_active: !currentStatus } : t))
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

  const handleDeleteTest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Chapter Test paper?")) return;
    setTests((prev) => prev.filter((t) => t.id !== id));
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

  const filteredTests = tests.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedSubjectFilter !== "ALL" && (t.subject || "Biology") !== selectedSubjectFilter) {
      return false;
    }

    if (selectedClassFilter !== "ALL" && t.class_level !== selectedClassFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* ═══ EXECUTIVE BANNER ═══ */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#016737]" />
            <span>Chapter-wise Tests &amp; Practice Papers</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage NEET practice tests across Biology, Physics, and Chemistry for Class 11 &amp; 12.
          </p>
        </div>

        <button
          onClick={handleOpenUploadModal}
          className="px-4 py-2.5 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-[#016737]/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#8BC43F]" />
          <span>Upload New Chapter Test</span>
        </button>
      </div>

      {/* ═══ FILTERS & SEARCH ═══ */}
      <div className="bg-white border border-slate-200 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        {/* Subject Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "ALL", label: "All Subjects", count: tests.length },
            { id: "Biology", label: "🌿 Biology", count: tests.filter((t) => (t.subject || "Biology") === "Biology").length },
            { id: "Physics", label: "⚡ Physics", count: tests.filter((t) => t.subject === "Physics").length },
            { id: "Chemistry", label: "🧪 Chemistry", count: tests.filter((t) => t.subject === "Chemistry").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSubjectFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedSubjectFilter === tab.id
                  ? "bg-[#016737] text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedSubjectFilter === tab.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Class Filter */}
        <div className="flex items-center gap-1.5">
          {(["ALL", "Class 11", "Class 12"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedClassFilter(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedClassFilter === lvl
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {lvl === "ALL" ? "All Classes" : lvl}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search test paper..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
          />
        </div>
      </div>

      {/* ═══ TESTS GRID ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTests.length > 0 ? (
          filteredTests.map((test) => {
            const isBio = (test.subject || "Biology") === "Biology";
            const isPhy = test.subject === "Physics";
            const isChem = test.subject === "Chemistry";

            return (
              <div
                key={test.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border ${
                        isBio
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : isPhy
                          ? "bg-violet-50 text-violet-800 border-violet-200"
                          : "bg-blue-50 text-blue-800 border-blue-200"
                      }`}
                    >
                      {isBio ? "🌿 Biology" : isPhy ? "⚡ Physics" : "🧪 Chemistry"} • {test.class_level}
                    </span>

                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        test.is_free
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {test.is_free ? "FREE" : `₹${test.price || 49}`}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mt-1">
                    {test.title}
                  </h3>

                  {test.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {test.description}
                    </p>
                  )}

                  {/* Test Metrics */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 rounded-xl p-2.5 mt-3 text-center">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block">Questions</span>
                      <span className="text-xs font-bold text-slate-800">{test.questions_count || 45} Qs</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block">Duration</span>
                      <span className="text-xs font-bold text-slate-800">{test.duration_minutes || 45}m</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block">Total Marks</span>
                      <span className="text-xs font-bold text-slate-800">{test.total_marks || 180}M</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                  <button
                    onClick={() => handleToggleActive(test.id, test.is_active)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                      test.is_active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {test.is_active ? "● Live / Active" : "○ Inactive"}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(test)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      title="Edit Test Details"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTest(test.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                      title="Delete Test"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No Tests Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Upload your first chapter test PDF paper to make it available for NEET aspirants.
            </p>
            <button
              onClick={handleOpenUploadModal}
              className="mt-4 px-4 py-2 rounded-xl bg-[#016737] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Upload Test Paper
            </button>
          </div>
        )}
      </div>

      {/* ═══ UPLOAD / EDIT TEST MODAL ═══ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#016737]" />
                <span>{editingTest ? "Edit Chapter Test Paper" : "Upload New Chapter Test"}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTest} className="space-y-4 mt-4">
              {/* Title */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Test Title / Chapter Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Molecular Basis of Inheritance - High-Yield Test"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#016737]"
                />
              </div>

              {/* Subject & Class */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#016737]"
                  >
                    <option value="Biology">🌿 Biology</option>
                    <option value="Physics">⚡ Physics</option>
                    <option value="Chemistry">🧪 Chemistry</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Class Level</label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#016737]"
                  >
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                    <option value="NEET Special">NEET Special</option>
                  </select>
                </div>
              </div>

              {/* Metrics: Questions, Duration, Marks */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Questions</label>
                  <input
                    type="number"
                    min={5}
                    max={200}
                    value={questionsCount}
                    onChange={(e) => setQuestionsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#016737]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    min={10}
                    max={200}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#016737]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    min={20}
                    max={720}
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#016737]"
                  />
                </div>
              </div>

              {/* Free vs Paid Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-xs font-bold text-slate-800">Free Practice Test</p>
                  <p className="text-[11px] text-slate-500">Enable to allow all students to download free</p>
                </div>
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                  className="w-4 h-4 accent-[#016737]"
                />
              </div>

              {!isFree && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#016737]"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Topics / Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key topics covered in this test paper..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#016737]"
                />
              </div>

              {/* Test PDF Upload */}
              {!editingTest && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Upload Test Paper PDF *
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#016737] file:text-white hover:file:bg-[#014d29] cursor-pointer"
                  />
                </div>
              )}

              {statusMessage && (
                <p className="text-xs text-[#016737] font-bold text-center animate-pulse">
                  {statusMessage}
                </p>
              )}

              {/* Form Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Saving..." : editingTest ? "Update Test" : "Upload Test"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
