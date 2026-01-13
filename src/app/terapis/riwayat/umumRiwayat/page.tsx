/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { getUmumParentAnswer } from "@/lib/api/riwayatAsesmentOrtu";

/* ===================== TYPES ===================== */
type AnswerItem = {
  question_id: string;
  question_text: string;
  answer: any;
  note: string | null;
};

/* ===================== RANGE ASPEK ===================== */
const parentGeneralRanges = [
  { key: "riwayat_psikososial", label: "Riwayat Psikososial", range: [430, 434] },
  { key: "riwayat_kehamilan", label: "Riwayat Kehamilan", range: [435, 442] },
  { key: "riwayat_kelahiran", label: "Riwayat Kelahiran", range: [443, 455] },
  { key: "riwayat_setelah_kelahiran", label: "Riwayat Setelah Kelahiran", range: [456, 468] },
  { key: "riwayat_kesehatan", label: "Riwayat Kesehatan", range: [469, 476] },
  { key: "riwayat_pendidikan", label: "Riwayat Pendidikan", range: [477, 485] },
];

/* ===================== STEPPER ===================== */
const steps = [
  "Data Umum",
  "Data Fisioterapi",
  "Data Terapi Okupasi",
  "Data Terapi Wicara",
  "Data Paedagog",
];

export default function RiwayatJawabanUmum() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");

  const [items, setItems] = useState<AnswerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeAspekIndex, setActiveAspekIndex] = useState(0);

  const activeAspek = parentGeneralRanges[activeAspekIndex];
  const activeStep = 0; // Data Umum

  /* ===================== FETCH ===================== */
  useEffect(() => {
    if (!assessmentId) {
      setErrorMsg("assessment_id tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await getUmumParentAnswer(assessmentId);
        setItems(res?.data || []);
      } catch (err) {
        console.error(err);
        setErrorMsg("Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  /* ===================== FILTER ===================== */
  const filteredItems = items.filter((q) => {
    const id = Number(q.question_id);
    return id >= activeAspek.range[0] && id <= activeAspek.range[1];
  });

  /* ===================== RENDER ANSWER ===================== */
  const renderAnswer = (answer: any): React.ReactNode => {
    if (answer === null || answer === undefined) return <span>-</span>;

    if (typeof answer === "object" && !Array.isArray(answer) && "value" in answer) {
      return <span>{String(answer.value ?? "-")}</span>;
    }

    if (Array.isArray(answer)) {
      if (answer.length > 0 && typeof answer[0] !== "object") {
        return (
          <ul className="list-disc pl-5 space-y-1">
            {answer.map((v, i) => (
              <li key={i}>{String(v)}</li>
            ))}
          </ul>
        );
      }

      if (answer.length > 0 && typeof answer[0] === "object") {
        const headers = Object.keys(answer[0]);
        return (
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="border px-3 py-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {answer.map((row, i) => (
                <tr key={i}>
                  {headers.map((h) => (
                    <td key={h} className="border px-3 py-2">
                      {String(row[h] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
    }

    if (typeof answer === "object") {
      return (
        <div className="space-y-1">
          {Object.entries(answer).map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="font-medium">{k}:</span>
              <span>{String(v ?? "-")}</span>
            </div>
          ))}
        </div>
      );
    }

    return <span>{String(answer)}</span>;
  };

  /* ===================== UI ===================== */
  if (loading) return <div className="p-10 text-center">Memuat data...</div>;
  if (errorMsg) return <div className="p-10 text-center text-red-600">{errorMsg}</div>;

  return (
         <div className="flex h-screen bg-gray-50 text-[#36315B] overflow-hidden">
       
           {/* SIDEBAR FIXED */}
           <div className="fixed inset-y-0 left-0 w-64 z-40 bg-white">
             <SidebarTerapis />
           </div>
       
           {/* AREA KANAN */}
           <div className="ml-64 flex-1 flex flex-col">
       
             {/* HEADER FIXED */}
             <div className="fixed top-0 left-64 right-0 h-16 z-30 bg-white border-b border-gray-200">
               <HeaderTerapis pageTitle="Assessment" />
             </div>
       
             {/* FRAME UTAMA (SCROLL DI SINI) */}
             <div
               className="pt-16 h-screen overflow-y-auto"
             >
               <div className="p-6">
                 <div className="bg-white rounded-xl shadow-md border border-gray-200"></div>
   

        <main className="p-8 flex-1 overflow-y-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => router.push("/terapis/asessmentOrtu")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
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
                    <span
                      className={`text-sm ${
                        i === activeStep ? "font-semibold" : "text-gray-500"
                      }`}
                    >
                      {label}
                    </span>
                  </div>

                  {i < steps.length - 1 && (
                    <div className="w-10 h-px bg-gray-300 mx-3 translate-y-[-12px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-5xl mx-auto">

            {/* HEADER FRAME */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-semibold">{activeAspek.label}</h2>

              <select
                value={activeAspekIndex}
                onChange={(e) => setActiveAspekIndex(Number(e.target.value))}
                className="border rounded-lg px-4 py-2 text-sm"
              >
                {parentGeneralRanges.map((a, i) => (
                  <option key={a.key} value={i}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            {/* QUESTIONS */}
            <div className="space-y-8">
              {filteredItems.map((q) => (
                <div key={q.question_id}>
                  <p className="text-sm font-semibold mb-2">
                    {q.question_text}
                  </p>

                  <div className="bg-gray-100 rounded-xl p-4 text-base">
                    {renderAnswer(q.answer)}
                  </div>

                  {q.note && (
                    <p className="text-xs text-gray-500 mt-2">
                      Catatan: {q.note}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* NAVIGASI ASPEK */}
            <div className="flex justify-between mt-12">
              <button
                disabled={activeAspekIndex === 0}
                onClick={() => setActiveAspekIndex((i) => i - 1)}
                className="px-6 py-3 rounded-xl border font-semibold disabled:opacity-40"
              >
                Sebelumnya
              </button>

              <button
                disabled={activeAspekIndex === parentGeneralRanges.length - 1}
                onClick={() => setActiveAspekIndex((i) => i + 1)}
                className="px-6 py-3 rounded-xl bg-[#6BB1A0] text-white font-semibold disabled:opacity-40"
              >
                Selanjutnya
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
    </div>
    </div>
  );
}
