"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const bidangOptions = [
  "Fisioterapi",
  "Okupasi Terapi",
  "Terapi Wicara",
  "Paedagog",
];

type FormState = {
  nama: string;
  bidang: string;
  username: string;
  email: string;
  telepon: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function FormTambahTerapis({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormState) => void;
}) {
  const [formData, setFormData] = useState<FormState>({
    nama: "",
    bidang: "",
    username: "",
    email: "",
    telepon: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= VALIDASI =================
  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama wajib diisi";
    }

    if (!formData.bidang) {
      newErrors.bidang = "Bidang wajib dipilih";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Nama pengguna wajib diisi";
    } else if (/\s/.test(formData.username)) {
      newErrors.username = "Nama pengguna tidak boleh mengandung spasi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.telepon.trim()) {
      newErrors.telepon = "Nomor telepon wajib diisi";
    } else if (!/^[0-9]+$/.test(formData.telepon)) {
      newErrors.telepon = "Nomor telepon hanya boleh angka";
    } else if (formData.telepon.length < 8) {
      newErrors.telepon = "Nomor telepon minimal 8 digit";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password harus mengandung 1 huruf kapital";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
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

    onSave(formData);

    setFormData({
      nama: "",
      bidang: "",
      username: "",
      email: "",
      telepon: "",
      password: "",
    });
    setErrors({});
  };

  return (
<div className="fixed inset-0 z-50 overflow-y-auto">
  <div className="flex min-h-screen items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg w-[400px] p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-[#36315B] hover:text-[#81B7A9]"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-[#36315B] mb-4">
          Tambah Data Terapis
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nama */}
          <div>
            <label className="block text-sm text-[#36315B] mb-1">Nama</label>
            <input
              type="text"
              name="nama"
              placeholder="Masukkan nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
            {errors.nama && (
              <p className="text-xs text-red-500 mt-1">{errors.nama}</p>
            )}
          </div>

          {/* Bidang */}
          <div>
            <label className="block text-sm text-[#36315B] mb-1">Bidang</label>
            <select
              name="bidang"
              value={formData.bidang}
              onChange={handleChange}
              className="w-full border rounded p-2 cursor-pointer"
            >
              <option value="">Pilih Bidang</option>
              {bidangOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {errors.bidang && (
              <p className="text-xs text-red-500 mt-1">{errors.bidang}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm text-[#36315B] mb-1">
              Nama Pengguna
            </label>
            <input
              type="text"
              name="username"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">
                {errors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-[#36315B] mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Masukkan email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Telepon */}
          <div>
            <label className="block text-sm text-[#36315B] mb-1">Telepon</label>
            <input
              type="text"
              name="telepon"
              placeholder="Masukkan nomor telepon"
              value={formData.telepon}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
            {errors.telepon && (
              <p className="text-xs text-red-500 mt-1">
                {errors.telepon}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-[#36315B] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Buat Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded p-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#36315B]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Action */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-[#36315B] hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#81B7A9] text-white rounded hover:bg-[#36315B]"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
</div>
  );
}
