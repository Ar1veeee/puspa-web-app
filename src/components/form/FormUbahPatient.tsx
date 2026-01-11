"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PatientUpdatePayload } from "@/lib/api/data_pasien";

export interface FormUbahPatientProps {
    open: boolean;
    onClose: () => void;
    onUpdate: (data: PatientUpdatePayload) => void | Promise<void>;
    initialData?: Partial<PatientUpdatePayload> & {
        child_birth_info?: string;
        child_age?: string;
    };
}

const toISODate = (value?: string | null) => {
    if (!value || value === "-") return "";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

const parseBirthInfo = (str?: string) => {
    if (!str) return { place: "", date: "" };
    const parts = str.split(", ");
    return { place: parts[0] || "", date: parts[1] || "" };
};

export default function FormUbahPatient({ open, onClose, onUpdate, initialData }: FormUbahPatientProps) {
    const [form, setForm] = useState({
        child_name: "",
        child_birth_date: "",
        child_gender: "",
        child_school: "",
        child_address: "",
        father_identity_number: "",
        father_name: "",
        father_phone: "",
        father_birth_date: "",
        father_occupation: "",
        mother_identity_number: "",
        mother_name: "",
        mother_phone: "",
        mother_birth_date: "",
        mother_occupation: "",
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
            child_birth_date: initialData.child_birth_date ? toISODate(initialData.child_birth_date) : toISODate(parsed.date),
            child_gender: initialData.child_gender ?? "",
            child_school: initialData.child_school ?? "",
            child_address: initialData.child_address ?? "",
            father_identity_number: initialData.father_identity_number ?? "",
            father_name: initialData.father_name ?? "",
            father_phone: initialData.father_phone ?? "",
            father_birth_date: toISODate(initialData.father_birth_date),
            father_occupation: initialData.father_occupation ?? "",
            mother_identity_number: initialData.mother_identity_number ?? "",
            mother_name: initialData.mother_name ?? "",
            mother_phone: initialData.mother_phone ?? "",
            mother_birth_date: toISODate(initialData.mother_birth_date),
            mother_occupation: initialData.mother_occupation ?? "",
            guardian_identity_number: initialData.guardian_identity_number ?? "",
            guardian_name: initialData.guardian_name ?? "",
            guardian_phone: initialData.guardian_phone ?? "",
            guardian_birth_date: toISODate(initialData.guardian_birth_date),
            guardian_occupation: initialData.guardian_occupation ?? "",
            guardian_relationship: initialData.guardian_relationship ?? "",
            child_complaint: initialData.child_complaint ?? "",
            child_service_choice: initialData.child_service_choice ?? "",
        });
    }, [initialData, open]);

    if (!open) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const emptyToNull = (v: string) => v.trim() === "" ? null : v;

        onUpdate({
            ...form,
            child_gender: emptyToNull(form.child_gender),
            father_birth_date: emptyToNull(form.father_birth_date),
            mother_birth_date: emptyToNull(form.mother_birth_date),
            guardian_birth_date: emptyToNull(form.guardian_birth_date),
            guardian_identity_number: emptyToNull(form.guardian_identity_number),
            guardian_name: emptyToNull(form.guardian_name),
            guardian_phone: emptyToNull(form.guardian_phone),
            guardian_occupation: emptyToNull(form.guardian_occupation),
            guardian_relationship: emptyToNull(form.guardian_relationship),
        });
    };

    return (
        <motion.div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-[#36315B]">Ubah Data Pasien</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nama Anak</label>
                            <input type="text" value={form.child_name} onChange={(e) => setForm({ ...form, child_name: e.target.value })} className="w-full border rounded-lg p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Alamat</label>
                            <input type="text" value={form.child_address} onChange={(e) => setForm({ ...form, child_address: e.target.value })} className="w-full border rounded-lg p-2" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Tanggal Lahir Anak</label>
                            <input type="date" value={form.child_birth_date} onChange={(e) => setForm({ ...form, child_birth_date: e.target.value })} className="w-full border rounded-lg p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
                            <select value={form.child_gender} onChange={(e) => setForm({ ...form, child_gender: e.target.value })} className="w-full border rounded-lg p-2">
                                <option value="">Pilih</option>
                                <option value="laki-laki">Laki-laki</option>
                                <option value="perempuan">Perempuan</option>
                            </select>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-2">Data Orang Tua (Ayah & Ibu)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="Nama Ayah" value={form.father_name} onChange={(e) => setForm({ ...form, father_name: e.target.value })} className="border p-2 rounded-lg" />
                            <input placeholder="Nama Ibu" value={form.mother_name} onChange={(e) => setForm({ ...form, mother_name: e.target.value })} className="border p-2 rounded-lg" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Batal</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-[#81B7A9] text-white">Simpan Perubahan</button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}