/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar_owner";
import Header from "@/components/layout/header_owner";
import { getAllChildren } from "@/lib/api/ownerPasien";
import { getDetailPasien } from "@/lib/api/data_pasien";
import { Eye, X } from "lucide-react";

const DataAnakListPage: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedChildDetail, setSelectedChildDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  async function fetchChildren() {
    const res = await getAllChildren();
    if (res.success) {
      setChildren(res.data);
    }
  }

  async function handleViewDetail(childId: string) {
    setLoadingDetail(true);
    setErrorDetail(null);
    setSelectedChildDetail(null);

    try {
      const detail = await getDetailPasien(childId);
      setSelectedChildDetail(detail);
    } catch (error) {
      setErrorDetail("Gagal mengambil detail pasien.");
      setSelectedChildDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  }

  const filteredChildren = children.filter(
    (item) =>
      item.child_name.toLowerCase().includes(search.toLowerCase()) ||
      (item.child_school?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  return (
    <div className="flex min-h-screen bg-[#F7F7F7] text-[#36315B]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-10">
          <section className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-[#81B7A9]">
              Data Pasien / Anak
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
              <table className="w-full text-left">
                <thead>
                  <tr>
                    {[
                      "No",
                      "Nama Anak",
                      "Tanggal Lahir",
                      "Usia",
                      "Jenis Kelamin",
                      "Asal Sekolah",
                      "Aksi",
                    ].map((label) => (
                      <th
                        key={label}
                        className="py-3 px-4 font-semibold border-b-2"
                        style={{ borderBottomColor: "#81B7A9" }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredChildren.map((child, idx) => (
                    <tr
                      key={child.child_id}
                      className={`border-b ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                      style={{ borderBottomColor: "#81B7A9" }}
                    >
                      <td className="py-3 px-4">{idx + 1}</td>
                      <td className="py-3 px-4">{child.child_name}</td>
                      <td className="py-3 px-4 text-[#757575]">
                        {child.child_birth_date}
                      </td>
                      <td className="py-3 px-4 text-[#757575]">{child.child_age}</td>
                      <td className="py-3 px-4 capitalize">{child.child_gender}</td>
                      <td className="py-3 px-4">{child.child_school}</td>

                      <td className="py-3 px-4">
                        <button
                          className="text-[#36315B] hover:text-[#81B7A9]"
                          onClick={() => handleViewDetail(child.child_id)}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredChildren.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Tidak ada data anak.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Modal Detail Pasien */}
     {/* Modal Detail Pasien */}
{(selectedChildDetail || loadingDetail || errorDetail) && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center "
    onClick={() => setSelectedChildDetail(null)}
  >

          <div
  className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative shadow-xl"
  onClick={(e) => e.stopPropagation()}
>

              
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setSelectedChildDetail(null)}
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>

            <h2 className="text-xl font-semibold mb-4 border-b border-[#81B7A9] pb-1">
              Detail Pasien
            </h2>

            {loadingDetail ? (
              <p>Loading...</p>
            ) : errorDetail ? (
              <p className="text-red-500">{errorDetail}</p>
            ) : selectedChildDetail ? (
              <>
                <div className="mb-4">
                  <h3 className="font-semibold text-[#36315B] mb-1 border-b border-[#81B7A9] pb-1">
                    Informasi Anak
                  </h3>
                  <ul className="list-disc list-inside text-sm text-[#36315B] space-y-1">
                    <li>
                      Nama Lengkap : {selectedChildDetail.child_name}
                    </li>
                    <li>
                      Tempat, Tanggal Lahir : {selectedChildDetail.child_birth_info}
                    </li>
                    <li>Usia : {selectedChildDetail.child_age}</li>
                    <li>Jenis Kelamin : {selectedChildDetail.child_gender}</li>
                    <li>Agama : {selectedChildDetail.child_religion}</li>
                    <li>Sekolah : {selectedChildDetail.child_school}</li>
                    <li>Alamat : {selectedChildDetail.child_address}</li>
                    <li>Tanggal Ditambahkan : {selectedChildDetail.created_at}</li>
                    <li>Tanggal Update : {selectedChildDetail.updated_at}</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-[#36315B] mb-1 border-b border-[#81B7A9] pb-1">
                    Informasi Orangtua / Wali
                  </h3>

                  <div className="mb-2">
                    <strong>Ayah</strong>
                    <ul className="list-disc list-inside text-sm text-[#36315B] space-y-1">
                      <li>Nama Ayah : {selectedChildDetail.father_name || "-"}</li>
                      <li>Hubungan : {selectedChildDetail.father_relationship || "-"}</li>
                      <li>Tanggal Lahir : {selectedChildDetail.father_birth_date || "-"}</li>
                    
                      <li>Usia : {selectedChildDetail.father_age || "-"}</li>
                      <li>Pekerjaan : {selectedChildDetail.father_occupation || "-"}</li>
                      <li>Nomor Telpon : {selectedChildDetail.father_phone || "-"}</li>
                      <li>NIK : {selectedChildDetail.father_identity_number || "-"}</li>
                    </ul>
                  </div>

                  <div className="mb-2">
                    <strong>Ibu</strong>
                    <ul className="list-disc list-inside text-sm text-[#36315B] space-y-1">
                      <li>Nama Ibu : {selectedChildDetail.mother_name || "-"}</li>
                      <li>Hubungan : {selectedChildDetail.mother_relationship || "-"}</li>
                      <li>Tanggal Lahir : {selectedChildDetail.mother_birth_date || "-"}</li>
                      <li>Usia : {selectedChildDetail.mother_age || "-"}</li>
                      <li>Pekerjaan : {selectedChildDetail.mother_occupation || "-"}</li>
                      <li>Nomor Telpon : {selectedChildDetail.mother_phone || "-"}</li>
                      <li>NIK : {selectedChildDetail.mother_identity_number || "-"}</li>
                    </ul>
                  </div>

                  <div>
                    <strong>Wali (Jika Ada)</strong>
                    <ul className="list-disc list-inside text-sm text-[#36315B] space-y-1">
                      <li>Nama Wali : {selectedChildDetail.guardian_name || "-"}</li>
                      <li>Hubungan : {selectedChildDetail.guardian_relationship || "-"}</li>
                      <li>Tanggal Lahir : {selectedChildDetail.guardian_birth_date || "-"}</li>
                      <li>Usia : {selectedChildDetail.guardian_age || "-"}</li>
                      <li>Pekerjaan : {selectedChildDetail.guardian_occupation || "-"}</li>
                      <li>Nomor Telpon : {selectedChildDetail.guardian_phone || "-"}</li>
                      <li>NIK : {selectedChildDetail.guardian_identity_number || "-"}</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-[#36315B] mb-1 border-b border-[#81B7A9] pb-1">
                    Keluhan
                  </h3>
                  <p className="text-sm text-[#36315B]">{selectedChildDetail.child_complaint || "-"}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#36315B] mb-1 border-b border-[#81B7A9] pb-1">
                    Layanan Terpilih
                  </h3>
                  <ul className="list-disc list-inside text-sm text-[#36315B] space-y-1 capitalize">
                    {selectedChildDetail.child_service_choice
                      ? selectedChildDetail.child_service_choice.split(",").map((service: string, i: number) => (
                          <li key={i}>{service.trim()}</li>
                        ))
                      : "-"}
                  </ul>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAnakListPage;
