"use client";

import { useState } from "react";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { Eye, EyeOff, Lock, ChevronLeft, Save } from "lucide-react";
import { updatePassword } from "@/lib/api/profile";
import Link from "next/link";

export default function PasswordOrangtuaPage() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      alert("Semua field harus diisi.");
      return;
    }

    if (newPass !== confirmPass) {
      alert("Konfirmasi password tidak cocok.");
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
        alert("Password berhasil diubah!");
        setOldPass("");
        setNewPass("");
        setConfirmPass("");
      } else {
        alert(res?.message || "Gagal mengubah password");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengubah password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-md">
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm md:shadow-lg border border-gray-100 mt-4 md:mt-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#EAF4F0] p-3 rounded-full mb-3">
            <Lock className="text-[#4A8B73] w-6 h-6" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#3A6B58] text-center">
            Ubah Password
          </h2>
          <p className="text-gray-400 text-sm text-center mt-1">
            Pastikan password baru Anda kuat dan aman
          </p>
        </div>

        <div className="space-y-5">
          {/* PASSWORD SAAT INI */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase ml-1">
              Password Saat Ini
            </label>
            <div className="relative">
              <input
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                type={showOld ? "text" : "password"}
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8EC3AA] focus:border-transparent outline-none transition-all text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4A8B73] transition-colors p-1"
              >
                {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* PASSWORD BARU */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase ml-1">
              Password Baru
            </label>
            <div className="relative">
              <input
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                type={showNew ? "text" : "password"}
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8EC3AA] focus:border-transparent outline-none transition-all text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4A8B73] transition-colors p-1"
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* KONFIRMASI PASSWORD */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase ml-1">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                type={showConfirm ? "text" : "password"}
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8EC3AA] focus:border-transparent outline-none transition-all text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4A8B73] transition-colors p-1"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* BUTTON GROUP */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-10 gap-3 pt-4 border-t border-gray-50">
            <Link
              href="/orangtua/profil"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold transition-all w-full sm:w-auto text-sm order-2 sm:order-1"
            >
              <ChevronLeft size={18} />
              <span>Kembali</span>
            </Link>

            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#8EC3AA] hover:bg-[#7AB399] text-white font-bold shadow-md shadow-[#8EC3AA]/20 disabled:opacity-50 transition-all w-full sm:w-auto text-sm order-1 sm:order-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                <>
                  <Save size={18} />
                  <span>Simpan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}