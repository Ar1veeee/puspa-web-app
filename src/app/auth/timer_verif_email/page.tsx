/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resendVerification } from "@/lib/api/resendVerification";

export default function TimerVerifEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Memuat...
      </div>
    }>
      <TimerVerifEmailContent />
    </Suspense>
  );
}

// --- SUB-KOMPONEN KONTEN (Logika Asli Anda) ---
function TimerVerifEmailContent() {
  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !userId) return;

    const sendFirstEmail = async () => {
      setLoading(true);
      setMsg("");
      setError("");

      try {
        const res = await resendVerification(userId);

        if (res?.success) {
          setMsg("Email verifikasi telah dikirim ke email Anda!");
        } else {
          setError(res?.message || "Gagal mengirim email verifikasi. Coba lagi nanti.");
        }
      } catch (err) {
        setError("Terjadi kesalahan koneksi. Periksa jaringan Anda.");
      } finally {
        setLoading(false);
      }
    };

    sendFirstEmail();
  }, [isClient, userId]);

  useEffect(() => {
    if (!isClient) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      setCanResend(false);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft, isClient]);

  if (!isClient) return null; 

  return (
    <main className="layout-main min-h-screen flex flex-col items-center justify-center font-playpen">
      <header className="header flex justify-left mt-6 mb-6">
        <Image src="/logo.png" alt="Logo Puspa" width={160} height={50} priority />
      </header>

      <div className="form-wrapper flex justify-center w-full shadow-[0_4px_20px_#ADADAD]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="layout-form"
          style={{ width: 430, height: 380, padding: 20 }}
        >
          <h2 className="text-[20px] font-extrabold text-[#36315B] text-center my-4">
            Verifikasi Email Anda
          </h2>

          <p className="text-[12px] text-[#36315B] text-center mb-6">
            Kami telah mengirimkan email verifikasi ke akun Anda. 
            Silakan periksa inbox atau folder spam Anda.
          </p>

          {!canResend ? (
            <p className="text-[#8D8D8D] text-sm text-center mb-4">
              Tidak menerima email? Tunggu{" "}
              <span className="text-[#EDB720] font-semibold">{timeLeft} detik</span> 
              {" "}untuk mengirim ulang.
            </p>
          ) : (
            <p className="text-[#8D8D8D] text-sm text-center mb-4">
              Anda bisa kirim ulang sekarang.
            </p>
          )}

          {msg && <p className="text-[#0E9F6E] text-sm text-center mb-2">{msg}</p>}
          {error && <p className="text-red-600 text-sm text-center mb-2">{error}</p>}

          <button
            onClick={async () => {
              if (!userId) return setError("User ID tidak ditemukan.");

              setLoading(true);
              setMsg("");
              setError("");

              try {
                const res = await resendVerification(userId);
                if (res?.success) {
                  setMsg("Email verifikasi telah dikirim ulang!");
                  setTimeLeft(60);
                } else {
                  setError(res?.message || "Gagal mengirim ulang email. Coba lagi nanti.");
                }
              } catch (err) {
                setError("Terjadi kesalahan koneksi. Periksa jaringan Anda.");
              } finally {
                setLoading(false);
              }
            }}
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
            <p className="text-[#8D8D8D] text-[15px] mb-1">Sudah verifikasi?</p>
            <p className="text-[#EDB720] text-[16px] font-normal">
              <Link href="/auth/login">Masuk di sini</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}