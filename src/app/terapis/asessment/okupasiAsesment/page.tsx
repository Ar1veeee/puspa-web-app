/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAssessmentQuestions, submitAssessment } from "@/lib/api/asesment";
import { handleApiError, showSuccessToast } from "@/lib/api-error";

/* =======================
   TYPES
======================= */
type Question = {
  id: number;
  question_code: string;
  question_number: string;
  question_text: string;
  answer_type: string;
  answer_options: string | null;
  extra_schema?: string | null;
};

type Group = {
  group_id: number;
  group_key: string;
  title: string;
  questions: Question[];
};

type UIAnswer = {
  score?: string;
  note?: string;
  checked?: string[];
};

/* =======================
   HELPERS
======================= */
const splitQuestion = (text: string) => {
  const parts = text.split("—").map((t) => t.trim());
  if (parts.length >= 2) {
    return { subTitle: parts[0], question: parts.slice(1).join(" — ") };
  }
  return { subTitle: null, question: text };
};

export default function OkupasiAssessmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const assessmentId = searchParams.get("assessment_id") || "";

  const [groups, setGroups] = useState<Group[]>([]);
  const [answers, setAnswers] = useState<Record<number, UIAnswer>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  /* =======================
     LOAD QUESTIONS
  ======================= */
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await getAssessmentQuestions("okupasi");
        setGroups(data.groups ?? []);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat pertanyaan");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  /* =======================
     HANDLERS
  ======================= */
  const handleScoreChange = (id: number, value: string) => {
    setAnswers((p) => ({ ...p, [id]: { ...p[id], score: value } }));
  };

  const handleNoteChange = (id: number, value: string) => {
    setAnswers((p) => ({ ...p, [id]: { ...p[id], note: value } }));
  };

  const handleCheckboxToggle = (
    id: number,
    option: string,
    checked: boolean
  ) => {
    setAnswers((p) => {
      const current = p[id]?.checked ?? [];
      return {
        ...p,
        [id]: {
          ...p[id],
          checked: checked
            ? [...current, option]
            : current.filter((o) => o !== option),
        },
      };
    });
  };

  /* =======================
     SUBMIT
  ======================= */
  const handleSubmit = async () => {
    if (!assessmentId) {
      handleApiError(null, "assessment_id tidak ditemukan ❌");
      return;
    }

    const payloadAnswers: any[] = [];

    for (const g of groups) {
      for (const q of g.questions) {
        const ui = answers[q.id] ?? {};

        if (q.answer_type === "checkbox") {
          payloadAnswers.push({
            question_id: q.id,
            answer: { value: ui.checked ?? [] },
          });
        } else if (q.answer_type === "score_with_note") {
          payloadAnswers.push({
            question_id: q.id,
            answer: { value: Number(ui.score ?? 0) },
            note: ui.note ?? "",
          });
        } else {
          payloadAnswers.push({
            question_id: q.id,
            answer: { value: ui.note ?? "" },
          });
        }
      }
    }

    const payload = { answers: payloadAnswers };

    // ======================
    // CONSOLE DEBUG
    // ======================
    console.log("📦 Submit Okupasi Assessment");
    console.log("🆔 assessment_id:", assessmentId);
    console.log("📌 type: okupasi");
    console.log("📦 payload:", payload);

    try {
      setSubmitting(true);
      await submitAssessment(assessmentId, "okupasi", payload);

      showSuccessToast("Assessment berhasil disubmit! ✅");
      router.push(`/terapis/asessment?type=okupasi&status=completed`);
    } catch (err: any) {
      console.error("❌ Submit Okupasi Assessment error:", err);

      const status = err?.response?.status;
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan";

      // ⛔ TIDAK PUNYA IZIN
      if (status === 403) {
        handleApiError(err, "Anda tidak memiliki izin untuk mengirim assessment ini. Pastikan login sebagai Asesor sesuai jenis terapi dan assessment ini adalah milik Anda.");
        return;
      }

      // 🔐 TOKEN HABIS / BELUM LOGIN
      if (status === 401) {
        handleApiError(err, "Sesi Anda telah berakhir. Silakan login kembali.");
        window.location.href = "/login";
        return;
      }

      // ❌ ERROR LAINNYA
      handleApiError(err, "Gagal submit assessment: " + message);
    } finally {
      setSubmitting(false);
    }
  };


  /* =======================
     RENDER
  ======================= */
  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  const group = groups[currentGroupIndex];
  let lastSubTitle: string | null = null;

  return (
    <div className="p-6 text-[#1E5C58]">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => (window.location.href = "/terapis/asessment")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>
          <h2 className="text-lg font-semibold mb-4 px-3 py-2 bg-[#C0DCD6] rounded">
            {currentGroupIndex + 1}. {group.title}
          </h2>

          {/* =======================
              FINAL REPORT (NO TABLE)
          ======================= */}
          {group.group_key === "final_report" ? (
            <div className="space-y-6">
              {group.questions.map((q) => {
                const ui = answers[q.id] ?? {};

                if (q.answer_type === "checkbox") {
                 return (
  <div key={q.id}>
    <label className="font-semibold block mb-2">
      {q.question_text}
    </label>

    {["paedagog", "okupasi", "wicara", "fisio"].map((opt) => (
      <label
        key={opt}
        className="flex gap-2 items-center mb-1 cursor-pointer"
      >
        <input
          type="checkbox"
          className="h-4 w-4 accent-[#409E86]"
          checked={ui.checked?.includes(opt) ?? false}
          onChange={(e) =>
            handleCheckboxToggle(
              q.id,
              opt,
              e.target.checked
            )
          }
        />
        <span className="capitalize">{opt}</span>
      </label>
    ))}
  </div>
);

                }

                return (
                  <div key={q.id}>
                    <label className="font-semibold block mb-2">
                      {q.question_text}
                    </label>
                    <textarea
                      className="w-full border rounded p-2"
                      rows={4}
                      value={ui.note ?? ""}
                      onChange={(e) =>
                        handleNoteChange(q.id, e.target.value)
                      }
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            /* =======================
               NORMAL GROUP (TABLE)
            ======================= */
            <table className="w-full border">
              <tbody>
                {group.questions.map((q, idx) => {
                  const ui = answers[q.id] ?? {};
                  const { subTitle, question } = splitQuestion(q.question_text);
                  const showSubTitle = subTitle && subTitle !== lastSubTitle;
                  if (showSubTitle) lastSubTitle = subTitle;

                  return (
                    <React.Fragment key={q.id}>
                      {showSubTitle && (
                        <tr>
                          <td colSpan={4} className="bg-gray-100 font-semibold p-2">
                            {subTitle}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="border p-2 text-center">{idx + 1}</td>
                        <td className="border p-2">{question}</td>
                        <td className="border p-2">
                          <select
                            className="border rounded w-full"
                            value={ui.score ?? ""}
                            onChange={(e) =>
                              handleScoreChange(q.id, e.target.value)
                            }
                          >
                            <option value="">Pilih</option>
                            {[0, 1, 2, 3].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="border p-2">
                          <input
                            className="border rounded w-full p-1"
                            value={ui.note ?? ""}
                            onChange={(e) =>
                              handleNoteChange(q.id, e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* =======================
              NAVIGATION
          ======================= */}
          <div className="flex justify-between mt-6">
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              disabled={currentGroupIndex === 0}
              onClick={() =>
                setCurrentGroupIndex((i) => Math.max(i - 1, 0))
              }
            >
              Sebelumnya
            </button>

            {currentGroupIndex < groups.length - 1 ? (
              <button
                className="bg-[#81B7A9] text-white px-4 py-2 rounded"
                onClick={() =>
                  setCurrentGroupIndex((i) => i + 1)
                }
              >
                Lanjutkan
              </button>
            ) : (
              <button
                className="bg-[#81B7A9] text-white px-4 py-2 rounded"
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Mengirim..." : "Submit"}
              </button>
            )}
          </div>
    </div>
  );
}
