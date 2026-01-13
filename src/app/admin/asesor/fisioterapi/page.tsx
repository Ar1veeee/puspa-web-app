/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getAssessmentAnswers } from "@/lib/api/asesment";

/* ================== RANGE UTAMA ================== */
const GROUP_RANGE: Record<string, [number, number]> = {
  "Pemeriksaan Umum": [316, 324],
  "Anamnesis Sistem": [325, 333],
  pemeriksaan_sensoris: [334, 340],
  pemeriksaan_refleks_primitif: [341, 356],
  gross_motor_pola_gerak: [357, 394],
  test_joint_laxity: [395, 399],
  pemeriksaan_spastisitas: [400, 405],
  pemeriksaan_kekuatan_otot: [406, 410],
  palpasi_otot: [411, 414],
  jenis_spastisitas: [415, 419],
  test_fungsi_bermain: [420, 426],
  "Diagnosa Fisioterapi": [427, 429],
};

/* ================== GROSS MOTOR ================== */
const GROSS_MOTOR_GROUPS = [
  { title: "Telentang", range: [357, 365] },
  { title: "Berguling", range: [366, 368] },
  { title: "Posisi Telungkup", range: [369, 375] },
  { title: "Posisi Duduk", range: [376, 383] },
  { title: "Posisi Berdiri", range: [384, 391] },
  { title: "Berjalan", range: [392, 394] },
];

export default function Page() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");

  const [activeTab, setActiveTab] = useState("Pemeriksaan Umum");
  const [selectedKhusus, setSelectedKhusus] =
    useState("pemeriksaan_sensoris");
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { key: "Pemeriksaan Umum", label: "Pemeriksaan Umum" },
    { key: "Anamnesis Sistem", label: "Anamnesis Sistem" },
    { key: "pemeriksaan_khusus", label: "Pemeriksaan Khusus" },
  ];

  const pemeriksaanKhususList = [
    { key: "pemeriksaan_sensoris", label: "Pemeriksaan Sensoris" },
    { key: "pemeriksaan_refleks_primitif", label: "Pemeriksaan Reflek Primitif" },
    { key: "gross_motor_pola_gerak", label: "Gross Motor & Pola Gerak" },
    { key: "test_joint_laxity", label: "Test Joint Laxity" },
    { key: "pemeriksaan_spastisitas", label: "Pemeriksaan Spastisitas" },
    { key: "pemeriksaan_kekuatan_otot", label: "Pemeriksaan Kekuatan Otot" },
    { key: "palpasi_otot", label: "Palpasi Otot" },
    { key: "jenis_spastisitas", label: "Jenis Spastisitas" },
    { key: "test_fungsi_bermain", label: "Test Fungsi Bermain" },
    { key: "Diagnosa Fisioterapi", label: "Diagnosa Fisioterapi" },
  ];

  /* ================== FETCH ================== */
  useEffect(() => {
    if (!assessmentId) return;
    getAssessmentAnswers(assessmentId, "fisio").then((res) => {
      setAnswers(Array.isArray(res) ? res : []);
      setLoading(false);
    });
  }, [assessmentId]);

  /* ================== FILTER ================== */
  const filteredQuestions = () => {
    let key = activeTab;
    if (activeTab === "pemeriksaan_khusus") key = selectedKhusus;
    const range = GROUP_RANGE[key];
    if (!range) return [];
    return answers
      .filter(
        (q) => q.question_id >= range[0] && q.question_id <= range[1]
      )
      .sort((a, b) => a.question_id - b.question_id);
  };

  /* ================== PALPASI OTOT (FIX FINAL) ================== */
  const renderPalpasiOtot = (ans: any) => {
  if (!ans || typeof ans !== "object") return "-";

  const rows = [
    { key: "hypertonus", label: "Hypertonus (spastic / rigid)" },
    { key: "hypotonus", label: "Hypotonus" },
    { key: "fluktuatif", label: "Fluktuatif" },
    { key: "normal", label: "Normal" },
  ];

  const renderDS = (rowKey: string, prefix: "aga" | "agb") => {
    const dKey = `${rowKey}_${prefix}_d`;
    const sKey = `${rowKey}_${prefix}_s`;

    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="flex items-center gap-1">
          <span className="font-medium">D :</span>
          <span>{ans[dKey] ?? ""}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">S :</span>
          <span>{ans[sKey] ?? ""}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {/* HEADER */}
      <div className="grid grid-cols-[2.5fr_1.5fr_1.5fr_2fr] font-semibold border-b pb-2">
        <div>Abnormalitas Tonus Otot</div>
        <div className="text-center">AGA</div>
        <div className="text-center">AGB</div>
        <div className="text-center">Perut</div>
      </div>

      {/* ISI */}
      {rows.map((row) => (
        <div
          key={row.key}
          className="grid grid-cols-[2.5fr_1.5fr_1.5fr_2fr] gap-4 py-2 border-b"
        >
          {/* Label */}
          <div className="flex items-center">
            {row.label}
          </div>

          {/* AGA */}
          <div className="flex justify-center">
            {renderDS(row.key, "aga")}
          </div>

          {/* AGB */}
          <div className="flex justify-center">
            {renderDS(row.key, "agb")}
          </div>

          {/* Perut */}
          <div className="flex items-center justify-center">
            {ans[`${row.key}_perut`] ?? ""}
          </div>
        </div>
      ))}
    </div>
  );
};

  /* ================== RENDER ANSWER DEFAULT ================== */
const renderAnswer = (q: any) => {
  const ans = q.answer;
  if (!ans) return "-";

  return (
    <div className="space-y-2">
      {/* VALUE (radio / pilihan / teks utama) */}
      {ans.value !== undefined && ans.value !== null && (
        Array.isArray(ans.value) ? (
          <ul className="list-disc ml-5">
            {ans.value.map((v: string, i: number) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        ) : (
          <div className="font-medium text-gray-800">
            {ans.value}
          </div>
        )
      )}

      {/* NOTE (jika diisi) */}
      {ans.note && ans.note.trim() !== "" && (
        <div className="text-sm text-gray-600 bg-white border rounded p-2">
          <span className="font-semibold">Catatan:</span> {ans.note}
        </div>
      )}
    </div>
  );
};

  /* ================== GROSS MOTOR ================== */
  const renderGrossMotor = (questions: any[]) => (
    <div className="space-y-6">
      {GROSS_MOTOR_GROUPS.map((g) => {
        const qs = questions.filter(
          (q) => q.question_id >= g.range[0] && q.question_id <= g.range[1]
        );
        if (qs.length === 0) return null;

        return (
          <div key={g.title} className="border rounded-lg p-4 bg-gray-50">
            <div className="font-semibold text-lg text-[#3A9C85] mb-4">
              {g.title}
            </div>
            {qs.map((q) => (
              <div key={q.question_id} className="mb-3">
                <div className="text-sm font-medium mb-1">
                  {q.question_text}
                </div>
                <div className="bg-white border rounded p-2">
                  {renderAnswer(q)}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  if (loading) return <div className="p-10">Memuat...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
     
      <div className="flex-1">
        
        <div className="p-6 bg-white rounded-xl shadow">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => (window.location.href = "/admin/jadwal_asesmen")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow"> 
            <h2 className="text-xl font-semibold mb-4"> Riwayat Jawaban Pemeriksaan </h2>
          <div className="flex gap-6 border-b mb-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`pb-2 ${
                  activeTab === t.key
                    ? "border-b-4 border-[#3A9C85] text-[#3A9C85]"
                    : "text-gray-500"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === "pemeriksaan_khusus" && (
            <select
              className="border p-2 rounded mb-6 w-full"
              value={selectedKhusus}
              onChange={(e) => setSelectedKhusus(e.target.value)}
            >
              {pemeriksaanKhususList.map((i) => (
                <option key={i.key} value={i.key}>
                  {i.label}
                </option>
              ))}
            </select>
          )}

          {activeTab === "pemeriksaan_khusus" &&
          selectedKhusus === "gross_motor_pola_gerak" ? (
            renderGrossMotor(filteredQuestions())
          ) : (
            filteredQuestions().map((q) => (
              <div key={q.question_id} className="mb-6">
                <div className="font-medium mb-2">
                  {q.question_text}
                </div>
                <div className="bg-gray-50 border p-3 rounded">
                  {q.question_id >= 411 && q.question_id <= 414
                    ? renderPalpasiOtot(q.answer)
                    : renderAnswer(q)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
