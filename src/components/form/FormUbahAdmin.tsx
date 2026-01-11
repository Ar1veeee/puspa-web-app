"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface FormUbahAdminProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: {
    admin_name: string;
    email: string;
    admin_phone: string;
    username: string;
  }) => void;
  initialData?: {
    admin_name: string;
    email: string;
    admin_phone: string;
    username: string;
  };
}

export default function FormUbahAdmin({ open, onClose, onUpdate, initialData }: FormUbahAdminProps) {
  const [form, setForm] = useState({
    admin_name: "",
    email: "",
    admin_phone: "",
    username: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(form);
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="text-xl font-semibold text-[#36315B] mb-2">Ubah Data Admin</h2>
        <p className="text-sm text-gray-600 mb-6">
          Nama Pengguna : <span className="font-medium">{initialData?.username}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={form.admin_name}
              onChange={(e) => setForm({ ...form, admin_name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#81B7A9] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#81B7A9] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">Telepon</label>
            <input
              type="text"
              value={form.admin_phone}
              onChange={(e) => setForm({ ...form, admin_phone: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#81B7A9] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">Nama Pengguna</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#81B7A9] outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#81B7A9] text-white hover:bg-[#6fa194]"
            >
              Perbarui
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
