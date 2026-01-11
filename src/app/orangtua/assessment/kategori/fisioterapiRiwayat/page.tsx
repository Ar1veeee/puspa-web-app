/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { getParentAssessmentAnswers, ParentSubmitType } from "@/lib/api/asesmentTerapiOrtu";

export default function DataFisioterapiRiwayatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const assessmentId = searchParams.get("assessment_id");

  const steps = [
    "Data Umum",
    "Data Fisioterapi",
    "Data Terapi Okupasi",
    "Data Terapi Wicara",
    "Data Paedagog",
  ];
  const activeStep = 1;

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