/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { getOkupasiParentAnswer } from "@/lib/api/riwayatAsesmentOrtu";

/* ===================== TYPE ===================== */
type AnswerItem = {
  question_id: string;
  question_text: string;
  answer: {
    value: string | number | string[] | null;
  };
  note: string | null;
};

/* ===================== STEPPER ===================== */
const steps = [
  "Data Umum",
  "Data Fisioterapi",
  "Data Terapi Okupasi",
  "Data Terapi Wicara",
  "Data Paedagog",
];

/* ===================== ASPEK RANGE ===================== */
const okupasiAspectRanges = [
  { key: "general", label: "General — Auditory & Language", range: [486, 494] },
  { key: "gustatory", label: "Gustatori / Olfaktori", range: [495, 502] },
  { key: "visual", label: "Visual", range: [503, 511] },
  { key: "tactile", label: "Taktil", range: [512, 526] },
  { key: "proprio", label: "Proprioseptif", range: [527, 531] },
  { key: "vestibular", label: "Vestibular", range: [532, 542] },
  { key: "body", label: "Persepsi Tubuh & Reaksi", range: [543, 554] },
  { key: "daily", label: "Aktivitas Sehari-hari", range: [555, 568] },
  { key: "behavior", label: "Perilaku & Sosialisasi", range: [569, 570] },
  { key: "frequency", label: "Frekuensi Perilaku", range: [571, 578] },
];

export default function RiwayatOkupasiParentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");

  const [items, setItems] = useState<AnswerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAspectIndex, setActiveAspectIndex] = useState(0);

  const activeStep = 2;
  const activeAspect = okupasiAspectRanges[activeAspectIndex];

  /* ===================== FETCH ===================== */
  useEffect(() => {
    if (!assessmentId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getOkupasiParentAnswer(assessmentId);
        setItems(res?.data || []);
      } catch (err) {
        console.error("❌ Gagal load okupasi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  /* ===================== FILTER ASPEK ===================== */
  const filteredItems = items.filter((q) => {
    const id = Number(q.question_id);
    return id >= activeAspect.range[0] && id <= activeAspect.range[1];
  });

  /* ===================== RENDER ANSWER ===================== */
  const renderAnswer = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>;
    }

    if (Array.isArray(value)) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {value.map((v, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border"
            >
              <span className="w-4 h-4 bg-[#6BB1A0] rounded flex items-center justify-center text-white text-xs">
                ✓
              </span>
              <span className="text-sm">{String(v)}</span>
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === "number") {
      return (
        <div className="flex items-center gap-4">
          <input type="range" min={1} max={5} value={value} disabled className="w-full" />
          <span className="text-sm font-semibold">{value}</span>
        </div>
      );
    }

    return (
      <span className="text-base font-medium text-[#36315B]">
        {String(value)}
      </span>
    );
  };

  /* ===================== UI ===================== */
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-2">
          <Header pageTitle="Assessment" />
          <p className="p-8">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-[#36315B]">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-2">
        <Header pageTitle="Assessment" />

        <main className="p-8">
          {/* CLOSE */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => router.push("/admin/jadwal_asesmen")}
              className="text-2xl font-bold hover:text-red-500"
            >
              ✕
            </button>
          </div>

          {/* ================= STEPPER ================= */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              {steps.map((label, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-semibold ${
                        i === activeStep
                          ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-12 h-px bg-gray-300 mx-2 translate-y-[-12px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-5xl mx-auto relative">
            {/* DROPDOWN ASPEK */}
            <div className="absolute top-6 right-6">
              <select
                value={activeAspectIndex}
                onChange={(e) => setActiveAspectIndex(Number(e.target.value))}
                className="border rounded-lg px-3 py-2 text-sm font-medium"
              >
                {okupasiAspectRanges.map((a, i) => (
                  <option key={a.key} value={i}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            <h2 className="text-lg font-semibold mb-8">
              {activeAspect.label}
            </h2>

            <div className="space-y-8">
              {filteredItems.map((q, idx) => (
                <div key={q.question_id}>
                  <p className="text-sm font-semibold mb-2">
                    {idx + 1}. {q.question_text}
                  </p>

                  <div className="bg-gray-100 rounded-xl p-5 leading-relaxed">
                    {renderAnswer(q.answer?.value)}
                  </div>

                  {q.note && (
                    <p className="text-xs text-gray-500 mt-2">
                      Catatan: {q.note}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* NAVIGATION */}
            <div className="flex justify-between mt-10">
              <button
                disabled={activeAspectIndex === 0}
                onClick={() => setActiveAspectIndex((i) => i - 1)}
                className="px-6 py-2 rounded-lg border font-semibold disabled:opacity-40"
              >
                ← Sebelumnya
              </button>

              <button
                disabled={activeAspectIndex === okupasiAspectRanges.length - 1}
                onClick={() => setActiveAspectIndex((i) => i + 1)}
                className="px-6 py-2 rounded-lg bg-[#6BB1A0] text-white font-semibold disabled:opacity-40"
              >
                Selanjutnya →
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
