/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, Suspense } from "react"; // Tambahkan Suspense
import { ChevronDown } from "lucide-react";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { useRouter, useSearchParams } from "next/navigation";
import { getAssessmentQuestions, submitAssessment } from "@/lib/api/asesment";

/* ================= TAB ================= */
const tabs = ["Oral Fasial", "Kemampuan Bahasa"] as const;
type TabType = (typeof tabs)[number];

/* ================= LIDAH ASPEK ================= */
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

/* ================= SAFE PARSE ================= */
const parseOptions = (opt: any): string[] => {
  if (Array.isArray(opt)) return opt;
  if (typeof opt === "string") {
    try {
      const parsed = JSON.parse(opt);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

// --- KOMPONEN UTAMA (Wrapper dengan Suspense) ---
export default function AsesmenWicaraPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-gray-50 text-[#36315B]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#409E86] border-t-transparent"></div>
          <p className="font-semibold">Memuat Halaman Asesmen...</p>
        </div>
      </div>
    }>
      <AsesmenWicaraContent />
    </Suspense>
  );
}

// --- SUB-KOMPONEN KONTEN (Logika Asli Anda) ---
function AsesmenWicaraContent() {
  const params = useSearchParams();
  const router = useRouter();
  const assessmentId = params.get("assessment_id") || "";

  const [activeTab, setActiveTab] = useState<TabType>("Oral Fasial");
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [sections, setSections] = useState<any[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      const apiType =
        activeTab === "Oral Fasial" ? "wicara_oral" : "wicara_bahasa";

      const res = await getAssessmentQuestions(apiType);
      const groups = res?.groups ?? [];

      const mapped = groups.map((g: any) => {
        if (g.group_key === "tongue_eval") {
          return {
            title: g.title,
            group_key: g.group_key,
            aspek: LIDAH_ASPEK.map((a) => ({
              title: a.title,
              questions: g.questions
                .filter((q: any) => q.id >= a.range[0] && q.id <= a.range[1])
                .map((q: any) => ({
                  id: q.id,
                  label: q.question_text,
                  options: parseOptions(q.answer_options),
                })),
            })).filter((a) => a.questions.length > 0),
          };
        }

        return {
          title: g.title,
          group_key: g.group_key,
          questions: g.questions.map((q: any) => ({
            id: q.id,
            label: q.question_text,
            options: parseOptions(q.answer_options),
            age_category: q.age_category,
          })),
        };
      });

      setSections(mapped);

      /* ===== INIT RESPONSE ===== */
      if (activeTab === "Kemampuan Bahasa") {
        const init: Record<string, boolean> = {};
        mapped.forEach((s: any) => {
          s.questions?.forEach((q: any) => {
            init[`${s.group_key}-${q.id}`] = false;
          });
        });
        setResponses(init);
      } else {
        setResponses({});
        setNotes({});
      }

      setOpenSection(0);
    };

    fetchData();
  }, [activeTab]);

  /* ================= HANDLER ================= */
  const handleRadio = (key: string, value: string) =>
    setResponses((p) => ({ ...p, [key]: value }));

  const handleCheckbox = (key: string) =>
    setResponses((p) => ({ ...p, [key]: !p[key] }));

  const handleNote = (key: string, value: string) =>
    setNotes((p) => ({ ...p, [key]: value }));

  /* ================= SUBMIT ================= */
    const handleSubmit = async () => {
    if (!assessmentId) {
      alert("❌ assessment_id tidak ditemukan");
      return;
    }

    const answers: any[] = [];

    sections.forEach((s) => {
      // ===== LIDAH ASPEK =====
      s.aspek?.forEach((a: any) =>
  a.questions.forEach((q: any) => {
    const k = `${s.group_key}-${q.id}`;

    const hasAnswer = responses[k] !== undefined && responses[k] !== null;
    const hasNote = notes[k] && notes[k].trim() !== "";

    if (hasAnswer || hasNote) {
      answers.push({
        question_id: q.id,
        answer: { value: hasAnswer ? responses[k] : null },
        note: hasNote ? notes[k] : "",
      });
    }
  })
);


      // ===== GROUP NORMAL =====
     s.questions?.forEach((q: any) => {
  const k = `${s.group_key}-${q.id}`;

  if (activeTab === "Oral Fasial") {
    const hasAnswer = responses[k] !== undefined && responses[k] !== null;
    const hasNote = notes[k] && notes[k].trim() !== "";

    if (hasAnswer || hasNote) {
      answers.push({
        question_id: q.id,
        answer: { value: hasAnswer ? responses[k] : null },
        note: hasNote ? notes[k] : "",
      });
    }
  } else {
          // Bahasa
          // ===== BAHASA (FIX) =====
if (responses[k] === true) {
  answers.push({
    question_id: q.id,
    answer: { value: true },
  });
}

        }
      });
    });

    const payload = { answers };

    // ======================
    // CONSOLE DEBUG
    // ======================
    console.log("📦 Submit Wicara Assessment");
    console.log("🆔 assessment_id:", assessmentId);
    console.log("📌 type: wicara");
    console.log("📌 activeTab:", activeTab);
    console.log("📦 payload:", payload);

    try {
      await submitAssessment(assessmentId, "wicara", payload);

      if (activeTab === "Oral Fasial") {
        alert("✅ Jawaban Oral Fasial berhasil disimpan");
        setActiveTab("Kemampuan Bahasa");
      } else {
        alert("✅ Jawaban Kemampuan Bahasa berhasil disimpan");
        router.push("/terapis/asessment?type=wicara&status=completed");
      }
    } catch (err: any) {
      console.error("❌ Submit Wicara Assessment error:", err);

      const status = err?.response?.status;
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan";

      if (status === 403) {
        alert(
          "❌ Anda tidak memiliki izin untuk menyimpan assessment ini.\n\n" +
            "Pastikan:\n" +
            "- Login sebagai Asesor sesuai jenis terapi\n" +
            "- Assessment ini adalah milik Anda"
        );
        return;
      }

      if (status === 401) {
        alert("⚠️ Sesi Anda telah berakhir. Silakan login kembali.");
        router.push("/login");
        return;
      }

      alert("❌ Gagal menyimpan: " + message);
    }
  };


  /* ================= RENDER ================= */
 return (
  <div className="flex min-h-screen bg-gray-50">
    {/* ================= SIDEBAR ================= */}
    <div className="fixed inset-y-0 left-0 w-64 z-40 bg-white">
      <SidebarTerapis />
    </div>

    {/* ================= AREA KANAN ================= */}
    <div className="ml-64 flex flex-col flex-1">
      {/* ================= HEADER ================= */}
      <div className="fixed top-0 left-64 right-0 h-16 z-30 bg-white shadow">
        <HeaderTerapis />
      </div>

      {/* ================= KONTEN (SCROLL) ================= */}
      <div
        className="pt-16 overflow-y-auto"
        style={{ height: "calc(100vh - 4rem)" }} // 4rem = h-16
      >
        <div className="p-6">

          <div className="flex justify-end mb-4">
            <button
              onClick={() => (window.location.href = "/terapis/asessment")}
              className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
            >
              ✕
            </button>
          </div>
          <div className="flex gap-3 mb-6 border-b">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-5 py-2 ${
                  activeTab === t
                    ? "border-b-4 border-[#409E86] text-[#409E86]"
                    : "text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {sections.map((s, i) => (
            <div key={i} className="mb-6 bg-white rounded-xl shadow">
              <button
                onClick={() => setOpenSection(openSection === i ? null : i)}
                className="w-full px-5 py-4 bg-[#C0DCD6] text-[#36315B] flex justify-between items-center font-semibold"
              >
                {s.title}
                <ChevronDown />
              </button>

              {openSection === i && (
                <div className="p-6 space-y-6">
                  {s.aspek?.map((a: any) => (
                    <div key={a.title}>
                      <h4 className="font-semibold text-[#409E86] mb-3">
                        {a.title}
                      </h4>
                      {a.questions.map((q: any) => {
                        const k = `${s.group_key}-${q.id}`;
                        return (
                          <div key={q.id} className="mb-4 text-left">
                            <p className="font-medium">{q.label}</p>
                            <div className="mt-2 space-y-1">
                              {q.options.map((o: string) => (
                                <label key={o} className="flex gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={k}
                                    checked={responses[k] === o}
                                    onChange={() => handleRadio(k, o)}
                                    className="accent-[#409E86]"
                                  />
                                  <span>{o}</span>
                                </label>
                              ))}
                            </div>
                            <input
                              className="w-full border mt-2 p-2 rounded-lg"
                              placeholder="Catatan..."
                              value={notes[k] || ""}
                              onChange={(e) => handleNote(k, e.target.value)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {s.questions?.map((q: any) => {
                    const k = `${s.group_key}-${q.id}`;
                    return (
                      <div key={q.id} className="mb-4 text-left">
                        {activeTab === "Oral Fasial" ? (
                          <>
                            <p className="font-medium">{q.label}</p>
                            <div className="mt-2 space-y-1">
                              {q.options.map((o: string) => (
                                <label key={o} className="flex gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={k}
                                    checked={responses[k] === o}
                                    onChange={() => handleRadio(k, o)}
                                    className="accent-[#409E86]"
                                  />
                                  <span>{o}</span>
                                </label>
                              ))}
                            </div>
                            <input
                              className="w-full border mt-2 p-2 rounded-lg"
                              placeholder="Catatan..."
                              value={notes[k] || ""}
                              onChange={(e) => handleNote(k, e.target.value)}
                            />
                          </>
                        ) : (
                          <label className="flex gap-2 items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(responses[k])}
                              onChange={() => handleCheckbox(k)}
                              className="accent-[#409E86] w-4 h-4"
                            />
                            <span className="font-medium">{q.label}</span>
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              className="px-8 py-2 bg-[#36315B] text-white rounded-xl font-bold hover:bg-[#2A264A] transition-colors"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
      </div>

  );
}