/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar_owner";
import Header from "@/components/layout/header_owner";
import { getAllTherapists, promoteToAssessor } from "@/lib/api/ownerTerapis";
import { getDetailTerapis } from "@/lib/api/ownerTerapis";
import { Eye, X } from "lucide-react";

const TherapistListPage: React.FC = () => {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [detailTerapis, setDetailTerapis] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [loadingPromote, setLoadingPromote] = useState(false);

  useEffect(() => {
    fetchTherapists();
  }, []);

  // ======================
  // GET ALL TERAPIS
  // ======================
  async function fetchTherapists() {
    const res = await getAllTherapists();
    if (res.success) setTherapists(res.data);
    else console.error(res.message);
  }

  // ======================
  // DETAIL TERAPIS
  // ======================
  async function handleViewDetail(therapist_id: string) {
    setLoadingDetail(true);
    setErrorDetail(null);
    try {
      const data = await getDetailTerapis(therapist_id);
      if (data) {
        console.log("✅ Detail Terapis didapat:", data);
        setDetailTerapis(data);
      } else {
        setErrorDetail("Data terapis tidak ditemukan.");
      }
    } catch (error) {
      setErrorDetail("Gagal mengambil data terapis.");
    } finally {
      setLoadingDetail(false);
    }
  }

  // ======================
  // PROMOTE KE ASESOR
  // ======================
  async function handlePromoteAssessor(user_id: string) {
    console.log("🚀 PromoteToAssessor user_id:", user_id);

    if (!user_id) {
      alert("User ID tidak ditemukan! Tidak bisa lanjut promote.");
      return;
    }

    if (!confirm("Yakin ingin menjadikan terapis ini sebagai asesor?")) return;

    setLoadingPromote(true);
    try {
      const res = await promoteToAssessor(user_id);
      if (res.success) {
        alert("Terapis berhasil dijadikan asesor!");
        setDetailTerapis(null);
        fetchTherapists();
      } else {
        alert(res.message || "Gagal menjadikan asesor");
      }
    } catch (err) {
      console.error("Error saat promoteToAssessor:", err);
      alert("Terjadi kesalahan saat promote ke asesor");
    } finally {
      setLoadingPromote(false);
    }
  }

  const filteredTherapists = therapists.filter(
    (item) =>
      item.therapist_name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.username.toLowerCase().includes(search.toLowerCase()) ||
      item.therapist_section.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <div className="min-h-screen bg-[#F7F7F7] text-[#36315B]">
       {/* SIDEBAR */}
  <div className="fixed inset-y-0 left-0 w-64 z-40 bg-white">
    <Sidebar />
  </div>
  
  {/* HEADER */}
  <div className="fixed top-0 left-64 right-0 h-16 z-30 bg-white shadow">
    <Header />
  </div>
  
  {/* CONTENT (INI YANG SCROLL) */}
  <div className="ml-64 pt-16 h-screen overflow-y-auto bg-[#F7F7F7]">

        <main className="p-8">
          <section className="bg-white rounded-xl shadow-md p-5">
            <h1 className="text-2xl font-bold mb-5 pb-2 border-b-2 border-[#81B7A9]">
              Data Terapis
            </h1>

            {/* Search Bar */}
            <div className="flex justify-end mb-4 relative w-full max-w-xs ml-auto">
              <input
                type="search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#81B7A9] w-full"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                />
              </svg>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    {[
                      "No",
                      "Nama Terapis",
                      "Bidang",
                      "Nama Pengguna",
                      "Email",
                      "Telepon",
                      "Status",
                      "Aksi",
                    ].map((head, i) => (
                      <th
                        key={i}
                        className="py-2.5 px-3 font-bold text-[#36315B] border-b-2"
                        style={{ borderBottomColor: "#81B7A9" }}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredTherapists.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-4 text-gray-500 italic"
                      >
                        Tidak ada data terapis.
                      </td>
                    </tr>
                  ) : (
                    filteredTherapists.map((t, idx) => (
                      <tr
                        key={t.therapist_id}
                        className={`border-b ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                        style={{ borderBottomColor: "#81B7A9" }}
                      >
                        <td className="py-2.5 px-3">{idx + 1}</td>
                        <td className="py-2.5 px-3">{t.therapist_name}</td>
                        <td className="py-2.5 px-3">{t.therapist_section}</td>
                        <td className="py-2.5 px-3">{t.username}</td>
                        <td className="py-2.5 px-3">{t.email}</td>
                        <td className="py-2.5 px-3">{t.therapist_phone}</td>
                        <td
                          className={`py-2.5 px-3 font-medium ${
                            t.status === "Terverifikasi"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {t.status}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            className="text-[#36315B] hover:text-[#81B7A9]"
                            onClick={() => handleViewDetail(t.therapist_id)}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Modal Detail Terapis */}
          {detailTerapis && (
            <div
              className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50"
              onClick={() => setDetailTerapis(null)}
            >
              <div
                className="bg-white rounded-lg p-6 w-96 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setDetailTerapis(null)}
                >
                  <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold mb-2 text-[#36315B]">
                  Detail Terapis
                </h2>
                <hr className="border-t-2 border-[#81B7A9] mb-4" />

                {loadingDetail ? (
                  <p>Loading...</p>
                ) : errorDetail ? (
                  <p className="text-red-600">{errorDetail}</p>
                ) : (
                  <div className="text-[#36315B] text-base space-y-2">
                    
                    <p>
                      <b>Nama Lengkap:</b> {detailTerapis.nama}
                    </p>
                    <p>
                      <b>Bidang:</b> {detailTerapis.bidang}
                    </p>
                    <p><b>Role:</b> {detailTerapis.role}</p> {/* ✅ tambahan */}
                    <p>
                      <b>Nama Pengguna:</b> {detailTerapis.username}
                    </p>
                    <p>
                      <b>Email:</b> {detailTerapis.email}
                    </p>
                    <p>
                      <b>Telepon:</b> {detailTerapis.telepon}
                    </p>
                    <p>
                      <b>Tanggal Ditambahkan:</b> {detailTerapis.ditambahkan}
                    </p>
                    <p>
                      <b>Tanggal Diubah:</b> {detailTerapis.diubah}
                    </p>

            {detailTerapis.status === "Terverifikasi" && (
  <button
    onClick={() => handlePromoteAssessor(detailTerapis.user_id)}
    disabled={loadingPromote || detailTerapis.role === "asesor"}
    className={`w-full mt-4 py-2 rounded-md font-medium text-white ${
      detailTerapis.role === "asesor"
        ? "bg-gray-400 cursor-not-allowed"
        : loadingPromote
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#81B7A9] hover:bg-[#6aa093]"
    }`}
  >
    {detailTerapis.role === "asesor"
      ? "Sudah Menjadi Asesor"
      : loadingPromote
      ? "Memproses..."
      : "Jadikan Asesor"}
  </button>
)}


                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TherapistListPage;
