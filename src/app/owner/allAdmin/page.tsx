/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar_owner";
import Header from "@/components/layout/header_owner";
import { getAllAdmins } from "@/lib/api/ownerAdmin";
import { getAdminById } from "@/lib/api/data_admin";
import { Eye, X } from "lucide-react";

const AdminListPage: React.FC = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Fetch semua admin
  async function fetchAdmins() {
    try {
      const res = await getAllAdmins();
      if (res.success && Array.isArray(res.data)) {
        setAdmins(res.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data admin:", error);
    }
  }

  // Lihat detail admin
  async function handleViewAdmin(id: string) {
    setLoadingDetail(true);
    try {
      const data = await getAdminById(id);
      setSelectedAdmin(data);
    } catch (error) {
      console.error("Gagal mengambil detail admin:", error);
      alert("Gagal mengambil detail admin");
    } finally {
      setLoadingDetail(false);
    }
  }

  function closeModal() {
    setSelectedAdmin(null);
  }

  const filteredAdmins = admins.filter(
    (item) =>
      item.admin_name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F7F7F7] text-[#36315B]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-8">
          <section className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-[#81B7A9]">
              Data Admin
            </h1>

            {/* Search */}
            <div className="flex justify-end mb-4 relative w-full max-w-xs ml-auto">
              <input
                type="search"
                placeholder="Cari admin..."
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
                      { label: "No", width: "50px" },
                      { label: "Nama", width: "180px" },
                      { label: "Nama Pengguna", width: "150px" },
                      { label: "Email", width: "200px" },
                      { label: "Telepon", width: "140px" },
                      { label: "Status", width: "120px" },
                      { label: "Aksi", width: "80px" },
                    ].map((col) => (
                      <th
                        key={col.label}
                        className="py-2.5 px-3 font-bold text-[#36315B] border-b-2"
                        style={{
                          borderBottomColor: "#81B7A9",
                          width: col.width,
                        }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-4 text-gray-500 italic"
                      >
                        Tidak ada data admin.
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((admin, idx) => (
                      <tr
                        key={admin.admin_id}
                        className={`border-b ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                        style={{ borderBottomColor: "#81B7A9" }}
                      >
                        <td className="py-2.5 px-3">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-medium">
                          {admin.admin_name}
                        </td>
                        <td className="py-2.5 px-3 text-[#757575] font-medium">
                          {admin.username}
                        </td>
                        <td className="py-2.5 px-3 text-[#757575] font-medium">
                          {admin.email}
                        </td>
                        <td className="py-2.5 px-3 text-[#757575] font-medium">
                          {admin.admin_phone}
                        </td>
                        <td
                          className={`py-2.5 px-3 font-medium ${
                            admin.status === "Terverifikasi"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {admin.status}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            className="text-[#36315B] hover:text-[#81B7A9]"
                            onClick={() => handleViewAdmin(admin.admin_id)}
                            disabled={loadingDetail}
                            title="Lihat detail admin"
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
        </main>

        {/* Modal Detail Admin */}
        {selectedAdmin && (
          <div
            className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg p-6 w-96 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold mb-2 text-[#36315B]">
                Detail Admin
              </h2>
              <hr className="border-t-2 border-[#81B7A9] mb-4" />

              <div className="text-[#36315B] text-base">
                <p className="mb-2 font-medium">Informasi Admin</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <span className="font-medium">Nama Lengkap:</span>{" "}
                    {selectedAdmin.admin_name}
                  </li>
                  <li>
                    <span className="font-medium">Nama Pengguna:</span>{" "}
                    {selectedAdmin.username}
                  </li>
                  <li>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedAdmin.email}
                  </li>
                  <li>
                    <span className="font-medium">Telepon:</span>{" "}
                    {selectedAdmin.admin_phone}
                  </li>
                  <li>
                    <span className="font-medium">Status:</span>{" "}
                    {selectedAdmin.status}
                  </li>
                  <li>
                    <span className="font-medium">Tanggal Ditambahkan:</span>{" "}
                    {selectedAdmin.created_at}
                  </li>
                  <li>
                    <span className="font-medium">Tanggal Diubah:</span>{" "}
                    {selectedAdmin.updated_at}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminListPage;
