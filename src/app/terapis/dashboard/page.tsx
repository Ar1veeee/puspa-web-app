/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";

import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import PasienChart from "@/components/dashboard/pasien_chart";

import {
  getDashboardMetrics,
  getUpcomingSchedules,
} from "@/lib/api/dashboardTerapis";

/* ================= CUSTOM X AXIS TICK ================= */
const CustomXAxisTick = ({ x, y, payload }: any) => {
  const words = payload.value.split(" ");

  return (
    <g transform={`translate(${x},${y + 8})`}>
      <text
        textAnchor="middle"
        fill="#36315B"
        fontSize={10}
      >
        {words.map((word: string, index: number) => (
          <tspan
            key={index}
            x="0"
            dy={index === 0 ? 0 : 12}   // 🔥 jarak antar baris DIPERKECIL
          >
            {word}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [trend, setTrend] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const dashboardRes = await getDashboardMetrics();
        const upcomingRes = await getUpcomingSchedules();

        const d = dashboardRes.data;

        setMetrics(d.metrics);

        setCategories(
          (d.patient_categories ?? []).map((c: any) => ({
            name: c.type,
            value: Number(c.percentage),
            count: Number(c.count), 
          }))
        );

        setTrend(
          (d.trend_chart ?? []).map((t: any) => ({
            name: t.label,
            value: Number(t.value),
          }))
        );

        setSchedule(upcomingRes.data ?? []);

        if (d.period) {
          setCurrentPeriod(d.period.month_name);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);
const filteredSchedule = schedule.filter((s: any) => {
    if (role === "terapis") {
      if (Array.isArray(s.types)) {
        return !s.types.some((t: string) =>
          t.toLowerCase().includes("assessment")
        );
      }
      return true;
    }
    return true;
  });

  if (loading || !role) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-[#36315B]">
      <SidebarTerapis />

      <div className="flex flex-col flex-1">
        <HeaderTerapis />

        <main className="p-8 space-y-10 overflow-y-auto">
          {/* ================= METRIC CARDS ================= */}
          <div
            className={`grid gap-6 ${
              role === "terapis" ? "grid-cols-3" : "grid-cols-4"
            }`}
          >
            <MetricCard
              label="Total Observasi"
              value={metrics?.total_observations?.current}
              percent={metrics?.total_observations?.change_percent}
            />

            {role === "asesor" && (
              <MetricCard
                label="Total Assessment"
                value={metrics?.total_assessments?.current}
                percent={metrics?.total_assessments?.change_percent}
              />
            )}

            <MetricCard
              label="Tingkat Penyelesaian"
              value={metrics?.completion_rate?.current}
              percent={metrics?.completion_rate?.change_percent}
            />

            {role === "terapis" ? (
              <MetricCard
                label="Total Terapis"
                value={metrics?.total_therapists?.current}
                percent={metrics?.total_therapists?.change_percent}
              />
            ) : (
              <MetricCard
                label="Total Asesor"
                value={metrics?.total_assessors?.current}
                percent={metrics?.total_assessors?.change_percent}
              />
            )}
          </div>

          {/* ================= CHART SECTION ================= */}
          <div className="grid grid-cols-3 gap-6">
           <div className="
  bg-white rounded-xl p-6
  shadow-[0_6px_20px_rgba(64,158,134,0.35)]
  transition-all duration-300
  hover:shadow-[0_10px_24px_rgba(64,158,134,0.3)]
">


              <PasienChart apiData={categories} />
            </div>

            <div className="
  col-span-2 bg-white rounded-xl p-6
  shadow-[0_6px_20px_rgba(64,158,134,0.35)]
  transition-all duration-300
  hover:shadow-[0_10px_24px_rgba(64,158,134,0.3)]
">

              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Trend Bulanan</h3>
                <span className="text-sm text-gray-400">{currentPeriod}</span>
              </div>

              <div className="h-72">
                <ResponsiveContainer>
                  <AreaChart
  data={trend}
  margin={{ top: 10, right: 35, left: 0, bottom: 20 }} // 🔥 TAMBAH bottom
>

                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

                    {/* 🔥 XAXIS RAPAT & PADAT */}
                    <XAxis
                      dataKey="name"
                      interval={0}
                      height={44}
                      tick={<CustomXAxisTick 
                      />}
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      domain={[0, 100]}
                      ticks={[0, 20, 40, 60, 80, 100]}
                    />

                    

                    <ReTooltip />

                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      fill="#8B5CF6"
                      fillOpacity={0.25}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ================= UPCOMING SCHEDULE ================= */}
          <div className="
  bg-white rounded-xl p-6
  shadow-[0_6px_20px_rgba(64,158,134,0.35)]
  transition-all duration-300
  hover:shadow-[0_10px_24px_rgba(64,158,134,0.3)]
">

            <h3 className="font-semibold mb-6">Jadwal Mendatang</h3>

            <table className="w-full text-sm table-fixed">
  <thead>
  <tr className="border-b text-gray-500 align-top">
    <th className="py-3 text-left w-[25%] align-top">
      Nama Pasien
    </th>

    <th className="py-3 text-left w-[25%] align-top leading-relaxed">
      Jenis Layanan
    </th>

    <th className="py-3 text-center w-[15%] align-top">
      Status
    </th>

    <th className="py-3 text-center w-[20%] align-top">
      Tanggal
    </th>

    <th className="py-3 text-center w-[15%] align-top">
      Waktu
    </th>
  </tr>
</thead>


     <tbody>
  {/* EMPTY STATE */}
  {filteredSchedule.length === 0 && (
    <tr>
      <td colSpan={5} className="text-center py-6 text-gray-400">
        Tidak ada jadwal
      </td>
    </tr>
  )}


  {filteredSchedule.map((s: any, index: number) => (

    <tr
      key={`${s.id}-${s.date}-${s.time}-${index}`}
      className="border-b align-top"
    >
      <td className="py-3">{s.child_name}</td>

      {/* 🔥 JENIS LAYANAN → LIST KE BAWAH */}
      <td className="py-3 whitespace-normal align-top">
        {Array.isArray(s.types) && s.types.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {s.types.map((type: string, i: number) => (
              <li key={i} className="wreak-break-words leading-relaxed">
                {type}
              </li>
            ))}
          </ul>
        ) : (
          "-"
        )}
      </td>

      <td className="py-3 text-center">
        <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-600">
          {s.status}
        </span>
      </td>

      <td className="py-3 text-center">{s.date}</td>
      <td className="py-3 text-center">{s.time}</td>
    </tr>
  ))}
</tbody>


            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ================= METRIC CARD ================= */
function MetricCard({
  label,
  value,
  percent,
}: {
  label: string;
  value: any;
  percent: number;
}) {
  return (
    <div
  className="
    bg-white rounded-xl p-6
    shadow-[0_6px_20px_rgba(64,158,134,0.35)]
    transition-all duration-300 ease-out
    hover:shadow-[0_10px_24px_rgba(64,158,134,0.35)]
    hover:-translate-y-1
  "
>


      <div className="text-xs text-gray-400">{label}</div>

      <div className="mt-4">
        <div className="text-2xl font-bold">{value}</div>

        <div
          className={`text-xs mt-1 ${
            percent >= 0 ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {percent >= 0 ? "↑" : "↓"} {Math.abs(percent)}% dari bulan lalu
        </div>
      </div>
    </div>
  );
}
