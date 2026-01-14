/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";
import { Search, Calendar, Clock, Activity, User } from "lucide-react";

// Import Layout
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";

import {
  getOrtuDashboardStats,
  getOrtuUpcomingSchedules,
} from "@/lib/api/dashboardOrtu";

/* ================= TYPES ================= */
type ScheduleItem = {
  id: number | string;
  jenis: "observation" | "assessment";
  service_type?: string;
  nama_pasien: string;
  observer?: string; // Tambahkan field ini
  assessor?: string; // Tambahkan field ini
  status: string;
  tanggal: string;
  waktu: string;
};

type StatItem = {
  count: number;
};

export default function DashboardOrtuPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_children: { count: 0 },
    total_observations: { count: 0 },
    total_assessments: { count: 0 },
  });
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [activeTab, setActiveTab] = useState<"Semua" | "Observasi" | "Assessment">("Semua");
  const [q, setQ] = useState("");

  /* ================= MAPPING DATA UNTUK CHART ================= */
  const customChartData = useMemo(() => [
    { name: "", value: 25 }, 
    { name: "Total Anak", value: stats.total_children.count || 0 },
    { name: "Total Observasi", value: stats.total_observations.count || 0 },
    { name: "Total Assessment", value: stats.total_assessments.count || 0 },
    { name: " ", value: stats.total_assessments.count || 0 }, 
  ], [stats]);

  useEffect(() => {
    async function load() {
      try {
        const ST = (await getOrtuDashboardStats())?.data ?? {};
        setStats({
          total_children: ST.total_children ?? { count: 0 },
          total_observations: ST.total_observations ?? { count: 0 },
          total_assessments: ST.total_assessments ?? { count: 0 },
        });

        const SC = (await getOrtuUpcomingSchedules("all"))?.data ?? [];
        const mappedSchedule: ScheduleItem[] = SC.map((r: any) => {
          const isAssessment = String(r.service_type).toLowerCase().includes("assessment");
          return {
            id: r.id,
            jenis: isAssessment ? "assessment" : "observation",
            service_type: r.service_type,
            nama_pasien: r.child_name ?? "-",
            observer: !isAssessment ? (r.therapist ?? "-") : undefined, // Mapping observer
            assessor: isAssessment ? (r.therapist ?? "-") : undefined, // Mapping assessor
            status: r.status ?? "-",
            tanggal: r.date ?? "-",
            waktu: r.time ?? "-",
          };
        });
        setSchedule(mappedSchedule);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredSchedule = useMemo(() => {
    return schedule
      .filter((s) => {
        if (activeTab === "Observasi") return s.jenis === "observation";
        if (activeTab === "Assessment") return s.jenis === "assessment";
        return true;
      })
      .filter((s) => s.nama_pasien.toLowerCase().includes(q.toLowerCase()));
  }, [schedule, q, activeTab]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white space-y-4">
      <div className="w-10 h-10 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 font-medium">Menyiapkan Dashboard...</p>
    </div>
  );

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-7xl">
      <div className="space-y-6 md:space-y-10 text-[#36315B]">

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <MetricCard title="Total Anak/Pasien" data={stats.total_children} icon="👶" color="bg-blue-50" />
          <MetricCard title="Total Observasi" data={stats.total_observations} icon="👁️" color="bg-green-50" />
          <MetricCard title="Total Assessment" data={stats.total_assessments} icon="🧠" color="bg-orange-50" />
        </div>

        {/* CUSTOM CHART SECTION */}
        <div className="bg-white rounded-2xl p-5 md:p-8 border border-gray-100 transition-all duration-300 ease-out shadow-[0_8px_20px_-5px_rgba(16,185,129,0.20)] hover:shadow-[0_18px_36px_-8px_rgba(16,185,129,0.35)] hover:-translate-y-1">

          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-800 text-base md:text-lg flex items-center gap-2">
              <Activity size={20} className="text-[#81B7A9]" />
              Ringkasan Aktivitas
            </h3>
          </div>

          <div className="h-70 sm:h-80 md:h-87.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E0D7FF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F5F3FF" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#64748B', fontWeight: 500 }}
                  dy={15}
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                />
                <ReTooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#81B7A9"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                  dot={{ r: 4, fill: '#fff', stroke: '#81B7A9', strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* JADWAL SECTION */}
        <div className="bg-white rounded-2xl p-5 md:p-8 mb-10 border border-gray-100 transition-all duration-300 ease-out shadow-[0_8px_20px_-5px_rgba(16,185,129,0.20)] hover:shadow-[0_18px_36px_-8px_rgba(16,185,129,0.35)] hover:-translate-y-1">

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
            <h3 className="font-bold text-gray-800 text-base md:text-lg flex items-center gap-2">
              <Calendar size={20} className="text-[#81B7A9]" />
              Jadwal Mendatang
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="relative group flex-1 sm:flex-initial">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#81B7A9] transition-colors" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari nama anak..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#81B7A9]/20 outline-none"
                />
              </div>

              <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto no-scrollbar scroll-smooth">
                {["Semua", "Observasi", "Assessment"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t as any)}
                    className={`whitespace-nowrap px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer
                    ${activeTab === t ? "bg-white text-[#4A8B73] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TABLE VIEW (Desktop & Tablet) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="pb-4 px-2">Nama Pasien</th>
                  <th className="pb-4 px-2">Layanan</th>
                  {/* Kolom Dinamis Berdasarkan Tab */}
                  <th className={`pb-4 px-2 ${activeTab === "Semua" ? "hidden" : "block"}`}>
                    {activeTab === "Observasi" ? "Observer" : activeTab === "Assessment" ? "Assessor" : ""}
                  </th>
                  <th className="pb-4 px-2">Status</th>
                  <th className="pb-4 px-2">
                    {activeTab === "Observasi" ? "Tanggal Observasi" : activeTab === "Assessment" ? "Tanggal Assessment" : "Tanggal"}
                  </th>
                  <th className="pb-4 px-2 text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSchedule.length === 0 ? (
                  <tr><td colSpan={6} className="py-16 text-center text-gray-400 font-medium">Belum ada jadwal yang terdaftar</td></tr>
                ) : (
                  filteredSchedule.map((r) => (
                    <tr key={r.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-2 font-bold text-gray-700 group-hover:text-[#4A8B73] transition-colors">{r.nama_pasien}</td>
                      <td className="px-2 text-sm text-gray-600 font-medium">{r.service_type || "-"}</td>
                      {/* Konten Kolom Dinamis */}
                      <td className={`px-2 text-sm text-[#36315B] font-semibold italic ${activeTab === "Semua" ? "hidden" : "table-cell"}`}>
                        {activeTab === "Observasi" ? r.observer : activeTab === "Assessment" ? r.assessor : (r.observer || r.assessor || "-")}
                      </td>
                      <td className="px-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EAF4F0] text-[#4A8B73]">{r.status}</span>
                      </td>
                      <td className="px-2 text-gray-600 font-medium text-sm">{r.tanggal}</td>
                      <td className="px-2 text-right">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold text-gray-600">
                          <Clock size={12} /> {r.waktu}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="block sm:hidden space-y-4">
            {filteredSchedule.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">Belum ada jadwal</div>
            ) : (
              filteredSchedule.map((r) => (
                <div key={r.id} className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-[#36315B] text-sm">{r.nama_pasien}</div>
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase bg-[#EAF4F0] text-[#4A8B73]">{r.status}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">{r.service_type || "-"}</div>
                  
                  {/* Info Ahli pada Mobile */}
                  <div className="flex items-center gap-2 text-[11px] text-[#4A8B73] font-bold py-1 bg-[#EAF4F0]/50 rounded-lg px-2 w-fit">
                    <User size={12} />
                    <span>{activeTab === "Observasi" ? `${r.observer}` : activeTab === "Assessment" ? `${r.assessor}` : (r.observer || r.assessor)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-semibold">
                      <Calendar size={13} className="text-[#81B7A9]" />
                      {activeTab === "Observasi" ? `${r.tanggal}` : activeTab === "Assessment" ? `${r.tanggal}` : r.tanggal}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-600 font-semibold">
                      <Clock size={13} className="text-[#81B7A9]" />
                      {r.waktu}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </ResponsiveOrangtuaLayout>
  );
}

function MetricCard({ title, data, icon, color }: any) {
  return (
    <div
      className="
        bg-white rounded-2xl p-5 sm:p-6
        border border-gray-100
        flex justify-between items-center
        transition-all duration-300 ease-out
        shadow-[0_8px_20px_-5px_rgba(16,185,129,0.20)]
        hover:shadow-[0_16px_32px_-8px_rgba(16,185,129,0.35)]
        hover:-translate-y-1 hover:scale-[1.02]
        group
      "
    >
      <div className="space-y-1">
        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest leading-tight">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl md:text-3xl font-black text-[#36315B]">
            {data.count}
          </h4>
          <span className="text-[10px] sm:text-xs font-bold text-gray-400">
            Total
          </span>
        </div>
      </div>

      <div
        className={`
          ${color}
          w-12 h-12 md:w-16 md:h-16
          flex items-center justify-center
          rounded-2xl
          shadow-inner
          transition-all duration-300
          group-hover:scale-110
          group-hover:rotate-3
        `}
      >
        <span className="text-xl sm:text-2xl md:text-3xl">{icon}</span>
      </div>
    </div>
  );
}
