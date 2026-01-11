"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface InputFieldProps {
    label: string;
    name?: string;
    value?: string;
    onChange?: (v: string) => void;
    type?: string;
}

function InputField({ label, name, value, onChange, type = "text" }: InputFieldProps) {
    return (
        <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">{label}</label>
            <input
                type={type}
                className="border border-gray-300 p-2.5 rounded-md text-xs md:text-sm focus:ring-2 focus:ring-[#6BB1A0] focus:border-transparent outline-none transition-all"
                name={name}
                value={value ?? ""}
                onChange={(e) => onChange?.(e.target.value)}
            />
        </div>
    );
}

interface IdentitasFormProps {
    childName: string;
    setChildName: (v: string) => void;
    childBirthInfo: string;
    setChildBirthInfo: (v: string) => void;
    parentIdentity: any;
    setParentField: (key: string, value: any) => void;
    onSubmit: (e?: any) => void;
    submitting: boolean;
}

export default function IdentitasForm({
    childName,
    setChildName,
    childBirthInfo,
    setChildBirthInfo,
    parentIdentity,
    setParentField,
    onSubmit,
    submitting,
}: IdentitasFormProps) {
    const router = useRouter();

    return (
        <form onSubmit={onSubmit} className="space-y-8 md:space-y-12">
            {/* Bagian 1: Anak */}
            <div className="bg-gray-50/50 p-4 md:p-0 rounded-xl">
                <h3 className="font-bold text-[#36315B] text-sm md:text-base mb-5 border-l-4 border-[#6BB1A0] pl-3">1. Anak</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 text-xs md:text-sm">
                    <div className="flex flex-col">
                        <label className="font-medium mb-1 text-gray-700">Nama</label>
                        <input
                            className="w-full border border-gray-300 p-2.5 rounded-md bg-white md:bg-gray-50"
                            value={childName}
                            onChange={(e) => setChildName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium mb-1 text-gray-700">Tanggal Lahir</label>
                        <input
                            className="w-full border border-gray-300 p-2.5 rounded-md bg-white md:bg-gray-50"
                            value={childBirthInfo}
                            onChange={(e) => setChildBirthInfo(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className="font-medium mb-1 text-gray-700">Alamat</label>
                        <input
                            className="w-full border border-gray-300 p-2.5 rounded-md bg-white md:bg-gray-50"
                            placeholder="Jln. Malabar Selatan 10"
                            value={parentIdentity.address || ""}
                            onChange={(e) => setParentField("address", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Bagian 2: Orangtua */}
            <div>
                <h3 className="font-bold text-[#36315B] text-sm md:text-base mb-6 border-l-4 border-[#6BB1A0] pl-3">
                    2. Orangtua
                </h3>

                {/* AYAH */}
                <div className="mb-8 md:mb-10">
                    <h4 className="font-semibold text-[#36315B] text-xs md:text-sm mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#6BB1A0]"></span> Ayah
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 text-xs md:text-sm">
                        <InputField label="Nama Ayah" value={parentIdentity.father_name || ""} onChange={(v) => setParentField("father_name", v)} />
                        <InputField label="Tanggal Lahir" type="date" value={parentIdentity.father_birth_date || ""} onChange={(v) => setParentField("father_birth_date", v)} />
                        <InputField label="Pekerjaan" value={parentIdentity.father_occupation || ""} onChange={(v) => setParentField("father_occupation", v)} />
                        <InputField label="Nomor Telpon" value={parentIdentity.father_phone || ""} onChange={(v) => setParentField("father_phone", v)} />
                        <InputField label="Hubungan dengan anak" value={parentIdentity.father_relationship || ""} onChange={(v) => setParentField("father_relationship", v)} />
                        <InputField label="NIK" value={parentIdentity.father_identity_number || ""} onChange={(v) => setParentField("father_identity_number", v)} />
                    </div>
                </div>

                {/* IBU */}
                <div className="mb-8 md:mb-10">
                    <h4 className="font-semibold text-[#36315B] text-xs md:text-sm mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#6BB1A0]"></span> Ibu
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 text-xs md:text-sm">
                        <InputField label="Nama Ibu" value={parentIdentity.mother_name || ""} onChange={(v) => setParentField("mother_name", v)} />
                        <InputField label="Tanggal Lahir" type="date" value={parentIdentity.mother_birth_date || ""} onChange={(v) => setParentField("mother_birth_date", v)} />
                        <InputField label="Pekerjaan" value={parentIdentity.mother_occupation || ""} onChange={(v) => setParentField("mother_occupation", v)} />
                        <InputField label="Nomor Telpon" value={parentIdentity.mother_phone || ""} onChange={(v) => setParentField("mother_phone", v)} />
                        <InputField label="Hubungan dengan anak" value={parentIdentity.mother_relationship || ""} onChange={(v) => setParentField("mother_relationship", v)} />
                        <InputField label="NIK" value={parentIdentity.mother_identity_number || ""} onChange={(v) => setParentField("mother_identity_number", v)} />
                    </div>
                </div>

                {/* WALI */}
                <div className="mb-8">
                    <h4 className="font-semibold text-[#36315B] text-xs md:text-sm mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#6BB1A0]"></span> Wali
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 text-xs md:text-sm">
                        <InputField label="Nama Wali" value={parentIdentity.guardian_name || ""} onChange={(v) => setParentField("guardian_name", v)} />
                        <InputField label="Tanggal Lahir" type="date" value={parentIdentity.guardian_birth_date || ""} onChange={(v) => setParentField("guardian_birth_date", v)} />
                        <InputField label="Pekerjaan" value={parentIdentity.guardian_occupation || ""} onChange={(v) => setParentField("guardian_occupation", v)} />
                        <InputField label="Nomor Telpon" value={parentIdentity.guardian_phone || ""} onChange={(v) => setParentField("guardian_phone", v)} />
                        <InputField label="Hubungan dengan Anak" value={parentIdentity.guardian_relationship || ""} onChange={(v) => setParentField("guardian_relationship", v)} />
                        <InputField label="NIK" value={parentIdentity.guardian_identity_number || ""} onChange={(v) => setParentField("guardian_identity_number", v)} />
                        <div className="flex flex-col md:col-span-2">
                            <label className="mb-1 font-medium text-gray-700">Alamat</label>
                            <input className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-[#6BB1A0] focus:border-transparent outline-none" value={parentIdentity.address || ""} onChange={(e) => setParentField("address", e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>

            {/* BUTTONS - Stack on Mobile, Row on Desktop */}
            <div className="flex flex-col-reverse md:flex-row justify-between items-stretch md:items-center gap-4 pt-8 border-t">
                <button
                    type="button"
                    onClick={() => router.push("/orangtua/assessment")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl text-sm md:text-base font-medium transition-colors"
                >
                    Batal
                </button>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#6BB1A0] hover:bg-[#5EA391] text-white px-8 py-3 rounded-xl disabled:opacity-60 text-sm md:text-base font-semibold shadow-sm transition-all active:scale-[0.98]"
                    >
                        {submitting ? "Mengirim..." : "Simpan Identitas"}
                    </button>
                </div>
            </div>
        </form>
    );
}