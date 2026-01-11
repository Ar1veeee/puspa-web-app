/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";

// Sinkronkan interface ini agar cocok dengan ChildDetail dari API
interface BackendDetailAnak {
  child_id?: string;
  child_name: string;
  child_birth_date: string;
  child_age: string;
  child_gender: string;
  child_religion?: string | null; // Tambahkan | null
  child_school?: string | null;
  child_address?: string | null;

  father_identity_number?: string | null;
  father_name?: string | null;
  father_birth_date?: string | null;
  father_occupation?: string | null;
  father_phone?: string | null;
  father_relationship?: string | null;

  mother_identity_number?: string | null;
  mother_name?: string | null;
  mother_birth_date?: string | null;
  mother_occupation?: string | null;
  mother_phone?: string | null;
  mother_relationship?: string | null;

  // Properti Wali yang menyebabkan error
  guardian_identity_number?: string | null;
  guardian_name?: string | null; // Tambahkan | null
  guardian_birth_date?: string | null;
  guardian_occupation?: string | null;
  guardian_phone?: string | null;
  guardian_relationship?: string | null;

  child_complaint?: string | null;
  child_service_choice?: string | null;
}

const toISODate = (value?: string | null) => {
  if (!value || value === "-") return "";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

interface FormProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  initialData?: BackendDetailAnak;
}

export default function FormUbahPasien({
  open,
  onClose,
  onUpdate,
  initialData,
}: FormProps) {
  const [formData, setFormData] = useState({
    child_name: "",
    birth_place: "",
    birth_date: "",
    child_age: "",
    child_religion: "",
    child_gender: "",
    child_school: "",
    child_address: "",
    child_complaint: "",
    child_service_choice: "",

    father_name: "",
    father_birth_date: "",
    father_occupation: "",
    father_phone: "",
    father_relationship: "",
    father_identity_number: "",

    mother_name: "",
    mother_birth_date: "",
    mother_occupation: "",
    mother_phone: "",
    mother_relationship: "",
    mother_identity_number: "",

    guardian_name: "",
    guardian_birth_date: "",
    guardian_occupation: "",
    guardian_phone: "",
    guardian_relationship: "",
    guardian_identity_number: "",
  });

  useEffect(() => {
    if (!initialData) return;

    // Mapping data dari API ke state form
    setFormData({
      child_name: initialData.child_name || "",
      birth_place: "", // Jika ada field birth_place di API, petakan ke sini
      birth_date: toISODate(initialData.child_birth_date),
      child_age: initialData.child_age || "",
      child_religion: initialData.child_religion || "",
      child_gender: initialData.child_gender || "",
      child_school: initialData.child_school || "",
      child_address: initialData.child_address || "",
      child_complaint: initialData.child_complaint || "",
      child_service_choice: initialData.child_service_choice || "",

      father_name: initialData.father_name || "",
      father_birth_date: toISODate(initialData.father_birth_date),
      father_occupation: initialData.father_occupation || "",
      father_phone: initialData.father_phone || "",
      father_relationship: initialData.father_relationship || "Kandung",
      father_identity_number: initialData.father_identity_number || "",

      mother_name: initialData.mother_name || "",
      mother_birth_date: toISODate(initialData.mother_birth_date),
      mother_occupation: initialData.mother_occupation || "",
      mother_phone: initialData.mother_phone || "",
      mother_relationship: initialData.mother_relationship || "Kandung",
      mother_identity_number: initialData.mother_identity_number || "",

      guardian_name: initialData.guardian_name || "",
      guardian_birth_date: toISODate(initialData.guardian_birth_date),
      guardian_occupation: initialData.guardian_occupation || "",
      guardian_phone: initialData.guardian_phone || "",
      guardian_relationship: initialData.guardian_relationship || "",
      guardian_identity_number: initialData.guardian_identity_number || "",
    });
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      child_name: formData.child_name,
      child_birth_place: formData.birth_place,
      child_birth_date: formData.birth_date,
      child_gender: formData.child_gender,
      child_religion: formData.child_religion,
      child_school: formData.child_school,
      child_address: formData.child_address,
      child_complaint: formData.child_complaint,
      child_service_choice: formData.child_service_choice,

      father_identity_number: formData.father_identity_number,
      father_name: formData.father_name,
      father_phone: formData.father_phone,
      father_birth_date: formData.father_birth_date || null,
      father_occupation: formData.father_occupation,
      father_relationship: "Kandung",

      mother_identity_number: formData.mother_identity_number,
      mother_name: formData.mother_name,
      mother_phone: formData.mother_phone,
      mother_birth_date: formData.mother_birth_date || null,
      mother_occupation: formData.mother_occupation,
      mother_relationship: "Kandung",

      // Kirim null jika data wali kosong agar sesuai dengan database
      guardian_identity_number: formData.guardian_identity_number || null,
      guardian_name: formData.guardian_name || null,
      guardian_phone: formData.guardian_phone || null,
      guardian_birth_date: formData.guardian_birth_date || null,
      guardian_occupation: formData.guardian_occupation || null,
      guardian_relationship: formData.guardian_relationship || null,

      _method: "PUT",
    };

    onUpdate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4 text-[#36315B]">Ubah Data Pasien</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Input fields di sini sesuai kebutuhan UI Anda */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Anak</label>
              <input 
                name="child_name" 
                value={formData.child_name} 
                onChange={handleChange} 
                className="w-full border rounded-lg p-2 mt-1" 
              />
            </div>
            
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 py-2 bg-gray-200 rounded-lg font-bold"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="flex-1 py-2 bg-[#409E86] text-white rounded-lg font-bold"
              >
                Simpan
              </button>
            </div>
        </form>
      </div>
    </div>
  );
}