/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { getAssessmentAnswers } from "@/lib/api/asesment";

/* =======================
   TYPES
======================= */
type AnswerItem = {
  question_text: string;
  answer?: {
    value: any;
  };
  note?: string | null;
};

/* =======================
   HELPERS (SAMA DENGAN FORM OKUPASI)
======================= */
const splitQuestion = (text: string) => {
  const parts = text.split("—").map((t) => t.trim());
  if (parts.length >= 2) {
    return {
      subTitle: parts[0],
      question: parts.slice(1).join(" — "),
    };
  }
  return { subTitle: "Lainnya", question: text };
};

export default function RiwayatJawabanOkupasiPage() {
  const params = useSearchParams();
  const assessmentId = params.get("assessment_id");
  const type = "okupasi";

  const [answers, setAnswers] = useState<AnswerItem[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================
     FETCH DATA
  ======================= */
  useEffect(() => {
    if (!assessmentId) return;

    const fetchData = async () => {
      try {
        const res = await getAssessmentAnswers(assessmentId, type);
        setAnswers(res ?? []);
      } catch (e) {
        console.error("Gagal load riwayat:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  /* =======================
     GROUP BY SUB TITLE
  ======================= */
  const groupedAnswers = useMemo(() => {
    const map: Record<string, AnswerItem[]> = {};

    answers.forEach((a) => {
      const { subTitle } = splitQuestion(a.question_text);
      if (!map[subTitle]) map[subTitle] = [];
      map[subTitle].push(a);
    });

    return map;
  }, [answers]);

  /* =======================
     LOADING & EMPTY
  ======================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memuat riwayat jawaban...
      </div>
    );
  }

  if (answers.length === 0) {
    return <div className="p-6">Tidak ada data riwayat.</div>;
  }

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="flex min-h-screen bg-gray-50 text-[#36315B]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <div className="p-6 overflow-auto">
          {/* CLOSE */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => (window.location.href = "/admin/jadwal_asesmen")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>

          <h2 className="text-lg font-semibold mb-6 px-3 py-2 bg-[#C0DCD6] rounded">
            Riwayat Jawaban Okupasi
          </h2>

          {/* =======================
              PER SUB KATEGORI
          ======================= */}
          {Object.entries(groupedAnswers).map(
            ([subTitle, items], groupIdx) => (
              <div key={subTitle} className="mb-8">
                {/* SUB TITLE */}
                <h3 className="font-semibold mb-3 px-3 py-2 bg-[#E6F2EF] rounded">
                  {groupIdx + 1}. {subTitle}
                </h3>

                {/* TABLE */}
                <table className="w-full border border-gray-300">
                  <thead>
                    <tr className="bg-[#F3F7F6]">
                      <th className="border p-2 w-[5%] text-center">No</th>
                      <th className="border p-2 w-[45%] text-left">Aspek</th>
                      <th className="border p-2 w-[15%] text-center">Nilai</th>
                      <th className="border p-2 w-[35%] text-left">
                        Catatan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((a, idx) => {
                      const { question } = splitQuestion(a.question_text);

                      return (
                        <tr key={idx}>
                          <td className="border p-2 text-center">
                            {idx + 1}
                          </td>
                          <td className="border p-2">{question}</td>
                          <td className="border p-2 text-center">
                            {Array.isArray(a.answer?.value)
                              ? a.answer.value.join(", ")
                              : a.answer?.value ?? "-"}
                          </td>
                          <td className="border p-2">{a.note ?? "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
