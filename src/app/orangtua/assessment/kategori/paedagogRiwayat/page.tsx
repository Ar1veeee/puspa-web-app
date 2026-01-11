/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, Suspense } from "react"; // Tambahkan Suspense
import { useRouter, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";

import {
  getParentAssessmentAnswers,
  ParentSubmitType,
  getParentAssessmentQuestions,
  ParentAssessmentType,
} from "@/lib/api/asesmentTerapiOrtu";

/* ===================== TYPES ===================== */
type AnswerItem = {
  question_id: string;
  question_text: string;
  answer_value: string | null;
  note: string | null;
  section_key: string;
  aspect_key: string;
};

type Aspect = { key: string; label: string; };

// --- KOMPONEN UTAMA (Wrapper dengan Suspense) ---
export default function PaedagogFormPageReadOnly() {
  return (
    <Suspense fallback={
      <div className="p-10 text-center text-lg font-medium text-[#36315B]">
        Memuat halaman...
      </div>
    }>
      <PaedagogRiwayatContent />
    </Suspense>
  );
}

// --- SUB-KOMPONEN KONTEN (Logika Asli Anda) ---
function PaedagogRiwayatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id") as string;

  const submitType: ParentSubmitType = "paedagog_parent";
  const questionType: ParentAssessmentType = "parent_paedagog";

  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<AnswerItem[]>([]);
  const [aspects, setAspects] = useState<Aspect[]>([]);
  const [activeAspectKey, setActiveAspectKey] = useState("");

  const steps = [
    "Data Umum",
    "Data Fisioterapi",
    "Data Terapi Okupasi",
    "Data Terapi Wicara",
    "Data Paedagog",
  ];
  const activeStep = 4;

  useEffect(() => {
    if (!assessmentId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const questionRes = await getParentAssessmentQuestions(questionType);
        const groups = questionRes?.data?.groups || [];
        const aspectList: Aspect[] = groups.map((g: any) => ({
          key: g.group_key,
          label: g.title,
        }));

        const answerRes = await getParentAssessmentAnswers(assessmentId, submitType);
        const apiAnswers = answerRes?.data || [];

        const mergedAnswers: AnswerItem[] = apiAnswers.map((item: any) => {
          let aspect_key = "default";
          let section_key = "Lainnya";

          for (const group of groups) {
            const found = group.questions.find(
              (q: any) => String(q.id) === String(item.question_id)
            );
            if (found) {
              aspect_key = group.group_key;
              section_key = group.title;
              break;
            }
          }

          return {
            question_id: String(item.question_id),
            question_text: item.question_text,
            answer_value: item.answer?.value ?? null,
            note: item.note ?? null,
            aspect_key,
            section_key,
          };
        });

        setAspects(aspectList);
        setAnswers(mergedAnswers);
        setActiveAspectKey(aspectList[0]?.key || "default");
      } catch (error) {
        console.error("❌ Gagal load riwayat paedagog parent", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId, questionType, submitType]);

  const activeQuestions = answers.filter((q) => q.aspect_key === activeAspectKey);

  const sectionGroups: Record<string, AnswerItem[]> = {};
  activeQuestions.forEach((q) => {
    if (!sectionGroups[q.section_key]) sectionGroups[q.section_key] = [];
    sectionGroups[q.section_key].push(q);
  });

  const currentIndex = aspects.findIndex((a) => a.key === activeAspectKey);
  const handlePrevAspect = () => {
    if (currentIndex > 0) {
      setActiveAspectKey(aspects[currentIndex - 1].key);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handleNextAspect = () => {
    if (currentIndex < aspects.length - 1) {
      setActiveAspectKey(aspects[currentIndex + 1].key);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) return <div className="p-10 text-center text-lg font-medium text-[#36315B]">Memuat jawaban...</div>;

  return (
    <ResponsiveOrangtuaLayout>
      <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
        {/* CLOSE BUTTON */}
        <div className="flex justify-end mb-4 md:mb-6">
          <button
            onClick={() =>
              router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`)
            }
            className="font-bold text-2xl text-[#36315B] hover:text-red-500 transition-colors p-2"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* STEP PROGRESS - Optimized for Mobile Scrolling */}
        <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex items-start justify-between min-w-[600px] md:min-w-0 md:justify-center gap-2 px-2">
            {steps.map((step, i) => {
              const isActive = i === activeStep;
              return (
                <div key={i} className="flex items-start flex-1 last:flex-none gap-2">
                  <div className="flex flex-col items-center min-w-[80px]">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-[#6BB1A0] border-[#6BB1A0] text-white shadow-sm"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`mt-2 text-[11px] md:text-sm text-center leading-tight ${
                        isActive ? "font-semibold text-[#36315B]" : "text-gray-400"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-px bg-gray-300 mt-4 min-w-[20px]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ASPEK DROPDOWN - Full width on mobile */}
        <div className="mb-6 flex justify-center md:justify-end">
          <div className="w-full md:w-auto">
            <label className="block text-xs font-bold text-gray-500 mb-1 md:hidden">Pilih Aspek:</label>
            <select
              value={activeAspectKey}
              onChange={(e) => setActiveAspectKey(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 w-full md:w-72 bg-white text-sm focus:ring-2 focus:ring-[#6BB1A0] outline-none shadow-sm"
            >
              {aspects.map((asp) => (
                <option key={asp.key} value={asp.key}>
                  {asp.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CONTENT CARD */}
        <div className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-gray-100 space-y-8">
          {Object.keys(sectionGroups).length > 0 ? (
            Object.keys(sectionGroups).map((section) => (
              <div key={section} className="animate-fadeIn">
                <h3 className="font-bold text-[#36315B] text-lg mb-4 border-b pb-2">
                  {section}
                </h3>
                <div className="space-y-4">
                  {sectionGroups[section].map((q, i) => (
                    <div key={q.question_id} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <p className="font-semibold text-[#36315B] text-sm md:text-base mb-2">
                        {i + 1}. {q.question_text}
                      </p>
                      <input
                        type="text"
                        value={q.answer_value ?? "-"}
                        readOnly
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-100/50 text-gray-700 text-sm cursor-not-allowed"
                      />
                      {q.note && (
                        <div className="mt-2 flex gap-2 items-start bg-blue-50/50 p-2 rounded-lg">
                          <span className="text-xs font-bold text-blue-600 uppercase">Catatan:</span>
                          <p className="text-sm text-gray-600">{q.note}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400 italic">
              Tidak ada data riwayat untuk aspek ini.
            </div>
          )}
        </div>

        {/* ASPEK NAVIGATION - Responsive buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={handlePrevAspect}
            disabled={currentIndex === 0}
            className={`px-6 py-3 rounded-xl font-bold border transition-all duration-200 w-full sm:w-auto text-sm md:text-base flex items-center justify-center gap-2 ${
              currentIndex === 0
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-[#36315B] border-gray-300 hover:bg-gray-50 active:scale-95"
            }`}
          >
            <span>←</span> Sebelumnya
          </button>
          
          <button
            onClick={handleNextAspect}
            disabled={currentIndex === aspects.length - 1}
            className={`px-8 py-3 rounded-xl font-bold transition-all duration-200 w-full sm:w-auto text-sm md:text-base flex items-center justify-center gap-2 ${
              currentIndex === aspects.length - 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#6BB1A0] text-white hover:bg-[#5aa191] active:scale-95 shadow-lg shadow-[#6BB1A0]/20"
            }`}
          >
            Selanjutnya <span>→</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
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