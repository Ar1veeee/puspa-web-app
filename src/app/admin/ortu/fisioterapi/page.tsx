/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

// 🔹 API
import { getFisioParentAnswer } from "@/lib/api/riwayatAsesmentOrtu";

/* ======================= TYPES ======================= */
type AnswerItem = {
  question_id: string;
  question_text: string;
  answer: any;
  note: string | null;
};

export default function DataFisioterapiPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const assessmentId = searchParams.get("assessment_id");

  /* ======================= STEPS ======================= */
  const steps = [
    { label: "Data Umum", path: "/terapis/riwayat/umumRiwayat" },
    { label: "Data Fisioterapi", path: "/terapis/riwayat/fisioterapiRiwayat" },
    { label: "Data Okupasi", path: "/terapis/riwayat/okupasiRiwayat" },
    { label: "Data Wicara", path: "/terapis/riwayat/wicaraRiwayat" },
    { label: "Data Paedagog", path: "/terapis/riwayat/paedagogRiwayat" },
  ];

  const activeStep = steps.findIndex((step) =>
    pathname.includes(step.path)
  );

  /* ======================= STATE ======================= */
  const [dataRiwayat, setDataRiwayat] = useState<AnswerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ======================= FETCH ======================= */
  useEffect(() => {
    if (!assessmentId) {
      console.warn("assessment_id tidak ditemukan di URL");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getFisioParentAnswer(assessmentId);
        setDataRiwayat(res?.data || []);
      } catch (err: any) {
        console.error("❌ Gagal fetch data:", err);
        setError(err.message || "Gagal mengambil data jawaban");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  /* ======================= RENDER ANSWER ======================= */
  const renderAnswer = (answer: any) => {
    if (!answer) return <span>-</span>;

    // { value: "..." }
    if (typeof answer === "object" && "value" in answer) {
      return <span>{answer.value ?? "-"}</span>;
    }

    // Array (checkbox / saudara / dll)
    if (Array.isArray(answer)) {
      return (
        <div className="space-y-1">
          {answer.map((item, idx) => (
            <div key={idx} className="ml-4">
              {typeof item === "string"
                ? item
                : Object.entries(item).map(([k, v]) => (
                    <div key={k}>
                      <span className="font-medium">{k}:</span>{" "}
                      {String(v)}
                    </div>
                  ))}
            </div>
          ))}
        </div>
      );
    }

    // Object (milestone / penyakit / dll)
    if (typeof answer === "object") {
      return (
        <div className="space-y-1">
          {Object.entries(answer).map(([k, v]) => (
            <div key={k}>
              <span className="font-medium">{k}:</span>{" "}
              {String(v)}
            </div>
          ))}
        </div>
      );
    }

    return <span>{String(answer)}</span>;
  };

  /* ======================= UI ======================= */
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-1">
        <Header pageTitle="Assessment" />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Close */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => router.push("/admin/jadwal_asesmen")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Step Progress */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-9 h-9 flex items-center justify-center rounded-full border-2 text-sm font-semibold ${
                        i === activeStep
                          ? "bg-[#6BB1A0] border-[#6BB1A0] text-white"
                          : "bg-gray-100 border-gray-300 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        i === activeStep
                          ? "text-[#36315B]"
                          : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {i < steps.length - 1 && (
                    <div className="w-12 h-px bg-gray-300 mx-2 translate-y-[-12px]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-lg font-semibold mb-6">
              II. Data Fisioterapi (Riwayat Jawaban)
            </h3>

            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="space-y-6">
                {dataRiwayat.map((item) => (
                  <div key={item.question_id} className="border-b pb-4">
                    <p className="text-base font-semibold text-gray-800 mb-2">
                      {item.question_text}
                    </p>
<div className="text-base text-gray-900 bg-gray-100 rounded-2xl p-10 leading-loose min-h-[160px]">
  {renderAnswer(item.answer)}
</div>



                    {item.note && (
                      <p className="text-xs text-gray-500 mt-1">
                        Catatan: {item.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Back */}
            <div className="flex justify-end mt-8">
              <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Kembali
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
