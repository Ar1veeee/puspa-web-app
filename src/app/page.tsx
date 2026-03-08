/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { registrationChild, RegistrationPayload } from "@/lib/api/registration";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  HeartPulse,
  Sparkles,
  Building2,
  CircleUserRound,
  AlertCircle,
  FileText,
  Info,
} from "lucide-react";

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
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
    <div className="min-h-screen lg:h-screen bg-[#F4F9F8] relative flex items-center justify-center p-4 sm:p-6 lg:py-8 overflow-x-hidden lg:overflow-hidden selection:bg-[#2B7A75] selection:text-white">
      {/* Decorative Background Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#b8e8db67] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#68b2a046] rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-7xl flex flex-col lg:flex-row relative z-10 h-auto lg:h-[90vh] bg-white rounded-3xl lg:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden my-4 lg:my-0"
      >
        {/* Left Side - Branding & Info */}
        <div className="w-full lg:w-5/12 bg-linear-to-br from-[#1E5C58] to-[#2B7A75] p-6 lg:p-10 text-white relative flex flex-col justify-between overflow-hidden shrink-0">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0d3633]/30 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 pointer-events-none" />

          <div className="relative z-10 flex flex-col flex-1 pb-4">
            <div className="bg-white p-2.5 rounded-xl inline-block mb-6 shadow-lg max-w-fit">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={35}
                className="w-auto h-6 lg:h-8 object-contain"
              />
            </div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl lg:text-4xl font-extrabold leading-tight mb-4"
            >
              Tumbuh Kembang <br />
              <span className="text-[#A2E4D3]">Lebih Optimal</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-teal-50 text-sm lg:text-base leading-relaxed mb-6 opacity-90"
            >
              Kami menghadirkan layanan terapi holistik dan integratif untuk
              mendukung setiap tahapan perkembangan buah hati Anda.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3"
            >
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
                <div className="bg-[#A2E4D3]/20 p-2.5 rounded-xl">
                  <HeartPulse className="w-5 h-5 text-[#A2E4D3]" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">
                    Pendekatan Holistik
                  </h3>
                  <p className="text-xs text-teal-100">
                    Penanganan tulus & menyeluruh
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
                <div className="bg-[#A2E4D3]/20 p-2.5 rounded-xl">
                  <Sparkles className="w-5 h-5 text-[#A2E4D3]" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">
                    Terapis Profesional
                  </h3>
                  <p className="text-xs text-teal-100">
                    Berpengalaman & tersertifikasi
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/20 mt-6 lg:mt-auto flex flex-col sm:flex-row lg:flex-col justify-between sm:items-center lg:items-stretch gap-3">
            <div className="flex flex-col gap-1 lg:gap-2">
              <p className="text-teal-50 text-xs sm:text-sm lg:text-xs">
                Sudah memiliki akun?
              </p>
              <p className="text-white font-semibold text-sm hidden sm:block lg:hidden">
                Masuk untuk pantau perkembangan.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center w-full sm:w-auto lg:w-full px-6 py-2.5 sm:py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-white font-bold text-sm sm:text-base lg:text-sm transition-all duration-300"
            >
              Masuk Disini
            </Link>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-7/12 flex flex-col lg:h-full bg-white relative">
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .scrollable-content::-webkit-scrollbar {
              width: 8px;
            }
            .scrollable-content::-webkit-scrollbar-track {
              background: #f1f5f9;
              border-radius: 10px;
            }
            .scrollable-content::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 10px;
            }
            .scrollable-content::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
          `,
            }}
          />
          <div className="p-6 sm:p-8 lg:p-12 pb-2 sm:pb-4 shrink-0">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E5C58] mb-1 sm:mb-2">
              Formulir Pendaftaran
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Lengkapi data di bawah ini agar permohonan Anda dapat segera kami
              proses.
            </p>
          </div>

          <div className="scrollable-content lg:overflow-y-auto px-6 sm:px-8 lg:px-12 pb-12 flex-1">
            <form
              onSubmit={handleSubmit}
              className="space-y-8 max-w-2xl mx-auto"
            >
              {/* Data Anak Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <CircleUserRound className="text-[#2B7A75] w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">Data Anak</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={handleChange}
                      required
                      placeholder="Masukkan nama lengkap anak"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-gray-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Tempat Lahir <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="tempatLahir"
                        value={formData.tempatLahir}
                        onChange={handleChange}
                        required
                        placeholder="Kota kelahiran"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-gray-700"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="space-y-2 flex-1">
                      <label className="text-sm font-semibold text-gray-700">
                        Tanggal Lahir <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="tanggalLahir"
                          value={formData.tanggalLahir}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-gray-600"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 w-20">
                      <label className="text-sm font-semibold text-gray-700">
                        Usia
                      </label>
                      <input
                        type="text"
                        name="usia"
                        value={formData.usia}
                        readOnly
                        placeholder="-"
                        className="w-full py-3 text-center bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-bold focus:outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.jenisKelamin === "laki-laki" ? "border-[#2B7A75]" : "border-gray-300"}`}
                        >
                          {formData.jenisKelamin === "laki-laki" && (
                            <div className="w-2.5 h-2.5 bg-[#2B7A75] rounded-full" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="jenisKelamin"
                          value="laki-laki"
                          className="hidden"
                          onChange={handleChange}
                        />
                        <span
                          className={`text-sm ${formData.jenisKelamin === "laki-laki" ? "font-medium text-[#1E5C58]" : "text-gray-500 group-hover:text-gray-700"}`}
                        >
                          Laki-laki
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.jenisKelamin === "perempuan" ? "border-[#2B7A75]" : "border-gray-300"}`}
                        >
                          {formData.jenisKelamin === "perempuan" && (
                            <div className="w-2.5 h-2.5 bg-[#2B7A75] rounded-full" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="jenisKelamin"
                          value="perempuan"
                          className="hidden"
                          onChange={handleChange}
                        />
                        <span
                          className={`text-sm ${formData.jenisKelamin === "perempuan" ? "font-medium text-[#1E5C58]" : "text-gray-500 group-hover:text-gray-700"}`}
                        >
                          Perempuan
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Asal Sekolah
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="sekolah"
                        value={formData.sekolah}
                        onChange={handleChange}
                        placeholder="Nama sekolah / TK"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Masukkan alamat domisili saat ini"
                    className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-gray-700 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Keluhan Utama <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      name="keluhan"
                      value={formData.keluhan}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="Ceritakan keluhan atau gejala yang dialami anak"
                      className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-gray-700 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Data Orang Tua Section */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <User className="text-[#2B7A75] w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Data Orang Tua / Wali
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Nama Orang Tua / Wali{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="orangTua"
                      value={formData.orangTua}
                      onChange={handleChange}
                      required
                      placeholder="Masukkan nama lengkap"
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-gray-700"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {["Ayah", "Ibu", "Wali"].map((status) => {
                      const isActive =
                        formData.statusOrtu === status.toLowerCase();
                      return (
                        <label key={status} className="cursor-pointer">
                          <input
                            type="radio"
                            name="statusOrtu"
                            value={status.toLowerCase()}
                            onChange={handleChange}
                            className="hidden"
                          />
                          <div
                            className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${
                              isActive
                                ? "bg-[#2B7A75] border-[#2B7A75] text-white shadow-md"
                                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {status}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="nomorTelepon"
                        value={formData.nomorTelepon}
                        onChange={handleChange}
                        required
                        placeholder="Contoh: 08123456789"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-gray-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="alamat@email.com"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-gray-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Layanan Section */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <FileText className="text-[#2B7A75] w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Pilihan Layanan
                  </h3>
                </div>

                <div className="bg-[#F4F9F8] rounded-2xl p-6 border border-teal-100">
                  <p className="text-sm text-gray-600 mb-4 font-medium flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#2B7A75]" /> Pilih layanan
                    yang dibutuhkan (bisa lebih dari satu){" "}
                    <span className="text-red-500">*</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {layananOptions.map((layanan) => {
                      const isChecked =
                        formData.pilihanLayanan.includes(layanan);
                      return (
                        <label
                          key={layanan}
                          className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all ${isChecked ? "bg-white border-[#2B7A75] shadow-sm" : "border-transparent hover:bg-white/60"}`}
                        >
                          <div
                            className={`mt-0.5 shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors ${isChecked ? "bg-[#2B7A75] border-[#2B7A75]" : "bg-white border-gray-300"}`}
                          >
                            {isChecked && (
                              <div className="w-2 h-2 bg-white rounded-sm" />
                            )}
                          </div>
                          <input
                            type="checkbox"
                            name="pilihanLayanan"
                            value={layanan}
                            checked={isChecked}
                            onChange={handleChange}
                            className="hidden"
                          />
                          <span
                            className={`text-sm leading-snug ${isChecked ? "font-medium text-[#1E5C58]" : "text-gray-600"}`}
                          >
                            {layanan}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-6">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={mutation.isPending}
                  className={`cursor-pointer w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg shadow-teal-500/30 transition-all duration-300 ${
                    mutation.isPending
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                      : "bg-[#2B7A75] text-white hover:bg-[#1E5C58]"
                  }`}
                >
                  {mutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    "Kirim Formulir Pendaftaran"
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
