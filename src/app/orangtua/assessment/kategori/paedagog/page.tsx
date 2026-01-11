/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import {
  getParentAssessmentQuestions,
  submitParentAssessment,
  ParentAssessmentType,
} from "@/lib/api/asesmentTerapiOrtu";

type Question = {
  id: number;
  question_code: string;
  question_number: string;
  question_text: string;
  answer_type: "radio" | "text";
  answer_options?: string[];
};

type Group = {
  group_id: number;
  group_key: string;
  title: string;
  questions: Question[];
};

type Step = { label: string; path: string };

export default function PaedagogFormPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");

  const steps: Step[] = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" },
  ];

  const activeStep = steps.findIndex((step) => step.path.includes("/paedagog"));

  const [groups, setGroups] = useState<Group[]>([]);
  const [answers, setAnswers] = useState<Record<string, Record<number, any>>>({});
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!assessmentId) {
        alert("Assessment ID tidak ditemukan");
        return;
      }
      try {
        const res = await getParentAssessmentQuestions("parent_paedagog" as ParentAssessmentType);
        const dataGroups: Group[] = res.data.groups.map((g: any) => ({
          group_id: g.group_id,
          group_key: g.group_key,
          title: g.title,
          questions: g.questions.map((q: any) => ({
            id: q.id,
            question_code: q.question_code,
            question_number: q.question_number,
            question_text: q.question_text,
            answer_type: q.answer_type,
            answer_options: q.extra_schema ? JSON.parse(q.answer_options ?? "[]") : [],
          })),
        }));

        setGroups(dataGroups);

        const initAnswers: Record<string, Record<number, any>> = {};
        dataGroups.forEach((g) => {
          initAnswers[g.group_key] = {};
          g.questions.forEach((q) => (initAnswers[g.group_key][q.id] = ""));
        });

        setAnswers(initAnswers);
      } catch (error) {
        console.error(error);
        alert("Gagal mengambil pertanyaan");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [assessmentId]);

  const handleChange = (groupKey: string, questionId: number, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [groupKey]: {
        ...prev[groupKey],
        [questionId]: value,
      },
    }));
  };

  const handleNextGroup = () => currentStep < groups.length - 1 && setCurrentStep(currentStep + 1);
  const handlePreviousGroup = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const onSave = async () => {
    if (!assessmentId) return alert("Assessment ID tidak ditemukan");
    try {
      const formattedAnswers = Object.values(answers).flatMap((group) =>
        Object.entries(group)
          .filter(([_, answer]) => answer !== "" && answer !== null)
          .map(([questionId, answer]) => ({ question_id: Number(questionId), answer: { value: answer } }))
      );

      console.log("PAYLOAD KE BE:", formattedAnswers);

      await submitParentAssessment(assessmentId, "paedagog_parent", { answers: formattedAnswers });
      alert("Jawaban berhasil disimpan");
      router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Gagal submit jawaban");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (groups.length === 0) return <p>Tidak ada pertanyaan.</p>;

  const group = groups[currentStep];

  return (
    <ResponsiveOrangtuaLayout>
      {/* Close Button */}
      <div className="flex justify-end mb-4 md:mb-6">
        <button
          onClick={() => router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`)}
          className="text-[#36315B] hover:text-red-500 font-bold text-xl md:text-2xl p-1 md:p-0"
          aria-label="Tutup"
        >
          ✕
        </button>
      </div>

      {/* Step Progress - Responsive */}
      <div className="mb-6 md:mb-12 overflow-x-auto pb-2">
        <div className="flex justify-center min-w-max md:min-w-0">
          <div className="flex items-center">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center text-center space-y-1 md:space-y-2">
                  <div
                    className={`flex items-center justify-center rounded-full border-2 font-semibold 
                      w-8 h-8 text-xs md:w-9 md:h-9 md:text-sm ${
                        i === activeStep
                          ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-xs md:text-sm font-medium whitespace-nowrap px-1 ${
                      i === activeStep ? "text-[#36315B]" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-6 md:w-12 h-px bg-gray-300 mx-1 md:mx-2 translate-y-[-10px] md:translate-y-[-12px]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Pertanyaan - Responsive */}
      <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow mb-4 md:mb-6">
        <h2 className="font-semibold text-base md:text-lg mb-2 md:mb-3 text-[#36315B]">
          {group.title}
        </h2>

        <div className="space-y-3 md:space-y-4">
          {group.questions.map((q) => (
            <div key={q.id} className="bg-gray-50 p-3 md:p-4 rounded-lg">
              <label className="block mb-2 font-medium text-sm md:text-base">
                <span className="text-[#36315B]">{q.question_number}.</span> {q.question_text}
              </label>

              {q.answer_type === "radio" ? (
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-2">
                  {q.answer_options?.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-sm md:text-base cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`${group.group_key}-${q.id}`}
                        checked={answers[group.group_key]?.[q.id] === opt}
                        onChange={() => handleChange(group.group_key, q.id, opt)}
                        className="accent-[#409E86] w-4 h-4 md:w-5 md:h-5"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 md:px-4 md:py-3 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[#409E86] focus:border-transparent
                    text-sm md:text-base"
                  value={answers[group.group_key]?.[q.id] ?? ""}
                  onChange={(e) => handleChange(group.group_key, q.id, e.target.value)}
                  placeholder="Ketik jawaban di sini"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons - Responsive */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 md:gap-0 mt-6 md:mt-8">
        <div className="w-full sm:w-auto">
          <button
            onClick={handlePreviousGroup}
            disabled={currentStep === 0}
            className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-2.5 bg-gray-200 hover:bg-gray-300 
              text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200 text-sm md:text-base font-medium"
          >
            Sebelumnya
          </button>
        </div>

        <div className="w-full sm:w-auto mb-3 sm:mb-0">
          {currentStep < groups.length - 1 ? (
            <button
              onClick={handleNextGroup}
              className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-2.5 bg-[#81B7A9] hover:bg-[#6BB1A0] 
                text-white rounded-lg transition-colors duration-200
                text-sm md:text-base font-medium shadow-sm"
            >
              Selanjutnya
            </button>
          ) : (
            <button
              onClick={onSave}
              className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-2.5 bg-[#81B7A9] hover:bg-[#6BB1A0] 
                text-white rounded-lg transition-colors duration-200
                text-sm md:text-base font-medium shadow-sm"
            >
              Simpan Jawaban
            </button>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 md:mt-6 text-center">
        <p className="text-xs md:text-sm text-gray-500 font-medium">
          Aspek <span className="text-[#409E86] font-bold">{currentStep + 1}</span> dari{" "}
          <span className="text-[#36315B] font-bold">{groups.length}</span>
        </p>
        
        {/* Progress Bar - Mobile Only */}
        <div className="mt-2 md:hidden">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#6BB1A0] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / groups.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}