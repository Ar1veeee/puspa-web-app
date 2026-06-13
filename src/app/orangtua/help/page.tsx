"use client";

import React, { useState } from "react";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HelpOrangtuaPage() {
  const faqs = [
    {
      question: "Bagaimana cara melakukan assessment mandiri untuk anak saya?",
      answer:
        "Anda dapat masuk ke menu 'Assessment', pilih anak yang bersangkutan, kemudian klik tombol 'Aksi' -> 'Mulai Isi' pada kategori data yang tersedia (seperti Data Umum, Fisioterapi, Okupasi, Wicara, atau Paedagog). Isi setiap pertanyaan dengan lengkap lalu simpan jawaban Anda.",
    },
    {
      question:
        "Dapatkah saya mengubah data profil anak yang sudah didaftarkan?",
      answer:
        "Ya, Anda dapat masuk ke menu 'Anak', kemudian klik ikon pena (edit) pada kartu anak yang ingin diubah datanya. Lakukan perubahan pada kolom isian yang diinginkan lalu klik 'Simpan'.",
    },
    {
      question:
        "Bagaimana cara mendownload laporan perkembangan hasil observasi/assessment?",
      answer:
        "Laporan perkembangan dapat didownload setelah asesor/terapis selesai melakukan verifikasi dan mengupload dokumen laporan. Masuk ke menu 'Assessment' -> pilih anak -> klik tombol 'Unduh Laporan' di bagian bawah halaman kategori jika file laporan sudah tersedia.",
    },
    {
      question:
        "Bagaimana jika ada kesalahan data pada riwayat jawaban assessment?",
      answer:
        "Jawaban assessment yang telah dikirim bersifat final untuk keperluan rekam medis perkembangan anak. Jika terdapat kesalahan pengisian yang fatal, silakan hubungi tim administrasi kami melalui WhatsApp support untuk bantuan perbaikan data.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-4xl">
      <div className="space-y-8 text-[#1E5C58]">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E5C58] tracking-tight">
            Pusat Bantuan & FAQ
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-semibold mt-1">
            Temukan jawaban atas pertanyaan umum atau hubungi tim administrasi
            kami
          </p>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl border border-teal-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-extrabold flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-[#2B7A75]" /> Pertanyaan Umum
          </h2>

          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;
              return (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setActiveIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left font-bold text-[#1E5C58] hover:text-[#2B7A75] transition-colors py-2 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base pr-4">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 shrink-0 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 shrink-0 text-gray-400" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed pt-2 pb-1 pl-1">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hubungi Kami */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-teal-50 rounded-3xl p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] space-y-4">
            <h3 className="font-extrabold text-base md:text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#2B7A75]" /> Hubungi Tim
              Support
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
              Jika Anda memerlukan bantuan teknis mendesak atau memiliki
              pertanyaan administratif lainnya, hubungi kami melalui saluran
              berikut:
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-700">
                <Phone className="w-4 h-4 text-[#2B7A75]" />
                <span>+62 812-3456-7890 (WhatsApp Only)</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-700">
                <Mail className="w-4 h-4 text-[#2B7A75]" />
                <span>support@holisticcare.id</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-teal-50 rounded-3xl p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] space-y-4">
            <h3 className="font-extrabold text-base md:text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#2B7A75]" /> Lokasi Klinik
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
              Kunjungi klinik Holistic Care Puspa Center kami untuk konsultasi
              langsung:
            </p>
            <div className="text-xs sm:text-sm font-semibold text-gray-700 space-y-1">
              <p className="font-bold">Holistic Care Puspa Center</p>
              <p className="text-gray-500 text-xs">
                Jl. Teratai I No.21, Mangkubumen, Kec. Banjarsari, Kota
                Surakarta, Jawa Tengah 57139
              </p>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}
