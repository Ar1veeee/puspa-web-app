/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/lib/api/forgotpassword";

export default function LupaPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendEmail = async () => {
    if (!email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await forgotPassword({ email });

      if (res.success) {
        router.push(
          `/auth/timer_lupa_password?email=${encodeURIComponent(email)}&type=reset`
        );
      } else {
        setError(res.message || "Gagal mengirim email.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengirim email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="layout-main min-h-screen flex flex-col items-center justify-center font-playpen bg-[#C9EAE0]">
      <header className="header flex justify-left my-6">
        <Image src="/logo.png" alt="Logo Puspa" width={160} height={50} priority />
      </header>

      <div className="form-wrapper flex justify-center w-full shadow-[0_4px_20px_#ADADAD]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="layout-form bg-white rounded-2xl p-6"
          style={{ width: 430, height: 350 }}
        >
          <h2 className="text-[20px] font-extrabold text-[#36315B] text-center my-4">
            Lupa Password Anda?
          </h2>

          <p className="text-[14px] text-[#36315B] text-left mb-2">
            Masukkan alamat Email
          </p>

          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full h-[45px] rounded-lg px-3 py-2 border border-[#ADADAD] bg-white outline-none focus:ring-2 focus:ring-[#81B7A9]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

          <button
            onClick={handleSendEmail}
            disabled={loading || email.trim() === ""}
            className={`bg-[#81B7A9] text-white w-full h-[45px] rounded-lg font-medium shadow-md mt-2 mb-4 transition-colors hover:bg-[#6EA092] ${
              loading || email.trim() === "" ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "KIRIM EMAIL"
            )}
          </button>
        </motion.div>
      </div>
    </main>
  );
}
