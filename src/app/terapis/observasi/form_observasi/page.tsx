/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  ClipboardList, 
  HelpCircle,
  FileText,
  AlertCircle
} from "lucide-react";
import {
  submitObservation,
  getObservationQuestions,
} from "@/lib/api/observasiSubmit";
import { handleApiError, showSuccessToast } from "@/lib/api-error";

type Question = {
  question_id: number;
  observation_id: number;
  question_text: string;
  score: number;
  question_code: string;
  age_category: string;
  question_number?: number;
};

type Answer = {
  jawaban?: boolean;
  keterangan?: string;
};

const kategoriMap: Record<string, string> = {
  BPE: "Perilaku & Emosi",
  BFM: "Fungsi Motorik",
  BBB: "Bahasa & Bicara",
  BKA: "Kognitif & Atensi",
  BS: "Sosial & Emosi",
  APE: "Perilaku & Emosi",
  AFM: "Fungsi Motorik",
  ABB: "Bahasa & Bicara",
  AKA: "Kognitif & Atensi",
  AS: "Sosial & Emosi",
  RPE: "Perilaku & Emosi",
  RFM: "Fungsi Motorik",
  RBB: "Bahasa & Bicara",
  RKA: "Kognitif & Atensi",
  RS: "Sosial & Emosi",
  RK: "Kemandirian",
};

export default function FormObservasiPage() {
  const searchParams = useSearchParams();

  const pasien = {
    nama: searchParams.get("nama") || "",
    usia: searchParams.get("usia") || "",
    kategori: searchParams.get("kategori") || "",
    tglObservasi: searchParams.get("tglObservasi") || "",
    observation_id:
      searchParams.get("observation_id") || searchParams.get("id") || "",
  };

  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [step, setStep] = useState<"observasi" | "kesimpulan" | "review">(
    "observasi"
  );
  const [kesimpulan, setKesimpulan] = useState("");
  const [rekomendasiLanjutan, setRekomendasiLanjutan] = useState("");
  const [rekomendasiAssessment, setRekomendasiAssessment] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load questions
  useEffect(() => {
    const fetchData = async () => {
      if (!pasien.observation_id) {
        handleApiError(null, "Observation ID tidak ditemukan di URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getObservationQuestions(pasien.observation_id);
        if (Array.isArray(data) && data.length > 0) {
          setQuestionsData(data);
          const firstPrefix = data[0].question_code.split("-")[0];
          setActiveTab(kategoriMap[firstPrefix] || firstPrefix);
        } else {
          handleApiError(null, "Tidak ada pertanyaan untuk observasi ini.");
        }
      } catch (err) {
        console.error("Gagal mengambil data observasi:", err);
        handleApiError(err, "Terjadi kesalahan saat memuat data observasi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pasien.observation_id]);

  // Group questions by category
  const groupedQuestions = questionsData.reduce(
    (acc: Record<string, Question[]>, q: Question) => {
      const prefix = q.question_code.split("-")[0];
      const kategori = kategoriMap[prefix] || prefix;
      if (!acc[kategori]) acc[kategori] = [];
      acc[kategori].push(q);
      return acc;
    },
    {}
  );

  const kategoriList = Object.keys(groupedQuestions);

  // Total Score
  const totalScore = questionsData.reduce((acc, q) => {
    const score = Number(q.score) || 0;
    if (answers[q.question_id]?.jawaban) return acc + score;
    return acc;
  }, 0);

  const handleChange = (id: number, field: keyof Answer, value: string | boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleNext = () => {
    const pertanyaanKategori = groupedQuestions[activeTab];
    const belumDiisi = pertanyaanKategori.some(
      (q) => answers[q.question_id]?.jawaban === undefined
    );
    if (belumDiisi) {
      handleApiError(null, "Harap isi semua jawaban sebelum lanjut.");
      return;
    }
    const idx = kategoriList.indexOf(activeTab);
    if (idx < kategoriList.length - 1) setActiveTab(kategoriList[idx + 1]);
  };

  const handlePrev = () => {
    const idx = kategoriList.indexOf(activeTab);
    if (idx > 0) setActiveTab(kategoriList[idx - 1]);
  };

  const handleAssessmentChange = (value: string, checked: boolean) => {
    setRekomendasiAssessment((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((v) => v !== value);
      }
    });
  };

  const handleSimpan = async () => {
    setSubmitting(true);

    const payload = {
      answers: Object.entries(answers).map(([id, ans]) => ({
        question_id: parseInt(id, 10),
        answer: ans.jawaban || false,
        note: ans.keterangan || "",
      })),
      conclusion: kesimpulan,
      recommendation: rekomendasiLanjutan,

      paedagog: rekomendasiAssessment.includes("(PLB) Paedagog"),
      okupasi: rekomendasiAssessment.includes("Terapi Okupasi"),
      wicara: rekomendasiAssessment.includes("Terapi Wicara"),
      fisio: rekomendasiAssessment.includes("Fisioterapi"),
    };

    try {
      const res = await submitObservation(pasien.observation_id, payload);
      if (res?.success) {
        showSuccessToast("Observasi berhasil disimpan! ✅");
        window.location.href = "/terapis/observasi/riwayat";
      } else {
        handleApiError(res, `Gagal menyimpan: ${res?.message || "Unknown error"} ❌`);
      }
    } catch (err) {
      console.error("Error saat menyimpan:", err);
      handleApiError(err, "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 text-[#1E5C58] bg-[#F8FBFB] min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center border-b border-teal-100/50 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#1E5C58]">
            Form Observasi Klinis
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Lengkapi lembar observasi untuk: <span className="font-bold text-[#1E5C58]">{pasien.nama}</span> ({pasien.usia})
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/terapis/observasi")}
          className="cursor-pointer inline-flex items-center gap-2 bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(129,183,169,0.2)] hover:shadow-[0_8px_20px_rgba(30,92,88,0.2)] hover:-translate-y-0.5"
        >
          <span>Kembali</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-8 h-8 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-sm font-medium">Memuat pertanyaan form...</span>
        </div>
      ) : (
        <>
          {/* ================= STEPPER & SCORE PANEL ================= */}
          {step === "observasi" && kategoriList.length > 0 && (
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-5 rounded-2xl border border-teal-50/60 shadow-[0_4px_24px_rgba(30,92,88,0.03)]">
              {/* Stepper Buttons */}
              <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
                {kategoriList.map((k, i) => {
                  const pertanyaanKategori = groupedQuestions[k];
                  const sudahDiisi = pertanyaanKategori.every(
                    (q) => answers[q.question_id]?.jawaban !== undefined
                  );
                  const isActive = activeTab === k;

                  return (
                    <div key={k} className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setActiveTab(k)}
                        className={`cursor-pointer w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isActive
                            ? "bg-[#1E5C58] text-white shadow-md shadow-[#1E5C58]/20"
                            : sudahDiisi
                            ? "bg-[#81B7A9] text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {sudahDiisi && !isActive ? <Check className="w-4 h-4" /> : i + 1}
                      </button>
                      <span className={`text-xs font-semibold ${isActive ? "text-[#1E5C58] font-bold" : "text-gray-400"}`}>
                        {k}
                      </span>
                      {i < kategoriList.length - 1 && (
                        <span className="text-gray-300 mx-1">/</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Score Tag */}
              <div className="shrink-0 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-4 py-2 rounded-full shadow-sm">
                Total Skor Sementara : {totalScore}
              </div>
            </div>
          )}

          {/* ================= STEP: OBSERVASI ================= */}
          {step === "observasi" && kategoriList.length > 0 && (
            <div className="space-y-6">
              {groupedQuestions[activeTab]?.map((q: Question) => (
                <div 
                  key={q.question_id} 
                  className="p-5 bg-white rounded-2xl border border-teal-50/50 shadow-[0_4px_20px_rgba(30,92,88,0.02)] hover:shadow-[0_8px_30px_rgba(30,92,88,0.06)] transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <p className="font-bold text-gray-700 leading-relaxed text-sm md:text-base">
                        {q.question_number}. {q.question_text}
                      </p>
                      <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                        Skor {q.score}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <input
                        type="text"
                        placeholder="Tambahkan keterangan pendukung observasi di sini..."
                        className="w-full md:flex-1 border border-teal-100 rounded-xl px-4 py-2.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#81B7A9] shadow-sm hover:border-teal-200 transition-colors"
                        value={answers[q.question_id]?.keterangan || ""}
                        onChange={(e) =>
                          handleChange(q.question_id, "keterangan", e.target.value)
                        }
                      />
                      
                      {/* Radio Answers */}
                      <div className="flex items-center gap-5 shrink-0 bg-[#EAF4F2]/30 px-4 py-2 rounded-xl border border-teal-50/40">
                        <label className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-600 cursor-pointer">
                          <input
                            type="radio"
                            name={`jawaban-${q.question_id}`}
                            value="true"
                            checked={answers[q.question_id]?.jawaban === true}
                            onChange={() => handleChange(q.question_id, "jawaban", true)}
                            className="w-4 h-4 accent-[#1E5C58] cursor-pointer"
                          />
                          <span>Ya</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-600 cursor-pointer">
                          <input
                            type="radio"
                            name={`jawaban-${q.question_id}`}
                            value="false"
                            checked={answers[q.question_id]?.jawaban === false}
                            onChange={() => handleChange(q.question_id, "jawaban", false)}
                            className="w-4 h-4 accent-[#1E5C58] cursor-pointer"
                          />
                          <span>Tidak</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-4">
                <div>
                  {activeTab !== kategoriList[0] && (
                    <button
                      onClick={handlePrev}
                      className="cursor-pointer inline-flex items-center gap-1.5 bg-white text-[#81B7A9] px-5 py-2.5 rounded-xl border border-teal-100 hover:bg-teal-50/30 transition-all text-sm font-semibold"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Sebelumnya</span>
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  {activeTab === kategoriList[kategoriList.length - 1] ? (
                    <button
                      onClick={() => {
                        const pertanyaanKategori = groupedQuestions[activeTab];
                        const belumDiisi = pertanyaanKategori.some(
                          (q) => answers[q.question_id]?.jawaban === undefined
                        );
                        if (belumDiisi) {
                          handleApiError(null, "Harap isi semua jawaban sebelum lanjut.");
                          return;
                        }
                        setStep("kesimpulan");
                      }}
                      className="cursor-pointer bg-[#1E5C58] hover:bg-[#2E8B83] text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      Selesai Observasi
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="cursor-pointer inline-flex items-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      <span>Lanjutkan</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP: KESIMPULAN & REKOMENDASI ================= */}
          {step === "kesimpulan" && (
            <div className="bg-white border border-teal-50/50 shadow-[0_4px_24px_rgba(30,92,88,0.03)] rounded-2xl p-6 md:p-8 space-y-6 text-[#1E5C58]">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Isi Kesimpulan & Rekomendasi</h2>
                <p className="text-xs text-gray-400 mt-1">Lengkapi evaluasi akhir dari proses observasi anak</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#EAF4F2]/30 border border-teal-50 rounded-xl text-xs gap-3">
                <div>
                  <span className="text-gray-400">Nama Pasien:</span>
                  <span className="font-bold text-gray-700 ml-1.5">{pasien.nama}</span>
                </div>
                <div>
                  <span className="text-gray-400">Tanggal Observasi:</span>
                  <span className="font-bold text-gray-700 ml-1.5">{pasien.tglObservasi}</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-100">
                  Total Skor: {totalScore}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kesimpulan Observasi</label>
                  <textarea
                    placeholder="Tuliskan evaluasi kesimpulan secara lengkap di sini..."
                    className="w-full border border-teal-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#81B7A9] hover:border-teal-200 transition-colors text-sm"
                    rows={4}
                    value={kesimpulan}
                    onChange={(e) => setKesimpulan(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Rekomendasi Lanjutan</label>
                  <textarea
                    placeholder="Tuliskan saran rekomendasi tindak lanjut bagi orang tua..."
                    className="w-full border border-teal-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#81B7A9] hover:border-teal-200 transition-colors text-sm"
                    rows={4}
                    value={rekomendasiLanjutan}
                    onChange={(e) => setRekomendasiLanjutan(e.target.value)}
                  />
                </div>

                {/* Checklist Rekomendasi Assessment */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Rekomendasi Assessment Spesifik</label>
                  <div className="flex flex-wrap gap-3">
                    {["(PLB) Paedagog", "Terapi Okupasi", "Terapi Wicara", "Fisioterapi"].map((item) => (
                      <label 
                        key={item} 
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-colors text-xs md:text-sm font-semibold ${
                          rekomendasiAssessment.includes(item)
                            ? "bg-[#1E5C58] border-[#1E5C58] text-white shadow-sm"
                            : "bg-[#EAF4F2]/30 border-teal-50 text-gray-700 hover:bg-[#EAF4F2]/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={item}
                          checked={rekomendasiAssessment.includes(item)}
                          onChange={(e) => handleAssessmentChange(item, e.target.checked)}
                          className="w-4 h-4 accent-[#1E5C58]"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button
                  onClick={() => setStep("observasi")}
                  className="cursor-pointer inline-flex items-center gap-1.5 bg-white text-[#81B7A9] px-5 py-2.5 rounded-xl border border-teal-100 hover:bg-teal-50/30 transition-all text-sm font-semibold"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
                <button
                  onClick={() => {
                    if (!kesimpulan.trim()) {
                      handleApiError(null, "Kesimpulan wajib diisi.");
                      return;
                    }
                    setStep("review");
                  }}
                  className="cursor-pointer inline-flex items-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <span>Lanjutkan</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP: REVIEW DATA ================= */}
          {step === "review" && (
            <div className="bg-white border border-teal-50/50 shadow-[0_4px_24px_rgba(30,92,88,0.03)] rounded-2xl p-6 md:p-8 space-y-6 text-[#1E5C58]">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Review Hasil Observasi</h2>
                <p className="text-xs text-gray-400 mt-1">Periksa kembali data sebelum menyimpan ke server</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#EAF4F2]/30 border border-teal-50 rounded-xl p-4 text-xs font-semibold">
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase">Nama Pasien</span>
                  <span className="text-gray-700 text-sm font-bold">{pasien.nama}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase">Tanggal Observasi</span>
                  <span className="text-gray-700 text-sm font-bold">{pasien.tglObservasi}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase">Akumulasi Skor</span>
                  <span className="text-teal-700 text-sm font-extrabold">{totalScore}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#EAF4F2]/10 border border-teal-50 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Kesimpulan Evaluasi</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium">
                    {kesimpulan}
                  </p>
                </div>

                <div className="bg-[#EAF4F2]/10 border border-teal-50 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Rekomendasi Lanjutan</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium">
                    {rekomendasiLanjutan || "Tidak ada rekomendasi tertulis"}
                  </p>
                </div>

                <div className="bg-[#EAF4F2]/10 border border-teal-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>Rekomendasi Assessment Spesifik</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {rekomendasiAssessment.length > 0 ? (
                      rekomendasiAssessment.map((rec) => (
                        <span key={rec} className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-[#EAF4F2] text-[#1E5C58]">
                          {rec}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 font-medium italic">Tidak ada rekomendasi spesifik</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button
                  onClick={() => setStep("kesimpulan")}
                  className="cursor-pointer inline-flex items-center gap-1.5 bg-white text-[#81B7A9] px-5 py-2.5 rounded-xl border border-teal-100 hover:bg-teal-50/30 transition-all text-sm font-semibold"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
                <button
                  onClick={handleSimpan}
                  disabled={submitting}
                  className="cursor-pointer bg-[#1E5C58] hover:bg-[#2E8B83] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Hasil Observasi"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
