/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import {
  getScheduledObservations,
  getScheduledObservationDetail,
} from "@/lib/api/observasiTerapis";

interface Anak {
  observation_id: string | number;
  age_category?: string;
  child_name?: string;
  guardian_name?: string;
  guardian_phone?: string;
  admin_name?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  child_birth_date?: string;
  child_age?: string;
  child_gender?: string;
  child_school?: string;
  child_address?: string;
  child_complaint?: string;
  child_service_choice?: string;
  parent_type?: string;
  parent_name?: string;
  parent_phone?: string;
}

interface Kategori {
  title: string;
  filter: (data: Anak) => boolean;
}

function getTahun(usiaStr?: string): number {
  if (!usiaStr) return 0;
  const match = usiaStr.match(/(\d+)\s*Tahun/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 0;
}

const kategori: Kategori[] = [
  { title: "Usia 0-5 Tahun", filter: (d) => getTahun(d.child_age) <= 5 },
  {
    title: "Usia 6-12 Tahun",
    filter: (d) => {
      const t = getTahun(d.child_age);
      return t >= 6 && t <= 12;
    },
  },
  {
    title: "Usia 13-17 Tahun",
    filter: (d) => {
      const t = getTahun(d.child_age);
      return t >= 13 && t <= 17;
    },
  },
  { title: "Usia 17+ Tahun", filter: (d) => getTahun(d.child_age) > 17 },
];

export default function ObservasiPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Anak | null>(null);
  const [activeKategori, setActiveKategori] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailObservasi, setDetailObservasi] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["observations", filterDate, searchName],
    queryFn: () => getScheduledObservations(filterDate, searchName),
  });

  const children: Anak[] = Array.isArray(data?.data)
    ? data.data.map((d: any, i: number) => ({
        observation_id: d.observation_id ?? `temp-${i}`,
        age_category: d.age_category ?? d.child_age_category ?? "-",
        child_name: d.child_name ?? "-",
        guardian_name: d.guardian_name ?? d.parent_name ?? "-",
        guardian_phone: d.guardian_phone ?? d.parent_phone ?? "-",
        admin_name: d.administrator ?? d.admin_name ?? "-",
        scheduled_date: d.scheduled_date ?? "-",
        scheduled_time: d.scheduled_time ?? d.time ?? "-",
        child_birth_date: d.child_birth_date,
        child_age: d.child_age,
        child_gender: d.child_gender,
        child_school: d.child_school,
        child_address: d.child_address,
        child_complaint: d.child_complaint,
        child_service_choice: d.child_service_choice,
        parent_type: d.parent_type,
        parent_name: d.parent_name,
        parent_phone: d.parent_phone,
      }))
    : [];

  // Filter hanya berdasarkan kategori aktif
  const filteredByKategori = children.filter((d) =>
    kategori[activeKategori].filter(d)
  );

  // Filter pencarian nama anak / wali (case insensitive)
  const filtered = filteredByKategori.filter((d) => {
    const q = searchName.trim().toLowerCase();
    if (!q) return true;
    return (
      String(d.child_name || "").toLowerCase().includes(q) ||
      String(d.guardian_name || "").toLowerCase().includes(q)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Reset page ke 1 jika filterDate, searchName atau kategori berubah
  useEffect(() => {
    setPage(1);
  }, [filterDate, searchName, activeKategori]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page]);

  const handleStartObservasi = (child: Anak) => {
    const kategoriUsia = child.age_category ?? "lainnya";

    router.push(
      `/terapis/observasi/form_observasi?observation_id=${child.observation_id}&nama=${encodeURIComponent(
        String(child.child_name)
      )}&usia=${encodeURIComponent(String(child.child_age ?? child.age_category ?? ""))}&kategori=${encodeURIComponent(
        kategoriUsia
      )}&tglObservasi=${encodeURIComponent(String(child.scheduled_date ?? ""))}`
    );
  };

  const handleViewDetail = async (observation_id: string | number) => {
    setLoadingDetail(true);
    try {
      const res = await getScheduledObservationDetail(String(observation_id));
      setDetailObservasi(res);
      setSelected(null);
    } catch (err) {
      console.error("❌ Gagal ambil detail observasi:", err);
      alert("Gagal memuat detail observasi");
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDate, searchName]);

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 sm:static sm:shadow-md`}
      >
        <SidebarTerapis
          activePage="observasi"
          isMobile={true}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderTerapis />

        <div className="sm:hidden p-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-[#36315B] hover:bg-gray-200"
          >
            <Menu size={24} />
          </button>
        </div>

        <main className="p-4 sm:p-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 className="text-lg sm:text-2xl font-bold">Pilih Anak Untuk Observasi</h2>
            <button
              onClick={() => router.push("/terapis/observasi/riwayat")}
              className="bg-[#81B7A9] hover:bg-[#36315B] text-white font-semibold px-3 py-2 rounded-lg text-sm sm:text-base"
            >
              Riwayat
            </button>
          </div>

          {/* Filter & Search */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-[#81B7A9] rounded px-2 py-1 text-sm"
              placeholder="Filter Tanggal"
            />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="border border-[#81B7A9] rounded px-2 py-1 text-sm max-w-[200px]"
              placeholder="Cari Nama Anak atau Wali"
            />
          </div>

          {/* Tabs kategori usia */}
          <div className="relative flex flex-wrap border-b border-gray-300 mb-4">
            {kategori.map((kat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveKategori(idx)}
                className={`relative px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors ${
                  activeKategori === idx
                    ? "text-[#36315B]"
                    : "text-gray-500 hover:text-[#36315B]"
                }`}
              >
                {kat.title}
                {activeKategori === idx && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#81B7A9]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tabel anak */}
          <AnimatePresence mode="wait">
            <motion.div
              key={String(activeKategori) + "|" + filterDate + "|" + searchName + "|" + page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-md rounded-lg p-3 sm:p-4 border border-[#E4E4E4] overflow-x-auto"
            >
              {isLoading ? (
                <p className="text-center py-4">Memuat data...</p>
              ) : isError ? (
                <p className="text-center py-4 text-red-500">Gagal memuat data</p>
              ) : filtered.length === 0 ? (
                <p className="text-center py-4 text-[#36315B]">
                  Tidak ada data observasi terjadwal
                </p>
              ) : (
                <>
                  <table className="w-full text-xs sm:text-sm table-auto border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-[#81B7A9] bg-gray-100">
                        <th className="py-2 px-4 text-center">Nama Anak</th>
                        <th className="py-2 px-4 text-center">Nama Orang Tua</th>
                        <th className="py-2 px-4 text-center">Telepon</th>
                        <th className="py-2 px-4 text-center">Administrator</th>
                        <th className="py-2 px-4 text-center">Tanggal Observasi</th>
                        <th className="py-2 px-4 text-center">Waktu</th>
                        <th className="py-2 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((d, index) => (
                        <tr
                          key={d.observation_id ?? `row-${index}`}
                          className={`border-b border-[#81B7A9] hover:bg-gray-50 ${
                            selected?.observation_id === d.observation_id
                              ? "bg-[#C0DCD6]"
                              : ""
                          }`}
                        >
                          <td className="py-2 px-4 text-center">{d.child_name}</td>
                          <td className="py-2 px-4 text-center">{d.guardian_name}</td>
                          <td className="py-2 px-4 text-center">{d.guardian_phone}</td>
                          <td className="py-2 px-4 text-center">{d.admin_name}</td>
                          <td className="py-2 px-4 text-center">{d.scheduled_date || "-"}</td>
                          <td className="py-2 px-4 text-center">{d.scheduled_time || "-"}</td>
                          <td className="py-2 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="bg-[#81B7A9] hover:bg-[#36315B] text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded"
                                onClick={() => handleStartObservasi(d)}
                              >
                                Mulai
                              </button>
                              <button
                                className="p-1 text-[#81B7A9] hover:text-[#36315B]"
                                onClick={() => handleViewDetail(d.observation_id!)}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="flex justify-center items-center gap-4 mt-4">
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
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Modal Detail Observasi */}
          <AnimatePresence>
            {(loadingDetail || detailObservasi) && (
              <motion.div
                className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative"
                >
                  <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                    onClick={() => setDetailObservasi(null)}
                  >
                    ✕
                  </button>

                  {loadingDetail ? (
                    <div className="flex justify-center items-center py-10">
                      <div className="w-8 h-8 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg sm:text-xl font-bold text-[#36315B] mb-4">
                        Detail Observasi
                      </h3>
                      <hr className="mb-4 border-[#81B7A9]" />

                      <div className="text-xs sm:text-sm space-y-3 mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">Data Anak</h4>
                          <ul className="list-disc ml-6 space-y-1">
                            <li>Nama Lengkap: {detailObservasi?.child_name ?? "-"}</li>
                            <li>Tanggal Lahir: {detailObservasi?.child_birth_date ?? "-"}</li>
                            <li>
                              Usia:{" "}
                              {detailObservasi?.child_age ??
                                detailObservasi?.age_category ??
                                "-"}
                            </li>
                            <li>Jenis Kelamin: {detailObservasi?.child_gender ?? "-"}</li>
                            <li>Sekolah: {detailObservasi?.child_school ?? "-"}</li>
                            <li>Alamat: {detailObservasi?.child_address ?? "-"}</li>
                            <li>
                              Tanggal Observasi: {detailObservasi?.scheduled_date ?? "-"}
                            </li>
                            <li>
                              Waktu Observasi:{" "}
                              {detailObservasi?.time ?? detailObservasi?.scheduled_time ?? "-"}
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-1">Informasi Orangtua / Wali</h4>
                          <ul className="list-disc ml-6 space-y-1">
                            <li>
                              Nama Orangtua:{" "}
                              {detailObservasi?.parent_name ??
                                detailObservasi?.guardian_name ??
                                "-"}
                            </li>
                            <li>Hubungan: {detailObservasi?.parent_type ?? "-"}</li>
                            <li>
                              Nomor WhatsApp / Telepon:{" "}
                              {detailObservasi?.parent_phone ??
                                detailObservasi?.guardian_phone ??
                                "-"}
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-1">Informasi Admin</h4>
                          <ul className="list-disc ml-6 space-y-1">
                            <li>
                              Nama Admin:{" "}
                              {detailObservasi?.admin_name ??
                                detailObservasi?.admin ??
                                detailObservasi?.administrator ??
                                "-"}
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-1">Keluhan</h4>
                          <p className="ml-4">{detailObservasi?.child_complaint ?? "Tidak ada keluhan"}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-1">Jenis Layanan</h4>
                          <p className="ml-4">{detailObservasi?.child_service_choice ?? "-"}</p>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
