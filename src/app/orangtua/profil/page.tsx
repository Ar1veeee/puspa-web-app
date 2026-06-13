"use client";

import React, { useEffect, useState } from "react";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { getParentProfile, updateParentProfile } from "@/lib/api/profile";
import { useProfile } from "@/context/ProfileContext";
import { User, Edit3, Camera } from "lucide-react";

export default function ProfileOrangtuaPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [guardianId, setGuardianId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { refreshProfile } = useProfile();

  interface FormData {
    guardian_name: string;
    guardian_type: string;
    relationship_with_child: string;
    relationship_with_child_detail?: string;
    guardian_birth_date: string;
    guardian_phone: string;
    email: string;
    guardian_occupation: string;
    role: string;
    profile_picture: string | null;
  }

  const [formData, setFormData] = useState<FormData>({
    guardian_name: "",
    guardian_type: "",
    relationship_with_child: "",
    guardian_birth_date: "",
    guardian_phone: "",
    email: "",
    guardian_occupation: "",
    role: "",
    profile_picture: null,
  });

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await getParentProfile(token);
      if (res?.success && res.data) {
        const d = res.data;
        setGuardianId(d.guardian_id);

        setFormData({
          guardian_name: d.guardian_name || "",
          guardian_type: d.guardian_type || "",
          relationship_with_child: d.relationship_with_child || "",
          guardian_birth_date: d.guardian_birth_date
            ? d.guardian_birth_date.split("-").reverse().join("-")
            : "",

          guardian_phone: d.guardian_phone || "",
          email: d.email || "",
          guardian_occupation: d.guardian_occupation || "",
          role: d.role || "",
          profile_picture: d.profile_picture || null,
        });
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const formatDateToBE = (date: string) => {
      if (!date) return "";
      const [y, m, d] = date.split("-");
      return `${d}-${m}-${y}`;
    };

    const fd = new FormData();
    if (selectedFile) fd.append("file", selectedFile);

    fd.append("guardian_name", formData.guardian_name);
    fd.append("guardian_type", formData.guardian_type);
    fd.append("relationship_with_child", formData.relationship_with_child);
    fd.append(
      "relationship_with_child_detail",
      formData.relationship_with_child_detail || ""
    );
    fd.append(
      "guardian_birth_date",
      formatDateToBE(formData.guardian_birth_date)
    );

    fd.append("guardian_phone", formData.guardian_phone);
    fd.append("email", formData.email);
    fd.append("guardian_occupation", formData.guardian_occupation);

    const res = await updateParentProfile(guardianId, fd);

    if (res?.success) {
      alert("Profil berhasil diperbarui!");
      setIsEditing(false);

      if (res.data?.profile_picture) {
        setFormData((prev) => ({
          ...prev,
          profile_picture: res.data.profile_picture,
        }));
      }

      refreshProfile();
    }
  };

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-6xl">
      <div className="text-[#1E5C58]">
        {!isEditing ? (
          <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
            {/* Foto profil Section */}
            <div className="flex flex-col items-center text-center p-6 border border-teal-50 rounded-3xl bg-white w-full md:w-1/3 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <div className="relative mt-6">
                {formData.profile_picture ? (
                  <img
                    src={formData.profile_picture}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-teal-50 shadow-md"
                    alt="Foto Profil"
                  />
                ) : (
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-teal-50/50 rounded-full flex items-center justify-center border-4 border-teal-50">
                    <User className="w-12 h-12 md:w-16 md:h-16 text-[#2B7A75]" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-extrabold text-[#1E5C58] mt-6 line-clamp-1">
                {formData.guardian_name}
              </h2>
              <span className="px-3 py-1 bg-teal-55/10 text-[#2B7A75] text-xs font-bold rounded-full mt-2 uppercase tracking-wide">
                {formData.role || "Orang Tua"}
              </span>
            </div>

            {/* Info profil Section */}
            <div className="flex-1 border border-teal-50 rounded-3xl p-6 md:p-8 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-[#1E5C58] text-lg">Informasi Pribadi</h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-white bg-[#2B7A75] hover:bg-[#1E5C58] transition-all px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-teal-500/10 active:scale-95 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profil</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Nama Lengkap</p>
                  <p className="text-gray-700 font-bold truncate">{formData.guardian_name || "-"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Hubungan</p>
                  <p className="text-gray-700 font-bold">{formData.relationship_with_child || "-"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Tanggal Lahir</p>
                  <p className="text-gray-700 font-bold">{formData.guardian_birth_date || "-"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Nomor Telepon</p>
                  <p className="text-gray-700 font-bold">{formData.guardian_phone || "-"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Alamat Email</p>
                  <p className="text-[#2B7A75] font-bold truncate">{formData.email || "-"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">User Role</p>
                  <p className="text-gray-700 font-bold capitalize">{formData.role || "-"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Pekerjaan</p>
                  <p className="text-gray-700 font-bold">{formData.guardian_occupation || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-teal-50 rounded-3xl p-6 md:p-8 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h2 className="text-xl font-extrabold text-[#1E5C58] mb-6 border-b border-gray-100 pb-4">
              Edit Informasi Pribadi
            </h2>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Foto dan upload */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative group">
                  {selectedFile ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-[#2B7A75]"
                      alt="Preview"
                    />
                  ) : formData.profile_picture ? (
                    <img
                      src={formData.profile_picture}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-[#2B7A75]"
                      alt="Foto Profil"
                    />
                  ) : (
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-teal-50/50 rounded-full flex items-center justify-center border-4 border-dashed border-teal-200">
                      <User className="w-12 h-12 text-[#2B7A75]" />
                    </div>
                  )}
                  <label className="absolute bottom-1 right-1 bg-[#2B7A75] hover:bg-[#1E5C58] p-2.5 rounded-full text-white cursor-pointer shadow-lg transition-all active:scale-90">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
                <p className="mt-4 text-[10px] font-bold text-gray-400 text-center max-w-[150px] uppercase tracking-wide">
                  Ubah Foto Profil
                </p>
              </div>

              {/* Form input */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nama Lengkap</label>
                  <input
                    name="guardian_name"
                    value={formData.guardian_name}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700 bg-white"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nomor Telepon</label>
                  <input
                    name="guardian_phone"
                    value={formData.guardian_phone}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700 bg-white"
                    placeholder="Contoh: 0812..."
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Hubungan</label>
                  <input
                    name="relationship_with_child"
                    value={formData.relationship_with_child}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700 bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Pekerjaan</label>
                  <input
                    name="guardian_occupation"
                    value={formData.guardian_occupation}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700 bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700 bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="guardian_birth_date"
                    value={formData.guardian_birth_date}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Button aksi */}
            <div className="flex flex-col sm:flex-row justify-end mt-10 gap-3 border-t border-gray-100 pt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold transition-all w-full sm:w-auto text-xs cursor-pointer"
              >
                Batal
              </button>

              <button
                onClick={handleUpdate}
                className="px-6 py-3 rounded-xl bg-[#2B7A75] hover:bg-[#1E5C58] text-white font-bold shadow-md shadow-teal-500/10 transition-all w-full sm:w-auto text-xs active:scale-95 cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        )}
      </div>
    </ResponsiveOrangtuaLayout>
  );
}