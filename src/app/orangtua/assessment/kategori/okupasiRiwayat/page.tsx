/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { getParentAssessmentAnswers, ParentSubmitType } from "@/lib/api/asesmentTerapiOrtu";
import { getParentAssessmentQuestions, ParentAssessmentType } from "@/lib/api/asesmentTerapiOrtu";

// =====================
// TYPE
// =====================
type Q = { id: string; text: string; type?: string; options?: string[]; };
type Category = { id: string; title: string; type: string; questions: Q[]; };

function tryParseMaybeJson(v: any) {
  if (v === null || v === undefined) return undefined;
  if (Array.isArray(v) || typeof v === "object") return v;
  if (typeof v === "number") return v;
  if (typeof v !== "string") return v;
  try { return JSON.parse(v); } catch { return v; }
}

export default function DataTerapiOkupasiPageReadOnly() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id") || null;

  const [categories, setCategories] = useState<Category[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  const lastIndex = categories.length - 1;
  const steps = [
    { label: "Data Umum" },
    { label: "Data Fisioterapi" },
    { label: "Data Terapi Okupasi" },
    { label: "Data Terapi Wicara" },
    { label: "Data Paedagog" },
  ];
  const activeStep = 2;

  useEffect(() => {
    const fetchAll = async () => {
      if (!assessmentId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const qRes = await getParentAssessmentQuestions("parent_okupasi" as ParentAssessmentType);
        const groups = qRes?.data?.groups ?? [];
        const aRes = await getParentAssessmentAnswers(assessmentId, "okupasi_parent" as ParentSubmitType);
        const list = aRes?.data ?? [];
        const fetchedAnswers: Record<string, any> = {};
        list.forEach((item: any) => {
          fetchedAnswers[String(item.question_id)] = item?.answer?.value !== undefined ? tryParseMaybeJson(item.answer.value) : null;
        });

        const builtCategories: Category[] = groups.map((g: any) => {
          const answerTypes = g.questions.map((q: any) => q.answer_type);
          let categoryType = "radio3";
          if (answerTypes.every((t: string) => t === "slider")) categoryType = "slider";
          else if (answerTypes.every((t: string) => t === "yes_only")) categoryType = "yes_only";
          else if (answerTypes.every((t: string) => t === "checkbox")) categoryType = "checkbox";
          return {
            id: String(g.group_id),
            title: g.title,
            type: categoryType,
            questions: g.questions.map((q: any) => ({
              id: String(q.id),
              text: q.question_text,
              type: q.answer_type,
              options: q.answer_options ?? [],
            })),
          };
        });

        setCategories(builtCategories);
        setAnswers(fetchedAnswers);
      } catch (err) {
        console.error("❌ ERROR fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [assessmentId]);

  const currentCategory = categories[activeIdx];
  const goNext = () => { if (activeIdx < lastIndex) setActiveIdx((i) => i + 1); };
  const goPrev = () => { if (activeIdx > 0) setActiveIdx((i) => i - 1); };

  const inputClass = "appearance-none w-5 h-5 rounded border border-gray-400 checked:bg-[#6BB1A0] disabled:checked:bg-[#6BB1A0] checked:border-[#6BB1A0] relative before:content-['✔'] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:text-white before:text-sm";
  const radioClass = "appearance-none w-5 h-5 rounded-full border border-gray-400 checked:bg-[#6BB1A0] disabled:checked:bg-[#6BB1A0] checked:border-[#6BB1A0] relative before:content-['✔'] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:text-white before:text-sm";

  // Optimized Table for Mobile
  const Radio3Table = ({ questions }: { questions: Q[] }) => {
    const opts = ["Ya", "Tidak", "Kadang-kadang"];
    return (
      <div className="w-full">
        {/* DESKTOP VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-base border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[#36315B] font-semibold">
                <th className="text-left w-[55%]">Pertanyaan</th>
                {opts.map((opt) => (<th key={opt} className="text-center w-[15%]">{opt}</th>))}
              </tr>
            </thead>
            <tbody>
              {questions.map((q, idx) => {
                const val = answers[q.id];
                return (
                  <tr key={q.id} className="border-b border-gray-200">
                    <td className="py-3 text-base text-[#36315B]">{idx + 1}. {q.text}</td>
                    {opts.map((opt) => (
                      <td key={opt} className="text-center py-3">
                        <input type="radio" checked={val === opt} readOnly disabled className={radioClass} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE & TABLET VIEW (Card style) */}
        <div className="block md:hidden space-y-4">
          {questions.map((q, idx) => {
            const val = answers[q.id];
            return (
              <div key={q.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                <p className="text-sm font-medium text-[#36315B] mb-3">{idx + 1}. {q.text}</p>
                <div className="flex justify-between items-center gap-2">
                  {opts.map((opt) => (
                    <div key={opt} className="flex flex-col items-center gap-1 flex-1">
                      <input type="radio" checked={val === opt} readOnly disabled className={radioClass} />
                      <span className="text-[10px] text-gray-500 text-center leading-tight">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const YesOnlyList = ({ questions }: { questions: Q[] }) => (
    <div className="space-y-3">
      {questions.map((q, i) => (
        <div key={q.id} className="flex justify-between items-center border-b border-gray-100 pb-3 gap-4">
          <span className="text-sm md:text-base text-[#36315B] leading-relaxed">{i + 1}. {q.text}</span>
          <input type="checkbox" checked={answers[q.id] === "Ya" || answers[q.id] === true} readOnly disabled className={`${inputClass} shrink-0`} />
        </div>
      ))}
    </div>
  );

  const SliderReadOnlyList = ({ questions }: { questions: Q[] }) => (
    <div className="space-y-8">
      {questions.map((q, i) => {
        const value = typeof answers[q.id] === "number" ? Number(answers[q.id]) : 1;
        return (
          <div key={q.id} className="bg-white md:bg-transparent p-4 md:p-0 rounded-xl border border-gray-100 md:border-0 md:border-b md:pb-6">
            <p className="text-sm md:text-base text-[#36315B] mb-4 font-medium leading-relaxed">
              {i + 1}. {q.text}
            </p>
            <div className="px-2">
              <input type="range" min={1} max={5} step={1} value={value} readOnly className="w-full accent-[#6BB1A0] cursor-default" />
              <div className="flex justify-between text-xs font-bold text-gray-400 mt-2 px-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <span key={num} className={value === num ? "text-[#6BB1A0]" : ""}>{num}</span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const CheckboxReadOnlyList = ({ questions }: { questions: Q[] }) => (
    <div className="space-y-10">
      {questions.map((q, i) => {
        const selectedValues: string[] = Array.isArray(answers[q.id]) ? answers[q.id] : [];
        return (
          <div key={q.id} className="space-y-4">
            <p className="text-sm md:text-base font-bold text-[#36315B] border-l-4 border-[#6BB1A0] pl-3">{i + 1}. {q.text}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {q.options?.map((opt) => (
                <label key={opt} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/30">
                  <input type="checkbox" checked={selectedValues.includes(opt)} readOnly disabled className={inputClass} />
                  <span className="text-sm text-[#36315B]">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (loading) return <div className="flex justify-center items-center p-20 text-[#6BB1A0] font-medium">Memuat data...</div>;
  if (!currentCategory) return <div className="p-10 text-center text-gray-500">Tidak ada data</div>;

  return (
    <ResponsiveOrangtuaLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-8 pb-10">
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-5 md:p-10 relative">
          
          {/* Header & Close Button */}
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg md:text-2xl font-bold text-[#36315B]">Riwayat Asesmen Okupasi</h3>
            <button 
              onClick={() => router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`)} 
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stepper - Scrollable on Mobile */}
          <div className="mb-10 overflow-x-auto scrollbar-hide">
            <div className="flex items-start justify-between min-w-[600px] md:min-w-full px-2">
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center flex-1 relative">
                  {/* Progress Line */}
                  {i < steps.length - 1 && (
                    <div className="absolute top-4.5 left-1/2 w-full h-[2px] bg-gray-100 -z-0" />
                  )}
                  
                  <div className={`relative z-10 w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-bold transition-all
                    ${i === activeStep ? "bg-[#6BB1A0] border-[#6BB1A0] text-white shadow-lg shadow-[#6BB1A0]/20" : "bg-white border-gray-200 text-gray-400"}`}>
                    {i + 1}
                  </div>
                  <span className={`mt-2 text-[10px] md:text-xs font-bold text-center uppercase tracking-wider
                    ${i === activeStep ? "text-[#36315B]" : "text-gray-400"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Content */}
          <div className="mb-10">
            <div className="inline-block px-3 py-1 bg-[#6BB1A0]/10 text-[#6BB1A0] text-[10px] font-bold rounded-full mb-3 uppercase tracking-widest">
              Bagian {activeIdx + 1} dari {categories.length}
            </div>
            <h4 className="text-lg md:text-xl font-bold text-[#36315B] mb-8">{currentCategory.title}</h4>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {currentCategory.type === "yes_only" && <YesOnlyList questions={currentCategory.questions} />}
              {currentCategory.type === "radio3" && <Radio3Table questions={currentCategory.questions} />}
              {currentCategory.type === "slider" && <SliderReadOnlyList questions={currentCategory.questions} />}
              {currentCategory.type === "checkbox" && <CheckboxReadOnlyList questions={currentCategory.questions} />}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4 pt-8 border-t border-gray-100">
            <button 
              onClick={goPrev} 
              disabled={activeIdx === 0} 
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl border-2 border-gray-100 text-gray-500 font-bold hover:bg-gray-50 disabled:opacity-30 transition-all active:scale-95 text-sm md:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Sebelumnya
            </button>
            <button 
              onClick={goNext} 
              disabled={activeIdx === lastIndex} 
              className="flex items-center justify-center gap-2 px-10 py-3 rounded-xl bg-[#6BB1A0] text-white font-bold hover:bg-[#5aa391] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-[#6BB1A0]/20 text-sm md:text-base"
            >
              Lanjutkan
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </ResponsiveOrangtuaLayout>
  );
}