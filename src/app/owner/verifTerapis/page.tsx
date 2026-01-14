/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar_owner";
import Header from "@/components/layout/header_owner";
import {
  getUnverifiedTherapists,
  activateTherapist,
  deactivateTherapist,
} from "@/lib/api/ownerTerapis";

const VerifikasiTerapisPage: React.FC = () => {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ==========================
  // FETCH DATA TERAPIS
  // ==========================
  const loadTherapists = async () => {
    setLoading(true);
    const response = await getUnverifiedTherapists();

    if (response.success) {
      setTherapists(response.data);
    } else {
      alert(response.message || "Gagal memuat data terapis.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTherapists();
  }, []);

  // ==========================
  // HANDLE SETUJUI TERAPIS
  // ==========================
  const handleApprove = async (user_id: string) => {
    const confirmApprove = window.confirm("Yakin ingin menyetujui terapis ini?");
    if (!confirmApprove) return;

    const response = await activateTherapist(user_id);

    if (response.success) {
      alert("Terapis berhasil diaktifkan!");
      loadTherapists(); // refresh list
    } else {
      alert("Gagal mengaktifkan: " + response.message);
    }
  };

  // ==========================
  // HANDLE TOLAK TERAPIS
  // ==========================
  const handleReject = async (user_id: string) => {
    const confirmReject = window.confirm("Apakah Anda yakin ingin menolak terapis ini?");
    if (!confirmReject) return;

    const response = await deactivateTherapist(user_id);

    if (response.success) {
      alert("Terapis berhasil ditolak!");
      loadTherapists(); // refresh list
    } else {
      alert("Gagal menolak terapis: " + response.message);
    }
  };

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
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-3 pb-2">Menunggu Verifikasi</h1>

            {/* Search Input */}
            <div className="flex justify-end mb-4 relative w-full max-w-xs ml-auto">
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
              <input
                type="search"
                placeholder="Search"
                className="border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#81B7A9] w-full"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    {[
                      { label: "No", width: "w-12" },
                      { label: "Nama Terapis" },
                      { label: "Email" },
                      { label: "Tanggal Pendaftaran" },
                      { label: "Aksi", width: "w-48" },
                    ].map(({ label, width }) => (
                      <th
                        key={label}
                        className={`py-3 px-4 font-semibold text-[#36315B] border-b-2 ${width || ""}`}
                        style={{ borderBottomColor: "#81B7A9" }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        Loading...
                      </td>
                    </tr>
                  ) : therapists.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-500">
                        Tidak ada data terapis menunggu verifikasi.
                      </td>
                    </tr>
                  ) : (
                    therapists.map((item, idx) => (
                      <tr
                        key={item.user_id}
                        className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                        style={{ borderBottomColor: "#81B7A9" }}
                      >
                        <td className="py-3 px-4">{idx + 1}</td>
                        <td className="py-3 px-4">{item.therapist_name}</td>
                        <td className="py-3 px-4 text-[#757575]">{item.email}</td>
                        <td className="py-3 px-4 text-[#757575]">{item.createdAt}</td>

                        <td className="py-3 px-4 flex gap-3">
                          {/* Approve */}
                          <button
                            onClick={() => handleApprove(item.user_id)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-green-600 transition"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Setujui
                          </button>

                          {/* Reject */}
                          <button
                            onClick={() => handleReject(item.user_id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-red-700 transition"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Tolak
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default VerifikasiTerapisPage;
