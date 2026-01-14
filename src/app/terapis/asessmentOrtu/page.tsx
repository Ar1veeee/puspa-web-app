/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { ChevronDown } from "lucide-react";
import { getPendingParents, getCompletedParents } from "@/lib/api/asesmentParent";
import { uploadAssessmentReport } from "@/lib/api/asesmentReport";

type StatusFilter = "Terjadwal" | "Selesai";

interface Patient {
  id: number;
  assessment_id: number;
  child_name: string;
  guardian_name: string;
  guardian_phone: string;
  types: string;
  admin_name: string;
  scheduled_date?: string;
  scheduled_time?: string;
  parent_completed_at: string | null;
  status: string;
}

export default function AssessmentPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("Terjadwal");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  const [searchName, setSearchName] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Upload file modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data function
  const fetchData = async () => {
    setLoading(true);
    try {
      const data =
        activeFilter === "Terjadwal"
          ? await getPendingParents(dateFilter, searchName)
          : await getCompletedParents(dateFilter, searchName);
      setPatients(data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData();
      setPage(1);
    }, 300);
    return () => clearTimeout(delay);
  }, [activeFilter, searchName, dateFilter]);

  // Toggle dropdown open/close
  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const paginatedData = patients.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const handleNext = () => page < totalPages && setPage(page + 1);
  const handlePrev = () => page > 1 && setPage(page - 1);

  // Upload area click triggers file input click
  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  // File selected handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setSelectedFileName(e.target.files[0].name);
    }
  };

  // Submit upload handler
  const handleSubmitUpload = async () => {
    if (!selectedFile || !selectedAssessmentId) {
      alert("File atau assessment tidak valid");
      return;
    }
    try {
      setUploadLoading(true);
      await uploadAssessmentReport(selectedAssessmentId, selectedFile);
      alert("File berhasil diupload");
      setShowUploadModal(false);
      setSelectedFile(null);
      setSelectedFileName(null);
      setSelectedAssessmentId(null);
    } catch (error) {
      console.error(error);
      alert("Gagal upload file");
    } finally {
      setUploadLoading(false);
    }
  };

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
  

        <main className="p-6 flex-1">
        {/* Search & Date */}
<div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
  <input
    type="text"
    placeholder="Cari nama pasien..."
    value={searchName}
    onChange={(e) => setSearchName(e.target.value)}
    className="
      border border-gray-300 rounded-md px-3 py-2 w-full md:w-1/3
      shadow-sm
      transition-all duration-300 ease-in-out
      hover:shadow-md
      focus:outline-none focus:ring-2 focus:ring-[#81B7A9] focus:shadow-lg
    "
  />
  <input
    type="date"
    value={dateFilter}
    onChange={(e) => setDateFilter(e.target.value)}
    className="
      border border-gray-300 rounded-md px-3 py-2 w-full md:w-1/4
      shadow-sm
      transition-all duration-300 ease-in-out
      hover:shadow-md
      focus:outline-none focus:ring-2 focus:ring-[#81B7A9] focus:shadow-lg
    "
  />
</div>


          {/* Filter Status */}
          <div className="mb-4 border-b border-gray-300">
            <ul className="flex w-full">
              {(["Terjadwal", "Selesai"] as StatusFilter[]).map((filter) => (
                <li
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 text-center py-2 cursor-pointer ${
                    activeFilter === filter
                      ? "text-[#81B7A9] font-semibold border-b-2 border-[#81B7A9]"
                      : "text-gray-500"
                  }`}
                >
                  {filter === "Terjadwal" ? "Belum Selesai" : "Selesai"}
                </li>
              ))}
            </ul>
          </div>

          {loading && (
            <div className="text-center py-10 text-gray-600">Memuat data...</div>
          )}

          {!loading && (
            <div className="bg-white rounded-xl p-4 border border-gray-100 transition-all duration-300 ease-out will-change-transform shadow-[0_8px_20px_-5px_rgba(16,185,129,0.20)] hover:shadow-[0_18px_36px_-8px_rgba(16,185,129,0.35)] hover:-translate-y-1">
              <table className="min-w-full text-xs table-auto">

                <thead className="bg-gray-100">
                  <tr className="text-left text-[#36315B]">
                    <th className="px-4 py-3">Nama Pasien</th>
                    <th className="px-4 py-3">Nama Orangtua</th>
                    <th className="px-4 py-3">Telepon</th>
                    <th className="px-4 py-3 min-w-[220px]">Tipe Assessment</th>
                    <th className="px-4 py-3">Administrator</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Waktu</th>
                    <th className={`px-4 py-3 ${activeFilter === "Terjadwal" ? "hidden" : ""}`}>
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-6 text-gray-500">
                        Tidak ada data
                      </td>
                    </tr>
                  )}

                  {paginatedData.map((row, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50 relative">
                      <td className="px-4 py-3">{row.child_name}</td>
                      <td className="px-4 py-3">{row.guardian_name}</td>
                      <td className="px-4 py-3">{row.guardian_phone}</td>
                      <td className="px-4 py-3 whitespace-pre-line align-top">
        {Array.isArray(row.types) ? (
          row.types.map((type: string, i: number) => (
            <div key={i} className="leading-relaxed">
              • {type}
            </div>
          ))
        ) : typeof row.types === "string" ? (
          row.types.split(",").map((type: string, i: number) => (
            <div key={i} className="leading-relaxed">
              • {type.trim()}
            </div>
          ))
        ) : (
          "-"
        )}
      </td>
                      <td className="px-4 py-3">{row.admin_name}</td>
                      <td className="px-4 py-3">{row.scheduled_date}</td>
                      <td className="px-4 py-3">{row.scheduled_time}</td>

                      <td
                        className={`px-4 py-3 relative ${activeFilter === "Terjadwal" ? "hidden" : ""}`}
                      >
                        {activeFilter === "Selesai" && (
                          <>
                            <button
                              onClick={() => toggleDropdown(index)}
                              className="flex items-center gap-2 px-4 py-2 bg-[#81B7A9] text-white rounded-md text-sm"
                            >
                              Aksi <ChevronDown size={14} />
                            </button>

                            <AnimatePresence>
                              {openDropdownIndex === index && (
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md overflow-hidden border z-20"
                                >
                                  {[
                                    { label: "Data Umum", route: "umumRiwayat", type: "umum_parent" },
                                    {
                                      label: "Data Fisioterapi",
                                      route: "fisioterapiRiwayat",
                                      type: "fisio_parent",
                                    },
                                    {
                                      label: "Data Terapi Okupasi",
                                      route: "okupasiRiwayat",
                                      type: "okupasi_parent",
                                    },
                                    {
                                      label: "Data Terapi Wicara",
                                      route: "wicaraRiwayat",
                                      type: "wicara_parent",
                                    },
                                    {
                                      label: "Data Paedagog",
                                      route: "paedagogRiwayat",
                                      type: "paedagog_parent",
                                    },
                                  ].map((item, i) => (
                                    <button
                                      key={i}
                                      className="w-full text-left px-4 py-2 text-[#3B817C] hover:bg-gray-100"
                                      onClick={() => {
                                        setOpenDropdownIndex(null);
                                        router.push(
                                          `/terapis/riwayat/${item.route}?assessment_id=${row.assessment_id}&type=${item.type}`
                                        );
                                      }}
                                    >
                                      {item.label}
                                    </button>
                                  ))}

                                  <button
                                    className="w-full text-left px-4 py-2 text-[#3B817C] hover:bg-gray-100 border-t"
                                    onClick={() => {
                                      setSelectedAssessmentId(row.assessment_id);
                                      setShowUploadModal(true);
                                      setOpenDropdownIndex(null);
                                    }}
                                  >
                                    Upload File
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-4">
                  <button
                    disabled={page === 1}
                    onClick={handlePrev}
                    className={`px-4 py-2 rounded-md border ${
                      page === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    Prev
                  </button>

                  <span className="text-sm font-medium">
                    Page {page} of {totalPages || 1}
                  </span>

                  <button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={handleNext}
                    className={`px-4 py-2 rounded-md border ${
                      page === totalPages || totalPages === 0
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL UPLOAD FILE ================= */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 'w-[420px]' relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* CLOSE BTN */}
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setSelectedFileName(null);
                  setSelectedAssessmentId(null);
                }}
              >
                ✕
              </button>

              <h2 className="text-xl font-semibold mb-2">Upload File</h2>
              <p className="text-gray-600 text-sm mb-4">
                Tambahkan file atau dokumen Anda di sini
              </p>

              {/* Upload Area */}
              <div
                onClick={handleUploadAreaClick}
                className="border border-dashed rounded-lg py-10 text-center text-gray-500 cursor-pointer hover:bg-gray-50"
              >
                <p className="mb-1">Letakkan file Anda di sini</p>
                <p className="text-sm underline">atau klik untuk menelusuri</p>
                <p className="text-xs mt-3">File yang didukung: pdf</p>
                <p className="text-xs">Ukuran Maksimal : 10MB</p>
                {selectedFileName && (
                  <p className="mt-2 text-sm text-green-600">
                    File terpilih: {selectedFileName}
                  </p>
                )}

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf"
                />
              </div>

              <button
                disabled={uploadLoading}
                onClick={handleSubmitUpload}
                className="mt-6 w-full bg-[#81B7A9] text-white py-2 rounded-md"
              >
                {uploadLoading ? "Mengupload..." : "Lanjutkan"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
    </div>
  );
}
