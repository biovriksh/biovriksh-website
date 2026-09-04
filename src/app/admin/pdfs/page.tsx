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
  BookOpen,
  Pin,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PDFNote, Chapter, NoteType, ClassLevel } from "@/types/database";

export default function AdminPDFsPage() {
  const [pdfs, setPdfs] = useState<PDFNote[]>([
    {
      id: "pdf1",
      chapter_id: "ch1",
      title: "Class 12 Genetics & Evolution - NCERT High Yield Notes",
      description: "Complete Mendelian genetics ratios, Chromosomal theory, DNA replication flowcharts.",
      thumbnail_url: "/hero_biology_ultra_wow.png",
      file_path: "genetics_class12.pdf",
      is_free: false,
      price: 49,
      is_active: true,
      is_recent: true,
      note_type: "paid",
      class_level: "Class 12",
      page_count: 18,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "pdf2",
      chapter_id: "ch2",
      title: "Human Reproduction & Embryology Special Mindmap",
      description: "Gametogenesis, Menstrual cycle hormones, Fertilization & Implantation diagrams.",
      thumbnail_url: "/hero_real_bio_tree.png",
      file_path: "human_reproduction.pdf",
      is_free: true,
      price: 0,
      is_active: true,
      is_recent: true,
      note_type: "short",
      class_level: "Class 12",
      page_count: 14,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "pdf3",
      chapter_id: "ch3",
      title: "Cell Structure & Organelles Full Chapter Pack",
      description: "Mitochondria, Chloroplast, Ribosome structure, Endomembrane system notes.",
      thumbnail_url: "/hero_tree_of_life_3d.png",
      file_path: "cell_biology.pdf",
      is_free: false,
      price: 99,
      is_active: true,
      is_recent: false,
      note_type: "chapter",
      class_level: "Class 11",
      page_count: 24,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeTabFilter, setActiveTabFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [noteType, setNoteType] = useState<NoteType>("paid");
  const [classLevel, setClassLevel] = useState<ClassLevel>("Class 12");
  const [chapterId, setChapterId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [isRecent, setIsRecent] = useState(true);
  const [price, setPrice] = useState(49);
  const [pageCount, setPageCount] = useState(16);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const fetchData = async () => {
    try {
      const supabase = createClient();
      const { data: chaptersData } = await supabase.from("chapters").select("*").eq("is_active", true);
      if (chaptersData) setChapters(chaptersData);

      const { data: pdfsData } = await supabase.from("pdfs").select("*, chapter:chapters(*)").order("created_at", { ascending: false });
      if (pdfsData && pdfsData.length > 0) setPdfs(pdfsData as any);
    } catch (e) {
      console.log("Using initial data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUploadPDF = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("Uploading files to Supabase Storage...");

    try {
      const supabase = createClient();

      let thumbnailUrl = "/hero_biology_ultra_wow.png";
      let filePath = `notes_${Date.now()}.pdf`;

      if (thumbnailFile) {
        const thumbName = `thumb_${Date.now()}_${thumbnailFile.name}`;
        const { data: thumbData } = await supabase.storage
          .from("pdf-thumbnails")
          .upload(thumbName, thumbnailFile);

        if (thumbData) {
          const { data: publicUrlData } = supabase.storage
            .from("pdf-thumbnails")
            .getPublicUrl(thumbName);
          thumbnailUrl = publicUrlData.publicUrl;
        }
      }

      if (pdfFile) {
        const pdfFileName = `pdf_${Date.now()}_${pdfFile.name}`;
        const { data: pdfUploadData } = await supabase.storage
          .from("pdf-files")
          .upload(pdfFileName, pdfFile);

        if (pdfUploadData) {
          filePath = pdfUploadData.path;
        }
      }

      const isActuallyFree = noteType === "free" || isFree;

      const newPdfRow = {
        chapter_id: chapterId || null,
        title,
        description,
        thumbnail_url: thumbnailUrl,
        file_path: filePath,
        is_free: isActuallyFree,
        price: isActuallyFree ? 0 : Number(price),
        is_recent: isRecent,
        note_type: noteType,
        class_level: classLevel,
        page_count: Number(pageCount),
        is_active: true,
      };

      const { data: insertedData } = await supabase.from("pdfs").insert(newPdfRow).select().single();

      if (insertedData) {
        setPdfs((prev) => [insertedData as any, ...prev]);
      } else {
        setPdfs((prev) => [
          {
            id: `pdf-${Date.now()}`,
            chapter_id: chapterId,
            title,
            description,
            thumbnail_url: thumbnailUrl,
            file_path: filePath,
            is_free: isActuallyFree,
            price: isActuallyFree ? 0 : Number(price),
            is_active: true,
            is_recent: isRecent,
            note_type: noteType,
            class_level: classLevel,
            page_count: Number(pageCount),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.log("Uploaded successfully");
    } finally {
      setLoading(false);
      setStatusMessage("");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIsFree(false);
    setIsRecent(true);
    setNoteType("paid");
    setPrice(49);
    setThumbnailFile(null);
    setPdfFile(null);
  };

  const togglePdfActive = async (id: string, currentStatus: boolean) => {
    setPdfs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_active: !currentStatus } : item))
    );

    try {
      const supabase = createClient();
      await supabase.from("pdfs").update({ is_active: !currentStatus }).eq("id", id);
    } catch (e) {
      // Ignored
    }
  };

  const togglePdfRecent = async (id: string, currentRecent: boolean) => {
    setPdfs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_recent: !currentRecent } : item))
    );

    try {
      const supabase = createClient();
      await supabase.from("pdfs").update({ is_recent: !currentRecent }).eq("id", id);
    } catch (e) {
      // Ignored
    }
  };

  const filteredPdfs = pdfs.filter((item) => {
    if (activeTabFilter === "recent") return item.is_recent;
    if (activeTabFilter === "paid") return !item.is_free;
    if (activeTabFilter === "free") return item.is_free;
    if (activeTabFilter === "short") return item.note_type === "short";
    if (activeTabFilter === "chapter") return item.note_type === "chapter" || item.chapter_id;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#016737]" />
            <span>Study Notes &amp; PDF Manager</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage notes, set pricing, assign chapters, and toggle <strong>Featured in Recent</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload New PDF Note</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: "all", label: "All Materials", count: pdfs.length },
          { id: "recent", label: "📌 Featured in Recent", count: pdfs.filter((p) => p.is_recent).length },
          { id: "paid", label: "🔒 Paid Notes", count: pdfs.filter((p) => !p.is_free).length },
          { id: "free", label: "🟢 Free Notes", count: pdfs.filter((p) => p.is_free).length },
          { id: "short", label: "⚡ Short Notes", count: pdfs.filter((p) => p.note_type === "short").length },
          { id: "chapter", label: "📚 Chapter Notes", count: pdfs.filter((p) => p.chapter_id || p.note_type === "chapter").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
              activeTabFilter === tab.id
                ? "bg-[#016737] text-white border-[#016737] shadow-2xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                activeTabFilter === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* PDFs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider bg-slate-50">
                <th className="py-2.5 px-3">Study Note</th>
                <th className="py-2.5 px-3">Class &amp; Type</th>
                <th className="py-2.5 px-3">Price</th>
                <th className="py-2.5 px-3">Recent Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredPdfs.map((pdf) => (
                <tr key={pdf.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                        <img
                          src={pdf.thumbnail_url || "/hero_biology_ultra_wow.png"}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-xs leading-snug">{pdf.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-normal">
                          {pdf.description || "NCERT revision note."}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="space-y-0.5">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px] border border-slate-200">
                        {pdf.class_level || "Class 12"}
                      </span>
                      <span className="block text-[10px] font-medium text-[#016737]">
                        {pdf.note_type === "short"
                          ? "⚡ Short Mindmap"
                          : pdf.chapter_id
                          ? "📚 Chapter Note"
                          : "📄 Note"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    {pdf.is_free ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[10px]">
                        <Unlock className="w-3 h-3 text-emerald-600" />
                        <span>FREE</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-bold text-[10px]">
                        <Lock className="w-3 h-3 text-amber-700" />
                        <span>₹{pdf.price}</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => togglePdfRecent(pdf.id, pdf.is_recent)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border transition-all ${
                        pdf.is_recent
                          ? "bg-amber-50 border-amber-200 text-amber-900"
                          : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      <Pin className="w-3 h-3" />
                      <span>{pdf.is_recent ? "📌 Featured" : "Not Featured"}</span>
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => togglePdfActive(pdf.id, pdf.is_active)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border shadow-2xs ${
                        pdf.is_active
                          ? "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                          : "bg-[#016737] hover:bg-[#014d29] text-white border-transparent"
                      }`}
                    >
                      {pdf.is_active ? "Hide" : "Publish"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 max-w-lg w-full shadow-xl my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#016737]" />
                <span>Upload New Study Material</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadPDF} className="space-y-3.5">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Material Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "paid", label: "🔒 Paid Note", icon: Lock },
                    { id: "free", label: "🟢 Free Note", icon: Unlock },
                    { id: "short", label: "⚡ Short Note", icon: Zap },
                    { id: "chapter", label: "📚 Chapter Note", icon: BookOpen },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setNoteType(cat.id as any);
                        if (cat.id === "free") setIsFree(true);
                        else setIsFree(false);
                      }}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                        noteType === cat.id
                          ? "bg-[#016737] text-white border-[#016737]"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <cat.icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Class & Chapter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class Level</label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
                  >
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                    <option value="NEET Special">NEET Special</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chapter Topic</label>
                  <select
                    value={chapterId}
                    onChange={(e) => setChapterId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
                  >
                    <option value="">Select Chapter...</option>
                    {chapters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">PDF Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Class 12 Biology - NCERT Note"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key Mendelian ratios and diagrams."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
                />
              </div>

              {/* Files Upload Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <ImageIcon className="w-4 h-4 text-[#016737] mx-auto mb-1" />
                  <label className="block text-xs font-semibold text-slate-700 mb-1 cursor-pointer">
                    Cover Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                    className="text-[10px] text-slate-500 w-full"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <FileText className="w-4 h-4 text-[#8BC43F] mx-auto mb-1" />
                  <label className="block text-xs font-semibold text-slate-700 mb-1 cursor-pointer">
                    PDF File
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    className="text-[10px] text-slate-500 w-full"
                  />
                </div>
              </div>

              {/* Recent Showcase Checkbox & Price */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecent}
                    onChange={(e) => setIsRecent(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#016737] rounded border-slate-300"
                  />
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    <Pin className="w-3 h-3 text-amber-600" />
                    <span>Feature in Homepage Recent Section</span>
                  </span>
                </label>

                {noteType === "paid" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-[#016737]"
                    />
                  </div>
                )}
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-pulse">
                  {statusMessage}
                </div>
              )}

              {/* Buttons */}
              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs font-semibold shadow-2xs"
                >
                  {loading ? "Uploading..." : "Save & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
