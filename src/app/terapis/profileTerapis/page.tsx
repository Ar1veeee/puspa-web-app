/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { updateProfileWithPhoto } from "@/lib/api/ProfileTerapis";
import { useTherapistProfile } from "@/context/ProfileTerapisContext";

export default function ProfilePage() {
  const { profile, refreshProfile } = useTherapistProfile();

  const [form, setForm] = useState({
    therapist_name: "",
    therapist_phone: "",
    email: "",
    therapist_birth_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // =====================================
  // LOAD PROFILE
  // =====================================
  useEffect(() => {
    if (!profile) {
      setLoading(true);
      return;
    }

    setForm({
      therapist_name: profile.therapist_name ?? "",
      therapist_phone: profile.therapist_phone ?? "",
      email: profile.email ?? "",
      therapist_birth_date: profile.therapist_birth_date ?? "",
    });

    setPreviewUrl(
      profile.profile_picture && profile.profile_picture !== ""
        ? `${profile.profile_picture}?t=${Date.now()}`
        : null
    );

    setLoading(false);
  }, [profile]);

  // =====================================
  // FORM INPUT
  // =====================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setUpdateSuccess(false);
    setUpdateError(null);
  };

  // =====================================
  // FOTO
  // =====================================
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // =====================================
  // SUBMIT
  // =====================================
  const handleSubmit = async () => {
    if (!profile?.therapist_id) {
      setUpdateError("ID terapis tidak ditemukan.");
      return;
    }

    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const formData = new FormData();

      formData.append("therapist_name", form.therapist_name);
      formData.append("therapist_phone", form.therapist_phone);
      formData.append("email", form.email);
      formData.append("therapist_birth_date", form.therapist_birth_date);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await updateProfileWithPhoto(profile.therapist_id, formData);
      await refreshProfile();

      setSelectedFile(null);
      setUpdateSuccess(true);
    } catch (err: any) {
      setUpdateError(err?.message || "Gagal memperbarui profil.");
    } finally {
      setUpdating(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================
  if (loading) {
    return (
      <p className="text-[#36315B] flex justify-center items-center min-h-screen">
        Loading...
      </p>
    );
  }

  // =====================================
  // UI
  // =====================================
  return (
    <div className="flex min-h-screen bg-gray-100 text-[#36315B]">
      <SidebarTerapis />

      <div className="flex-1">
        <HeaderTerapis />

        <main className="p-10 flex flex-col items-center">
          {!isEditing ? (
            /* ================= VIEW MODE ================= */
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-5xl w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* FOTO */}
                <div className="flex flex-col items-center text-center p-6 shadow rounded-xl bg-white">
                  <div className="w-44 h-44 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-100">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Foto Profil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-20 h-20 text-gray-400" />
                    )}
                  </div>

                  <h2 className="text-xl font-semibold text-[#4A8B73] mt-4">
                    {profile?.therapist_name}
                  </h2>
                  <p className="text-gray-500 text-sm">Terapis</p>
                </div>

                {/* DETAIL */}
                <div className="shadow rounded-xl p-6 bg-white relative">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute right-6 top-4 text-white bg-[#8EC3AA] px-4 py-1 rounded-full text-sm"
                  >
                    Edit
                  </button>

                  <div className="grid grid-cols-2 gap-y-3 text-sm mt-6">
                    <p className="font-semibold">Nama</p>
                    <p>{profile?.therapist_name}</p>

                    <p className="font-semibold">Tanggal Lahir</p>
                    <p>{profile?.therapist_birth_date}</p>

                    <p className="font-semibold">Telepon</p>
                    <p>{profile?.therapist_phone}</p>

                    <p className="font-semibold">Email</p>
                    <p>{profile?.email}</p>

                    <p className="font-semibold">Role</p>
                    <p>{profile?.role}</p>

                    <p className="font-semibold">Bidang Terapis</p>
                    <p className="capitalize">{profile?.therapist_section}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================= EDIT MODE ================= */
            <div className="w-full max-w-4xl">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Informasi Pribadi
              </h2>

              <div className="bg-white border border-green-200 rounded-lg p-10 flex gap-12">
                {/* FOTO */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-32 h-32 relative rounded-full overflow-hidden border border-green-200 flex items-center justify-center bg-gray-100">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Foto Profil"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>

                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="fileInput"
                    className="mt-4 px-4 py-2 border border-green-200 rounded text-green-600 hover:bg-green-50 cursor-pointer"
                  >
                    Pilih Foto
                  </label>
                </div>

                {/* FORM */}
                <div className="flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <input
                      name="therapist_name"
                      value={form.therapist_name}
                      onChange={handleChange}
                      className="p-3 border rounded"
                      placeholder="Nama"
                    />
                    <input
                      type="date"
                      name="therapist_birth_date"
                      value={form.therapist_birth_date}
                      onChange={handleChange}
                      className="p-3 border rounded"
                    />
                    <input
                      name="therapist_phone"
                      value={form.therapist_phone}
                      onChange={handleChange}
                      className="p-3 border rounded"
                      placeholder="Telepon"
                    />
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="p-3 border rounded"
                      placeholder="Email"
                    />
                  </div>

                  <div className="mt-auto flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedFile(null);
                        setPreviewUrl(
                          profile?.profile_picture
                            ? `${profile.profile_picture}?t=${Date.now()}`
                            : null
                        );
                      }}
                      className="px-6 py-3 bg-gray-300 rounded"
                    >
                      Batal
                    </button>

                    <button
                      disabled={updating}
                      onClick={async () => {
                        await handleSubmit();
                        setIsEditing(false);
                      }}
                      className="px-6 py-3 bg-green-500 text-white rounded"
                    >
                      {updating ? "Memperbarui..." : "Perbarui"}
                    </button>
                  </div>
                </div>
              </div>

              {updateError && <p className="mt-4 text-red-600">{updateError}</p>}
              {updateSuccess && (
                <p className="mt-4 text-green-600">
                  Profil berhasil diperbarui!
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}