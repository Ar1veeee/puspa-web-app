"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const bidangOptions = ["Fisioterapi", "Okupasi Terapi", "Terapi Wicara", "Paedagog"];

export default function FormTambahTerapis({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    nama: string;
    bidang: string;
    username: string;
    email: string;
    telepon: string;
    password: string;
  }) => void;
}) {
  const [formData, setFormData] = useState({
    nama: "",
    bidang: "",
    username: "",
    email: "",
    telepon: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi sederhana
    if (
      !formData.nama ||
      !formData.bidang ||
      !formData.username ||
      !formData.email ||
      !formData.telepon ||
      !formData.password
    ) {
      alert("Semua field wajib diisi!");
      return;
    }

    onSave(formData);

    // Reset form setelah submit
    setFormData({
      nama: "",
      bidang: "",
      username: "",
      email: "",
      telepon: "",
      password: "",
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px] p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-[#36315B] hover:text-[#81B7A9]"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-[#36315B] mb-4">Tambah Data Terapis</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
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
          </div>

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
          </div>

          <div>
            <label className="block text-sm text-[#36315B] mb-1">Nama Pengguna</label>
            <input
              type="text"
              name="username"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

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
          </div>

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
          </div>

          <div>
            <label className="block text-sm text-[#36315B] mb-1">Password</label>
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
          </div>

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
  );
}
