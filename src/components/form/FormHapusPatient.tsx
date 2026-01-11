"use client";

import { motion } from "framer-motion";


interface FormHapusPatientProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function FormHapusPatient({ open, onClose, onConfirm }: FormHapusPatientProps) {
  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex justify-between items-center mb-4">
        </div>
        <p className="mb-6">Apakah kamu yakin ingin menghapus data ini?</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-100">
            Batal
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-[#F64E60] text-white hover:bg-red-700">
            Hapus
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
