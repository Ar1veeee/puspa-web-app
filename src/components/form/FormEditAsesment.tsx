"use client";

import { useEffect, useRef, useState } from "react";

interface FormEditAsesmentProps {
  onClose: () => void;
  onSave?: (date: string, time: string) => void | Promise<void>;
  initialDate?: string;
  initialTime?: string;
  pasienName?: string;
  title?: string; // 🔹 Tambahan props title
}

export default function FormEditAsesment({
  onClose,
  onSave,
  initialDate = "",
  initialTime = "",
  pasienName,
  title, // 🔹 Terima title
}: FormEditAsesmentProps) {
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // set initial values when props change (useful when re-opening for different pasien)
  useEffect(() => {
    setDate(initialDate);
    setTime(initialTime);
  }, [initialDate, initialTime]);

  // trap focus to modal (basic)
  useEffect(() => {
    const el = modalRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // prevent background scroll
    if (el) el.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // submit handler (allows async onSave)
  const handleSave = async () => {
    if (onSave) {
      try {
        await onSave(date, time);
      } catch (err) {
        console.error("onSave error:", err);
      }
    }
    onClose();
  };

  // klik di backdrop harus menutup, klik di modal tidak
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center bg-transparent z-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white rounded-2xl shadow-lg p-6 w-[360px] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-center mb-4 text-[#1E1E1E]">
          {title
            ? title + (pasienName ? ` untuk ${pasienName}` : "")
            : pasienName
            ? `Atur Jadwal Asesmen untuk ${pasienName}`
            : "Atur Jadwal Asesmen"}
        </h2>

        <div className="mb-4">
          <label className="text-gray-600 text-sm font-medium mb-1 block">
            Tanggal
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#81B7A9] outline-none"
          />
        </div>

        <div className="mb-2">
          <label className="text-gray-600 text-sm font-medium mb-1 block">
            Waktu
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#81B7A9] outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm bg-gray-200 hover:bg-gray-300 transition"
            type="button"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md text-sm bg-[#81B7A9] text-white hover:bg-[#5f9e8b] transition"
            type="button"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
