"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Pencil, Trash2, Plus, Search, Eye } from "lucide-react";

import FormUbahPatient from "@/components/form/FormUbahPatient";
import FormHapusPatient from "@/components/form/FormHapusPatient";
import {
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  PatientList,
  PatientDetail,
  PatientUpdatePayload,
} from "@/lib/api/data_patient";


function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}


function DetailPatient({
  open,
  onClose,
  patient,
}: {
  open: boolean;
  onClose: () => void;
  patient: PatientDetail | null;
}) {
  if (!open || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col relative">
        
        {/* Header (tetap) */}
        <div className="p-4 border-b border-[#81B7A9] flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#36315B]">
            Detail Patient
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-[#81B7A9]"
          >
            ✕
          </button>
        </div>

        {/* Content (SCROLL DI SINI) */}
        <div className="p-6 overflow-y-auto text-sm text-[#36315B] space-y-4">

          <div>
            <p className="font-medium">Informasi Pasien</p>
            <ul className="space-y-1 mt-2">
              <li>• Nama Anak : {patient.child_name}</li>
              <li>• Tempat, Tanggal Lahir : {patient.child_birth_info}</li>
              <li>• Usia : {patient.child_age}</li>
              <li>• Jenis Kelamin : {patient.child_gender ?? "-"}</li>
              <li>• Agama : {patient.child_religion}</li>
              <li>• Sekolah : {patient.child_school}</li>
              <li>• Alamat : {patient.child_address}</li>
            </ul>
          </div>

          <div>
            <p className="font-medium">Data Orang Tua / Wali</p>

            <ul className="space-y-1 mt-2">
              <li className="font-medium">Ayah</li>
              <li>• NIK : {patient.father_identity_number}</li>
              <li>• Nama : {patient.father_name}</li>
              <li>• Telepon : {patient.father_phone}</li>
              <li>• Tanggal Lahir : {patient.father_birth_date}</li>
              <li>• Usia : {patient.father_age}</li>
              <li>• Pekerjaan : {patient.father_occupation}</li>
              <li>• Hubungan : {patient.father_relationship}</li>
            </ul>

            <ul className="space-y-1 mt-3">
              <li className="font-medium">Ibu</li>
              <li>• NIK : {patient.mother_identity_number}</li>
              <li>• Nama : {patient.mother_name}</li>
              <li>• Telepon : {patient.mother_phone}</li>
              <li>• Tanggal Lahir : {patient.mother_birth_date}</li>
              <li>• Usia : {patient.mother_age}</li>
              <li>• Pekerjaan : {patient.mother_occupation}</li>
              <li>• Hubungan : {patient.mother_relationship}</li>
            </ul>

            <ul className="space-y-1 mt-3">
              <li className="font-medium">Wali</li>
              <li>• NIK : {patient.guardian_identity_number ?? "-"}</li>
              <li>• Nama : {patient.guardian_name ?? "-"}</li>
              <li>• Telepon : {patient.guardian_phone ?? "-"}</li>
              <li>• Tanggal Lahir : {patient.guardian_birth_date ?? "-"}</li>
              <li>• Usia : {patient.guardian_age ?? "-"}</li>
              <li>• Pekerjaan : {patient.guardian_occupation ?? "-"}</li>
              <li>• Hubungan : {patient.guardian_relationship ?? "-"}</li>
            </ul>
          </div>

          <div>
            <p className="font-medium">Informasi Layanan</p>
            <ul className="space-y-1 mt-2">
              <li>• Keluhan Anak : {patient.child_complaint ?? "-"}</li>
              <li>• Pilihan Layanan : {patient.child_service_choice ?? "-"}</li>
              <li>• Tanggal Ditambahkan : {patient.created_at}</li>
              <li>• Tanggal Diubah : {patient.updated_at}</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}


export default function PatientPage() {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<PatientList[]>([]);
const [selectedPatient, setSelectedPatient] = useState<PatientDetail | null>(null);
  const [showUbah, setShowUbah] = useState(false);
  const [showHapus, setShowHapus] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchPatients = async () => {
  try {
    const res = await getPatients();
    setPatients(res);
  } catch (error) {
    console.error("Gagal mengambil data pasien:", error);
  }
};



  useEffect(() => {
    fetchPatients();
  }, []);

 const handleDetail = async (child_id: string) => {
  try {
    const item = await getPatientById(child_id);
    setSelectedPatient(item);
    setShowDetail(true);
  } catch (error) {
    console.error("Gagal memuat detail pasien:", error);
  }
};



 const handleUbah = async (data: PatientUpdatePayload) => {
  if (!selectedPatient) return;

  try {
    await updatePatient(selectedPatient.child_id, data);
    setShowUbah(false);
    setSelectedPatient(null);
    fetchPatients();
  } catch (error: any) {
  console.log("422 RESPONSE FULL:", error.response?.data);
  console.log("422 ERRORS DETAIL:", error.response?.data?.errors);
}

};




  const handleHapus = async (child_id: string) => {
    try {
      await deletePatient(child_id);
      setShowHapus(false);
      setDeleteId(null);
      fetchPatients();
    } catch (error) {
      console.error("Gagal menghapus pasien:", error);
    }
  };

  const filtered = patients.filter(
    (a) =>
      (a.child_name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">

            <div className="relative w-64">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Cari..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-[#ADADAD] rounded-lg pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#81B7A9]"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md shadow-[#ADADAD] p-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#81B7A9] text-[#36315B]">
                  <th className="p-3 text-left">No</th>
                    <th className="p-3 text-left">Nama Anak</th>
                    <th className="p-3 text-left">Tanggal Lahir</th>
                    <th className="p-3 text-left">Usia</th>
                    <th className="p-3 text-left">Jenis Kelamin</th>
                    <th className="p-3 text-left">Asal Sekolah</th>
                    <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pasien, i) => (
                    <tr
                      key={pasien.child_id}
                      className="border-b border-[#81B7A9] hover:bg-gray-50"
                    >
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3">{pasien.child_name}</td>
                      <td className="p-3 text-[#757575]">{pasien.child_birth_date}</td>
                      <td className="p-3 text-[#757575]">{pasien.child_age}</td>
                      <td className="p-3 text-[#757575]">{pasien.child_gender ?? "-"}</td>
                      <td className="p-3 text-[#757575]">{pasien.child_school ?? "-"}</td>

                    <td className="p-3 flex justify-center gap-3">
                      <button
                        onClick={() => handleDetail(pasien.child_id)}
                        className="hover:scale-110 transition text-[#36315B]"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const detail = await getPatientById(pasien.child_id);
                            setSelectedPatient(detail);
                            setShowUbah(true);
                          } catch (err) {
                            console.error("Gagal memuat detail pasien untuk ubah:", err);
                          }
                        }}
                        className="hover:scale-110 transition text-[#4AB58E]"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(pasien.child_id);
                          setShowHapus(true);
                        }}
                        className="hover:scale-110 transition text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>


            </table>
          </div>
        </main>
      </div>

      
      <FormUbahPatient
  open={showUbah}
  onClose={() => setShowUbah(false)}
  onUpdate={handleUbah}
  initialData={selectedPatient ? {
    ...selectedPatient,
    child_birth_date: formatDate(selectedPatient.child_birth_date),
    father_birth_date: formatDate(selectedPatient.father_birth_date),
    mother_birth_date: formatDate(selectedPatient.mother_birth_date),
    guardian_birth_date: formatDate(selectedPatient.guardian_birth_date),
  } : undefined}
/>


      <FormHapusPatient
        open={showHapus}
        onClose={() => setShowHapus(false)}
        onConfirm={() => deleteId && handleHapus(deleteId)}
      />
      <DetailPatient
        open={showDetail}
        onClose={() => setShowDetail(false)}
        patient={selectedPatient}
      />
    </div>
  );
}