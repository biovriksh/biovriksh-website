"use client";

import { useState, useEffect } from "react";
import { Users, Search, UserCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types/database";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Profile[]>([
    { id: "s1", full_name: "Rahul Sharma", phone: "+91 9876543210", role: "student", created_at: new Date().toISOString() },
    { id: "s2", full_name: "Priya Patel", phone: "+91 9876543211", role: "student", created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: "s3", full_name: "Aman Verma", phone: "+91 9876543212", role: "student", created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const fetchStudents = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) setStudents(data);
    } catch (e) {
      console.log("Using initial student list");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-4 h-4 text-[#016737]" />
            <span>Registered Student Directory</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Registered NEET aspirants community directory.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or phone..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
          />
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider bg-slate-50">
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Phone Number</th>
                <th className="py-2.5 px-3">Joined Date</th>
                <th className="py-2.5 px-3">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#016737]/10 text-[#016737] flex items-center justify-center font-bold text-xs">
                      {s.full_name?.charAt(0) || "S"}
                    </div>
                    <span>{s.full_name || "Aspirant Student"}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 font-medium">
                    {s.phone || "+91 98765XXXXX"}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                    {new Date(s.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      <span>Active Aspirant</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
