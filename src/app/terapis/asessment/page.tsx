/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Play, Clock3 } from "lucide-react";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { useRouter, useSearchParams } from "next/navigation";
import { getAssessments } from "@/lib/api/asesment";

// --- INTERFACES (Tetap Sama) ---
type TerapiTab =
  | "PLB (Paedagog)"
  | "Terapi Okupasi"
  | "Terapi Wicara"
  | "Fisioterapi";

type StatusFilter = "Terjadwal" | "Selesai";

interface Assessment {
  id: number;
  assessment_id: number;
  child_id: string;
  child_name: string;
  guardian_name: string;
  guardian_phone: string;
  type: string;
  administrator: string;
  assessor: string | null;
  scheduled_date?: string;
  scheduled_time?: string;
  completed_at?: string; 
  status: string;
}

// --- KOMPONEN UTAMA (Wrapper dengan Suspense) ---
export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-[#36315B]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#81B7A9] border-t-transparent"></div>
          <p className="font-semibold">Memuat Halaman Asesmen...</p>
        </div>
      </div>
    }>
      <AssessmentContent />
    </Suspense>
  );
}

// --- SUB-KOMPONEN KONTEN (Logika Asli Anda) ---
function AssessmentContent() {
  const router = useRouter();
  const params = useSearchParams();

  const urlStatus = params.get("status");

  const [activeTab, setActiveTab] = useState<TerapiTab>("PLB (Paedagog)");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>(
    urlStatus === "completed" ? "Selesai" : "Terjadwal"
  );
  const [dateFilter, setDateFilter] = useState("");
  const [searchName, setSearchName] = useState("");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const mappedStatus = activeFilter === "Terjadwal" ? "scheduled" : "completed";

  const getType = () => {
    switch (activeTab) {
      case "Terapi Okupasi":
        return "okupasi";
      case "Terapi Wicara":
        return "wicara";
      case "Fisioterapi":
        return "fisio";
      default:
        return "paedagog";
    }
  };

  useEffect(() => {
    router.replace(`?type=${getType()}&status=${mappedStatus}`);
  }, [activeFilter, activeTab]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, activeFilter, dateFilter, searchName]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        let data = await getAssessments(
          getType(),
          mappedStatus,
          dateFilter || undefined
        );

        if (Array.isArray(data)) {
          if (searchName.trim()) {
            const lower = searchName.toLowerCase();
            data = data.filter((item) =>
              String(item.child_name || "").toLowerCase().includes(lower)
            );
          }
          setAssessments(data);
        } else {
          setAssessments([]);
        }
      } catch (err) {
        console.error("❌ Error fetching assessments:", err);
        setAssessments([]);
      }

      setOpenDropdown(null);
      setLoading(false);
    };

    fetchData();
  }, [activeTab, activeFilter, dateFilter, searchName]);

  const handleStartAssessment = (id: number) => {
    const type = getType();
    router.push(
      `/terapis/asessment/${type}Asesment?assessment_id=${id}&status=${mappedStatus}`
    );
  };

  const toggleDropdown = (id: number) =>
    setOpenDropdown((prev) => (prev === id ? null : id));

  // Pagination logic
  const totalPages = Math.ceil(assessments.length / itemsPerPage);
  const paginatedData = assessments.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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

       <main className="p-6 flex-1 flex flex-col text-[#36315B]">
  {/* TAB TERAPI */}
  <div className="flex gap-4 mb-4">
    {(
      [
        "PLB (Paedagog)",
        "Terapi Okupasi",
        "Terapi Wicara",
        "Fisioterapi",
      ] as TerapiTab[]
    ).map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`
          px-5 py-2 rounded-full text-md font-semibold
          transition-all duration-300 ease-in-out
          ${
            activeTab === tab
              ? "border border-[#81B7A9] bg-[#d2f3e7] shadow-lg"
              : "text-[#36315B]/70 hover:text-[#36315B] hover:shadow-md hover:bg-white"
          }
        `}
      >
        {tab}
      </button>
    ))}
  </div>



         {/* FILTERS */}
<div className="flex flex-wrap sm:flex-row justify-end gap-3 mb-6">
  <input
    type="date"
    value={dateFilter}
    onChange={(e) => setDateFilter(e.target.value)}
    className="
      border border-gray-300
   px-3 py-2 rounded-lg text-sm shadow-sm
      transition-all duration-300 ease-in-out
      hover:shadow-md
      focus:outline-none focus:ring-2 focus:ring-[#81B7A9] focus:shadow-lg
    "
  />

  <input
    type="text"
    placeholder="Cari nama anak..."
    value={searchName}
    onChange={(e) => setSearchName(e.target.value)}
    className="
      border border-gray-300
 px-3 py-2 rounded-lg text-sm shadow-sm w-60
      transition-all duration-300 ease-in-out
      hover:shadow-md
      focus:outline-none focus:ring-2 focus:ring-[#81B7A9] focus:shadow-lg
    "
  />
</div>


          {/* STATUS FILTER */}
          <div className="mb-4 border-b border-gray-200">
            <ul className="flex text-sm font-semibold">
              {(["Terjadwal", "Selesai"] as StatusFilter[]).map((filter) => (
                <li
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`pb-2 flex-1 text-center cursor-pointer ${
                    activeFilter === filter
                      ? "border-b-2 border-[#81B7A9] text-[#81B7A9]"
                      : "text-[#36315B]"
                  }`}
                >
                  {filter}
                </li>
              ))}
            </ul>
          </div>

          {/* TABLE */}
          {/* TABLE */}
<div className="bg-white rounded-xl p-4 border border-gray-100 transition-all duration-300 ease-out will-change-transform shadow-[0_8px_20px_-5px_rgba(16,185,129,0.20)] hover:shadow-[0_18px_36px_-8px_rgba(16,185,129,0.35)] hover:-translate-y-1">
            {loading ? (
              <p className="text-center py-4 text-gray-500">Memuat data…</p>
            ) : assessments.length === 0 ? (
              <p className="text-center py-4 text-gray-500">
                Tidak ada data asesmen.
              </p>
            ) : (
              <>
                <table className="min-w-full text-sm text-[#36315B] border-collapse">
                  <thead className="bg-[#F8FAF9] border-b-2 border-[#81B7A9]">
                    <tr className="text-left">
                      {[
                        "Nama Pasien",
                        "Nama Orang Tua",
                        "Telepon",
                        "Tipe Assessment",
                        activeFilter === "Selesai" ? "Assessor" : "Administrator",
                        "Tanggal Asesmen",
                        "Waktu",
                        "Aksi",
                      ].map((head) => (
                        <th key={head} className="px-3 py-2 font-semibold">
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedData.map((item) => (
                      <tr
                        key={item.assessment_id}
                        className="border-t border-[#81B7A9] hover:bg-[#F8FAF9]"
                      >
                        <td className="px-3 py-2">{item.child_name}</td>
                        <td className="px-3 py-2">{item.guardian_name}</td>
                        <td className="px-3 py-2">{item.guardian_phone}</td>
                        <td className="px-3 py-2">{item.type}</td>

                        <td className="px-3 py-2">
                          {activeFilter === "Selesai"
                            ? item.assessor
                            : item.administrator}
                        </td>

                        <td className="px-3 py-2">{item.scheduled_date}</td>
                        <td className="px-3 py-2">
                          {activeFilter === "Selesai"
                            ? item.completed_at
                            : item.scheduled_time}
                        </td>
                        <td className="px-3 py-2 relative">
                          <button
                            onClick={() => toggleDropdown(item.assessment_id)}
                            className="flex items-center gap-1 border border-[#81B7A9] text-[#81B7A9] rounded-md px-4 py-1 text-sm hover:bg-[#E9F4F1]"
                          >
                            Aksi <ChevronDown size={14} />
                          </button>

                          <AnimatePresence>
                            {openDropdown === item.assessment_id && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute bg-white border border-[#81B7A9] shadow-md rounded-md right-0 mt-2 w-44 z-10"
                              >
                                {activeFilter === "Terjadwal" ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleStartAssessment(item.assessment_id)
                                      }
                                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#E9F4F1] text-[#81B7A9] text-sm"
                                    >
                                      <Play size={14} /> Mulai
                                    </button>

                                    <div className="border-t border-[#81B7A9]" />

                                    <button
                                      onClick={() =>
                                        router.push(
                                          `/terapis/asessment/detailAsesment?assessment_id=${item.assessment_id}&type=${getType()}&status=${mappedStatus}`
                                        )
                                      }
                                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#E9F4F1] text-[#81B7A9] text-sm"
                                    >
                                      <Clock3 size={14} /> Detail
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() =>
                                        router.push(
                                          `/terapis/asessment/${getType()}Riwayat?assessment_id=${item.assessment_id}&status=${mappedStatus}`
                                        )
                                      }
                                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#E9F4F1] text-[#81B7A9] text-sm"
                                    >
                                      <Clock3 size={14} /> Riwayat Jawaban
                                    </button>

                                    <div className="border-t border-[#81B7A9]" />
                                  </>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* PAGINATION */}
                <div className="flex justify-center mt-4">
                  <div className="flex items-center gap-4">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className={`px-3 py-1 rounded border ${
                        page === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      Prev
                    </button>
                    <span className="text-sm font-medium">
                      Page {page} / {totalPages}
                    </span>
                    <button
                      disabled={page === totalPages || totalPages === 0}
                      onClick={() => setPage(page + 1)}
                      className={`px-3 py-1 rounded border ${
                        page === totalPages || totalPages === 0
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
    </div>
    </div>
  );
}