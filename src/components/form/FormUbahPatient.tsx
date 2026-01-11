"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface FormUbahPatientProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (data: {
        child_name: string;
        child_birth_date: string; // ← WAJIB
        child_gender?: string | null;
        child_school: string;
        child_address: string;

        father_identity_number?: string | null;
        father_name?: string | null;
        father_phone?: string | null;
        father_birth_date?: string | null;
        father_occupation?: string | null;
        father_relationship?: string | null;

        mother_identity_number?: string | null;
        mother_name?: string | null;
        mother_phone?: string | null;
        mother_birth_date?: string | null;
        mother_occupation?: string | null;
        mother_relationship?: string | null;

        guardian_identity_number?: string | null;
        guardian_name?: string | null;
        guardian_phone?: string | null;
        guardian_birth_date?: string | null;
        guardian_occupation?: string | null;
        guardian_relationship?: string | null;

        child_complaint?: string;
        child_service_choice?: string;
    }) => void;


    initialData?: {
        child_name: string;
        child_birth_info: string;
        child_birth_date: string;

        child_age: string;
        child_gender?: string | null;
        child_school: string;
        child_address: string;

        father_identity_number: string;
        father_name: string;
        father_phone: string;
        father_birth_date: string;
        father_occupation: string;
        father_relationship: string;

        mother_identity_number: string;
        mother_name: string;
        mother_phone: string;
        mother_birth_date: string;
        mother_occupation: string;
        mother_relationship: string;

        guardian_identity_number: string;
        guardian_name: string;
        guardian_phone: string;
        guardian_birth_date: string;
        guardian_occupation: string;
        guardian_relationship: string;

        child_complaint: string;
        child_service_choice: string;
    };
}

const toISODate = (value?: string) => {
  if (!value || value === "-") return "";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

const parseBirthInfo = (str?: string) => {
  if (!str) return { place: "", date: "" };
  const [place, date] = str.split(", ");
  return { place: place || "", date: date || "" };
};


export default function FormUbahPatient({ open, onClose, onUpdate, initialData }: FormUbahPatientProps) {
    const [form, setForm] = useState({
        child_name: "",
        child_birth_date: "", // ← GANTI
        child_gender: "",
        
        child_school: "",
        child_address: "",

        father_identity_number: "",
        father_name: "",
        father_phone: "",
        father_birth_date: "",
        father_occupation: "",
        father_relationship: "Ayah",

        mother_identity_number: "",
        mother_name: "",
        mother_phone: "",
        mother_birth_date: "",
        mother_occupation: "",
        mother_relationship: "Ibu",

        guardian_identity_number: "",
        guardian_name: "",
        guardian_phone: "",
        guardian_birth_date: "",
        guardian_occupation: "",
        guardian_relationship: "",

        child_complaint: "",
        child_service_choice: "",
    });


 useEffect(() => {
  if (!initialData) return;

  const parsed = parseBirthInfo(initialData.child_birth_info);

  setForm({
    child_name: initialData.child_name ?? "",
    child_birth_date: toISODate(parsed.date), // 🔥 FIX UTAMA
    child_gender: initialData.child_gender ?? "",
    child_school: initialData.child_school ?? "",
    child_address: initialData.child_address ?? "",

    father_identity_number: initialData.father_identity_number ?? "",
    father_name: initialData.father_name ?? "",
    father_phone: initialData.father_phone ?? "",
    father_birth_date: toISODate(initialData.father_birth_date),
    father_occupation: initialData.father_occupation ?? "",
    father_relationship: "Ayah",

    mother_identity_number: initialData.mother_identity_number ?? "",
    mother_name: initialData.mother_name ?? "",
    mother_phone: initialData.mother_phone ?? "",
    mother_birth_date: toISODate(initialData.mother_birth_date),
    mother_occupation: initialData.mother_occupation ?? "",
    mother_relationship: "Ibu",

    guardian_identity_number: initialData.guardian_identity_number ?? "",
    guardian_name: initialData.guardian_name ?? "",
    guardian_phone: initialData.guardian_phone ?? "",
    guardian_birth_date: toISODate(initialData.guardian_birth_date),
    guardian_occupation: initialData.guardian_occupation ?? "",
    guardian_relationship: initialData.guardian_relationship ?? "",

    child_complaint: initialData.child_complaint ?? "",
    child_service_choice: initialData.child_service_choice ?? "",
  });
}, [initialData]);



    if (!open) return null;

    const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.child_birth_date || form.child_birth_date.trim() === "") {
    alert("Tanggal lahir anak wajib diisi");
    return;
  }

  const emptyToString = (v?: string | null) => v ?? "";

onUpdate({
  child_name: form.child_name,
  child_birth_date: form.child_birth_date,
  child_gender: form.child_gender || null,
  child_school: form.child_school || "",
  child_address: form.child_address || "",

  father_identity_number: emptyToString(form.father_identity_number),
  father_name: emptyToString(form.father_name),
  father_phone: emptyToString(form.father_phone),
  father_birth_date: form.father_birth_date || null,
  father_occupation: emptyToString(form.father_occupation),
  father_relationship: form.father_relationship || "Ayah",

  mother_identity_number: emptyToString(form.mother_identity_number),
  mother_name: emptyToString(form.mother_name),
  mother_phone: emptyToString(form.mother_phone),
  mother_birth_date: form.mother_birth_date || null,
  mother_occupation: emptyToString(form.mother_occupation),
  mother_relationship: form.mother_relationship || "Ibu",

  guardian_identity_number: form.guardian_identity_number || null,
  guardian_name: form.guardian_name || null,
  guardian_phone: form.guardian_phone || null,
  guardian_birth_date: form.guardian_birth_date || null,
  guardian_occupation: form.guardian_occupation || null,
  guardian_relationship: form.guardian_relationship || null,

  child_complaint: form.child_complaint || "",
  child_service_choice: form.child_service_choice || "",
});

};



    return (
  <motion.div
    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.div
      className="bg-white rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >     \
     <div className="p-6 border-b">

                <h2 className="text-xl font-semibold mb-4 text-[#36315B]">
                    Ubah Data Pasien
                </h2>
                </div>

                <form onSubmit={handleSubmit}         
                className="p-6 overflow-y-auto space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#36315B] mb-1">Nama</label>
                            <input
                                type="text"
                                value={form.child_name}
                                onChange={(e) => setForm({ ...form, child_name: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#81B7A9] outline-none"
                                required
                            />
                        </div>

                         <div>
                        <label className="block text-sm font-medium text-[#36315B] mb-1">Alamat</label>
                        <input
                            type="text"
                            name="child_address"
                            value={form.child_address}
                            onChange={(e) => setForm({ ...form, child_address: e.target.value })}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#36315B] mb-1">Tanggal Lahir</label>
                            <input
                                type="date"
                                value={form.child_birth_date}
                                onChange={(e) =>
                                    setForm({ ...form, child_birth_date: e.target.value })
                                }
                                className="w-full border rounded-lg p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#36315B] mb-1">Jenis Kelamin</label>
                            <select
                                name="child_gender"
                                value={form.child_gender}
                                onChange={(e) => setForm({ ...form, child_gender: e.target.value })}
                                className="w-full border rounded-lg p-2"
                            >
                                <option value="">Pilih Jenis Kelamin</option>
                                <option value="laki-laki">Laki-laki</option>
                                <option value="perempuan">Perempuan</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#36315B] mb-1">Usia</label>
                            <input
                                value={initialData?.child_age ?? "-"}
                                readOnly
                                className="w-full border rounded-lg p-2 bg-gray-100"
                            />

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#36315B] mb-1">Asal Sekolah</label>
                            <input
                                name="child_school"
                                value={form.child_school}
                                onChange={(e) => setForm({ ...form, child_school: e.target.value })}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Informasi Orangtua / Wali</h3>

                        <div className="border rounded-lg p-4 mb-4">
                            <h4 className="font-semibold mb-2">Ayah</h4>

                            <label className="block text-sm font-medium text-[#36315B] mb-1">Nama Ayah</label>
                            <input
                                name="father_name"
                                value={form.father_name}
                                onChange={(e) => setForm({ ...form, father_name: e.target.value })}
                                className="w-full border rounded-lg p-2 mb-3"
                            />

                            <label className="block text-sm font-medium text-[#36315B] mb-1">Hubungan</label>
                            <input
                                readOnly
                                value="Ayah"
                                className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#36315B] mb-1">Tanggal Lahir</label>
                                    <input
                                        name="father_birth_date"
                                        value={form.father_birth_date}
                                        onChange={(e) => setForm({ ...form, father_birth_date: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#36315B] mb-1">Pekerjaan</label>
                                    <input
                                        name="father_occupation"
                                        value={form.father_occupation}
                                        onChange={(e) => setForm({ ...form, father_occupation: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <div>
                                    <label className="block text-sm font-medium text-[#36315B] mb-1">Nomor Telepon</label>
                                    <input
                                        name="father_phone"
                                        value={form.father_phone}
                                        onChange={(e) => setForm({ ...form, father_phone: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#36315B] mb-1">NIK</label>
                                    <input
                                        name="father_identity_number"
                                        value={form.father_identity_number}
                                        onChange={(e) => setForm({ ...form, father_identity_number: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="border rounded-lg p-4 mb-4">
                            <h4 className="font-semibold mb-2">Ibu</h4>

                            <label className="block text-sm font-medium text-[#36315B] mb-1">Nama Ibu</label>
                            <input
                                name="mother_name"
                                value={form.mother_name}
                                onChange={(e) => setForm({ ...form, mother_name: e.target.value })}
                                className="w-full border rounded-lg p-2 mb-3"
                            />

                            <label className="block text-sm font-medium text-[#36315B] mb-1">Hubungan</label>
                            <input
                                readOnly
                                value="Ibu"
                                className="w-full border rounded-lg p-2 bg-gray-100 mb-3"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#36315B] mb-1">Tanggal Lahir</label>
                                    <input
                                        name="mother_birth_date"
                                        value={form.mother_birth_date}
                                        onChange={(e) => setForm({ ...form, mother_birth_date: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#36315B] mb-1">Pekerjaan</label>
                                    <input
                                        name="mother_occupation"
                                        value={form.mother_occupation}
                                        onChange={(e) => setForm({ ...form, mother_occupation: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <div>
                                    <label className="block text-sm font-medium text-[#36315B] mb-1">Nomor Telepon</label>
                                    <input
                                        name="mother_phone"
                                        value={form.mother_phone}
                                        onChange={(e) => setForm({ ...form, mother_phone: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#36315B] mb-1">NIK</label>
                                    <input
                                        name="mother_identity_number"
                                        value={form.mother_identity_number}
                                        onChange={(e) => setForm({ ...form, mother_identity_number: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Wali (Opsional)</h4>

                            <label>Nama Wali</label>
                            <input
                                type="text"
                                value={form.guardian_name}
                                onChange={(e) =>
                                    setForm({ ...form, guardian_name: e.target.value })
                                }
                                className="w-full border rounded-lg p-2"
                            />



                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#36315B] mb-1">Hubungan</label>
                                    <input
                                        name="guardian_relationship"
                                        value={form.guardian_relationship}
                                        onChange={(e) => setForm({ ...form, guardian_relationship: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#36315B] mb-1">Tanggal Lahir</label>
                                    <input
                                        name="guardian_birth_date"
                                        value={form.guardian_birth_date}
                                        onChange={(e) => setForm({ ...form, guardian_birth_date: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <div>
                                    <label className="block text-sm font-medium text-[#36315B] mb-1">Nomor Telepon</label>
                                    <input
                                        name="guardian_phone"
                                        value={form.guardian_phone}
                                        onChange={(e) => setForm({ ...form, guardian_phone: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#36315B] mb-1">NIK</label>
                                    <input
                                        name="guardian_identity_number"
                                        value={form.guardian_identity_number}
                                        onChange={(e) => setForm({ ...form, guardian_identity_number: e.target.value })}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#36315B] mb-1">Keluhan</label>
                        <textarea
                            name="keluhan"
                            rows={3}
                            value={form.child_complaint}
                            onChange={(e) => setForm({ ...form, child_complaint: e.target.value })}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#36315B] mb-1">Layanan Terpilih</label>
                        <div className="w-full p-2 border rounded-md bg-gray-100 text-gray-700">
                            {form.child_service_choice || "-"}
                        </div>
                    </div>


                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-[#81B7A9] text-white"
                        >
                            Perbarui
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}