"use client";
import React, { useState, useEffect } from "react";

interface FormUbahTerapisProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: {
    nama: string;
    bidang: string;
    username: string;
    email: string;
    telepon: string;
  }) => void;
  initialData?: {
    nama: string;
    bidang: string;
    username: string;
    email: string;
    telepon: string;
  };
}

const bidangOptions = ["Fisioterapi", "Okupasi Terapi", "Terapi Wicara", "Paedagog"];

export default function FormUbahTerapis({
  open,
  onClose,
  onUpdate,
  initialData,
}: FormUbahTerapisProps) {
  const [formData, setFormData] = useState({
    nama: "",
    bidang: "",
    username: "",
    email: "",
    telepon: "",
  });

  useEffect(() => {
    if (initialData && open) {
      setFormData({
        nama: initialData.nama || "",
        bidang: initialData.bidang || "",
        username: initialData.username || "",
        email: initialData.email || "",
        telepon: initialData.telepon || "",
      });
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.nama ||
      !formData.bidang ||
      !formData.username ||
      !formData.email ||
      !formData.telepon
    ) {
      alert("Semua field wajib diisi!");
      return;
    }

    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparents z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-[#36315B] hover:text-[#81B7A9]"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-[#36315B]">
          Ubah Data Terapis
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">
              Nama
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#81B7A9]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">
              Bidang
            </label>
            <select
              name="bidang"
              value={formData.bidang}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#81B7A9]"
            >
              <option value="">Pilih bidang</option>
              {bidangOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#81B7A9]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#81B7A9]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#36315B] mb-1">
              Telepon
            </label>
            <input
              type="text"
              name="telepon"
              value={formData.telepon}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#81B7A9]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#36315B] text-[#36315B] hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#81B7A9] text-white hover:bg-[#36315B]"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
