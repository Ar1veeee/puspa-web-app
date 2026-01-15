/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Download, Play, History, Info, X } from "lucide-react";

import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { downloadAssessmentReport } from "@/lib/api/childrenAsesment";
import { getMyAssessmentDetail } from "@/lib/api/checkStatusAsesment";

interface AssessmentDetail {
  assessment_detail_id: number;
  type: string;
  status: string;
  parent_completed_status: string;
}

export default function AssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const assessmentId = searchParams.get("assessment_id") ?? "";

  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState<string[]>([]);
  const [hasNewFile, setHasNewFile] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [completionStatus, setCompletionStatus] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    async function fetchDetail() {
      if (!assessmentId) return;

      try {
        const res = await getMyAssessmentDetail(assessmentId);

        setTypes(res.details.map((d: AssessmentDetail) => d.type));

        const map: Record<string, string> = {};
        res.details.forEach((d: AssessmentDetail) => {
          map[d.type] = d.parent_completed_status;
        });
        setCompletionStatus(map);

        setHasNewFile(Boolean(res.report?.available));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [assessmentId]);

  if (!assessmentId) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-xl font-bold">
        Assessment ID tidak ditemukan.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-10 w-10 border-4 border-[#68B2A0] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const kategoriList = [
    {
      code: "umum",
      kategori: "I. Data Umum",
      subkategori: [
        "A. Identitas",
        "B. Riwayat Anak",
        "C. Riwayat Kesehatan",
        "D. Riwayat Pendidikan",
      ],
      link: `/orangtua/assessment/kategori/data-umum?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/data-umumRiwayat?assessment_id=${assessmentId}`,
    },
    {
      code: "fisio",
      kategori: "II. Data Fisioterapi",
      subkategori: ["A. Keluhan", "B. Riwayat Penyakit"],
      link: `/orangtua/assessment/kategori/fisioterapi?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/fisioterapiRiwayat?assessment_id=${assessmentId}`,
    },
    {
      code: "okupasi",
      kategori: "III. Terapi Okupasi",
      subkategori: [],
      link: `/orangtua/assessment/kategori/okupasi?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/okupasiRiwayat?assessment_id=${assessmentId}`,
    },
    {
      code: "wicara",
      kategori: "IV. Data Terapi Wicara",
      subkategori: [],
      link: `/orangtua/assessment/kategori/wicara?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/wicaraRiwayat?assessment_id=${assessmentId}`,
    },
    {
      code: "paedagog",
      kategori: "V. Data Paedagog",
      subkategori: [
        "A. Aspek Akademis",
        "B. Aspek Ketunaan",
        "C. Aspek Sosialisasi - Komunikasi",
      ],
      link: `/orangtua/assessment/kategori/paedagog?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/paedagogRiwayat?assessment_id=${assessmentId}`,
    },
  ];

  const filteredKategori = kategoriList.filter((k) =>
    types.includes(k.code)
  );

  const handleAction = (action: string, item: any) => {
    if (action === "mulai") router.push(item.link);
    if (action === "riwayat") router.push(item.riwayat);
  };

  const handleDownload = async () => {
    if (!hasNewFile) return;
    try {
      setDownloading(true);
      await downloadAssessmentReport(assessmentId);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-5xl">
      <div className="space-y-6">
        {/* Tombol Tutup/Keluar */}
        <div className="flex justify-end">
          <button
            onClick={() => router.push("/orangtua/assessment")}
            className="text-[#36315B] hover:bg-gray-100 p-2 rounded-full transition-colors"
            aria-label="Tutup"
          >
            <X size={28} />
          </button>
        </div>

        {/* Card Utama List Kategori */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-8 relative z-20">
          <div className="flex justify-between border-b border-gray-100 pb-4 mb-6">
            <h2 className="font-bold text-[#36315B] text-lg">Kategori</h2>
            <h2 className="font-bold text-[#36315B] text-lg hidden sm:block">Status</h2>
          </div>

          <div className="space-y-8">
            {filteredKategori.map((item, index) => {
              const isCompleted = completionStatus[item.code] === "completed";

              return (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-gray-50 pb-6 last:border-none last:pb-0"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-[#36315B] text-base md:text-lg mb-2">
                      {item.kategori}
                    </h3>

                    <ul className="ml-5 text-sm text-gray-600 space-y-1">
                      {item.subkategori.map((sub, idx) => (
                        <li key={idx} className="list-none relative pl-0">
                          {sub}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dropdown Action */}
                  <div className="relative inline-block text-left self-end sm:self-start">
                    <button
                      onClick={() =>
                        setActiveId(activeId === item.code ? null : item.code)
                      }
                      className="flex  cursor-pointer items-center justify-between gap-2 min-h-[40px] px-5 py-2 text-sm font-bold text-white bg-[#68B2A0] hover:bg-[#599A8A] rounded-xl w-full sm:w-auto shadow-sm transition-all"
                    >
                      Aksi
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeId === item.code ? 'rotate-180' : ''}`} />
                    </button>

                    {activeId === item.code && (
                      <div className="absolute right-0 z-50 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <button
                          disabled={isCompleted}
                          onClick={() => {
                            handleAction("mulai", item);
                            setActiveId(null);
                          }}
                          className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold border-b border-gray-50 transition-colors ${isCompleted
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-[#68B2A0] hover:bg-gray-50 cursor-pointer"
                            }`}
                        >
                          <Play className="w-4 h-4 fill-current" />
                          Mulai
                        </button>

                        <button
                          onClick={() => {
                            handleAction("riwayat", item);
                            setActiveId(null);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-[#68B2A0] hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <History className="w-4 h-4" />
                          Riwayat Jawaban
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Unduh Laporan */}
        <div className={`${hasNewFile ? "opacity-0" : "opacity-50"} bg-white border-2 border-[#68B2A0] p-5 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm`}>
          <div className="flex items-start gap-4">
            <div className="bg-[#EAF4F0] p-2 rounded-lg mt-1">
              <Info className="w-5 h-5 text-[#68B2A0]" />
            </div>
            <div>
              <p className="font-bold text-[#36315B] text-base md:text-lg">
                {hasNewFile
                  ? "File baru telah diunggah."
                  : "File belum diunggah."}</p>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                {hasNewFile
                  ? "Asesor telah mengunggah laporan perkembangan terbaru anak Anda."
                  : "Asesor belum mengunggah laporan perkembangan terbaru anak Anda."}
              </p>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={!hasNewFile || downloading}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#68B2A0] hover:bg-[#599A8A] text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>
              {downloading ? "Mengunduh..." : "Unduh Laporan"}
            </span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .animate-in {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </ResponsiveOrangtuaLayout>
  );
}