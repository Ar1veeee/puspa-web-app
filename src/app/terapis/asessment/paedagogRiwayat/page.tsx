"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { getAssessmentAnswers } from "@/lib/api/asesment";

/* ======================
   TYPES
====================== */
type AnswerItem = {
  question_id: string;
  question_text: string;
  answer: { value: number | string };
  note: string | null;
};

type GroupedAnswers = Record<string, AnswerItem[]>;

/* ======================
   ASPEK RANGE (PAEDAGOG)
====================== */
const ASPEK_RANGE = [
  { title: "Membaca", from: 69, to: 78 },
  { title: "Menulis", from: 79, to: 90 },
  { title: "Berhitung", from: 91, to: 97 },
  { title: "Kesiapan Belajar", from: 98, to: 104 },
  { title: "Pengetahuan Umum", from: 105, to: 112 },
];

/* ======================
   HELPERS
====================== */
const getAspekByQuestionId = (id: number) => {
  const found = ASPEK_RANGE.find(
    (range) => id >= range.from && id <= range.to
  );
  return found?.title ?? "Lainnya";
};

const groupByAspek = (items: AnswerItem[]): GroupedAnswers => {
  const grouped: GroupedAnswers = {};

  items.forEach((item) => {
    const qid = Number(item.question_id);
    const aspek = getAspekByQuestionId(qid);

    if (!grouped[aspek]) {
      grouped[aspek] = [];
    }

    grouped[aspek].push(item);
  });

  return grouped;
};

/* ======================
   PAGE
====================== */
export default function RiwayatJawabanPaedagogPage() {
  const params = useSearchParams();
  const assessmentId = params.get("assessment_id") ?? "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<GroupedAnswers>({});
  const [activeAspek, setActiveAspek] = useState("");

  /* ======================
     FETCH DATA
  ====================== */
  useEffect(() => {
    if (!assessmentId) {
      setError("assessment_id tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    const fetchAnswers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAssessmentAnswers(
          assessmentId,
          "paedagog"
        );

        if (!Array.isArray(data)) {
          throw new Error("Format data tidak valid");
        }

        const grouped = groupByAspek(data);
        setAnswers(grouped);
        setActiveAspek(Object.keys(grouped)[0] ?? "");
      } catch (err) {
        console.error(err);
        setError("Gagal memuat riwayat jawaban.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [assessmentId]);

  /* ======================
     NAVIGATION LOGIC
  ====================== */
  const aspekList = Object.keys(answers);
  const currentQuestions = answers[activeAspek] ?? [];

  const currentAspekIndex = aspekList.findIndex(
    (a) => a === activeAspek
  );

  const hasPrev = currentAspekIndex > 0;
  const hasNext = currentAspekIndex < aspekList.length - 1;

  const goPrev = () => {
    if (!hasPrev) return;
    setActiveAspek(aspekList[currentAspekIndex - 1]);
  };

  const goNext = () => {
    if (!hasNext) return;
    setActiveAspek(aspekList[currentAspekIndex + 1]);
  };

  /* ======================
     STATES
  ====================== */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center font-medium text-[#36315B]">
        Memuat riwayat jawaban...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center font-medium text-red-600">
        {error}
      </div>
    );
  }

  /* ======================
     RENDER
  ====================== */
  return (
    <div className="flex h-screen font-playpen text-[#36315B]">
      <SidebarTerapis />

      <div className="flex flex-1 flex-col bg-gray-50">
        <HeaderTerapis />

        <main className="overflow-y-auto p-6">
          {/* CLOSE */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => (window.location.href = "/terapis/asessment")}
              className="text-2xl font-bold hover:text-red-500"
            >
              ✕
            </button>
          </div>

          {/* TITLE */}
          <h1 className="mb-6 text-center text-2xl font-bold">
            PLB | Paedagog {activeAspek}
          </h1>

          {/* ASPEK TABS */}
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            {aspekList.map((aspek) => {
              const isActive = aspek === activeAspek;
              return (
                <button
                  key={aspek}
                  onClick={() => setActiveAspek(aspek)}
                  className={`rounded-full border px-5 py-2 text-sm font-semibold transition
                    ${
                      isActive
                        ? "border-[#81B7A9] bg-[#EAF4F1] text-[#2E7D6B]"
                        : "border-gray-300 bg-white hover:bg-gray-100"
                    }`}
                >
                  {aspek}
                </button>
              );
            })}
          </div>

          {/* QUESTIONS */}
          <div className="rounded-xl bg-white p-2">
            {currentQuestions.map((q, idx) => {
              const isTextOnly = typeof q.answer.value === "string";

              return (
                <div
                  key={q.question_id}
                  className="mb-6 rounded-xl bg-white p-5 shadow-md"
                >
                  <p className="mb-3 font-semibold">
                    {idx + 1}. {q.question_text}
                  </p>

                  {isTextOnly ? (
                    <textarea
                      readOnly
                      rows={3}
                      className="w-full rounded-md border bg-gray-100 p-3"
                      value={q.answer.value as string}
                    />
                  ) : (
                    <div className="flex items-center gap-4">
                      <textarea
                        readOnly
                        className="flex-[4] rounded-md border bg-gray-100 p-3 text-sm"
                        value={q.note ?? ""}
                      />

                      <div className="relative flex-[1]">
                        <select
                          disabled
                          value={String(q.answer.value)}
                          className="w-80 appearance-none rounded-md border bg-gray-200 py-4 px-2"
                        >
                          <option value="0">0 - Buruk</option>
                          <option value="1">1 - Kurang Baik</option>
                          <option value="2">2 - Cukup Baik</option>
                          <option value="3">3 - Baik</option>
                        </select>

                        <ChevronDown
                          size={18}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* NAVIGATION BUTTONS */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={!hasPrev}
              className={`rounded-lg px-6 py-3 font-semibold transition
                ${
                  hasPrev
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "cursor-not-allowed bg-gray-100 text-gray-400"
                }`}
            >
              ← Sebelumnya
            </button>

            <span className="text-sm font-medium text-gray-500">
              {currentAspekIndex + 1} / {aspekList.length}
            </span>

            <button
              onClick={goNext}
              disabled={!hasNext}
              className={`rounded-lg px-6 py-3 font-semibold transition
                ${
                  hasNext
                    ? "bg-[#81B7A9] text-white hover:bg-[#81B7A9]"
                    : "cursor-not-allowed bg-gray-100 text-gray-400"
                }`}
            >
              Selanjutnya →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
