/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function TerimakasihPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#B8E8DB] flex flex-col overflow-x-hidden">
      {/* Header - Responsif Padding */}
      <header className="bg-white flex items-center px-4 sm:px-8 md:px-12 py-3 shadow-md w-full">
        <Image
          src="/logo.png"
          alt="Logo Puspa"
          width={130}
          height={44}
          priority
          className="w-auto h-8 md:h-12"
        />
      </header>

      {/* Konten Utama */}
      <div className="flex flex-col items-center justify-center text-center flex-1 px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-[#68B2A0]"
        >
          <CheckCircle2 size={80} className="md:w-24 md:h-24 mx-auto" strokeWidth={1.5} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#36315B] mb-4 md:mb-6 max-w-2xl"
        >
          Terimakasih telah mengisi Form!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-[#36315B]/80 text-sm sm:text-base md:text-lg lg:text-xl max-w-xl mb-10 md:mb-12 leading-relaxed"
        >
          Kami senang dapat mendukung setiap langkah tumbuh kembang anak Anda.
          Admin akan menghubungi via WhatsApp untuk informasi selanjutnya. Mohon pastikan nomor Anda tetap aktif.
        </motion.p>

        {/* Tombol Aksi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3.5 rounded-full bg-[#68B2A0] text-white font-bold text-sm md:text-base shadow-lg shadow-[#68B2A0]/20 hover:bg-[#599A8A] transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Kembali ke Beranda
          </button>
          
          <button
            onClick={() => router.push("/auth/login")}
            className="px-8 py-3.5 rounded-full bg-white text-[#36315B] font-bold text-sm md:text-base shadow-sm hover:bg-gray-50 transition-all active:scale-95 border border-gray-100 flex items-center justify-center gap-2"
          >
            Masuk ke Akun
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>

      {/* Footer / Decorative Element */}
      <footer className="py-8 text-center">
        <p className="text-[#36315B]/50 text-xs font-medium uppercase tracking-widest">
          Puspa Holistic Integrative Care © 2026
        </p>
      </footer>
    </main>
  );
}