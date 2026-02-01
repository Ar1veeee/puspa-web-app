/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";

import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { 
  getAssessmentAnswers,
  getAssessmentQuestions
} from "@/lib/api/asesment";


/* ================== SUB GROUP LIDAH ================== */
const LIDAH_ASPEK = [
  { title: "Evaluasi Lidah (Istirahat)", range: [135, 139] },
  { title: "Evaluasi Lidah (Keluar)", range: [140, 144] },
  { title: "Evaluasi Lidah (Masuk)", range: [145, 148] },
  { title: "Evaluasi Lidah (Kanan)", range: [149, 151] },
  { title: "Evaluasi Lidah (Kiri)", range: [152, 154] },
  { title: "Evaluasi Lidah (Atas)", range: [155, 157] },
  { title: "Evaluasi Lidah (Bawah)", range: [158, 160] },
  { title: "Evaluasi Lidah (Alternatif)", range: [161, 163] },
];

/* ================== ORAL GROUP ================== */
const ORAL_GROUP_MAP = [
  { title: "Evaluasi Wajah", ids: [113, 114, 115, 116] },
  { title: "Evaluasi Rahang dan Gigi", ids: [117, 118, 119, 120, 121] },
  { title: "Observasi Gigi", ids: [122, 123, 124, 125, 126, 127] },
  { title: "Evaluasi Bibir", ids: [128, 129, 130, 131, 132, 133, 134] },
  { title: "Evaluasi Lidah", ids: [] },
  { title: "Evaluasi Faring", ids: [164, 165,166] },
  {
    title: "Evaluasi Langit-langit Keras dan Lunak",
    ids: [ 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178,179,180],
  },
];

/* ================== BAHASA ================== */
const BAHASA_GROUP_MAP = [
  { title: "Usia 0–6 Bulan", range: [181, 189] },
  { title: "Usia 7–12 Bulan", range: [190, 206] },
  { title: "Usia 13–18 Bulan", range: [207, 215] },
  { title: "Usia 19–24 Bulan", range: [216, 227] },
  { title: "Usia 2–3 Tahun", range: [228, 251] },
  { title: "Usia 3–4 Tahun", range: [252, 273] },
  { title: "Usia 4–5 Tahun", range: [274, 291] },
  { title: "Usia 5–6 Tahun", range: [292, 305] },
  { title: "Usia 6–7 Tahun", range: [306, 315] },
];

export default function RiwayatWicaraPage() {
  const tabs = ["Oral Fasial", "Kemampuan Bahasa"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [openSection, setOpenSection] = useState<number | null>(0);

  const [oralFasial, setOralFasial] = useState<any[]>([]);
  const [kemampuanBahasa, setKemampuanBahasa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const params = useSearchParams();
  const assessmentId = params.get("assessment_id") || "";

  useEffect(() => {
  const load = async () => {
    setLoading(true);

    // 1. Ambil jawaban
    const answers = await getAssessmentAnswers(assessmentId, "wicara");

    // 2. Ambil questions
    const oralQ = await getAssessmentQuestions("wicara_oral");
    const bahasaQ = await getAssessmentQuestions("wicara_bahasa");

    // flatten questions
    const flatten = (groups: any[]) =>
      groups.flatMap((g) => g.questions || []);

    const oralQuestions = flatten(oralQ.groups);
    const bahasaQuestions = flatten(bahasaQ.groups);

    // 3. merge
    const merge = (questions: any[]) =>
      questions.map((q) => {
        const found = answers.find(
          (a: any) => Number(a.question_id) === Number(q.id)
        );

        return {
          question_id: q.id,
          question_text: q.question_text,
          answer: found?.answer ?? null,
          note: found?.note ?? null,
        };
      });

    const mergedOral = merge(oralQuestions);
    const mergedBahasa = merge(bahasaQuestions);

    /* ===== ORAL GROUP ===== */
    const oral = ORAL_GROUP_MAP.map((g) => {
      if (g.title === "Evaluasi Lidah") {
        return {
          title: g.title,
          aspek: LIDAH_ASPEK.map((a) => ({
            title: a.title,
            questions: mergedOral.filter((q) => {
              const id = Number(q.question_id);
              return id >= a.range[0] && id <= a.range[1];
            }),
          })),
        };
      }

      return {
        title: g.title,
        questions: mergedOral.filter((q) =>
          g.ids.includes(Number(q.question_id))
        ),
      };
    });

    /* ===== BAHASA GROUP ===== */
    const bahasa = BAHASA_GROUP_MAP
  .map((g) => ({
    title: g.title,
    questions: mergedBahasa.filter((q) => {
      const id = Number(q.question_id);
      return id >= g.range[0] && id <= g.range[1];
    }),
  }))
  .filter((g) =>
    g.questions.some(
      (q) => q.answer?.value !== null && q.answer?.value !== undefined
    )
  );


    setOralFasial(oral);
    setKemampuanBahasa(bahasa);
    setLoading(false);
  };

  if (assessmentId) load();
}, [assessmentId]);


  const data = activeTab === "Oral Fasial" ? oralFasial : kemampuanBahasa;

  if (loading) return <p className="p-6">Memuat riwayat...</p>;

 return (
  <div className="flex h-screen bg-gray-50 text-[#36315B] overflow-hidden">

    {/* SIDEBAR FIXED */}
    <div className="fixed inset-y-0 left-0 w-64 z-40 bg-white">
      <SidebarTerapis />
    </div>

    {/* AREA KANAN */}
    <div className="ml-64 flex-1 flex flex-col">

      {/* HEADER FIXED */}
      <div className="fixed top-0 left-64 right-0 h-16 z-30 bg-white border-b border-gray-200">
        <HeaderTerapis />
      </div>

      {/* FRAME UTAMA (SCROLL DI SINI) */}
      <div
        className="pt-16 h-screen overflow-y-auto"
      >
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200"></div>
           <div className="flex justify-end mb-4">
            <button
              onClick={() => (window.location.href = "/terapis/asessment")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>
          {/* TAB */}
          <div className="flex gap-3 mb-6 border-b">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setOpenSection(0);
                }}
                className={`px-5 py-2 font-medium ${
                  activeTab === tab
                    ? "border-b-4 border-[#409E86] text-[#409E86]"
                    : "text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ACCORDION */}
          {data.map((section, i) => (
            <div key={i} className="mb-6 bg-white rounded-xl shadow">
              <button
                onClick={() => setOpenSection(openSection === i ? null : i)}
                className="w-full flex justify-between items-center px-5 py-4 bg-[#36315B] text-white"
              >
                <span className="font-semibold">{section.title}</span>
                <ChevronDown
                  className={`w-5 h-5 ${
                    openSection === i ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openSection === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 py-5 space-y-4"
                  >
                    {/* ===== BAHASA (SESUI REFERENSI) ===== */}
                    {activeTab === "Kemampuan Bahasa" &&
                      section.questions.map((q: any) => (
                        <div
                          key={q.question_id}
                          className="flex items-center gap-3 border-b pb-2"
                        >
                          <input
  type="checkbox"
  checked={!!q.answer?.value}
  readOnly
  className="accent-[#409E86] "
/>
                          <span className="text-sm font-medium">
                            {q.question_text}
                          </span>
                        </div>
                      ))}

                    {/* ===== ORAL FASIAL ===== */}
                    {activeTab === "Oral Fasial" && (
                      <>
                        {section.aspek?.map((a: any, idx: number) => (
                          <div key={idx}>
                            <h4 className="font-semibold text-[#409E86] mb-3">
                              {a.title}
                            </h4>

                            {a.questions.map((q: any) => (
                              <div
                                key={q.question_id}
                                className="border-b pb-4 mb-4"
                              >
                                <p className="text-sm font-semibold mb-1">
                                  {q.question_text}
                                </p>
                                <p className="font-medium capitalize mb-2">
                                  {String(q.answer?.value ?? "-")}
                                </p>

                                <label className="block text-xs text-gray-500 mb-1">
                                  Keterangan
                                </label>
                                <input
                                  readOnly
                                  value={q.note || ""}
                                  className="w-full rounded-lg border bg-gray-100 px-3 py-2 text-sm"
                                />
                              </div>
                            ))}
                          </div>
                        ))}

                        {section.questions?.map((q: any) => (
                          <div key={q.question_id} className="border-b pb-4">
                            <p className="text-sm font-semibold mb-1">
                              {q.question_text}
                            </p>
                            <p className="font-medium capitalize mb-2">
                              {String(q.answer?.value ?? "-")}
                            </p>

                            <label className="block text-xs text-gray-500 mb-1">
                              Keterangan
                            </label>
                            <input
                              readOnly
                              value={q.note || ""}
                              className="w-full rounded-lg border bg-gray-100 px-3 py-2 text-sm"
                            />
                          </div>
                        ))}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
     </div>
  );
}