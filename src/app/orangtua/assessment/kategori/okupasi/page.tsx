/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";

import {
  getParentAssessmentQuestions,
  submitParentAssessment,
} from "@/lib/api/asesmentTerapiOrtu";

type Question = {
  id: number;
  question_number: string;
  question_text: string;
  answer_type: string;
  answer_options?: string[];
};

type Category = {
  group_id: number;
  group_key: string;
  title: string;
  questions: Question[];
};

const inputStyles = {
  accentColor: "#81B7A9",
};

// --- KOMPONEN UTAMA (Wrapper dengan Suspense) ---
export default function DataTerapiOkupasiPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    }>
      <OkupasiAssessmentContent />
    </Suspense>
  );
}

// --- SUB-KOMPONEN KONTEN (Logika Asli Anda) ---
function OkupasiAssessmentContent() {
  const router = useRouter();
  const search = useSearchParams();
  const assessmentId = search.get("assessment_id");


  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [activeIdx, setActiveIdx] = useState(0);

  const lastIndex = categories.length - 1;

  // FETCH DATA
  useEffect(() => {
    async function load() {
      try {
        const res = await getParentAssessmentQuestions("parent_okupasi");
        setCategories(
          res.data.groups.map((g: any) => ({
            group_id: g.group_id,
            group_key: g.group_key,
            title: g.title,
            questions: g.questions.map((q: any) => ({
              id: q.id,
              question_number: q.question_number,
              question_text: q.question_text,
              answer_type: q.answer_type,
              answer_options: q.answer_options ?? [],
            })),
          }))
        );
      } catch (e) {
        console.error("Gagal load pertanyaan okupasi:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // LOAD & SAVE LOCAL STORAGE


  const currentCategory = categories[activeIdx];

  const steps = [
    { label: "Data Umum" },
    { label: "Data Fisioterapi" },
    { label: "Data Terapi Okupasi" },
    { label: "Data Terapi Wicara" },
    { label: "Data Paedagog" },
  ];

  const activeStep = steps.findIndex(
    (step) => step.label === "Data Terapi Okupasi"
  );

  const setAnswer = (qid: number, val: any) =>
    setAnswers((s) => ({ ...s, [qid]: val }));

  const goNext = () => activeIdx < lastIndex && setActiveIdx(activeIdx + 1);
  const goPrev = () => activeIdx > 0 && setActiveIdx(activeIdx - 1);

  const getValue = (qid: number, type?: string) => {
    if (answers.hasOwnProperty(qid)) return answers[qid];
    if (type === "checkbox") return [];
    if (type === "slider") return 1;
    return "";
  };

  const onSubmitAll = async () => {
    if (!assessmentId) {
      alert("Assessment ID tidak ditemukan!");
      return;
    }

    const payload = {
      answers: categories
        .flatMap((cat) =>
          cat.questions.map((q) => {
            const val = answers[q.id];
            if (
              val === undefined ||
              val === null ||
              (Array.isArray(val) && val.length === 0)
            )
              return null;

            return {
              question_id: Number(q.id),
              answer: {
                value:
                  q.answer_type === "checkbox"
                    ? val
                    : q.answer_type === "slider"
                    ? Number(val)
                    : val,
              },
            };
          })
        )
        .filter(Boolean),
    };

    try {
      await submitParentAssessment(assessmentId, "okupasi_parent", payload);



alert("Jawaban berhasil dikirim!");
router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`);

    } catch (e) {
      console.error("Error submit okupasi:", e);
      alert("Gagal mengirim jawaban.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!currentCategory) return null;

  return (
    <ResponsiveOrangtuaLayout>
      {/* CLOSE BUTTON */}
      <div className="flex justify-end mb-4 md:mb-6">
        <button
          onClick={() => router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`)}
          className="text-[#36315B] hover:text-red-500 font-bold text-xl md:text-2xl p-2 md:p-0"
          aria-label="Tutup"
        >
          ✕
        </button>
      </div>

      {/* STEP INDICATOR */}
      <div className="mb-8 md:mb-12 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-start justify-start md:justify-center min-w-max md:min-w-0 px-4 md:px-0">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center group">
              <div className="flex flex-col items-center text-center space-y-2 w-24 md:w-32 lg:w-40">
                <div
                  className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full border-2 text-xs md:text-sm font-semibold transition-all ${
                    i === activeStep
                      ? "bg-[#6BB1A0] border-[#6BB1A0] text-white shadow-md shadow-[#6BB1A0]/20"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-[10px] md:text-xs lg:text-sm font-medium leading-tight md:leading-normal ${
                    i === activeStep ? "text-[#36315B]" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-6 md:w-12 h-px bg-gray-300 mx-1 md:mx-2 -mt-6 md:-mt-7" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 md:p-8 max-w-5xl mx-auto transition-all">
        <div className="mb-6 md:mb-8 border-b pb-4">
          <h4 className="text-sm md:text-base lg:text-lg font-bold text-[#36315B]">
            {activeIdx + 1}. {currentCategory.title}
          </h4>
          <p className="text-[10px] md:text-xs text-gray-400 mt-1">Bagian {activeIdx + 1} dari {categories.length}</p>
        </div>

        <div className="space-y-8 md:space-y-10">
          {currentCategory.questions.map((q) => (
            <div key={q.id} className="group">
              {q.answer_type === "yes_only" ? (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <p className="font-semibold text-[#36315B] text-sm md:text-base leading-relaxed">
                    <span className="text-[#6BB1A0] mr-1">{q.question_number}.</span> {q.question_text}
                  </p>
                  <div className="flex items-center gap-3 bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-lg">
                    <input
                      type="checkbox"
                      style={inputStyles}
                      className="w-6 h-6 md:w-5 md:h-5 rounded-md cursor-pointer transition-transform active:scale-90"
                      checked={getValue(q.id) === "Ya"}
                      onChange={(e) => setAnswer(q.id, e.target.checked ? "Ya" : null)}
                    />
                    <span className="text-xs font-bold text-gray-500 sm:hidden">Klik jika Ya</span>
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-semibold text-[#36315B] text-sm md:text-base mb-3 md:mb-4 leading-relaxed">
                    <span className="text-[#6BB1A0] mr-1">{q.question_number}.</span> {q.question_text}
                  </p>

                  {q.answer_type === "radio3" && (
                    <div className="grid grid-cols-1 sm:flex sm:gap-8 gap-3 mt-2">
                      {q.answer_options?.map((opt) => (
                        <label 
                          key={opt} 
                          className={`flex items-center gap-3 p-3 sm:p-0 rounded-xl border sm:border-0 cursor-pointer transition-all ${
                            getValue(q.id) === opt ? "bg-[#6BB1A0]/5 border-[#6BB1A0]/30" : "bg-white border-gray-100"
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id.toString()}
                            style={inputStyles}
                            className="w-5 h-5 md:w-4 md:h-4 cursor-pointer"
                            checked={getValue(q.id) === opt}
                            onChange={() => setAnswer(q.id, opt)}
                          />
                          <span className="text-sm text-gray-700 font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.answer_type === "checkbox" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {q.answer_options?.map((opt) => (
                        <label 
                          key={opt} 
                          className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                            getValue(q.id, "checkbox").includes(opt) ? "bg-[#6BB1A0]/5 border-[#6BB1A0] shadow-sm" : "bg-white border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            style={inputStyles}
                            className="w-5 h-5 md:w-4 md:h-4 rounded cursor-pointer"
                            checked={getValue(q.id, "checkbox").includes(opt)}
                            onChange={(e) => {
                              const old = getValue(q.id, "checkbox");
                              if (e.target.checked) setAnswer(q.id, [...old, opt]);
                              else setAnswer(q.id, old.filter((x: string) => x !== opt));
                            }}
                          />
                          <span className="text-sm text-gray-700 font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.answer_type === "slider" && (
                    <div className="flex flex-col mt-4 bg-gray-50/50 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Skala Penilaian</span>
                         <span className="bg-[#6BB1A0] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">{getValue(q.id, "slider")}</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        style={inputStyles}
                        value={getValue(q.id, "slider")}
                        onChange={(e) => setAnswer(q.id, Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6BB1A0]"
                      />
                      <div className="flex justify-between text-[11px] md:text-xs font-bold text-gray-400 mt-3 px-1">
                        <span className={getValue(q.id, "slider") === 1 ? "text-[#6BB1A0]" : ""}>1</span>
                        <span className={getValue(q.id, "slider") === 2 ? "text-[#6BB1A0]" : ""}>2</span>
                        <span className={getValue(q.id, "slider") === 3 ? "text-[#6BB1A0]" : ""}>3</span>
                        <span className={getValue(q.id, "slider") === 4 ? "text-[#6BB1A0]" : ""}>4</span>
                        <span className={getValue(q.id, "slider") === 5 ? "text-[#6BB1A0]" : ""}>5</span>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div className="mt-8 border-b border-gray-50 md:hidden last:hidden"></div>
            </div>
          ))}
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-between mt-10 md:mt-12 gap-4 pt-6 md:pt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={goPrev}
            disabled={activeIdx === 0}
            className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm md:text-base order-2 sm:order-1"
          >
            Sebelumnya
          </button>

          <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
            {activeIdx < lastIndex ? (
              <button
                type="button"
                onClick={goNext}
                className="px-10 py-3 bg-[#6BB1A0] hover:bg-[#5AA391] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#6BB1A0]/20 active:scale-95 text-sm md:text-base w-full sm:w-auto"
              >
                Lanjutkan
              </button>
            ) : (
              <button
                type="button"
                onClick={onSubmitAll}
                className="px-10 py-3 bg-[#36315B] hover:bg-[#2A264A] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#36315B]/20 active:scale-95 text-sm md:text-base w-full sm:w-auto"
              >
                Simpan & Kirim
              </button>
            )}
          </div>
        </div>
      </div>
      
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