/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import {
  ChevronDown,
  X,
  User,
  Users,
  Baby,
  Calendar,
  MapPin,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Info
} from "lucide-react";

import {
  getParentAssessmentAnswers,
  ParentSubmitType,
} from "@/lib/api/asesmentTerapiOrtu";
import {
  getMyAssessments,
  getChildDetail,
} from "@/lib/api/childrenAsesment";

const parentGeneralRanges = [
  { group_key: "riwayat_psikososial", title: "Riwayat Psikososial", range: [430, 434] },
  { group_key: "riwayat_kehamilan", title: "Riwayat Kehamilan", range: [435, 442] },
  { group_key: "riwayat_kelahiran", title: "Riwayat Kelahiran", range: [443, 455] },
  { group_key: "riwayat_setelah_kelahiran", title: "Riwayat Setelah Kelahiran", range: [456, 468] },
  { group_key: "riwayat_kesehatan", title: "Riwayat Kesehatan", range: [469, 476] },
  { group_key: "riwayat_pendidikan", title: "Riwayat Pendidikan", range: [477, 485] },
];

export default function RiwayatJawabanOrangtua() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");
  const type = (searchParams.get("type") || "umum_parent") as ParentSubmitType;

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [activeCategory, setActiveCategory] = useState<string>(
    parentGeneralRanges[0].group_key
  );
  const [familyInfo, setFamilyInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assessmentId) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const [aRes, myAssessments] = await Promise.all([
          getParentAssessmentAnswers(assessmentId, type),
          getMyAssessments(),
        ]);

        const answerMap: Record<string, any> = {};
        (aRes?.data || []).forEach((item: any) => {
          answerMap[item.question_id] = {
            value: item.answer?.value ?? item.answer ?? null,
            note: item.note ?? null,
            question_text: item.question_text,
            question_number: item.question_number,
          };
        });
        setAnswers(answerMap);

        const found = (myAssessments?.data || []).find(
          (x: any) => String(x.assessment_id) === String(assessmentId)
        );

        if (found?.child_id) {
          const detail = await getChildDetail(found.child_id);
          setFamilyInfo(detail);
        }
      } catch (err) {
        console.error("❌ Gagal memuat data riwayat:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [assessmentId, type]);

  const currentQuestions = Object.entries(answers)
    .filter(([id]) => {
      const numId = parseInt(id);
      const rangeObj = parentGeneralRanges.find(
        (g) => g.group_key === activeCategory
      );
      return rangeObj
        ? numId >= rangeObj.range[0] && numId <= rangeObj.range[1]
        : true;
    })
    .map(([id, val]) => ({ question_id: id, ...val }));

  const steps = [
    "Data Umum",
    "Data Fisioterapi",
    "Data Terapi Okupasi",
    "Data Terapi Wicara",
    "Data Paedagog",
  ];
  const activeStep = 0;

  const categoryOrder = parentGeneralRanges.map((g) => g.group_key);
  const currentIndex = categoryOrder.indexOf(activeCategory);

  const goPrevCategory = () => {
    if (currentIndex > 0) {
      setActiveCategory(categoryOrder[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goNextCategory = () => {
    if (currentIndex < categoryOrder.length - 1) {
      setActiveCategory(categoryOrder[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderCellValue = (value: any) => {
    if (typeof value === "object" && value !== null) {
      const allNull = Object.values(value).every((v) => !v);
      return allNull ? "-" : JSON.stringify(value);
    }
    return value ?? "-";
  };

  const renderAnswer = (answer: any) => {
    if (!answer) return <span className="text-gray-400 italic">Belum diisi</span>;
    if (typeof answer === "string" || typeof answer === "number")
      return <span className="text-[#36315B] font-semibold">{answer}</span>;

    if (Array.isArray(answer)) {
      if (!answer.length) return <span className="text-gray-400">-</span>;
      if (typeof answer[0] === "object") {
        const headers = Object.keys(answer[0]);
        return (
          <div className="overflow-x-auto my-2 rounded-lg border border-gray-200">
            <table className="w-full text-xs md:text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] tracking-wider">
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="px-4 py-3 font-bold border-b">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {answer.map((row, idx) => (
                  <tr key={idx} className="bg-white">
                    {headers.map((h) => (
                      <td key={h} className="px-4 py-3 text-gray-700">{renderCellValue(row[h])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      return (
        <ul className="list-disc pl-5 space-y-1 text-[#36315B] font-semibold">
          {answer.map((v, i) => (
            <li key={i}>{v ?? "-"}</li>
          ))}
        </ul>
      );
    }

    if (typeof answer === "object") {
      const allNull = Object.values(answer).every((v) => !v);
      if (allNull) return <span className="text-gray-400">-</span>;
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          {Object.entries(answer).map(([k, v]) => (
            <div key={k} className="flex flex-col p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">{k}</span>
              <span className="text-sm font-semibold text-[#36315B]">{renderCellValue(v)}</span>
            </div>
          ))}
        </div>
      );
    }

    return <span>{String(answer)}</span>;
  };

  const InfoRow = ({ label, value, icon: Icon }: any) => (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center gap-2 text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
        {Icon && <Icon size={12} className="text-[#6BB1A0]" />}
        {label}
      </div>
      <div className="text-sm md:text-base font-semibold text-[#36315B] leading-tight">
        {value || "-"}
      </div>
    </div>
  );

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-5xl">
      {/* CLOSE BUTTON */}
      <div className="flex justify-end mb-4 md:mb-6">
        <button
          onClick={() =>
            router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`)
          }
          className="font-bold text-2xl text-[#36315B] hover:text-red-500 transition-colors p-2 cursor-pointer"
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
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 ${isActive
                      ? "bg-[#6BB1A0] border-[#6BB1A0] text-white shadow-sm"
                      : "bg-white border-gray-300 text-gray-400"
                      }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`mt-2 text-[11px] md:text-sm text-center leading-tight ${isActive ? "font-semibold text-[#36315B]" : "text-gray-400"
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

      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#EAF4F0] rounded-xl text-[#6BB1A0]">
            <ClipboardList size={24} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#36315B]">
              Riwayat Jawaban
            </h2>
            <p className="text-xs text-gray-400 font-medium">Data Umum Orang Tua</p>
          </div>
        </div>
      </div>

      {/* IDENTITAS CARD */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#6BB1A0]" />

        <h3 className="font-black text-[#36315B] mb-6 flex items-center gap-2 text-lg">
          <Baby size={20} className="text-[#6BB1A0]" />
          Identitas Anak & Keluarga
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 mb-8">
          <InfoRow label="Nama Anak" value={familyInfo.child_name} icon={User} />
          <InfoRow label="Tempat, Tgl Lahir" value={familyInfo.child_birth_info} icon={MapPin} />
          <InfoRow label="Usia / Gender" value={`${familyInfo.child_age} / ${familyInfo.child_gender === 'perempuan' ? 'P' : 'L'}`} icon={Calendar} />
          <InfoRow label="Agama" value={familyInfo.child_religion} icon={Users} />
          <InfoRow label="Sekolah" value={familyInfo.child_school} icon={BookOpen} />
          <div className="sm:col-span-2 lg:col-span-1">
            <InfoRow label="Alamat" value={familyInfo.child_address} icon={MapPin} />
          </div>
        </div>

        <h4 className="text-xs font-black text-[#6BB1A0] uppercase tracking-widest border-l-4 border-[#6BB1A0] pl-2">Data Ayah</h4>

        {/* Sub Headers for Parents */}
        <div className="col-span-full pt-4 border-t border-gray-50 mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <InfoRow label="Nama Ayah" value={familyInfo.father_name} />
            <InfoRow label="Pekerjaan" value={`${familyInfo.father_occupation || '-'}`} />
          </div>

          <div className="space-y-4">
            <InfoRow label="Hubungan Dengan Anak" value={`${familyInfo.relationship_with_child || '-'} `} />
            <InfoRow label="Tanggal Lahir" value={familyInfo.father_birth_date} />
          </div>

          <div className="space-y-4">
            <InfoRow label="Nomor Telepon" value={` ${familyInfo.father_phone_number || '-'}`} />
            <InfoRow label="NIK" value={` ${familyInfo.father_identity_number || '-'}`} />
          </div>
        </div>

        <h4 className="text-xs font-black text-[#6BB1A0] uppercase tracking-widest border-l-4 border-[#6BB1A0] pl-2">Data Ibu</h4>

        {/* Sub Headers for Parents */}
        <div className="col-span-full pt-4 border-t border-gray-50 mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <InfoRow label="Nama Ibu" value={familyInfo.mother_name} />
            <InfoRow label="Pekerjaan" value={`${familyInfo.mother_occupation || '-'}`} />
          </div>

          <div className="space-y-4">
            <InfoRow label="Hubungan Dengan Anak" value={`${familyInfo.relationship_with_child || '-'} `} />
            <InfoRow label="Tanggal Lahir" value={familyInfo.mother_birth_date} />
          </div>

          <div className="space-y-4">
            <InfoRow label="Nomor Telepon" value={` ${familyInfo.mother_phone_number || '-'}`} />
            <InfoRow label="NIK" value={` ${familyInfo.mother_identity_number || '-'}`} />
          </div>
        </div>

        <h4 className="text-xs font-black text-[#6BB1A0] uppercase tracking-widest border-l-4 border-[#6BB1A0] pl-2">Data Wali</h4>

        {/* Sub Headers for Parents */}
        <div className="col-span-full pt-4 border-t border-gray-50 mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <InfoRow label="Nama Wali" value={familyInfo.guardian_name} />
            <InfoRow label="Pekerjaan" value={`${familyInfo.guardian_occupation || '-'}`} />
          </div>

          <div className="space-y-4">
            <InfoRow label="Hubungan Dengan Anak" value={`${familyInfo.relationship_with_child || '-'} `} />
            <InfoRow label="Tanggal Lahir" value={familyInfo.guardian_birth_date} />
          </div>

          <div className="space-y-4">
            <InfoRow label="Nomor Telepon" value={` ${familyInfo.guardian_phone_number || '-'}`} />
            <InfoRow label="NIK" value={` ${familyInfo.guardian_identity_number || '-'}`} />
          </div>
        </div>
      </div>

      {/* FILTER KATEGORI */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="font-bold text-[#36315B]">Kategori Pertanyaan</h3>
        <div className="relative w-full sm:w-auto">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-[#36315B] focus:ring-2 focus:ring-[#6BB1A0]/20 focus:border-[#6BB1A0] outline-none w-full transition-all shadow-sm"
          >
            {parentGeneralRanges.map((g) => (
              <option key={g.group_key} value={g.group_key}>{g.title}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6BB1A0] pointer-events-none" />
        </div>
      </div>

      {/* QUESTIONS LIST */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-10 text-[#36315B]">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-[#6BB1A0] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Sinkronisasi data...</p>
          </div>
        ) : currentQuestions.length === 0 ? (
          <p className="py-10 text-center text-gray-400">Tidak ada pertanyaan di kategori ini.</p>
        ) : (
          <div className="space-y-8">
            {currentQuestions.map((q) => (
              <div key={q.question_id} className="group">
                <label className="block font-bold text-sm md:text-base mb-3 leading-relaxed">
                  <span className="text-[#6BB1A0] mr-1">{q.question_number ? `${q.question_number}. ` : ""}</span>
                  {q.question_text}
                </label>
                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 md:p-5 transition-colors group-hover:bg-white group-hover:border-[#EAF4F0] group-hover:shadow-sm">
                  {renderAnswer(q.value)}
                </div>
                {q.note && (
                  <div className="mt-2 flex items-start gap-2 text-xs italic text-gray-400 ml-2">
                    <Info size={14} className="mt-0.5 shrink-0" />
                    <span>Catatan: {q.note}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* NAVIGATION BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-4">
        <button
          onClick={goPrevCategory}
          disabled={currentIndex === 0}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all w-full sm:w-auto
            disabled:opacity-0 disabled:pointer-events-none bg-gray-100 text-gray-500 hover:bg-gray-200"
        >
          <ArrowLeft size={18} />
          Sebelumnya
        </button>

        <button
          onClick={goNextCategory}
          disabled={currentIndex === categoryOrder.length - 1}
          className="flex items-center justify-center gap-2 px-10 py-3.5 rounded-2xl font-black text-sm transition-all w-full sm:w-auto
            disabled:opacity-0 disabled:pointer-events-none bg-[#6BB1A0] text-white hover:bg-[#599A8A] shadow-lg shadow-[#6BB1A0]/20 active:scale-95"
        >
          Selanjutnya
          <ArrowRight size={18} />
        </button>
      </div>
    </ResponsiveOrangtuaLayout >
  );
}