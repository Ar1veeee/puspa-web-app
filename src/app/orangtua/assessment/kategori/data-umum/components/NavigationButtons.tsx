"use client";

import React from "react";

interface NavigationButtonsProps {
    currentIndex: number;
    totalCategories: number;
    onPrev: () => void;
    onNext: () => void;
    onSubmit: () => void;
    submitting: boolean;
}

export default function NavigationButtons({
    currentIndex,
    totalCategories,
    onPrev,
    onNext,
    onSubmit,
    submitting,
}: NavigationButtonsProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
            {currentIndex > 0 ? (
                <button
                    type="button"
                    onClick={onPrev}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl text-sm md:text-base order-2 sm:order-1"
                >
                    Sebelumnya
                </button>
            ) : (
                <div className="hidden sm:block" />
            )}

            {currentIndex < totalCategories - 1 ? (
                <button
                    type="button"
                    onClick={onNext}
                    className="bg-[#6BB1A0] hover:bg-[#5EA391] text-white px-6 md:px-8 py-2 rounded-xl text-sm md:text-base order-1 sm:order-2"
                >
                    Selanjutnya
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={submitting}
                    className="bg-[#6BB1A0] hover:bg-[#5EA391] text-white px-6 md:px-8 py-2 rounded-xl disabled:opacity-60 text-sm md:text-base order-1 sm:order-2"
                >
                    {submitting ? "Mengirim..." : "Simpan"}
                </button>
            )}
        </div>
    );
}