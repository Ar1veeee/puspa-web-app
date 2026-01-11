/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";

import { getAssessmentQuestions, submitAssessment } from "@/lib/api/asesment";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const assessmentId = searchParams.get("assessment_id");

  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("Pemeriksaan Umum");

  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [responses, setResponses] = useState<{ [key: string]: any }>({});

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
    { key: "diagnosa_fisioterapi", label: "Diagnosa Fisioterapi" },
  ];

  const [selectedKhusus, setSelectedKhusus] = useState(pemeriksaanKhususList[0].key);

  const tabs = ["Pemeriksaan Umum", "Anamnesis Sistem", "Pemeriksaan Khusus"];

  // ==========================
  // DEFINISI SUBKATEGORI GROSS MOTOR
  // ==========================
  const GM_PREFIX_MAP: Record<string, string> = {
    "gm_telentang": "Telentang",
    "gm_rolling": "Berguling",
    "gm_prone": "Posisi Telungkup",
    "gm_sitting": "Posisi Duduk",
    "gm_standing": "Posisi Berdiri",
    "gm_walk": "Berjalan",
  };

  useEffect(() => {
    if (!assessmentId) return;

    const load = async () => {
      setLoading(true);

      const data = await getAssessmentQuestions("fisio");
      const allGroups = data.groups || [];

      const baseGMGroup = allGroups.find(
        (g: any) => g.group_key === "gross_motor_pola_gerak"
      );

      let gmSubGroups: any[] = [];
      if (baseGMGroup) {
        gmSubGroups = Object.entries(GM_PREFIX_MAP).map(([prefix, title]) => {
          const questions = baseGMGroup.questions.filter((q: any) =>
            q.question_code.includes(prefix)
          );

          return {
            group_id: `${baseGMGroup.group_id}_${prefix}`,
            parent_group_key: "gross_motor_pola_gerak",
            group_key: prefix,
            title,
            questions,
          };
        });
      }

      const cleanedGroups = allGroups.filter(
        (g: any) => g.group_key !== "gross_motor_pola_gerak"
      );

      const finalGroups = [...cleanedGroups, ...gmSubGroups];

      setGroups(finalGroups);
      setLoading(false);
    };

    load();
  }, [assessmentId]);

  // ==============================
  // FILTER GROUPS PER TAB
  // ==============================
  const filteredGroups =
    activeTab === "Pemeriksaan Khusus"
      ? groups.filter(
          (g) =>
            g.group_key === selectedKhusus ||
            g.parent_group_key === selectedKhusus
        )
      : activeTab === "Pemeriksaan Umum"
      ? groups.filter((g) => g.group_key === "pemeriksaan_umum")
      : groups.filter((g) => g.group_key === "anamnesis_sistem");

  // ==============================
  // HANDLER INPUT
  // ==============================
  const getQKey = (q: any) => `q_${q.id}`;

  const handleCheck = (key: string, value: string) => {
    setResponses((prev) => {
      const arr = Array.isArray(prev[key]?.value ? prev[key].value : prev[key])
        ? prev[key].value
        : [];
      const newArr = arr.includes(value)
        ? arr.filter((x: string) => x !== value)
        : [...arr, value];
      return { ...prev, [key]: { value: newArr } };
    });
  };

  const handleRadio = (key: string, value: string) => {
    setResponses((prev) => ({ ...prev, [key]: { value } }));
  };

  const handleText = (key: string, v: string) => {
    setResponses((prev) => ({ ...prev, [key]: { value: v } }));
  };

  const handleRadioWithText = (key: string, value: string, text?: string) => {
    setResponses((prev) => ({
      ...prev,
      [key]: { value, note: text || "" },
    }));
  };

  const handleMultiSegment = (key: string, segment: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [segment]: value },
    }));
  };

  // ==============================
  // SUBMIT
  // ==============================
  const handleSubmit = async () => {
  if (!assessmentId) {
    alert("❌ assessment_id tidak ditemukan");
    return;
  }

  // ======================
  // BUILD PAYLOAD
  // ======================
  const answers = Object.keys(responses).map((key) => ({
    question_id: Number(key.replace("q_", "")),
    answer: responses[key],
  }));

  const payload = { answers };

  // ======================
  // CONSOLE DEBUG
  // ======================
  console.log("📦 Submit Fisio Assessment");
  console.log("🆔 assessment_id:", assessmentId);
  console.log("📌 type: fisio");
  console.log("📌 activeTab:", activeTab);
  console.log("📦 responses (raw):", responses);
  console.log("📦 payload (final):", payload);

  try {
    await submitAssessment(assessmentId, "fisio", payload);

    console.log("✅ Submit Fisio Assessment SUCCESS");
    alert("✅ Assessment Fisioterapi berhasil disimpan!");
    router.push(`/terapis/asessment?type=fisio&status=completed`);
  } catch (err: any) {
    console.error("❌ Submit Fisio Assessment error:", err);

    const status = err?.response?.status;
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Terjadi kesalahan";

    // ⛔ TIDAK PUNYA IZIN
    if (status === 403) {
      alert(
        "❌ Anda tidak memiliki izin untuk menyimpan assessment ini.\n\n" +
          "Pastikan:\n" +
          "-  Anda login sebagai Asesor sesuai jenis terapi\n" +
          "- Assessment ini adalah milik Anda"
      );
      return;
    }

    // 🔐 TOKEN HABIS / BELUM LOGIN
    if (status === 401) {
      alert("⚠️ Sesi Anda telah berakhir. Silakan login kembali.");
      window.location.href = "/login";
      return;
    }

    // ❌ ERROR LAINNYA
    alert("❌ Gagal menyimpan: " + message);
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Memuat pertanyaan...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarTerapis />

      <div className="flex-1">
        <HeaderTerapis />

        <div className="p-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => (window.location.href = "/terapis/asessment")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">Pemeriksaan</h2>

              {/* Tabs */}
              <div className="flex gap-6 border-b mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 ${
                      activeTab === tab
                        ? "border-b-4 border-[#3A9C85] text-[#3A9C85] font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Pemeriksaan Khusus */}
              {activeTab === "Pemeriksaan Khusus" && (
                <div className="mb-6">
                  <label className="text-sm font-medium">
                    Aspek Pemeriksaan Khusus
                  </label>
                  <select
                    value={selectedKhusus}
                    onChange={(e) => setSelectedKhusus(e.target.value)}
                    className="border rounded-lg px-3 py-2 mt-1 w-full"
                  >
                    {pemeriksaanKhususList.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Pertanyaan */}
              {filteredGroups.length === 0 && (
                <div className="text-gray-500">Tidak ada pertanyaan pada grup ini.</div>
              )}

              {filteredGroups.map((section: any) => (
                <div key={section.group_id} className="mb-6">
                  <div className="px-5 py-3 bg-[#CFE7E1] rounded-lg font-semibold mb-3">
                    {section.title}
                  </div>

                  <div className="p-3">
                    {(section.questions ?? []).map((q: any) => {
                      const qKey = getQKey(q);
                      const options: string[] = q.answer_options
                        ? JSON.parse(q.answer_options)
                        : [];

                      return (
                        
                        <div key={qKey} className="mb-6">
                          {section.group_key !== "palpasi_otot" && (
  <div className="font-medium mb-2">
    {q.question_text}
  </div>
)}


                          {/* Checkbox */}
                          {q.answer_type === "checkbox" && (
                            <div className="flex gap-6 flex-wrap">
                              {options.map((opt) => (
                                <label key={opt} className="flex gap-2">
                                  <input
                                    type="checkbox"
                                    checked={responses[qKey]?.value?.includes(opt) || false}
                                    onChange={() => handleCheck(qKey, opt)}
                                    className="accent-[#409E86]"
                                  />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          )}

                          {/* Radio */}
                          {q.answer_type === "radio" && (
                            <div className="flex gap-6 flex-wrap">
                              {options.map((opt) => (
                                <label key={opt} className="flex gap-2">
                                  <input
                                    type="radio"
                                    name={qKey}
                                    checked={responses[qKey]?.value === opt}
                                    onChange={() => handleRadio(qKey, opt)}
                                    className="accent-[#409E86]"
                                  />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          )}

                          {/* Radio with Text */}
                          {q.answer_type === "radio_with_text" && (
                            <div className="flex flex-col gap-2">
                              {options.map((opt) => (
                                <label key={opt} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={qKey}
                                    checked={responses[qKey]?.value === opt}
                                    onChange={() =>
                                      handleRadioWithText(qKey, opt, "")
                                      
                                    }
                                    className="accent-[#409E86]"
                                  />
                                  {opt}
                                </label>
                              ))}

                              <input
                                type="text"
                                className="border px-3 py-2 rounded w-full"
                                placeholder={
                                  q.extra_schema
                                    ? JSON.parse(q.extra_schema).text_placeholder
                                    : ""
                                }
                                value={responses[qKey]?.note || ""}
                                onChange={(e) =>
                                  handleRadioWithText(
                                    qKey,
                                    responses[qKey]?.value || "",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          )}

                          {/* Text */}
                          {q.answer_type === "text" && (
                            <input
                              type="text"
                              className="border px-3 py-2 rounded w-full"
                              value={responses[qKey]?.value || ""}
                              onChange={(e) => handleText(qKey, e.target.value)}
                            />
                          )}

                          {/* Textarea */}
                          {q.answer_type === "textarea" && (
                            <textarea
                              className="border px-3 py-2 rounded w-full"
                              placeholder={
                                q.extra_schema
                                  ? JSON.parse(q.extra_schema).placeholder
                                  : ""
                              }
                              rows={
                                q.extra_schema
                                  ? JSON.parse(q.extra_schema).rows
                                  : 4
                              }
                              value={responses[qKey]?.value || ""}
                              onChange={(e) => handleText(qKey, e.target.value)}
                            />
                          )}

                          {/* Multi Segment */}
                          {/* Multi Segment – Palpasi Otot (SESUIAI GAMBAR, TANPA TABEL) */}
{/* Multi Segment – Palpasi Otot (FINAL, RAPI, TANPA TABEL) */}
{q.answer_type === "multi_segment" &&
  q.extra_schema &&
  section.group_key === "palpasi_otot" &&
  q.id === section.questions[0].id && (() => {

    const rows = [
      { key: "hypertonus", label: "Hypertonus (spastic / rigid)" },
      { key: "hypotonus", label: "Hypotonus" },
      { key: "fluktuatif", label: "Fluktuatif" },
      { key: "normal", label: "Normal" },
    ];

    const renderDS = (rowKey: string, prefix: "aga" | "agb") => (
      <div className="flex flex-col gap-2">
        {["d", "s"].map((side) => {
          const segmentKey = `${rowKey}_${prefix}_${side}`;
          return (
            <div
              key={segmentKey}
              className="flex items-center gap-2"
            >
              {/* LABEL D : / S : */}
              <span className="w-7 text-right font-medium">
                {side.toUpperCase()} :
              </span>

              {/* INPUT */}
              <input
                type="text"
                className="border rounded px-2 py-1 w-32"
                value={responses[qKey]?.[segmentKey] || ""}
                onChange={(e) =>
                  handleMultiSegment(
                    qKey,
                    segmentKey,
                    e.target.value
                  )
                }
              />
            </div>
          );
        })}
      </div>
    );

    return (
      <div className="space-y-3">

        {/* HEADER */}
        <div className="grid grid-cols-[2.5fr_1.5fr_1.5fr_2fr] font-semibold text-gray-700 border-b pb-2">
          <div>Abnormalitas Tonus Otot</div>
          <div className="text-center">AGA</div>
          <div className="text-center">AGB</div>
          <div className="text-center">Perut</div>
        </div>

        {/* ISI */}
        {rows.map((row) => (
          <div
            key={row.key}
            className="grid grid-cols-[2.5fr_1.5fr_1.5fr_2fr] gap-4 py-3 border-b"
          >
            {/* LABEL BARIS */}
            <div className="pt-2">
              {row.label}
            </div>

            {/* AGA */}
            {renderDS(row.key, "aga")}

            {/* AGB */}
            {renderDS(row.key, "agb")}

            {/* PERUT */}
            <textarea
              className="border rounded px-2 py-1 w-full min-h-[70px]"
              value={responses[qKey]?.[`${row.key}_perut`] || ""}
              onChange={(e) =>
                handleMultiSegment(
                  qKey,
                  `${row.key}_perut`,
                  e.target.value
                )
              }
            />
          </div>
        ))}

      </div>
    );
  })()}


    

                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* NAV BUTTON */}
              <div className="flex justify-between mt-8">
                <button
                  className="px-4 py-2 border rounded-lg"
                  onClick={() => {
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1]);
                    }
                  }}
                  disabled={tabs.indexOf(activeTab) === 0}
                >
                  Sebelumnya
                </button>

                <button
                  className="px-6 py-2 rounded-lg bg-[#3A9C85] text-white"
                  onClick={() => {
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1]);
                    } else {
                      setStep(2);
                    }
                  }}
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-6">Diagnosa Fisioterapi</h2>

              <button
                className="px-6 py-2 bg-[#3A9C85] text-white rounded-lg"
                onClick={handleSubmit}
              >
                Simpan Assessment
              </button>

              <button
                className="ml-4 px-6 py-2 border rounded-lg"
                onClick={() => {
                  setStep(1);
                  setActiveTab(tabs[tabs.length - 1]);
                }}
              >
                Kembali
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
