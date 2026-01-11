"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar_owner";
import Header from "@/components/layout/header_owner";
import {
  getUnverifiedAdmins,
  activateAdmin,
  deactivateAdmin,
} from "@/lib/api/ownerAdmin";

// ==========================
// TYPE
// ==========================
interface AdminData {
  user_id: string;
  admin_id: string;
  admin_name: string;
  email: string;
  admin_phone: string;
  createdAt: string;
}

const VerifikasiAdminPage: React.FC = () => {
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================
  // FETCH DATA ADMIN
  // ==========================
  const fetchUnverifiedAdmins = async () => {
    setLoading(true);
    const res = await getUnverifiedAdmins();
    if (res.success) {
      setAdmins(res.data);
    } else {
      alert(res.message || "Gagal memuat data admin.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUnverifiedAdmins();
  }, []);

  // ==========================
  // HANDLE APPROVE ADMIN
  // ==========================
  const handleApprove = async (user_id: string) => {
    const confirmApprove = window.confirm("Aktifkan admin ini?");
    if (!confirmApprove) return;

    const res = await activateAdmin(user_id);

    if (res.success) {
      alert("Admin berhasil diaktifkan!");
      // Refresh daftar admin belum verifikasi
      fetchUnverifiedAdmins();
    } else {
      alert(res.message || "Gagal mengaktifkan admin.");
    }
  };

  // ==========================
  // HANDLE REJECT ADMIN
  // ==========================
  const handleReject = async (user_id: string) => {
    const confirmReject = window.confirm("Apakah Anda yakin ingin menolak admin ini?");
    if (!confirmReject) return;

    const result = await deactivateAdmin(user_id);

    if (result.success) {
      alert("Admin berhasil ditolak.");
      // reload ulang data admin belum terverifikasi
      fetchUnverifiedAdmins();
    } else {
      alert(result.message || "Gagal menolak admin.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-[#36315B]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-8">
          <section className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-3 pb-2">
              Menunggu Verifikasi
            </h1>

            {/* Search */}
            <div className="flex justify-end mb-4 relative w-full max-w-xs ml-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
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

            {/* Loading */}
            {loading ? (
              <p className="text-center py-6 text-gray-500">Loading...</p>
            ) : admins.length === 0 ? (
              <p className="text-center py-6 text-gray-500">
                Tidak ada admin yang menunggu verifikasi.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      {[
                        { label: "No", width: "w-12" },
                        { label: "Nama Admin" },
                        { label: "Email" },
                        { label: "Tanggal Pendaftaran" },
                        { label: "Aksi", width: "w-48" },
                      ].map(({ label, width }) => (
                        <th
                          key={label}
                          className={`py-3 px-4 font-semibold text-[#36315B] border-b-2 ${
                            width || ""
                          }`}
                          style={{ borderBottomColor: "#81B7A9" }}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {admins.map((admin, idx) => (
                      <tr
                        key={admin.user_id}
                        className={`border-b ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                        style={{ borderBottomColor: "#81B7A9" }}
                      >
                        <td className="py-3 px-4">{idx + 1}</td>
                        <td className="py-3 px-4">{admin.admin_name}</td>
                        <td className="py-3 px-4 text-[#757575]">
                          {admin.email}
                        </td>
                        <td className="py-3 px-4 text-[#757575]">
                          {admin.createdAt.split(" ").slice(0, 3).join(" ")}
                        </td>

                        <td className="py-3 px-4 flex gap-3">
                          {/* Approve */}
                          <button
                            onClick={() => handleApprove(admin.user_id)}
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
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Setujui
                          </button>

                          {/* Reject */}
                          <button
                            onClick={() => handleReject(admin.user_id)}
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
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Tolak
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default VerifikasiAdminPage;
