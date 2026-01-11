/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { resetPassword } from "@/lib/api/resetpassword";


export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#C9EAE0] text-[#36315B]">
        Memuat...
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setMounted(true);
    const t = searchParams.get("token") || "";
    const e = searchParams.get("email") || "";
    setToken(t);
    setEmail(e);
  }, [searchParams]);

  if (!mounted) {
    return null;
  }

  const validations = [
    { text: "Minimal 8 karakter", valid: password.length >= 8 },
    { text: "Terdapat huruf kapital", valid: /[A-Z]/.test(password) },
    { text: "Terdapat angka", valid: /\d/.test(password) },
    { text: "Terdapat simbol (!@#%&)", valid: /[!@#%&]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!password || !confirm) {
      setError("Password dan konfirmasi wajib diisi.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({
        token,
        email,
        password,
        password_confirmation: confirm,
      });

      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          router.push("/auth/berhasil_ubah_password");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Gagal mengubah password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#C9EAE0] font-playpen">
      <header className="flex items-start p-6">
        <Image src="/logo.png" alt="Logo Puspa" width={160} height={50} priority />
      </header>

      <div className="flex justify-center flex-1 items-start mt-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white w-[430px] rounded-2xl shadow-[0_4px_20px_#ADADAD] p-6"
        >
          <h2 className="text-[20px] font-extrabold text-[#36315B] mb-4">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit}>
            <label className="text-[14px] text-[#36315B] block mb-2">
              Masukkan Password Baru
            </label>
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password baru"
                className="w-full h-[45px] rounded-lg px-3 pr-10 py-2 border border-[#ADADAD] bg-white outline-none focus:ring-2 focus:ring-[#81B7A9]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <ul className="mb-4 space-y-1">
              {validations.map((rule, idx) => (
                <li key={idx} className="flex items-center text-[13px]">
                  <CheckCircle2
                    size={16}
                    className={rule.valid ? "text-green-500 mr-2" : "text-gray-300 mr-2"}
                  />
                  <span className={rule.valid ? "text-green-600" : "text-gray-500"}>
                    {rule.text}
                  </span>
                </li>
              ))}
            </ul>

            <label className="text-[14px] text-[#36315B] block mb-2">
              Konfirmasi Password
            </label>
            <div className="relative mb-4">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Konfirmasi password"
                className="w-full h-[45px] rounded-lg px-3 pr-10 py-2 border border-[#ADADAD] bg-white outline-none focus:ring-2 focus:ring-[#81B7A9]"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-red-600 text-sm text-center mb-2">{error}</p>}
            {successMsg && (
              <p className="text-green-600 text-sm text-center mb-2">{successMsg}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-[45px] rounded-lg font-medium text-white transition-colors ${loading ? "bg-[#81B7A9] cursor-not-allowed" : "bg-[#81B7A9] hover:bg-[#6EA092]"
                }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                "SIMPAN"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}