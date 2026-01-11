"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FormTambahAdminProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    admin_name: string;
    email: string;
    admin_phone: string;
    username: string;
    password?: string;
  }) => void;
}

export default function FormTambahAdmin({ open, onClose, onSave }: FormTambahAdminProps) {
  const [form, setForm] = useState({
    admin_name: "",
    email: "",
    admin_phone: "",
    username: "",
    password: "",
  });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setForm({ admin_name: "", email: "", admin_phone: "", username: "", password: "" });
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
        <h2 className="text-xl font-semibold text-[#36315B] mb-6">Tambah Data Admin</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
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
              placeholder="Masukkan email"
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
              placeholder="Masukkan nomor telepon"
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
              placeholder='Buat nama pengguna “admin(Nama)”'
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#81B7A9] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">Password</label>
            <input
              type="password"
              placeholder="Buat Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#81B7A9] outline-none"
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
              Simpan
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
