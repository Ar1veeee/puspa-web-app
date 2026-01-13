/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";

export default function UbahPasswordAdmin() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Semua field harus diisi.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      setLoading(true);
      await api.put("/profile/update-password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      toast.success("Password berhasil diubah!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f9fc]">
    
      <div className="flex-1 flex flex-col items-center">
       
        <Toaster position="top-right" />
        <div className="bg-white rounded-xl p-6 shadow-md mt-6 w-full max-w-md">
          <h2 className="text-xl font-semibold text-[#2D2A55] text-center">
            Ubah Password
          </h2>

          <div className="mt-4 space-y-4">
            {/* Password Saat Ini */}
            <div>
              <label className="text-sm font-semibold">Password Saat Ini</label>
              <div className="relative mt-1">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border w-full px-3 py-2 rounded"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Baru */}
            <div>
              <label className="text-sm font-semibold">Password Baru</label>
              <div className="relative mt-1">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border w-full px-3 py-2 rounded"
                  placeholder="Masukkan password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="text-sm font-semibold">Konfirmasi Password</label>
              <div className="relative mt-1">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border w-full px-3 py-2 rounded"
                  placeholder="Konfirmasi password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <div className="flex flex-col sm:flex-row justify-between mt-4 gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 rounded bg-[#8BC3B8] text-white disabled:opacity-50 w-full sm:w-auto"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
