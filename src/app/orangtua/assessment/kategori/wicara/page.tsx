/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout"; // Menggunakan layout responsif yang sudah ada

import {
  getParentAssessmentQuestions,
  submitParentAssessment,
  ParentAssessmentType,
  ParentSubmitType,
} from "@/lib/api/asesmentTerapiOrtu";

export default function TerapiWicaraPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const assessmentId = searchParams.get("assessment_id") ?? "";

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const parseSchema = (schema: any): any => {
    if (!schema) return {};
    try {
      if (typeof schema === "string") return JSON.parse(schema);
      return schema;
    } catch {
      return {};
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getParentAssessmentQuestions(
          "parent_wicara" as ParentAssessmentType
        );

        const q = res?.data?.groups?.[0]?.questions ?? [];
        setQuestions(q);
      } catch (err) {
        console.error("Fetch question error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (id: number, value: any) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" },
  ];

  const activeStep = steps.findIndex((s) => pathname.includes(s.path));

  const resolveAnswerForWhen = (when: number | string) => {
    const whenNum = typeof when === "string" && /^\d+$/.test(when) ? Number(when) : when;
    if (typeof whenNum === "number" && answers[whenNum] !== undefined) {
      return answers[whenNum];
    }

    const whenStr = String(when);
    const found = questions.find((q: any) => {
      if (String(q.id) === whenStr) return true;
      if (q.question_id && String(q.question_id) === whenStr) return true;
      if (q.question_number && String(q.question_number) === whenStr) return true;
      if (q.question_code && String(q.question_code).includes(whenStr)) return true;
      return false;
    });

    if (!found) return undefined;

    return answers[found.id];
  };

  const shouldShowQuestion = (q: any) => {
    const schema = parseSchema(q.extra_schema);
    const rules = schema?.conditional_rules;
    if (!rules || !Array.isArray(rules)) return true;

    return rules.every((r: any) => {
      const rawAnswer = resolveAnswerForWhen(r.when);
      if (rawAnswer == null) return false;

      const val = typeof rawAnswer === "object" ? rawAnswer.status ?? rawAnswer : rawAnswer;

      if (r.operator === "==" || r.operator === "===") {
        return String(val) === String(r.value);
      }
      return String(val) === String(r.value);
    });
  };

  const handleSubmit = async () => {
    if (!assessmentId) return alert("Assessment ID tidak ditemukan");

    try {
      setSubmitting(true);

      const payload = {
        answers: questions
          .filter((q) => shouldShowQuestion(q))
          .map((q) => {
            const ans = answers[q.id];
            const schema = parseSchema(q.extra_schema);

            if (q.answer_type === "table") {
              const rows = schema.rows || [];
              const cols = schema.columns || [];

              const tableAnswer = rows.map((row: string) => {
                const rowAns: Record<string, any> = { kegiatan: row };
                cols.forEach((col: string) => {
                  rowAns[col] = ans?.[row]?.[col] ?? null;
                });
                return rowAns;
              });

              return {
                question_id: q.id,
                answer: {
                  value: tableAnswer,
                },
              };
            }

            if (q.answer_type === "radio") {
              const out = typeof ans === "object" ? ans.status ?? ans : ans ?? null;

              return {
                question_id: q.id,
                answer: {
                  value: out,
                },
              };
            }

            return {
              question_id: q.id,
              answer: {
                value: ans ?? null,
              },
            };
          }),
      };

      await submitParentAssessment(
        assessmentId,
        "wicara_parent" as ParentSubmitType,
        payload
      );

      alert("Jawaban berhasil disimpan!");
      router.push( `/orangtua/assessment/kategori?assessment_id=${assessmentId}`);
    } catch (err: any) {
      console.error("Submit error:", err);
      alert(err?.response?.data?.message || "Gagal submit jawaban");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Memuat pertanyaan...</div>;

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-4xl"> {/* Tetap menggunakan layout utama Anda */}
      <div className="text-[#36315B]">
        
        {/* Tombol Tutup - Responsif */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`)}
            className="text-[#36315B] hover:text-red-500 font-bold text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Stepper - Horizontal Scroll pada Mobile */}
        <div className="flex justify-start md:justify-center mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex items-center min-w-max px-4 md:px-0">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                      i === activeStep
                        ? "bg-[#6BB1A0] border-[#6BB1A0] text-white shadow-md"
                        : "bg-gray-100 border-gray-300 text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`text-xs md:text-sm font-medium ${i === activeStep ? "text-[#36315B]" : "text-gray-400"}`}>
                    {step.label}
                  </span>
                </div>

                {i < steps.length - 1 && (
                  <div className="w-8 md:w-10 h-px bg-gray-300 mx-2 translate-y-[-12px]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Konten Form Utama */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 transition-all">
          <div className="space-y-8 md:space-y-10">
            {questions.map((q) => {
              if (!shouldShowQuestion(q)) return null;

              const schema = parseSchema(q.extra_schema);

              const radioOptions =
                schema.options ||
                (q.answer_options ? JSON.parse(q.answer_options) : []);

              const tableRows = schema.rows || [];
              const tableColumns = schema.columns || [];

              return (
                <div key={q.id} className="animate-in fade-in duration-500">
                  <label className="block font-semibold mb-3 text-sm md:text-base leading-relaxed">
                    {q.question_number}. {q.question_text}
                  </label>

                  {/* Input Textarea */}
                  {q.answer_type === "textarea" && (
                    <textarea
                      className="w-full border border-gray-200 rounded-xl p-3 h-32 focus:ring-2 focus:ring-[#6BB1A0] focus:border-transparent outline-none transition-all"
                      value={answers[q.id] || ""}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      placeholder="Tuliskan jawaban Anda di sini..."
                    />
                  )}

                  {/* Input Text Biasa */}
                  {q.answer_type === "text" && (
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#6BB1A0] outline-none transition-all"
                      value={answers[q.id] || ""}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                    />
                  )}

                  {/* Pilihan Radio Button */}
                  {q.answer_type === "radio" && (
                    <div className="flex flex-wrap gap-4 md:gap-8 mt-2">
                      {radioOptions.map((op: string) => (
                        <label key={op} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name={"q" + q.id}
                            value={op}
                            checked={answers[q.id] === op}
                            onChange={() => handleChange(q.id, op)}
                            className="accent-[#6BB1A0] w-5 h-5 transition-transform group-active:scale-90"
                          />
                          <span className="text-sm md:text-base font-medium">{op}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Tabel Pertanyaan - Dioptimalkan untuk Mobile */}
                  {q.answer_type === "table" && (
                    <div className="space-y-4 mt-3">
                      {tableRows.map((row: string, idx: number) => (
                        <div key={idx} className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 border-b border-gray-100 pb-4 md:pb-2 last:border-0">
                          <span className="text-sm md:w-72 font-medium text-gray-700">{row}</span>

                          <div className="flex flex-1 gap-2">
                            {tableColumns.map((col: string) => (
                              <input
                                key={col}
                                type="text"
                                placeholder={col}
                                className="border border-gray-200 rounded-lg p-2 flex-1 text-sm focus:border-[#6BB1A0] outline-none transition-all"
                                value={answers[q.id]?.[row]?.[col] || ""}
                                onChange={(e) =>
                                  handleChange(q.id, {
                                    ...answers[q.id],
                                    [row]: {
                                      ...answers[q.id]?.[row],
                                      [col]: e.target.value,
                                    },
                                  })
                                }
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tombol Simpan */}
          <button
            className="mt-12 bg-[#6BB1A0] text-white px-6 py-4 rounded-2xl shadow-lg shadow-[#6BB1A0]/20 w-full hover:bg-[#58a88f] active:scale-[0.98] transition-all font-bold text-base disabled:opacity-50"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Menyimpan..." : "Simpan Jawaban"}
          </button>
        </div>
      </div>
      
      {/* Sembunyikan scrollbar stepper pada mobile */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </ResponsiveOrangtuaLayout>
  );
}