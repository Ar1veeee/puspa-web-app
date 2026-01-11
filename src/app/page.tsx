/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { registrationChild, RegistrationPayload } from "@/lib/api/registration";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const layananOptions = [
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
];

export default function Page() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    namaLengkap: "",
    tempatLahir: "",
    tanggalLahir: "",
    usia: "",
    jenisKelamin: "",
    sekolah: "",
    alamat: "",
    keluhan: "",
    statusOrtu: "",
    orangTua: "",
    nomorTelepon: "",
    email: "",
    pilihanLayanan: [] as string[],
  });

  useEffect(() => {
    if (formData.tanggalLahir) {
      const today = new Date();
      const birthDate = new Date(formData.tanggalLahir);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData((prev) => ({ ...prev, usia: String(age) }));
    }
  }, [formData.tanggalLahir]);

  const mutation = useMutation({
    mutationFn: (payload: RegistrationPayload) => registrationChild(payload),
    onSuccess: () => {
      alert("✅ Pendaftaran berhasil!");
      setFormData({
        namaLengkap: "",
        tempatLahir: "",
        tanggalLahir: "",
        usia: "",
        jenisKelamin: "",
        sekolah: "",
        alamat: "",
        keluhan: "",
        statusOrtu: "",
        orangTua: "",
        nomorTelepon: "",
        email: "",
        pilihanLayanan: [],
      });
      router.push("/pendaftaran");
    },
    onError: (error: any) => {
      console.error("❌ Error saat submit:", error);
      if (error.response?.data) {
        alert(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
        alert(error.message || "Terjadi kesalahan saat pendaftaran.");
      }
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setFormData((prev) => {
        const updated = checked
          ? [...prev.pilihanLayanan, value]
          : prev.pilihanLayanan.filter((v) => v !== value);
        return { ...prev, pilihanLayanan: updated };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let birthDate = formData.tanggalLahir;
    if (birthDate) {
      const date = new Date(birthDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      birthDate = `${year}-${month}-${day}`;
    }

    const payload: RegistrationPayload = {
      child_name: formData.namaLengkap,
      child_gender: formData.jenisKelamin.toLowerCase(),
      child_birth_place: formData.tempatLahir,
      child_birth_date: birthDate,
      child_school: formData.sekolah,
      child_address: formData.alamat,
      child_complaint: formData.keluhan,
      child_service_choice: formData.pilihanLayanan.join(", "),
      email: formData.email,
      guardian_name: formData.orangTua,
      guardian_phone: formData.nomorTelepon,
      guardian_type: formData.statusOrtu.toLowerCase(),
    };

    mutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-[#B8E8DB] pb-10 overflow-x-hidden">
      <header className="bg-white flex items-center px-6 md:px-10 py-3 shadow-sm mb-8 w-full">
        <Image src="/logo.png" alt="Logo" width={140} height={48} className="w-auto h-auto" />
      </header>

      <div className="max-w-[1100px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-black text-3xl md:text-4xl mb-3 text-[#36315B]">
            Form Pendaftaran
          </h2>
          <p className="mb-10 text-[#36315B] text-base md:text-lg font-normal max-w-2xl mx-auto leading-relaxed opacity-90">
            Kami senang dapat mendukung setiap langkah tumbuh kembang anak Anda.
            Mohon isi data lengkap di bawah ini agar permohonan Anda segera kami proses.
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[900px] bg-white rounded-[2rem] p-6 md:p-12 lg:p-16 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#36315B] flex items-center gap-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  required
                  placeholder="Isi Nama Lengkap"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7AA68D] outline-none transition-all"
                />
              </div>

              {/* Tempat, Tgl Lahir, Usia */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_0.4fr] gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#36315B]">
                    Tempat Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleChange}
                    required
                    placeholder="Isi Tempat Lahir"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7AA68D] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#36315B]">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7AA68D] outline-none transition-all text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#36315B]">Usia</label>
                  <input
                    type="number"
                    name="usia"
                    value={formData.usia}
                    readOnly
                    className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50 text-gray-400 font-semibold"
                  />
                </div>
              </div>

              {/* Jenis Kelamin */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#36315B]">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-8">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value="laki-laki"
                      checked={formData.jenisKelamin === "laki-laki"}
                      onChange={handleChange}
                      className="w-5 h-5 accent-[#7AA68D]"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-[#36315B]">Laki-laki</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value="perempuan"
                      checked={formData.jenisKelamin === "perempuan"}
                      onChange={handleChange}
                      className="w-5 h-5 accent-[#7AA68D]"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-[#36315B]">Perempuan</span>
                  </label>
                </div>
              </div>

              {/* Sekolah */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#36315B]">Asal Sekolah / Kelas</label>
                <input
                  type="text"
                  name="sekolah"
                  value={formData.sekolah}
                  onChange={handleChange}
                  placeholder="Isi Asal Sekolah"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7AA68D] outline-none transition-all"
                />
              </div>

              {/* Alamat */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#36315B]">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Isi Alamat Lengkap"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7AA68D] outline-none transition-all resize-none"
                />
              </div>

              {/* Keluhan */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#36315B]">
                  Keluhan <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="keluhan"
                  value={formData.keluhan}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Isi Keluhan"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7AA68D] outline-none transition-all resize-none"
                />
              </div>

              {/* Nama Ortu & Status */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#36315B]">
                    Nama Orang Tua / Wali <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="orangTua"
                    value={formData.orangTua}
                    onChange={handleChange}
                    required
                    placeholder="Isi Nama Orang Tua"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7AA68D] outline-none transition-all"
                  />
                </div>
                <div className="flex flex-wrap gap-6">
                  {['Ayah', 'Ibu', 'Wali'].map((status) => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="statusOrtu"
                        value={status.toLowerCase()}
                        checked={formData.statusOrtu === status.toLowerCase()}
                        onChange={handleChange}
                        className="w-5 h-5 accent-[#7AA68D]"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-[#36315B]">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Kontak */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#36315B]">
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="nomorTelepon"
                    value={formData.nomorTelepon}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: 08123456789"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7AA68D] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#36315B]">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Isi Alamat Email"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7AA68D] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Pilih Layanan */}
              <div className="pt-4">
                <label className="text-sm font-bold text-[#36315B] mb-4 block">
                  Pilih Layanan <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                  {layananOptions.map((layanan) => (
                    <label key={layanan} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="pilihanLayanan"
                        value={layanan}
                        checked={formData.pilihanLayanan.includes(layanan)}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-gray-300 accent-[#7AA68D]"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-[#36315B] transition-colors">
                        {layanan}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center md:justify-end pt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={mutation.isPending}
                  className={`w-full md:w-[160px] h-[52px] bg-[#68B2A0] text-white rounded-full flex items-center justify-center font-bold shadow-lg transition-all duration-300 ${
                    mutation.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#599A8A]"
                  }`}
                >
                  {mutation.isPending ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Daftar"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-[#36315B] text-sm md:text-base">
            Sudah Mendaftar?{" "}
            <Link href="/login" className="text-[#68B2A0] hover:text-[#599A8A] font-bold underline underline-offset-4">
              Masuk disini!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}