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
import { Search, Calendar, Clock, User, Activity } from "lucide-react";

// Import Layout Baru
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";

import {
  getOrtuDashboardStats,
  getOrtuDashboardChart,
  getOrtuUpcomingSchedules,
} from "@/lib/api/dashboardOrtu";

/* ================= TYPES ================= */
type ChartItem = {
  monthIndex: number;
  name: string;
  total_children: number;
  total_observations: number;
  total_assessments: number;
};

type ScheduleItem = {
  id: number | string;
  jenis: "observation" | "assessment";
  service_type?: string;
  nama_pasien: string;
  observer?: string;
  assessor?: string;
  status: string;
  tanggal: string;
  waktu: string;
};

type StatItem = {
  count: number;
  percentage?: number;
  direction?: "up" | "down";
  label?: string;
};

const MONTH_ORDER: Record<string, { index: number; label: string }> = {
  Jan: { index: 0, label: "Jan" },
  Feb: { index: 1, label: "Feb" },
  Mar: { index: 2, label: "Mar" },
  Apr: { index: 3, label: "Apr" },
  Mei: { index: 4, label: "Mei" },
  Jun: { index: 5, label: "Jun" },
  Jul: { index: 6, label: "Jul" },
  Agt: { index: 7, label: "Agt" },
  Sep: { index: 8, label: "Sep" },
  Okt: { index: 9, label: "Okt" },
  Nov: { index: 10, label: "Nov" },
  Des: { index: 11, label: "Des" },
};

const formatDateID = (d?: string) => d || "-";

export default function DashboardOrtuPage() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<{
    total_children: StatItem;
    total_observations: StatItem;
    total_assessments: StatItem;
  }>({
    total_children: { count: 0 },
    total_observations: { count: 0 },
    total_assessments: { count: 0 },
  });

  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [activeTab, setActiveTab] = useState<"Semua" | "Observasi" | "Assessment">("Semua");
  const [q, setQ] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function load() {
      try {
        const ST = (await getOrtuDashboardStats())?.data ?? {};
        setStats({
          total_children: ST.total_children ?? { count: 0 },
          total_observations: ST.total_observations ?? { count: 0 },
          total_assessments: ST.total_assessments ?? { count: 0 },
        });

        const CH = (await getOrtuDashboardChart())?.data ?? [];
        const mappedChart: ChartItem[] = CH
          .map((x: any): ChartItem => {
            const [bulan] = String(x.month ?? "").split(" ");
            const m = MONTH_ORDER[bulan];
            return {
              monthIndex: m?.index ?? 0,
              name: m?.label ?? "-",
              total_children: Number(x.total_children ?? 0),
              total_observations: Number(x.total_observations ?? 0),
              total_assessments: Number(x.total_assessments ?? 0),
            };
          })
          .sort((a: ChartItem, b: ChartItem) => a.monthIndex - b.monthIndex);
        setChartData(mappedChart);

        const SC = (await getOrtuUpcomingSchedules("all"))?.data ?? [];
        const mappedSchedule: ScheduleItem[] = SC.map((r: any) => {
          const isAssessment = String(r.service_type).toLowerCase().includes("assessment");
          return {
            id: r.id,
            jenis: isAssessment ? "assessment" : "observation",
            service_type: r.service_type,
            nama_pasien: r.child_name ?? "-",
            observer: !isAssessment ? r.therapist ?? "-" : "-",
            assessor: isAssessment ? r.therapist ?? "-" : "-",
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

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <div className="w-10 h-10 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Menyiapkan Dashboard...</p>
      </div>
    );
  }

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-7xl">
      <div className="space-y-6 md:space-y-10 text-[#36315B]">
        
        {/* ================= METRIC ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <MetricCard title="Total Anak/Pasien" data={stats.total_children} icon="👶" color="bg-blue-50" />
          <MetricCard title="Total Observasi" data={stats.total_observations} icon="👁️" color="bg-green-50" />
          <MetricCard title="Total Assessment" data={stats.total_assessments} icon="🧠" color="bg-orange-50" />
        </div>

        {/* ================= CHART ================= */}
        <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 text-base md:text-lg flex items-center gap-2">
              <Activity size={20} className="text-[#81B7A9]" />
              Grafik Aktivitas
            </h3>
            <div className="hidden md:flex gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#7c73f6] rounded-full"></span> Anak</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#34d399] rounded-full"></span> Observasi</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#fb923c] rounded-full"></span> Assessment</div>
            </div>
          </div>
          
          <div className="h-[280px] md:h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorChild" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c73f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#7c73f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 11, fill: '#94A3B8'}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 11, fill: '#94A3B8'}} 
                />
                <ReTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="total_children" stroke="#7c73f6" strokeWidth={3} fill="url(#colorChild)" />
                <Area type="monotone" dataKey="total_observations" stroke="#34d399" strokeWidth={3} fillOpacity={0} />
                <Area type="monotone" dataKey="total_assessments" stroke="#fb923c" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-6 text-[10px] md:hidden justify-center border-t border-gray-50 pt-4 font-semibold text-gray-500 uppercase tracking-wider">
             <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#7c73f6] rounded-full"></div> Anak</div>
             <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#34d399] rounded-full"></div> Observasi</div>
             <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#fb923c] rounded-full"></div> Assmt</div>
          </div>
        </div>

        {/* ================= JADWAL SECTION ================= */}
        <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-gray-100 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
            <h3 className="font-bold text-gray-800 text-base md:text-lg flex items-center gap-2">
              <Calendar size={20} className="text-[#81B7A9]" />
              Jadwal Mendatang
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#81B7A9] transition-colors" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari nama anak..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#81B7A9]/20 transition-all outline-none"
                />
              </div>
              
              <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
                {["Semua", "Observasi", "Assessment"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t as any)}
                    className={`whitespace-nowrap px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold transition-all
                    ${activeTab === t
                        ? "bg-white text-[#4A8B73] shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TABLE VIEW (Tablet & Desktop) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="pb-4 px-2">Pasien</th>
                  <th className="pb-4 px-2">Layanan / Tenaga Ahli</th>
                  <th className="pb-4 px-2">Status</th>
                  <th className="pb-4 px-2">Jadwal</th>
                  <th className="pb-4 px-2 text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSchedule.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-gray-400 font-medium">
                      Belum ada jadwal yang terdaftar
                    </td>
                  </tr>
                ) : (
                  filteredSchedule.map((r) => (
                    <tr key={r.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-2">
                        <div className="font-bold text-gray-700 group-hover:text-[#4A8B73] transition-colors">{r.nama_pasien}</div>
                      </td>
                      <td className="px-2">
                        <div className="text-sm text-gray-600 font-medium">{r.service_type || "-"}</div>
                        <div className="text-[11px] text-gray-400">Ahli: {r.observer || r.assessor || "-"}</div>
                      </td>
                      <td className="px-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          r.status.toLowerCase() === 'selesai' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-[#EAF4F0] text-[#4A8B73]'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-2 text-gray-600 font-medium text-sm whitespace-nowrap">
                        {formatDateID(r.tanggal)}
                      </td>
                      <td className="px-2 text-right">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold text-gray-600">
                          <Clock size={12} />
                          {r.waktu}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* CARD VIEW (Mobile) */}
          <div className="sm:hidden space-y-4">
            {filteredSchedule.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">Tidak ada jadwal ditemukan</div>
            ) : (
              filteredSchedule.map((r) => (
                <div key={r.id} className="p-4 border border-gray-100 rounded-2xl space-y-4 bg-gray-50/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-[#36315B]">{r.nama_pasien}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{r.service_type}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase ${
                      r.status.toLowerCase() === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-600">{r.tanggal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-600">{r.waktu}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <User size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-500 truncate">Ahli: {r.observer || r.assessor}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}

/* ================= METRIC CARD ================= */
function MetricCard({
  title,
  data,
  icon,
  color
}: {
  title: string;
  data: StatItem;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-center group hover:border-[#81B7A9] transition-all duration-300">
      <div className="space-y-1">
        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl md:text-3xl font-black text-[#36315B]">{data.count}</h4>
          <span className="text-xs font-bold text-gray-400">Total</span>
        </div>
      </div>
      <div className={`text-2xl md:text-3xl ${color} w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    </div>
  );
}