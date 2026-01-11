/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import {
  getAssessmentQuestions,
  getAssessmentAnswers,
} from "@/lib/api/asesment";

/* =======================
   TYPES
======================= */
type Question = {
  id: number;
  question_text: string;
  answer_type: string;
  answer_options: string | null;
};

type Group = {
  group_id: number;
  group_key: string;
  title: string;
  questions: Question[];
};

type AnswerItem = {
  question_id: string;
  answer?: {
    value: any;
  };
  note?: string | null;
};

/* =======================
   PAGE
======================= */
export default function RiwayatJawabanOkupasiPage() {
  const params = useSearchParams();
  const assessmentId = params.get("assessment_id");
  const type = "okupasi";

  const [groups, setGroups] = useState<Group[]>([]);
  const [rawAnswers, setRawAnswers] = useState<AnswerItem[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  /* =======================
     FETCH DATA
  ======================= */
  useEffect(() => {
    const fetchData = async () => {
      if (!assessmentId) return;

      try {
        const [questionRes, answerRes] = await Promise.all([
          getAssessmentQuestions(type),
          getAssessmentAnswers(assessmentId, type),
        ]);

        setGroups(questionRes.groups ?? []);
        setRawAnswers(answerRes ?? []);
      } catch (e) {
        console.error("Gagal load riwayat:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  /* =======================
     MAP ANSWERS
  ======================= */
  const answersMap = useMemo(() => {
    const map: Record<number, AnswerItem> = {};
    rawAnswers.forEach((a) => {
      map[Number(a.question_id)] = a;
    });
    return map;
  }, [rawAnswers]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memuat riwayat jawaban...
      </div>
    );
  }

  if (groups.length === 0) {
    return <div className="p-6">Tidak ada data riwayat.</div>;
  }

  const group = groups[stepIndex];

  /* =======================
     HELPER
  ======================= */
  const splitTitle = (text: string) => {
    if (text.includes("—")) return text.split("—").map((t) => t.trim());
    if (text.includes("-")) return text.split("-").map((t) => t.trim());
    return [text, text];
  };

  const TEXT_ONLY_GROUPS = [
    "final_report",
    "catatan",
    "rekomendasi",
    "laporan_khusus",
  ];

  const isTextOnly = TEXT_ONLY_GROUPS.includes(group.group_key);

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="flex min-h-screen bg-gray-50 text-[#36315B]">
      <SidebarTerapis />
      <div className="flex-1 flex flex-col">
        <HeaderTerapis />

        <div className="p-6 overflow-auto">
          {/* CLOSE */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => (window.location.href = "/terapis/asessment")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>

          {/* TITLE */}
          <h2 className="text-lg font-semibold mb-4 px-3 py-2 bg-[#C0DCD6] rounded">
            {stepIndex + 1}. {group.title}
          </h2>

          {/* =======================
              TEXT ONLY (LAPORAN)
          ======================= */}
          {isTextOnly ? (
            <div className="space-y-6">
              {group.questions.map((q) => {
                const ans = answersMap[q.id];

                return (
                  <div key={q.id}>
                    <label className="font-semibold block mb-2">
                      {q.question_text}
                    </label>
                    <textarea
                      readOnly
                      rows={4}
                      className="w-full border rounded p-3 bg-gray-100"
                      value={ans?.answer?.value ?? ans?.note ?? "-"}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            /* =======================
                TABLE WITH SUB JUDUL
            ======================= */
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-[#F3F7F6]">
                  <th className="border p-2 w-[5%] text-center">No</th>
                  <th className="border p-2 w-[45%] text-left">Aspek</th>
                  <th className="border p-2 w-[15%] text-center">Nilai</th>
                  <th className="border p-2 w-[35%] text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let lastSubTitle = "";

                  return group.questions.map((q, idx) => {
                    const ans = answersMap[q.id];
                    const [subTitle, aspect] = splitTitle(q.question_text);
                    const showSubTitle = subTitle !== lastSubTitle;
                    lastSubTitle = subTitle;

                    return (
                      <React.Fragment key={q.id}>
                        {showSubTitle && (
                          <tr className="bg-[#E6F2EF]">
                            <td colSpan={4} className="p-2 font-semibold">
                              {subTitle}
                            </td>
                          </tr>
                        )}

                        <tr>
                          <td className="border p-2 text-center">
                            {idx + 1}
                          </td>
                          <td className="border p-2">{aspect}</td>
                          <td className="border p-2 text-center">
                            <input
                              disabled
                              className="w-full border rounded bg-gray-200 text-center"
                              value={
                                Array.isArray(ans?.answer?.value)
                                  ? ans.answer.value.join(", ")
                                  : ans?.answer?.value ?? "-"
                              }
                            />
                          </td>
                          <td className="border p-2">
                            <input
                              disabled
                              className="w-full border rounded bg-gray-100"
                              value={ans?.note ?? "-"}
                            />
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  });
                })()}
              </tbody>
            </table>
          )}

          {/* =======================
              NAVIGATION
          ======================= */}
          <div className="flex justify-between mt-6">
            {stepIndex > 0 ? (
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setStepIndex((i) => i - 1)}
              >
                Sebelumnya
              </button>
            ) : (
              <div />
            )}

            {stepIndex < groups.length - 1 ? (
              <button
                className="bg-[#81B7A9] text-white px-4 py-2 rounded"
                onClick={() => setStepIndex((i) => i + 1)}
              >
                Lanjutkan
              </button>
            ) : (
              <div className="text-gray-400">(Akhir Riwayat)</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
