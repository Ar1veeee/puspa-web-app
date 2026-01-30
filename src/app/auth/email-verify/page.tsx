"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";

function EmailVerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Token verifikasi tidak ditemukan.");
      setLoading(false);
      return;
    }

    axios
      .get(`https://puspa.sinus.ac.id/api/v1/auth/verify-email?token=${token}`)
      .then((res) => {
        if (res.data?.email) {
          setEmail(res.data.email);
          localStorage.removeItem("registered_email");
        } else {
          setError("Email tidak ditemukan dari server.");
        }
      })
      .catch(() => {
        setError("Verifikasi email gagal atau token tidak valid.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  return (
    <main className="min-h-screen flex flex-col bg-[#C9EAE0]">
      <header className="flex items-start p-6">
        <Image src="/logo.png" alt="Logo Puspa" width={160} height={50} priority />
      </header>

      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <Image
            src="/password.png"
            alt="Ilustrasi Email Verified"
            width={530}
            height={530}
            priority
          />

          <h2 className="text-[20px] font-extrabold text-[#36315B] text-center mt-6 mb-2">
            Email Telah Terverifikasi
          </h2>

          {loading && (
            <p className="text-sm text-[#36315B] text-center mb-6">
              Memverifikasi email...
            </p>
          )}

          {!loading && error && (
            <p className="text-sm text-red-500 text-center mb-6">
              {error}
            </p>
          )}

          {!loading && email && (
            <p className="text-[14px] text-[#36315B] text-center mb-6">
              Akun anda sudah sukses dibuat dengan email{" "}
              <span className="font-bold">{email}</span>.
              <br />
              Silahkan klik tombol dibawah untuk melakukan login.
            </p>
          )}

          {!loading && email && (
            <Link href="/auth/login">
              <button className="w-[160px] h-[45px] rounded-lg font-medium text-white bg-[#81B7A9] shadow-md hover:bg-[#6EA092]">
                Log-In
              </button>
            </Link>
          )}
        </motion.div>
      </div>
    </main>
  );
}

export default function EmailVerifiedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <EmailVerifyContent />
    </Suspense>
  );
}
