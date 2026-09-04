"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, CheckCircle2, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Purchase } from "@/types/database";

export default function AdminOrdersPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("purchases")
        .select("*, student:profiles(*), pdf:pdfs(*)")
        .order("purchased_at", { ascending: false });

      if (data) setPurchases(data as any);
    } catch (e) {
      console.log("Error fetching orders:", e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredPurchases = purchases.filter(
    (p) =>
      p.student?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pdf?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.payment_gateway_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-[#016737]" />
            <span>Orders &amp; Sales Log</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Verified student purchases and Razorpay payment IDs.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or Txn ID..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#016737]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider bg-slate-50">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">PDF Material</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Razorpay Txn ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {new Date(p.purchased_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900 block">{p.student?.full_name || "Aspirant"}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{p.student?.phone}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#016737]">{p.pdf?.title}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">₹{p.amount_paid}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{p.payment_status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {p.payment_gateway_id || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    No order transactions found in Supabase database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
