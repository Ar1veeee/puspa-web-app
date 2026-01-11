/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { getParentAssessmentAnswers, ParentSubmitType } from "@/lib/api/asesmentTerapiOrtu";

export default function DataFisioterapiRiwayatPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const assessmentId = searchParams.get("assessment_id");

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" }
  ];

  const activeStep = steps.findIndex((step) => pathname.includes(step.path));

  const [dataRiwayat, setDataRiwayat] = useState({
    keluhan: "",
    riwayat: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assessmentId) {
      console.warn("assessment_id tidak ditemukan di URL");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getParentAssessmentAnswers(
          assessmentId as string,
          "fisio_parent" as ParentSubmitType
        );

        const dataArray = res?.data || [];

        const keluhanObj = dataArray.find(
          (item: any) =>
            item.question_text.toLowerCase().includes("keluhan utama")
        );

        const riwayatObj = dataArray.find(
          (item: any) =>
            item.question_text.toLowerCase().includes("riwayat penyakit")
        );

        setDataRiwayat({
          keluhan: keluhanObj?.answer?.value || "",
          riwayat: riwayatObj?.answer?.value || "",
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Gagal mengambil data jawaban");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  return (
    <ResponsiveOrangtuaLayout>
      {/* Tombol Tutup - Konsisten dengan UI Asesmen */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`)}
          className="text-[#36315B] hover:text-red-500 font-bold text-2xl p-2 transition-colors"
          aria-label="Tutup"
        >
          ✕
        </button>
      </div>

      {/* Step Progress - Dioptimalkan untuk scrolling pada Mobile */}
      <div className="mb-8 md:mb-12 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-start min-w-max md:justify-center px-4 md:px-0">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center text-center space-y-2 w-24 sm:w-32 md:w-40">
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-semibold transition-all ${
                    i === activeStep
                      ? "bg-[#6BB1A0] border-[#6BB1A0] text-white shadow-md"
                      : "bg-gray-100 border-gray-300 text-gray-500"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-[10px] sm:text-xs md:text-sm font-medium leading-tight ${
                    i === activeStep ? "text-[#36315B]" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {/* Garis penghubung antar langkah */}
              {i < steps.length - 1 && (
                <div className="w-8 sm:w-12 md:w-16 h-px bg-gray-300 mx-1 mt-4.5" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Card utama read-only */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 md:p-8 w-full max-w-4xl mx-auto transition-all">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#36315B] mb-6">
          II. Data Fisioterapi (Riwayat Jawaban)
        </h3>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6BB1A0]"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center py-4 bg-red-50 rounded-lg">{error}</p>
        ) : (
          <div className="space-y-6">

            {/* Keluhan */}
            <div className="animate-in fade-in duration-500">
              <label className="block text-xs sm:text-sm md:text-base font-semibold text-gray-700 mb-2">
                Keluhan utama yang dialami anak saat ini:
              </label>
              <div className="w-full border border-gray-200 rounded-xl p-4 bg-gray-50 text-gray-700 text-sm md:text-base min-h-[120px] whitespace-pre-wrap leading-relaxed shadow-inner">
                {dataRiwayat.keluhan || <span className="text-gray-400 italic">Tidak ada keluhan yang dicatat</span>}
              </div>
            </div>

            {/* Riwayat */}
            <div className="animate-in fade-in duration-700">
              <label className="block text-xs sm:text-sm md:text-base font-semibold text-gray-700 mb-2">
                Riwayat penyakit atau kondisi yang berhubungan dengan fisioterapi:
              </label>
              <div className="w-full border border-gray-300 rounded-xl p-4 bg-gray-50 text-gray-700 text-sm md:text-base min-h-[120px] whitespace-pre-wrap leading-relaxed shadow-inner">
                {dataRiwayat.riwayat || <span className="text-gray-400 italic">Tidak ada riwayat penyakit yang dicatat</span>}
              </div>
            </div>
          </div>
        )}

        {/* Button Back - Responsive width on Mobile */}
        <div className="flex flex-col sm:flex-row justify-end mt-8 gap-3">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-8 py-3 bg-gray-100 text-[#36315B] font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95 text-sm md:text-base text-center"
          >
            Kembali
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