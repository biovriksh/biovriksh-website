"use client";

import { useState, useEffect } from "react";
import { FolderTree, Plus, BookOpen, CheckCircle2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Chapter } from "@/types/database";

export default function AdminChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: "ch1", name: "Genetics & Evolution", subject: "Biology", order_index: 1, is_active: true, created_at: new Date().toISOString() },
    { id: "ch2", name: "Human Reproduction & Health", subject: "Biology", order_index: 2, is_active: true, created_at: new Date().toISOString() },
    { id: "ch3", name: "Cell Structure & Functions", subject: "Biology", order_index: 3, is_active: true, created_at: new Date().toISOString() },
    { id: "ch4", name: "Plant Physiology & Photosynthesis", subject: "Biology", order_index: 4, is_active: true, created_at: new Date().toISOString() },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("Biology");
  const [orderIndex, setOrderIndex] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchChapters = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("chapters")
        .select("*")
        .order("order_index", { ascending: true });

      if (data && data.length > 0) {
        setChapters(data);
      }
    } catch (e) {
      console.log("Using initial chapters data");
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const newChapter = {
        name,
        subject,
        order_index: Number(orderIndex),
        is_active: true,
      };

      const { data } = await supabase.from("chapters").insert(newChapter).select().single();

      if (data) {
        setChapters((prev) => [...prev, data]);
      } else {
        setChapters((prev) => [
          ...prev,
          { id: `ch-${Date.now()}`, name, subject, order_index: Number(orderIndex), is_active: true, created_at: new Date().toISOString() },
        ]);
      }

      setIsModalOpen(false);
      setName("");
    } catch (e) {
      console.log("Chapter created");
    } finally {
      setLoading(false);
    }
  };

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
            <FolderTree className="w-4 h-4 text-[#016737]" />
            <span>Chapter Management</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Organize NEET biology chapters and set display ordering.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-[#016737] hover:bg-[#014d29] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Chapter</span>
        </button>
      </div>

      {/* Chapters Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider bg-slate-50">
                <th className="py-2.5 px-3">Order</th>
                <th className="py-2.5 px-3">Chapter Title</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {chapters.map((ch) => (
                <tr key={ch.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#016737]">
                    #{ch.order_index}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ch.name}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-medium">{ch.subject}</td>
                  <td className="py-3 px-3">
                    {ch.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Live Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold">
                        <span>Hidden</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => toggleChapterActive(ch.id, ch.is_active)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border shadow-2xs ${
                        ch.is_active
                          ? "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                          : "bg-[#016737] hover:bg-[#014d29] text-white border-transparent"
                      }`}
                    >
                      {ch.is_active ? "Hide" : "Publish"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Chapter */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-sm text-slate-900">Add New Chapter</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateChapter} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chapter Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Molecular Basis of Inheritance"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Order Index
                </label>
                <input
                  type="number"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
                />
              </div>

              <div className="pt-3 flex gap-2.5">
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
                  Save Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
