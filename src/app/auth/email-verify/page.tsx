"use client";


import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function EmailVerifedPage() {
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

        
          <p className="text-[14px] text-[#36315B] text-center mb-6">
            Akun anda sudah sukses dibuat dengan email{" "}
            <span className="font-bold">puspa@puspa.com</span>.
            <br />
            Silahkan klik tombol dibawah untuk melakukan login.
          </p>

       
          <Link href="/auth/login">
            <button className="w-[160px] h-[45px] rounded-lg font-medium text-white bg-[#81B7A9] shadow-md transition-colors hover:bg-[#6EA092]">
              Log-In
            </button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}