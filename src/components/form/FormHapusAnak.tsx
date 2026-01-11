"use client";

import { motion } from "framer-motion";

interface FormHapusAnakProps {
  open: boolean;
  onClose: () => void;
  childId?: string;
  onConfirm: (id: string) => void;
}

export default function FormHapusAnak({
  open,
  onClose,
  childId,
  onConfirm,
}: FormHapusAnakProps) {
  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <p className="mb-6">Apakah kamu yakin ingin menghapus data ini?</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Batal
          </button>

          <button
            onClick={() => childId && onConfirm(childId)}
            className="px-4 py-2 rounded-lg bg-[#F64E60] text-white hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
