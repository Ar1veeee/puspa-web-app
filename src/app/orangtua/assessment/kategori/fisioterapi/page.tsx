/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, Suspense } from "react"; // Menambahkan Suspense dari react
import { useRouter, usePathname, useSearchParams } from "next/navigation"; // Menggunakan hook navigasi
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout"; // Layout responsif
import {
  getParentAssessmentQuestions,
  submitParentAssessment,
} from "@/lib/api/asesmentTerapiOrtu"; // Helper API

// 1. Pindahkan seluruh logika asli ke dalam sub-komponen
function FisioterapiContent() {
  const router = useRouter(); //
  const pathname = usePathname(); //
  const searchParams = useSearchParams(); // Hook yang menyebabkan error jika tidak dibungkus Suspense
  const assessmentId = searchParams.get("assessment_id"); // Mengambil ID asesmen dari URL

  const [activeTab, setActiveTab] = useState<"keluhan" | "riwayat">("keluhan"); // State tab aktif
  const [keluhanQuestion, setKeluhanQuestion] = useState<any>(null); // State pertanyaan keluhan
  const [riwayatQuestion, setRiwayatQuestion] = useState<any>(null); // State pertanyaan riwayat
  const [keluhanJawaban, setKeluhanJawaban] = useState(""); // State jawaban keluhan
  const [riwayatJawaban, setRiwayatJawaban] = useState(""); // State jawaban riwayat
  const [loading, setLoading] = useState(false); // State loading simpan

  // Fetch pertanyaan menggunakan key "parent_fisio"
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await getParentAssessmentQuestions("parent_fisio"); //
        const questions = res?.data?.groups?.[0]?.questions || []; //

        setKeluhanQuestion(questions.find((q: any) => q.question_number === "1")); //
        setRiwayatQuestion(questions.find((q: any) => q.question_number === "2")); //
      } catch (err) {
        console.error(err); //
      }
    }

    fetchQuestions(); //
  }, []);

  const handleSubmit = async () => {
    if (!assessmentId) return alert("Assessment ID tidak ditemukan."); // Validasi ID asesmen

    const payload = {
      answers: [
        { question_id: keluhanQuestion?.id, answer: { value: keluhanJawaban } }, //
        { question_id: riwayatQuestion?.id, answer: { value: riwayatJawaban } }, //
      ],
    };

    try {
      setLoading(true); //
      // Submit menggunakan tipe "fisio_parent"
      await submitParentAssessment(assessmentId, "fisio_parent", payload); //
      alert("Berhasil menyimpan data fisioterapi!"); //
      router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`); //
    } catch (err) {
      console.error(err); //
      alert("Gagal menyimpan data."); //
    } finally {
      setLoading(false); //
    }
  };

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" }, //
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" }, //
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" }, //
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" }, //
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" }, //
  ];

  const activeStep = steps.findIndex((step) => pathname.includes(step.path)); // Mencari langkah aktif

  return (
    <ResponsiveOrangtuaLayout>
      {/* Tombol Tutup */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`)}
          className="text-[#36315B] hover:text-red-500 font-bold text-xl md:text-2xl p-2 transition-colors"
          aria-label="Tutup"
        >
          ✕
        </button>
      </div>

      {/* Indikator Langkah (Stepper) */}
      <div className="mb-8 md:mb-12 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-start min-w-max md:justify-center px-4 md:px-0">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center text-center space-y-2 w-24 sm:w-32 md:w-40">
                <div
                  className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full border-2 text-xs md:text-sm font-semibold transition-all ${
                    i === activeStep
                      ? "bg-[#6BB1A0] border-[#6BB1A0] text-white shadow-md"
                      : "bg-gray-100 border-gray-300 text-gray-500"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-[10px] sm:text-xs md:text-sm font-medium leading-tight md:leading-normal ${
                    i === activeStep ? "text-[#36315B]" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-8 sm:w-12 md:w-16 h-px bg-gray-300 mx-1 mt-4 md:mt-4.5" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#36315B] mb-6">
          II. Data Fisioterapi
        </h3>

        {/* Tab Navigasi */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("keluhan")}
            className={`px-4 sm:px-6 py-2.5 rounded-t-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "keluhan"
                ? "bg-[#EAF4F1] text-[#357960] border-b-2 border-[#357960]"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            Keluhan
          </button>
          <button
            onClick={() => setActiveTab("riwayat")}
            className={`px-4 sm:px-6 py-2.5 rounded-t-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "riwayat"
                ? "bg-[#EAF4F1] text-[#357960] border-b-2 border-[#357960]"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            Riwayat Penyakit
          </button>
        </div>

        {/* Area Input Jawaban */}
        <div className="min-h-[200px]">
          {activeTab === "keluhan" && keluhanQuestion && (
            <div className="animate-in fade-in duration-300">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3 leading-relaxed">
                {keluhanQuestion.question_text}
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-xl p-3 sm:p-4 h-40 sm:h-48 md:h-52 focus:outline-none focus:ring-2 focus:ring-[#6BB1A0] focus:border-transparent transition-shadow text-xs sm:text-sm"
                placeholder={`Tuliskan ${keluhanQuestion.question_text.toLowerCase()}...`}
                value={keluhanJawaban}
                onChange={(e) => setKeluhanJawaban(e.target.value)}
              />
            </div>
          )}

          {activeTab === "riwayat" && riwayatQuestion && (
            <div className="animate-in fade-in duration-300">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-3 leading-relaxed">
                {riwayatQuestion.question_text}
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-xl p-3 sm:p-4 h-40 sm:h-48 md:h-52 focus:outline-none focus:ring-2 focus:ring-[#6BB1A0] focus:border-transparent transition-shadow text-xs sm:text-sm"
                placeholder={`Tuliskan ${riwayatQuestion.question_text.toLowerCase()}...`}
                value={riwayatJawaban}
                onChange={(e) => setRiwayatJawaban(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Navigasi Tombol Bawah */}
        <div className="flex flex-col sm:flex-row justify-end mt-8 gap-3">
          {activeTab === "keluhan" ? (
            <button
              onClick={() => setActiveTab("riwayat")}
              className="px-8 py-3 bg-[#6BB1A0] text-white rounded-xl font-bold hover:bg-[#5bb49b] shadow-sm active:scale-[0.98] transition-all w-full sm:w-auto text-sm"
            >
              Lanjutkan
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-8 py-3 rounded-xl text-white font-bold shadow-sm active:scale-[0.98] transition-all w-full sm:w-auto text-sm ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#6BB1A0] hover:bg-[#5bb49b]"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                "Simpan"
              )}
            </button>
          )}
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}

// 2. Komponen utama dibungkus dengan Suspense
export default function DataFisioterapiPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Memuat halaman...</div>}>
      <FisioterapiContent />
    </Suspense>
  );
}