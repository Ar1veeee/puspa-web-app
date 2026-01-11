"use client";

import { useState } from "react";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { Eye, EyeOff } from "lucide-react";
import { updatePassword } from "@/lib/api/profile";

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

        // reset form
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
        <div className="flex min-h-screen bg-gray-50 text-[#36315B]">
          <SidebarTerapis />
    
          <div className="flex-1 flex flex-col">
            <HeaderTerapis />
    
            <main className="p-8">
           
          <div className="bg-white rounded-xl p-6 shadow-md max-w-xl mx-auto mt-4">
            <h2 className="text-xl font-semibold text-[#4A8B73] text-center">
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
                  className="border w-full px-3 py-2 rounded"
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
                  className="border w-full px-3 py-2 rounded"
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
                  className="border w-full px-3 py-2 rounded"
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
                  className="px-4 py-2 rounded bg-gray-300"
                >
                  Kembali
                </a>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 rounded bg-[#8EC3AA] text-white disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
