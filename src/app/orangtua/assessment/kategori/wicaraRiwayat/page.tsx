/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import {
  getParentAssessmentAnswers,
  ParentSubmitType,
} from "@/lib/api/asesmentTerapiOrtu";

export default function TerapiWicaraPageReadOnly() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id") as string;
  const type: ParentSubmitType = "wicara_parent";

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!assessmentId) {
      setErrorMsg("assessment_id tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await getParentAssessmentAnswers(assessmentId, type);

        if (!res.success) {
          setErrorMsg("Gagal mengambil data dari server.");
          setLoading(false);
          return;
        }

        const data = res.data;
        if (!Array.isArray(data)) {
          setErrorMsg("Format data jawaban tidak valid.");
          setLoading(false);
          return;
        }

        const parsed = data.map((q: any) => {
          const val = q.answer?.value;
          if (Array.isArray(val)) return { ...q, answer: val, answer_type: "table" };
          if (typeof val === "string") return { ...q, answer: val, answer_type: "textarea" };
          return { ...q, answer: "", answer_type: "textarea" };
        });

        setItems(parsed);
      } catch (err) {
        console.error("API ERROR:", err);
        setErrorMsg("Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [assessmentId]);

  const steps = [
    "Data Umum",
    "Data Fisioterapi",
    "Data Terapi Okupasi",
    "Data Terapi Wicara",
    "Data Paedagog",
  ];
  const activeStep = 3;

  if (loading) return <div className="p-10 text-center text-lg font-medium text-[#36315B]">Memuat jawaban...</div>;
  if (errorMsg) return <div className="p-10 text-center text-red-600 font-semibold">{errorMsg}</div>;

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-4xl">
      {/* STEPPER - Optimized for Mobile Scrolling */}
      <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-start justify-between min-w-[650px] md:min-w-full px-2">
          {steps.map((label, i) => (
            <div key={i} className="flex flex-col items-center relative flex-1">
              {/* Line Connector */}
              {i < steps.length - 1 && (
                <div className="absolute top-4.5 left-1/2 w-full h-[2px] bg-gray-200 -z-0" />
              )}
              
              <div
                className={`relative z-10 w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
                  i === activeStep 
                    ? "bg-[#6BB1A0] border-[#6BB1A0] text-white shadow-md" 
                    : i < activeStep 
                    ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {i + 1}
              </div>
              <span className={`mt-2 text-[10px] md:text-xs font-bold text-center uppercase tracking-wider leading-tight max-w-[80px] ${
                i === activeStep ? "text-[#36315B]" : "text-gray-400"
              }`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-10 transition-all duration-300">
        <h2 className="text-xl md:text-2xl font-bold text-[#36315B] mb-8 border-b pb-4">
          Riwayat Terapi Wicara
        </h2>

        <div className="space-y-8">
          {items.map((q: any, index: number) => (
            <div key={index} className="animate-fadeIn">
              <label className="block font-bold text-[#36315B] mb-3 text-sm md:text-base leading-relaxed">
                <span className="text-[#6BB1A0]">{q.question_number || index + 1}.</span> {q.question_text}
              </label>

              {/* Textarea / Text field */}
              {(q.answer_type === "textarea" || q.answer_type === "text") && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 text-sm md:text-base min-h-[100px] whitespace-pre-wrap leading-relaxed">
                  {q.answer || <span className="text-gray-400 italic">Tidak ada jawaban</span>}
                </div>
              )}

              {/* Table Style for Activities */}
              {q.answer_type === "table" && Array.isArray(q.answer) && (
                <div className="grid grid-cols-1 gap-3 mt-2">
                  {q.answer.map((row: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl gap-2 transition-hover hover:bg-white hover:shadow-sm">
                      <span className="text-sm md:text-base font-semibold text-[#36315B]">
                        {row.kegiatan}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-tighter">Mampu pada usia:</span>
                        <span className="bg-[#6BB1A0]/10 text-[#6BB1A0] px-3 py-1 rounded-lg text-sm font-bold border border-[#6BB1A0]/20">
                          {row.usia || "-"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-50 gap-4">
          <p className="text-xs md:text-sm text-gray-400 font-medium order-2 md:order-1">
            Menampilkan data asesmen tersimpan pada sistem Puspa.
          </p>
          <button
            className="w-full md:w-auto bg-[#6BB1A0] hover:bg-[#5aa391] text-white px-10 py-3.5 rounded-2xl font-bold shadow-lg shadow-[#6BB1A0]/20 transition-all active:scale-95 text-sm md:text-base order-1 md:order-2"
            onClick={() => router.back()}
          >
            Kembali ke Daftar
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </ResponsiveOrangtuaLayout>
  );
}