"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Pencil, Trash2, Search } from "lucide-react";
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
} from "@/lib/api/data_pasien";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "" : d.toISOString().split('T')[0];
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

  const handleUbah = async (data: PatientUpdatePayload) => {
    if (!selectedPatient) return;
    try {
      await updatePatient(selectedPatient.child_id, data);
      setShowUbah(false);
      fetchPatients();
    } catch (error: any) {
      console.error("Gagal update:", error.response?.data);
    }
  };

  const handleHapus = async (id: string) => {
    try {
      await deletePatient(id);
      setShowHapus(false);
      fetchPatients();
    } catch (error) {
      console.error("Gagal hapus:", error);
    }
  };

  const filtered = patients.filter(p => p.child_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6">
          <div className="mb-4 relative w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              className="pl-10 pr-4 py-2 border rounded-lg w-full" 
              placeholder="Cari nama anak..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-left">Nama</th>
                  <th className="p-4 text-left">Usia</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.child_id} className="border-b">
                    <td className="p-4">{p.child_name}</td>
                    <td className="p-4">{p.child_age}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button onClick={async () => {
                        const detail = await getPatientById(p.child_id);
                        setSelectedPatient(detail);
                        setShowUbah(true);
                      }} className="text-emerald-600"><Pencil size={18}/></button>
                      <button onClick={() => { setDeleteId(p.child_id); setShowHapus(true); }} className="text-red-600"><Trash2 size={18}/></button>
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
        initialData={selectedPatient ?? undefined}
      />

      <FormHapusPatient
        open={showHapus}
        onClose={() => setShowHapus(false)}
        onConfirm={() => deleteId && handleHapus(deleteId)}
      />
    </div>
  );
}