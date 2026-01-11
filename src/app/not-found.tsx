"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#C4F0E6] flex flex-col items-center justify-center relative p-6 overflow-hidden">

            {/* LOGO PUSPA - Top Left */}
            <div className="absolute top-6 left-6 md:top-10 md:left-10 lg:top-12 lg:left-12">
                <div className="flex items-center gap-2">
                    <img
                        src="/logo.png"
                        alt="Logo Puspa"
                        className="h-8 w-auto md:h-10 lg:h-12 object-contain"
                        // Fallback jika asset belum ada
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex flex-col items-center text-center w-full max-w-[1383px]">

                {/* ILLUSTRATION AREA */}
                <div className="relative w-full flex justify-center mb-6 md:mb-10 lg:mb-12">
                    <div className="w-full max-w-[280px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[400px] transition-all duration-300">
                        <img
                            src="/not-found.png"
                            alt="404 Illustration"
                            className="w-full h-auto object-contain mx-auto"
                            onError={(e) => {
                                e.currentTarget.src = "https://cdni.iconscout.com/illustration/premium/thumb/404-error-page-not-found-9561131-7824316.png";
                            }}
                        />
                    </div>
                </div>

                {/* TEXT MESSAGE */}
                <h1 className="text-[#36315B] font-bold text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 transition-all duration-300 px-4">
                    Halaman Yang Anda Tuju Tidak Tersedia.
                </h1>

                {/* BUTTON BACK TO PREVIOUS PAGE */}
                <button
                    onClick={() => router.back()}
                    className="bg-[#6BB1A0] cursor-pointer hover:bg-[#5aa391] text-white px-6 py-3 md:px-10 md:py-3.5 rounded-full flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-lg shadow-[#6BB1A0]/20"
                >
                    <ArrowLeft size={20} className="md:w-6 md:h-6" />
                    <span className="text-sm md:text-base font-bold tracking-wide">
                        Kembali ke Halaman Sebelumnya
                    </span>
                </button>
            </div>

            {/* FOOTER SPACING */}
            <div className="h-12 md:h-20 lg:h-24" />
        </div>
    );
}