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
    password: string;
  }) => void;
}

type FormState = {
  admin_name: string;
  email: string;
  admin_phone: string;
  username: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function FormTambahAdmin({
  open,
  onClose,
  onSave,
}: FormTambahAdminProps) {
  const [form, setForm] = useState<FormState>({
    admin_name: "",
    email: "",
    admin_phone: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  if (!open) return null;

  // ================= VALIDASI =================
  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.admin_name.trim()) {
      newErrors.admin_name = "Nama lengkap wajib diisi";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!form.admin_phone.trim()) {
      newErrors.admin_phone = "Nomor telepon wajib diisi";
    } else if (!/^[0-9]+$/.test(form.admin_phone)) {
      newErrors.admin_phone = "Nomor telepon hanya boleh angka";
    } else if (form.admin_phone.length < 8) {
      newErrors.admin_phone = "Nomor telepon minimal 8 digit";
    }

    if (!form.username.trim()) {
      newErrors.username = "Nama pengguna wajib diisi";
    } else if (/\s/.test(form.username)) {
      newErrors.username = "Nama pengguna tidak boleh mengandung spasi";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password wajib diisi";
    } else if (form.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Password harus mengandung 1 huruf kapital";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
      newErrors.password = "Password harus mengandung 1 simbol";
    }

    return newErrors;
  };

  // ================= SUBMIT =================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    onSave(form);

    setForm({
      admin_name: "",
      email: "",
      admin_phone: "",
      username: "",
      password: "",
    });
    setErrors({});
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
        <h2 className="text-xl font-semibold text-[#36315B] mb-6">
          Tambah Data Admin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={form.admin_name}
              onChange={(e) =>
                setForm({ ...form, admin_name: e.target.value })
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#81B7A9] outline-none"
            />
            {errors.admin_name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.admin_name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#81B7A9] outline-none"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Telepon */}
          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">
              Telepon
            </label>
            <input
              type="text"
              placeholder="Masukkan nomor telepon"
              value={form.admin_phone}
              onChange={(e) =>
                setForm({ ...form, admin_phone: e.target.value })
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#81B7A9] outline-none"
            />
            {errors.admin_phone && (
              <p className="text-xs text-red-500 mt-1">
                {errors.admin_phone}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">
              Nama Pengguna
            </label>
            <input
              type="text"
              placeholder='Buat nama pengguna “admin(Nama)”'
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#81B7A9] outline-none"
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">
                {errors.username}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Buat Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#81B7A9] outline-none"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Action */}
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
