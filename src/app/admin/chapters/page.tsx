"use client";

import { useState, useEffect } from "react";
import {
  FolderTree,
  Plus,
  BookOpen,
  CheckCircle2,
  X,
  Layers,
  FileText,
  Link as LinkIcon,
  ShieldCheck,
  Sparkles,
  Lock,
  Trash2,
  Edit3,
  ListPlus,
  ChevronDown,
  Flame,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Chapter, PDFNote, ClassLevel } from "@/types/database";

interface SubHeadingItem {
  id: string; // temporary UI ID or title
  title: string;
  pdfIds: string[]; // List of attached PDF IDs under this sub-heading
}

export default function AdminChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [availablePdfs, setAvailablePdfs] = useState<PDFNote[]>([]);
  const [loading, setLoading] = useState(false);

  // Chapter Builder Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("Biology");
  const [classLevel, setClassLevel] = useState<ClassLevel>("Class 12");
  const [orderIndex, setOrderIndex] = useState(1);

  // Dynamic Sub-Headings List State
  const [subHeadings, setSubHeadings] = useState<SubHeadingItem[]>([
    { id: "sub-1", title: "Topic 1: Introduction & Overview", pdfIds: [] },
  ]);

  const fetchChaptersAndPdfs = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // 1. Fetch chapters with linked PDFs
      const { data: chaptersData } = await supabase
        .from("chapters")
        .select("*, pdfs(*)")
        .order("order_index", { ascending: true });

      if (chaptersData) {
        setChapters(chaptersData);
      }

      // 2. Fetch all published PDFs for dropdown selection
      const { data: pdfsData } = await supabase
        .from("pdfs")
        .select("*")
        .order("title", { ascending: true });

      if (pdfsData) {
        setAvailablePdfs(pdfsData);
      }
    } catch (e) {
      console.log("Error fetching chapters or PDFs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChaptersAndPdfs();
  }, []);

  // Toggle Showcase in Recent / Trending Section for ANY PDF directly from Chapter Manager
  const toggleRecentStatus = async (pdfId: string, currentStatus: boolean) => {
    // Update local state for chapters
    setChapters((prevChapters) =>
      prevChapters.map((ch) => ({
        ...ch,
        pdfs: ch.pdfs?.map((p) => (p.id === pdfId ? { ...p, is_recent: !currentStatus } : p)),
      }))
    );

    // Update availablePdfs state
    setAvailablePdfs((prev) =>
      prev.map((p) => (p.id === pdfId ? { ...p, is_recent: !currentStatus } : p))
    );

    try {
      const supabase = createClient();
      await supabase.from("pdfs").update({ is_recent: !currentStatus }).eq("id", pdfId);
    } catch (e) {
      console.error(e);
    }
  };

  // Open Builder Modal for creating a new Chapter
  const openNewChapterModal = () => {
    setEditingChapterId(null);
    setName("");
    setSubject("Biology");
    setClassLevel("Class 12");
    setOrderIndex(chapters.length + 1);
    setSubHeadings([
      { id: `sub-${Date.now()}-1`, title: "Topic 1: Key Concepts & Theory", pdfIds: [] },
    ]);
    setIsModalOpen(true);
  };

  // Open Builder Modal for editing existing Chapter structure
  const openEditChapterModal = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setName(chapter.name);
    setSubject(chapter.subject || "Biology");
    setClassLevel((chapter.class_level as ClassLevel) || "Class 12");
    setOrderIndex(chapter.order_index || 1);

    // Group existing attached PDFs by sub_heading
    const existingPdfs = chapter.pdfs || [];
    const grouped: Record<string, string[]> = {};

    existingPdfs.forEach((pdf) => {
      const subTitle = pdf.sub_heading || "General Chapter Notes";
      if (!grouped[subTitle]) grouped[subTitle] = [];
      grouped[subTitle].push(pdf.id);
    });

    const items: SubHeadingItem[] = Object.entries(grouped).map(([title, pdfIds], idx) => ({
      id: `sub-edit-${idx}-${Date.now()}`,
      title,
      pdfIds,
    }));

    if (items.length === 0) {
      items.push({ id: `sub-${Date.now()}`, title: "Topic 1: Key Concepts", pdfIds: [] });
    }

    setSubHeadings(items);
    setIsModalOpen(true);
  };

  // Add new Sub-Heading block dynamically
  const handleAddSubHeadingBlock = () => {
    const newIdx = subHeadings.length + 1;
    setSubHeadings((prev) => [
      ...prev,
      {
        id: `sub-${Date.now()}-${newIdx}`,
        title: `Topic ${newIdx}: New Sub-Heading Title`,
        pdfIds: [],
      },
    ]);
  };

  // Update Sub-Heading title
  const handleSubHeadingTitleChange = (id: string, newTitle: string) => {
    setSubHeadings((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, title: newTitle } : sub))
    );
  };

  // Attach a PDF to a specific Sub-Heading
  const handleAttachPdfToSubHeading = (subId: string, pdfId: string) => {
    if (!pdfId) return;
    setSubHeadings((prev) =>
      prev.map((sub) => {
        if (sub.id === subId) {
          if (!sub.pdfIds.includes(pdfId)) {
            return { ...sub, pdfIds: [...sub.pdfIds, pdfId] };
          }
        }
        return sub;
      })
    );
  };

  // Remove a PDF from a Sub-Heading
  const handleRemovePdfFromSubHeading = (subId: string, pdfIdToRemove: string) => {
    setSubHeadings((prev) =>
      prev.map((sub) => {
        if (sub.id === subId) {
          return { ...sub, pdfIds: sub.pdfIds.filter((id) => id !== pdfIdToRemove) };
        }
        return sub;
      })
    );
  };

  // Delete a Sub-Heading block
  const handleDeleteSubHeadingBlock = (subId: string) => {
    if (subHeadings.length <= 1) return;
    setSubHeadings((prev) => prev.filter((sub) => sub.id !== subId));
  };

  // Save Chapter + all Sub-Headings & PDFs
  const handleSaveChapterStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const supabase = createClient();

      let targetChapterId = editingChapterId;

      if (!editingChapterId) {
        // Create new chapter
        const { data: newCh, error } = await supabase
          .from("chapters")
          .insert({
            name,
            subject,
            class_level: classLevel,
            order_index: Number(orderIndex),
            is_active: true,
          })
          .select()
          .single();

        if (error || !newCh) {
          console.error(error);
          setLoading(false);
          return;
        }
        targetChapterId = newCh.id;
      } else {
        // Update existing chapter details
        await supabase
          .from("chapters")
          .update({
            name,
            subject,
            class_level: classLevel,
            order_index: Number(orderIndex),
          })
          .eq("id", editingChapterId);
      }

      if (targetChapterId) {
        // Update PDF records: Assign chapter_id and sub_heading for all selected PDFs
        for (const sub of subHeadings) {
          if (sub.pdfIds.length > 0) {
            await supabase
              .from("pdfs")
              .update({
                chapter_id: targetChapterId,
                sub_heading: sub.title,
              })
              .in("id", sub.pdfIds);
          }
        }
      }

      setIsModalOpen(false);
      fetchChaptersAndPdfs();
    } catch (e) {
      console.error("Error saving chapter structure:", e);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Chapter Visibility
  const toggleChapterActive = async (id: string, currentStatus: boolean) => {
    setChapters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !currentStatus } : c))
    );

    try {
      const supabase = createClient();
      await supabase.from("chapters").update({ is_active: !currentStatus }).eq("id", id);
    } catch (e) {
      // Ignored
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderTree className="w-4.5 h-4.5 text-[#016737]" />
            <span>Chapter &amp; Sub-Heading Structure Manager</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Create chapters, define multiple sub-headings, and feature notes in Trending.
          </p>
        </div>

        <button
          onClick={openNewChapterModal}
          className="px-4 py-2.5 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-md shadow-[#016737]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Chapter &amp; Sub-Headings</span>
        </button>
      </div>

      {/* Security Rule Highlight Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-xl flex items-start gap-3 text-xs text-emerald-900 font-medium">
        <ShieldCheck className="w-4.5 h-4.5 text-[#016737] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Inherited Pricing &amp; Security:</span> PDFs linked to any sub-heading retain their original pricing (`FREE` or `Paid`). You can also feature any topic note in Homepage Trending using the 🔥 button!
        </div>
      </div>

      {/* Chapters Grid / Display */}
      <div className="grid grid-cols-1 gap-5">
        {chapters.length > 0 ? (
          chapters.map((ch) => {
            // Group PDFs by sub_heading
            const pdfList = ch.pdfs || [];
            const groupedSubHeadings = pdfList.reduce((acc, pdf) => {
              const sub = pdf.sub_heading || "General Notes";
              if (!acc[sub]) acc[sub] = [];
              acc[sub].push(pdf);
              return acc;
            }, {} as Record<string, PDFNote[]>);

            return (
              <div
                key={ch.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Chapter Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#016737] bg-[#016737]/10 px-2.5 py-1 rounded-lg border border-[#016737]/20 font-mono">
                      #{ch.order_index}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span>{ch.name}</span>
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {ch.class_level || "Class 12"} • {ch.subject || "Biology"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {ch.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Live Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold">
                        <span>Hidden</span>
                      </span>
                    )}

                    <button
                      onClick={() => openEditChapterModal(ch)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-200"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit Structure &amp; PDFs</span>
                    </button>

                    <button
                      onClick={() => toggleChapterActive(ch.id, ch.is_active)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        ch.is_active
                          ? "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                      }`}
                    >
                      {ch.is_active ? "Hide" : "Publish"}
                    </button>
                  </div>
                </div>

                {/* Sub-Headings Tree View */}
                <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-[#016737]/20">
                  {Object.keys(groupedSubHeadings).length > 0 ? (
                    Object.entries(groupedSubHeadings).map(([subTitle, pdfs]) => (
                      <div
                        key={subTitle}
                        className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#016737]" />
                            <span>{subTitle}</span>
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 font-mono bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {pdfs.length} PDF Notes
                          </span>
                        </div>

                        {/* List of PDFs under sub-heading with Quick Recent Flame Button */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {pdfs.map((pdf) => (
                            <div
                              key={pdf.id}
                              className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 text-xs shadow-2xs"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-3.5 h-3.5 text-[#016737] shrink-0" />
                                <span className="font-semibold text-slate-800 truncate">
                                  {pdf.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                {/* Price Tag */}
                                {pdf.is_free ? (
                                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                                    FREE
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 text-[10px] font-bold font-mono">
                                    ₹{pdf.price}
                                  </span>
                                )}

                                {/* Quick Trending Flame Toggle Button */}
                                <button
                                  onClick={() => toggleRecentStatus(pdf.id, pdf.is_recent)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 border ${
                                    pdf.is_recent
                                      ? "bg-rose-500 text-white border-rose-600 shadow-2xs"
                                      : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600"
                                  }`}
                                  title={pdf.is_recent ? "Remove from Recent/Trending" : "+ Add to Homepage Trending"}
                                >
                                  <Flame className={`w-3 h-3 ${pdf.is_recent ? "fill-white text-white" : "text-slate-400"}`} />
                                  <span>{pdf.is_recent ? "Recent Active" : "+ Add to Recents"}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 font-medium py-2">
                      No sub-headings or attached PDFs yet. Click &quot;Edit Structure &amp; PDFs&quot; to add topics and attach notes!
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3 shadow-2xs">
            <FolderTree className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Biology Chapters Added Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Start building your NEET curriculum structure. Add chapters, create sub-heading topics, and attach your uploaded PDF notes.
            </p>
            <button
              onClick={openNewChapterModal}
              className="px-4 py-2 rounded-xl bg-[#016737] text-white text-xs font-semibold shadow-2xs"
            >
              Add First Chapter
            </button>
          </div>
        )}
      </div>

      {/* ═══ MASTER BUILDER MODAL: CHAPTER + MULTIPLE SUB-HEADINGS + MULTIPLE PDFS ═══ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#016737] bg-[#016737]/10 px-2.5 py-0.5 rounded-md uppercase font-mono">
                  Curriculum Builder
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <FolderTree className="w-4.5 h-4.5 text-[#016737]" />
                  <span>{editingChapterId ? "Edit Chapter Structure & Topics" : "Create New Chapter with Sub-Headings"}</span>
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <form id="chapter-builder-form" onSubmit={handleSaveChapterStructure} className="flex-1 overflow-y-auto py-5 space-y-6">
              {/* Step 1: Basic Chapter Meta */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                  1. Chapter Basic Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Chapter Title
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Genetics & Evolution"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Class Level</label>
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
                </div>
              </div>

              {/* Step 2: Multiple Sub-Headings & PDF Attachment Builder */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#016737]" />
                      <span>2. Sub-Headings &amp; PDF Attachments Builder</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Add multiple sub-headings under this chapter and attach PDFs to each topic.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSubHeadingBlock}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#016737] border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Sub-Heading</span>
                  </button>
                </div>

                {/* Sub-Headings List */}
                <div className="space-y-4">
                  {subHeadings.map((sub, idx) => (
                    <div
                      key={sub.id}
                      className="bg-white border-2 border-slate-200 rounded-xl p-4 space-y-3 relative shadow-2xs hover:border-slate-300 transition-all"
                    >
                      {/* Sub-heading Header */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-[10px] font-mono font-bold bg-[#016737]/10 text-[#016737] px-2 py-0.5 rounded-md">
                            Topic {idx + 1}
                          </span>
                          <input
                            type="text"
                            required
                            value={sub.title}
                            onChange={(e) => handleSubHeadingTitleChange(sub.id, e.target.value)}
                            placeholder="Enter Sub-Heading Title (e.g. Mendelian Ratios)"
                            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-[#016737]"
                          />
                        </div>

                        {subHeadings.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteSubHeadingBlock(sub.id)}
                            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Delete Sub-heading"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* PDF Selector Dropdown for this Sub-heading */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                            <LinkIcon className="w-3 h-3 text-[#016737]" />
                            <span>Attach PDF to this Sub-Heading:</span>
                          </label>

                          <select
                            onChange={(e) => {
                              handleAttachPdfToSubHeading(sub.id, e.target.value);
                              e.target.value = "";
                            }}
                            className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-medium focus:outline-none focus:border-[#016737]"
                          >
                            <option value="">+ Choose Existing PDF Note --</option>
                            {availablePdfs.map((pdf) => (
                              <option key={pdf.id} value={pdf.id}>
                                {pdf.title} ({pdf.is_free ? "FREE" : `₹${pdf.price}`})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* List of currently attached PDFs in this Sub-heading */}
                        <div className="space-y-1.5 pt-1">
                          {sub.pdfIds.length > 0 ? (
                            sub.pdfIds.map((pdfId) => {
                              const pdfObj = availablePdfs.find((p) => p.id === pdfId);
                              if (!pdfObj) return null;
                              return (
                                <div
                                  key={pdfId}
                                  className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <FileText className="w-3.5 h-3.5 text-[#016737] shrink-0" />
                                    <span className="font-semibold text-slate-800 truncate">
                                      {pdfObj.title}
                                    </span>
                                    {pdfObj.is_free ? (
                                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold shrink-0">
                                        FREE
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 text-[10px] font-bold shrink-0 font-mono">
                                        ₹{pdfObj.price}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                    {/* Trending Flame Button inside Modal */}
                                    <button
                                      type="button"
                                      onClick={() => toggleRecentStatus(pdfObj.id, pdfObj.is_recent)}
                                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 border ${
                                        pdfObj.is_recent
                                          ? "bg-rose-500 text-white border-rose-600 shadow-2xs"
                                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600"
                                      }`}
                                      title={pdfObj.is_recent ? "Remove from Trending" : "+ Add to Homepage Trending"}
                                    >
                                      <Flame className={`w-3 h-3 ${pdfObj.is_recent ? "fill-white text-white" : "text-slate-400"}`} />
                                      <span>{pdfObj.is_recent ? "Recent Active" : "+ Add to Recents"}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleRemovePdfFromSubHeading(sub.id, pdfId)}
                                      className="text-[10px] font-semibold text-rose-600 hover:underline"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-[11px] text-slate-400 font-medium italic text-center py-1">
                              No PDFs attached to this sub-heading yet. Use the dropdown above to add notes!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>

            {/* Modal Footer Controls */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>PDF pricing &amp; unlock states remain preserved.</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="chapter-builder-form"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs font-bold transition-all shadow-md shadow-[#016737]/20"
                >
                  Save Chapter &amp; All Sub-Headings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
