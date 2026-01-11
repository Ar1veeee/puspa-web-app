/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react"; // ✅ Tambahkan Suspense
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { forgotPassword } from "@/lib/api/forgotpassword";

// --- KOMPONEN UTAMA (Wrapper dengan Suspense) ---
export default function TimerLupaPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Memuat halaman...
      </div>
    }>
      <TimerLupaPasswordContent />
    </Suspense>
  );
}

// --- SUB-KOMPONEN KONTEN (Logika Asli Anda) ---
function TimerLupaPasswordContent() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const res = await forgotPassword({ email });
      if (res.success) {
        setMsg(res.message || "Email reset password berhasil dikirim ulang.");
        setTimeLeft(60);
        setCanResend(false);
      } else {
        setError(res.message || "Gagal mengirim ulang email.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengirim ulang.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="layout-main min-h-screen flex flex-col items-center justify-center font-playpen">
      <header className="header flex justify-left" style={{ marginTop: 24, marginBottom: 24 }}>
        <Image src="/logo.png" alt="Logo Puspa" width={160} height={50} priority />
      </header>

      <div className="form-wrapper flex justify-center w-full shadow-[0_4px_20px_#ADADAD]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="layout-form"
          style={{ width: 430, height: 350, padding: 20 }}
        >
          <h2 className="text-[20px] font-extrabold text-[#36315B] text-center my-4">
            Silahkan cek Email Anda
          </h2>

          <p className="text-[12px] text-[#36315B] text-center mb-6">
            Kami sudah mengirim link reset ke email{" "}
            <span className="font-bold">{email}</span>.
          </p>

          {!canResend ? (
            <p className="text-[#8D8D8D] text-sm text-center mb-4">
              Tidak menerima email? Tunggu{" "}
              <span className="text-[#EDB720]">{timeLeft} detik</span> untuk mengirim ulang.
            </p>
          ) : (
            <p className="text-[#8D8D8D] text-sm text-center mb-4">
              Anda bisa kirim ulang sekarang.
            </p>
          )}

          {msg && <p className="text-[#81B7A9] text-sm text-center mb-2">{msg}</p>}
          {error && <p className="text-red-600 text-sm text-center mb-2">{error}</p>}

          <button
            onClick={handleResend}
            disabled={!canResend || loading}
            style={{
              backgroundColor: canResend ? "#81B7A9" : "#8D8D8D",
              color: "#FFFFFF",
              width: "100%",
              height: 45,
              borderRadius: 8,
              fontWeight: 500,
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              marginTop: 8,
              marginBottom: 16,
              transition: "background-color 0.3s",
              cursor: canResend ? "pointer" : "not-allowed",
            }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "KIRIM ULANG"
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-[#8D8D8D] text-[15px] mb-1">Kembali?</p>
            <p className="text-[#EDB720] text-[16px] font-normal">
              <Link href="/auth/login">Klik disini</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}