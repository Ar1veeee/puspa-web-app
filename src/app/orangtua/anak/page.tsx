/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { X, Plus, Baby, MapPin, Calendar, Users, Info, School, BookOpen, Heart, UserCircle } from "lucide-react";

import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import {
  getChildren,
  getChildDetail,
  updateChild,
  deleteChild,
  createChild,
  ChildItem,
  ChildDetail,
} from "@/lib/api/childrenAsesment";

import FormDetailPasien from "@/components/form/FormDetailPasien";
import FormUbahPasien from "@/components/form/FormUbahPasien";
import FormHapusAnak from "@/components/form/FormHapusAnak";

import { FaEye, FaPen, FaTrash } from "react-icons/fa";

export default function ChildList() {
  const [children, setChildren] = useState<ChildItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedChild, setSelectedChild] = useState<ChildDetail | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Initial State Lengkap sesuai ChildDetail
  const [formAdd, setFormAdd] = useState({
    child_name: "",
    child_gender: "",
    child_birth_place: "",
    child_birth_date: "",
    child_school: "",
    child_religion: "",
    child_address: "",
    child_complaint: "",
    child_service_choice: [] as string[],

    // Father Info
    father_identity_number: "",
    father_name: "",
    father_phone: "",
    father_birth_date: "",
    father_occupation: "",
    father_relationship: "Ayah Kandung",

    // Mother Info
    mother_identity_number: "",
    mother_name: "",
    mother_phone: "",
    mother_birth_date: "",
    mother_occupation: "",
    mother_relationship: "Ibu Kandung",

    // Guardian Info
    guardian_identity_number: "",
    guardian_name: "",
    guardian_phone: "",
    guardian_birth_date: "",
    guardian_occupation: "",
    guardian_relationship: "",
  });

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "child_service_choice" && e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      const checked = e.target.checked;
      setFormAdd((prev) => {
        let newArray = [...prev.child_service_choice];
        if (checked) { newArray.push(value); } else { newArray = newArray.filter((v) => v !== value); }
        return { ...prev, child_service_choice: newArray };
      });
    } else {
      setFormAdd((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await getChildren();
        setChildren(res.data || []);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleOpenDetail(id: string) {
    const data = await getChildDetail(id);
    setSelectedChild(data);
    setOpenDetail(true);
  }

  async function handleOpenEdit(id: string) {
    const data = await getChildDetail(id);
    setSelectedChild({ ...data, child_id: id });
    setOpenEdit(true);
  }

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleHapus = async (id: string) => {
    await deleteChild(id);
    const refreshed = await getChildren();
    setChildren(refreshed.data || []);
    setOpenDelete(false);
  };

  const handleUbah = async (payload: Partial<ChildDetail>) => {
    if (!selectedChild?.child_id) return;
    await updateChild(selectedChild.child_id, payload);
    const refreshed = await getChildren();
    setChildren(refreshed.data || []);
    setOpenEdit(false);
  };

  async function handleTambah() {
    const payload = {
      ...formAdd,
      child_service_choice: formAdd.child_service_choice.join(", ")
    };
    await createChild(payload as any);
    const refreshed = await getChildren();
    setChildren(refreshed.data || []);
    setOpenAdd(false);
  }

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-7xl">
      <div className="space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#36315B]">Data Anak</h1>
            <p className="text-gray-400 text-sm mt-1">Kelola informasi profil dan riwayat medis anak Anda</p>
          </div>
          <button
            onClick={() => setOpenAdd(true)}
            className="w-full cursor-pointer sm:w-auto flex items-center justify-center gap-2 bg-[#409E86] hover:bg-[#368672] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#409E86]/20 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>Tambah Data</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-[#C0DCD6] border-t-[#409E86] rounded-full animate-spin" />
            <p className="text-gray-400 font-medium animate-pulse">Sinkronisasi data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {children.map((child) => (
              <div
                key={child.child_id}
                className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-[#C0DCD6] transition-all duration-300 flex flex-col group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-[#EAF4F0] text-[#409E86] rounded-2xl w-14 h-14 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    👶
                  </div>
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 uppercase tracking-wider">
                    Aktif
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  <h2 className="font-bold text-[#36315B] text-lg leading-tight line-clamp-1">{child.child_name}</h2>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <Calendar size={14} className="text-[#409E86]" />
                      <span>{child.child_birth_date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <Users size={14} className="text-[#409E86]" />
                      <span className="capitalize">{child.child_gender}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => handleOpenDetail(child.child_id)}
                    className="flex cursor-pointer items-center justify-center p-3 text-gray-400 hover:text-[#409E86] hover:bg-[#EAF4F0] rounded-xl transition-colors"
                    title="Detail"
                  >
                    <FaEye size={18} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(child.child_id)}
                    className="flex cursor-pointer items-center justify-center p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Edit"
                  >
                    <FaPen size={16} />
                  </button>
                  <button
                    onClick={() => handleOpenDelete(child.child_id)}
                    className="flex cursor-pointer items-center justify-center p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Hapus"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODALS ================= */}
      <FormDetailPasien open={openDetail} onClose={() => setOpenDetail(false)} pasien={selectedChild} />
      <FormUbahPasien open={openEdit} onClose={() => setOpenEdit(false)} initialData={selectedChild || undefined} onUpdate={handleUbah} />
      <FormHapusAnak open={openDelete} onClose={() => setOpenDelete(false)} childId={deleteId ?? undefined} onConfirm={(id) => handleHapus(id)} />

      {/* MODAL TAMBAH ANAK */}
      {openAdd && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all">
          <div className="bg-white w-full max-w-4xl rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#EAF4F0] rounded-lg text-[#409E86]">
                  <Baby size={24} />
                </div>
                <h2 className="text-xl font-black text-[#36315B]">Pendaftaran Data Pasien Baru</h2>
              </div>
              <button onClick={() => setOpenAdd(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 cursor-pointer"><X size={24} /></button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-10 custom-scrollbar">

              {/* SECTION INFORMASI ANAK */}
              <div className="space-y-6">
                <h3 className="font-bold text-[#36315B] text-sm md:text-base border-l-4 border-[#6BB1A0] pl-3">Identitas Anak</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nama Lengkap <span className="text-red-500">*</span></label>
                    <input name="child_name" value={formAdd.child_name} onChange={handleAddChange} className="w-full border border-gray-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-[#C0DCD6] outline-none" placeholder="Contoh: Zahara Prameswari" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tempat Lahir <span className="text-red-500">*</span></label>
                    <input name="child_birth_place" value={formAdd.child_birth_place} onChange={handleAddChange} className="w-full border border-gray-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-[#C0DCD6] outline-none" placeholder="Kota lahir" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tanggal Lahir <span className="text-red-500">*</span></label>
                    <input type="date" name="child_birth_date" value={formAdd.child_birth_date} onChange={handleAddChange} className="w-full border border-gray-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-[#C0DCD6] outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Agama</label>
                    <select name="child_religion" value={formAdd.child_religion} onChange={handleAddChange} className="w-full border border-gray-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-[#C0DCD6] outline-none">
                      <option value="">Pilih Agama</option>
                      <option value="Islam">Islam</option>
                      <option value="Kristen">Kristen</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Budha">Budha</option>
                      <option value="Konghucu">Konghucu</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Sekolah</label>
                    <input name="child_school" value={formAdd.child_school} onChange={handleAddChange} className="w-full border border-gray-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-[#C0DCD6] outline-none" placeholder="Nama sekolah saat ini" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Jenis Kelamin <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    {["laki-laki", "perempuan"].map((g) => (
                      <label key={g} className="relative flex items-center justify-center gap-2 border-2 border-gray-100 rounded-2xl py-3.5 cursor-pointer transition-all has-[:checked]:bg-[#EAF4F0] has-[:checked]:border-[#409E86]">
                        <input type="radio" name="child_gender" value={g} checked={formAdd.child_gender === g} onChange={handleAddChange} className="hidden" />
                        <span className="capitalize text-sm font-bold text-gray-600">{g === 'laki-laki' ? '👦 Laki-laki' : '👧 Perempuan'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Alamat Domisili <span className="text-red-500">*</span></label>
                  <textarea name="child_address" value={formAdd.child_address} onChange={handleAddChange} rows={2} className="w-full border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#C0DCD6]" placeholder="Alamat lengkap sesuai KTP/Domisili" />
                </div>
              </div>

              {/* SECTION KELUHAN & LAYANAN */}
              <div className="space-y-6">
                <h3 className="font-bold text-[#36315B] text-sm md:text-base border-l-4 border-[#6BB1A0] pl-3">Detail Keluhan & Layanan</h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Keluhan Utama <span className="text-red-500">*</span></label>
                  <textarea name="child_complaint" value={formAdd.child_complaint} onChange={handleAddChange} rows={3} className="w-full border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#C0DCD6]" placeholder="Jelaskan alasan pemeriksaan atau keluhan anak saat ini" />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-2">
                    <Info size={14} /> Layanan yang Dibutuhkan <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      "Asesmen Tumbuh Kembang",
                      "Asesmen Terpadu",
                      "Konsultasi Dokter",
                      "Konsultasi Psikolog",
                      "Konsultasi Keluarga",
                      "Test Psikolog",
                      "Layanan Minat Bakat",
                      "Daycare",
                      "Home Care",
                      "Hydrotherapy",
                      "Baby Spa",
                      "Lainnya",
                    ].map((item) => (
                      <label key={item} className="group flex items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors has-[:checked]:bg-[#EAF4F0] has-[:checked]:border-[#C0DCD6]">
                        <input type="checkbox" value={item} onChange={handleAddChange} name="child_service_choice" checked={formAdd.child_service_choice.includes(item)} className="w-5 h-5 rounded accent-[#409E86]" />
                        <span className="text-sm font-semibold text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3">
              <button onClick={() => setOpenAdd(false)} className="w-full sm:flex-1 py-4 border border-gray-300 rounded-2xl font-bold text-gray-600 hover:bg-white transition-all order-2 sm:order-1 cursor-pointer">Batal</button>
              <button onClick={handleTambah} className="w-full sm:flex-1 py-4 bg-[#409E86] text-white rounded-2xl font-bold shadow-lg shadow-[#409E86]/20 hover:bg-[#368672] transition-all active:scale-95 order-1 sm:order-2 cursor-pointer">Simpan</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </ResponsiveOrangtuaLayout>
  );
}