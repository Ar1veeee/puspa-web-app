"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { updatePassword } from "@/lib/api/profile";
import { handleApiError, showSuccessToast } from "@/lib/api-error";

export default function PasswordOrangtuaPage() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [loading, setLoading] = useState(false);

  // ============================
  //   HANDLE SUBMIT PASSWORD
  // ============================
  const handleSave = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      handleApiError(null, "Semua field harus diisi.");
      return;
    }

    if (newPass !== confirmPass) {
      handleApiError(null, "Konfirmasi password tidak cocok.");
      return;
    }

    try {
      setLoading(true);

      const res = await updatePassword({
        current_password: oldPass,
        password: newPass,
        password_confirmation: confirmPass,
      });

      if (res?.success) {
        showSuccessToast("Password berhasil diubah!");

        // reset form
        setOldPass("");
        setNewPass("");
        setConfirmPass("");
      } else {
        handleApiError(res, "Gagal mengubah password");
      }
    } catch (err) {
      handleApiError(err, "Terjadi kesalahan saat mengubah password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-[#1E5C58]">
      <div className="bg-white rounded-xl p-6 shadow-md max-w-xl mx-auto mt-4 border border-teal-50">
        <h2 className="text-xl font-semibold text-[#2B7A75] text-center">
          Ubah Password
        </h2>

        <div className="mt-6">
          {/* PASSWORD SAAT INI */}
          <label className="text-sm font-semibold">Password Saat Ini</label>
          <div className="relative mt-1">
            <input
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              type={showOld ? "text" : "password"}
              className="border w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75]"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* PASSWORD BARU */}
          <label className="text-sm font-semibold mt-4 block">
            Password Baru
          </label>
          <div className="relative mt-1">
            <input
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              type={showNew ? "text" : "password"}
              className="border w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75]"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* KONFIRMASI PASSWORD */}
          <label className="text-sm font-semibold mt-4 block">
            Konfirmasi Password
          </label>
          <div className="relative mt-1">
            <input
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              type={showConfirm ? "text" : "password"}
              className="border w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75]"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* BUTTON */}
          <div className="flex justify-between mt-6">
            <a
              href="/terapis/profileTerapis"
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-300 transition"
            >
              Kembali
            </a>

            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 rounded bg-[#2B7A75] hover:bg-[#1E5C58] text-white disabled:opacity-50 font-semibold text-sm transition"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
