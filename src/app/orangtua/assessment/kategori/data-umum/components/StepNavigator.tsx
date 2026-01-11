"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface Step {
    label: string;
    path: string;
}

interface StepNavigatorProps {
    steps: Step[];
    activeStep: number;
}

export default function StepNavigator({ steps, activeStep }: StepNavigatorProps) {
    const router = useRouter();

    return (
        
        <div className="mb-6 md:mb-12 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <div className="flex items-center min-w-max md:min-w-0 md:justify-center px-4 md:px-0">
                {steps.map((step, i) => (
                    <div
                        key={i}
                        className="flex items-center"
                    >
                        {/* Kontainer Step */}
                        <div
                            className="flex flex-col items-center text-center space-y-1 md:space-y-2 cursor-pointer group"
                            onClick={() => router.push(step.path)}
                        >
                            {/* Lingkaran Angka: Ukuran lebih kecil di mobile (w-7 h-7) */}
                            <div
                                className={`w-7 h-7 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center text-[10px] md:text-sm font-bold transition-all ${i === activeStep
                                        ? "bg-[#6BB1A0] border-[#6BB1A0] text-white shadow-sm"
                                        : i < activeStep
                                            ? "bg-white border-[#6BB1A0] text-[#6BB1A0]" // Indikator jika sudah lewat
                                            : "bg-gray-100 border-gray-300 text-gray-400"
                                    }`}
                            >
                                {i + 1}
                            </div>

                            {/* Label: Ukuran teks sangat kecil di mobile agar tidak memakan tempat */}
                            <span
                                className={`text-[10px] md:text-sm font-medium transition-colors ${i === activeStep
                                        ? "text-[#36315B] font-bold"
                                        : "text-gray-500"
                                    } max-w-[60px] md:max-w-none leading-tight`}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Garis Penghubung: Mengecil di mobile, menghilang di step terakhir */}
                        {i < steps.length - 1 && (
                            <div
                                className={`h-px transition-all duration-300 mx-2 md:mx-4 translate-y-[-10px] md:translate-y-[-14px] ${i < activeStep ? "bg-[#6BB1A0] w-6 md:w-16" : "bg-gray-300 w-4 md:w-12"
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}