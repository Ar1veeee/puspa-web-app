/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";

// 🔹 API
import { getWicaraParentAnswer } from "@/lib/api/riwayatAsesmentOrtu";

/* ======================= TYPES ======================= */
type AnswerItem = {
  question_id: string;
  question_text: string;
  answer: any;
  note: string | null;
};

export default function TerapiWicaraPageReadOnly() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");

  const [items, setItems] = useState<AnswerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ======================= FETCH ======================= */
  useEffect(() => {
    if (!assessmentId) {
      setErrorMsg("assessment_id tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const res = await getWicaraParentAnswer(assessmentId);
        setItems(res?.data || []);
      } catch (err) {
        console.error("API ERROR:", err);
        setErrorMsg("Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  /* ======================= RENDER ANSWER ======================= */
  const renderAnswer = (answer: any) => {
    if (!answer) return "-";

    if (typeof answer === "object" && "value" in answer) {
      const val = answer.value;

      if (Array.isArray(val)) {
        return (
          <div className="space-y-2 text-sm">
            {val.map((row: any, idx: number) => (
              <div
                key={idx}
                className="flex justify-between gap-4 border-b pb-1"
              >
                <span className="font-medium">{row.kegiatan}</span>
                <span>{row.usia} bln</span>
              </div>
            ))}
          </div>
        );
      }

      return <span>{val ?? "-"}</span>;
    }

    if (typeof answer === "object") {
      return (
        <div className="space-y-1 text-sm">
          {Object.entries(answer).map(([k, v]) => (
            <div key={k}>
              <span className="font-medium">{k}:</span> {String(v)}
            </div>
          ))}
        </div>
      );
    }

    return <span>{String(answer)}</span>;
  };

  /* ======================= STEPS ======================= */
  const steps = [
    "Data Umum",
    "Data Fisioterapi",
    "Data Terapi Okupasi",
    "Data Terapi Wicara",
    "Data Paedagog",
  ];
  const activeStep = 3;

  /* ======================= UI ======================= */
  if (loading) {
    return (
      <div className="p-10 text-center text-sm font-medium text-[#36315B]">
        Memuat jawaban...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-10 text-center text-red-600 text-sm font-semibold">
        {errorMsg}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-[#36315B]">
      <SidebarTerapis />

      <div className="flex-1 flex flex-col ml-2">
        <HeaderTerapis pageTitle="Assessment" />

        <main className="p-8 flex-1 overflow-y-auto">
          {/* Close */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => router.push("/terapis/asessmentOrtu")}
              className="text-[#36315B] hover:text-red-500 font-bold text-xl"
            >
              ✕
            </button>
          </div>

          {/* === STEPPER === */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center">
              {steps.map((label, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center space-y-1">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-xs font-semibold ${
                        i === activeStep
                          ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        i === activeStep
                          ? "text-[#36315B]"
                          : "text-gray-500"
                      }`}
                    >
                      {label}
                    </span>
                  </div>

                  {i < steps.length - 1 && (
                    <div className="w-8 h-px bg-gray-300 mx-2 translate-y-[-10px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* === CONTENT === */}
          <div className="bg-white rounded-2xl shadow-sm p-6 max-w-5xl mx-auto">
            <h3 className="text-base font-semibold mb-6">
              IV. Data Terapi Wicara (Riwayat Jawaban)
            </h3>

            <div className="space-y-6">
              {items.map((q) => (
                <div key={q.question_id}>
                  <p className="text-sm font-semibold mb-2">
                    {q.question_text}
                  </p>

                  <div className="text-sm text-gray-900 bg-gray-100 rounded-xl p-4 leading-relaxed min-h-[80px]">
                    {renderAnswer(q.answer)}
                  </div>

                  {q.note && (
                    <p className="text-xs text-gray-500 mt-1">
                      Catatan: {q.note}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              className="mt-8 bg-[#6BB1A0] text-white px-6 py-2 rounded-xl shadow-md w-full hover:bg-[#58a88f] transition text-sm"
              onClick={() => router.back()}
            >
              Kembali
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
