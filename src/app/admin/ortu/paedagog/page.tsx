/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";


import { getPaedagogParentAnswer } from "@/lib/api/riwayatAsesmentOrtu";

// =====================
// TYPE SESUAI BE
// =====================
type AnswerItem = {
  question_id: string;
  question_text: string;
  answer_value: string | null;
};

// =====================
// ASPEK RANGE PAEDAGOG
// =====================
const paedagogAspectRanges = [
  {
    key: "akademis",
    label: "Aspek Akademis",
    range: [598, 616],
  },
  {
    key: "ketunaan_visual",
    label: "Aspek Ketunaan - Visual",
    range: [617, 622],
  },
  {
    key: "ketunaan_auditori",
    label: "Aspek Ketunaan - Auditori",
    range: [623, 629],
  },
  {
    key: "ketunaan_motorik",
    label: "Aspek Ketunaan - Motorik",
    range: [630, 634],
  },
  {
    key: "ketunaan_kognitif",
    label: "Aspek Ketunaan - Kognitif",
    range: [635, 639],
  },
  {
    key: "ketunaan_perilaku",
    label: "Aspek Ketunaan - Perilaku",
    range: [640, 645],
  },
  {
    key: "sosialisasi",
    label: "Aspek Sosialisasi",
    range: [646, 651],
  },
];

// =====================
// COMPONENT
// =====================
export default function PaedagogFormPageReadOnly() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");

  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<AnswerItem[]>([]);
  const [activeAspectIndex, setActiveAspectIndex] = useState(0);

  // =====================
  // FETCH DATA
  // =====================
  useEffect(() => {
    if (!assessmentId) {
      console.error("❌ assessment_id tidak ditemukan");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getPaedagogParentAnswer(assessmentId);
        const list = res?.data ?? [];

        const mapped: AnswerItem[] = list.map((item: any) => ({
          question_id: String(item.question_id),
          question_text: item.question_text ?? "-",
          answer_value: item?.answer?.value ?? null,
        }));

        setAnswers(mapped);
      } catch (e) {
        console.error("❌ Gagal memuat jawaban paedagog", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  // =====================
  // STEPPER
  // =====================
  const steps = [
    "Data Umum",
    "Data Fisioterapi",
    "Data Terapi Okupasi",
    "Data Terapi Wicara",
    "Data Paedagog",
  ];
  const activeStep = 4;

  // =====================
  // FILTER JAWABAN BERDASARKAN ASPEK
  // =====================
  const activeAspect = paedagogAspectRanges[activeAspectIndex];

  const filteredAnswers = answers.filter((item) => {
    const qid = Number(item.question_id);
    return qid >= activeAspect.range[0] && qid <= activeAspect.range[1];
  });

  // =====================
  // HANDLE NAVIGASI PREV / NEXT ASPEK
  // =====================
  const handlePrev = () => {
    setActiveAspectIndex((i) => (i > 0 ? i - 1 : i));
  };

  const handleNext = () => {
    setActiveAspectIndex((i) =>
      i < paedagogAspectRanges.length - 1 ? i + 1 : i
    );
  };

  // =====================
  // LOADING UI
  // =====================
  if (loading) {
    return (
      <div className="p-10 text-center font-medium text-[#36315B]">
        Memuat jawaban...
      </div>
    );
  }

  // =====================
  // MAIN RENDER
  // =====================
  return (
    <div className="flex min-h-screen bg-gray-50 text-[#36315B]">
      
      <div className="flex-1 flex flex-col ml-1">

        <main className="p-8 flex-1 overflow-y-auto">
          {/* Close */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => router.push("/admin/jadwal_asesmen")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>

          {/* Stepper */}
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
                      className={`text-sm font-medium ${
                        i === activeStep ? "text-[#36315B]" : "text-gray-500"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-10 h-px bg-gray-300 mx-2 translate-y-[-12px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl p-6 shadow max-w-5xl mx-auto relative">
            {/* Dropdown aspek */}
            <div className="absolute top-6 right-6">
              <select
                value={activeAspectIndex}
                onChange={(e) => setActiveAspectIndex(Number(e.target.value))}
                className="border rounded-lg px-3 py-2 text-sm font-medium"
                aria-label="Pilih aspek paedagog"
              >
                {paedagogAspectRanges.map((aspect, i) => (
                  <option key={aspect.key} value={i}>
                    {aspect.label}
                  </option>
                ))}
              </select>
            </div>

            <h2 className="font-semibold text-lg mb-6">{activeAspect.label}</h2>

            <div className="space-y-4">
              {filteredAnswers.length === 0 && (
                <p className="text-gray-500 italic">Tidak ada pertanyaan di aspek ini.</p>
              )}
              {filteredAnswers.map((item, idx) => (
                <div
                  key={item.question_id}
                  className="bg-gray-50 p-4 rounded-lg border"
                >
                  <p className="font-medium mb-2">
                    {idx + 1}. {item.question_text}
                  </p>

                  {/* AUTO RENDER */}
                  {item.answer_value === "Ya" || item.answer_value === "Tidak" ? (
                    <div className="flex gap-6">
                      {["Ya", "Tidak"].map((opt) => (
                        <label key={opt} className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={item.answer_value === opt}
                            disabled
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={item.answer_value ?? ""}
                      disabled
                      className="w-full border rounded px-3 py-2 bg-gray-100"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-10">
              <button
                onClick={handlePrev}
                disabled={activeAspectIndex === 0}
                className="px-6 py-2 rounded-lg border font-semibold disabled:opacity-40"
              >
                ← Sebelumnya
              </button>

              <button
                onClick={handleNext}
                disabled={activeAspectIndex === paedagogAspectRanges.length - 1}
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

