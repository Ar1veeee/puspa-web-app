"use client";
import { useState } from "react";
import { addPatient } from "@/lib/api/data_patient";

interface FormTambahPasienProps {
    open: boolean;
    onClose: () => void;
}

export default function FormTambahPasien({
    open,
    onClose,
}: FormTambahPasienProps) {
    const [form, setForm] = useState({
        child_name: "",
        child_gender: "",
        child_birth_place: "",
        child_birth_date: "",
        child_school: "",
        child_address: "",
        child_complaint: "",
        child_service_choice: [] as string[],
        email: "",
        guardian_name: "",
        guardian_phone: "",
        guardian_type: "ayah" as "ayah" | "ibu" | "wali",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const REQUIRED_MESSAGE = "Data wajib diisi";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleService = (service: string) => {
        setForm((prev) => {
            const updated = prev.child_service_choice.includes(service)
                ? prev.child_service_choice.filter((s) => s !== service)
                : [...prev.child_service_choice, service];

            return {
                ...prev,
                child_service_choice: updated,
            };
        });

        setErrors((prev) => ({
            ...prev,
            child_service_choice: "",
        }));
    };


    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.child_name.trim())
            newErrors.child_name = REQUIRED_MESSAGE;

        if (!form.child_gender)
            newErrors.child_gender = REQUIRED_MESSAGE;

        if (!form.child_birth_place.trim())
            newErrors.child_birth_place = REQUIRED_MESSAGE;

        if (!form.child_birth_date)
            newErrors.child_birth_date = REQUIRED_MESSAGE;

        if (!form.child_address.trim())
            newErrors.child_address = REQUIRED_MESSAGE;

        if (!form.child_complaint.trim())
            newErrors.child_complaint = REQUIRED_MESSAGE;

        if (!form.guardian_name.trim())
            newErrors.guardian_name = REQUIRED_MESSAGE;

        if (!form.guardian_phone.trim())
            newErrors.guardian_phone = REQUIRED_MESSAGE;

        if (!form.email.trim())
            newErrors.email = REQUIRED_MESSAGE;

        if (form.child_service_choice.length === 0)
            newErrors.child_service_choice = REQUIRED_MESSAGE;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 🔥 HANDLE SUBMIT FINAL (SESUAI API YANG BERHASIL)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // optional tapi disarankan
        if (!validate()) return;


        const payload = {
            child_name: form.child_name,
            child_gender: form.child_gender,
            child_birth_place: form.child_birth_place,
            child_birth_date: form.child_birth_date,
            child_school: form.child_school,
            child_address: form.child_address,
            child_complaint: form.child_complaint,
            child_service_choice: form.child_service_choice.join(", "),

            // ⬇️ SESUAI REQUEST YANG BERHASIL
            parent_name: form.guardian_name,
            parent_phone: form.guardian_phone,
            parent_email: form.email,
            guardian_type: form.guardian_type,
        };

        try {
            await addPatient(payload);
            onClose();
        } catch (err: any) {
            console.error("STATUS:", err.response?.status);
            console.error("DATA:", err.response?.data);
        }
    };

    if (!open) return null;


    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col">

                {/* HEADER (TETAP) */}
                <div className="p-4 border-b border-[#81B7A9] flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-[#36315B]">
                        Tambah Data Pasien
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-[#81B7A9]"
                    >
                        ✕
                    </button>
                </div>

                {/* CONTENT (SCROLL DI SINI) */}
                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Nama */}
                        <div>
                            <label className="block text-sm font-medium">Nama</label>
                            <input
                                type="text"
                                placeholder="Isi nama lengkap"
                                name="child_name"
                                value={form.child_name}
                                onChange={handleChange}
                                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                            />
                            {errors.child_name && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.child_name}
                                </p>
                            )}

                        </div>

                        {/* Tempat & Tanggal Lahir */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Tempat Lahir</label>
                                <input
                                    type="text"
                                    placeholder="Isi tempat lahir"
                                    name="child_birth_place"
                                    value={form.child_birth_place}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                                />
                                {errors.child_birth_place && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.child_birth_place}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">
                                    Tanggal Lahir
                                </label>
                                <input
                                    type="date"
                                    name="child_birth_date"
                                    value={form.child_birth_date}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                                />
                                {errors.child_birth_date && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.child_birth_date}
                                    </p>
                                )}

                            </div>
                        </div>

                        {/* Jenis Kelamin */}
                        <div>
                            <label className="block text-sm font-medium">
                                Jenis Kelamin <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2 flex gap-6 text-sm">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="child_gender"
                                        value="laki-laki"
                                        checked={form.child_gender === "laki-laki"}
                                        onChange={handleChange}
                                        className="accent-[#81B7A9]"

                                    />

                                    Laki-laki
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="child_gender"
                                        value="perempuan"
                                        checked={form.child_gender === "perempuan"}
                                        onChange={handleChange}
                                        className="accent-[#81B7A9]"
                                    />
                                    Perempuan
                                </label>
                                {errors.child_gender && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.child_gender}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sekolah */}
                        <div>
                            <label className="block text-sm font-medium">Sekolah</label>
                            <input
                                type="text"
                                placeholder="Isi asal sekolah"
                                name="child_school"
                                value={form.child_school}
                                onChange={handleChange}
                                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                            />


                        </div>

                        {/* Alamat */}
                        <div>
                            <label className="block text-sm font-medium">Alamat</label>
                            <input
                                type="text"
                                placeholder="Isi alamat lengkap"
                                name="child_address"
                                value={form.child_address}
                                onChange={handleChange}
                                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                            />
                            {errors.child_address && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.child_address}
                                </p>
                            )}
                        </div>

                        {/* Keluhan */}
                        <div>
                            <label className="block text-sm font-medium">Keluhan</label>
                            <input
                                type="text"
                                placeholder="Isi keluhan"
                                name="child_complaint"
                                value={form.child_complaint}
                                onChange={handleChange}
                                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                            />
                            {errors.child_complaint && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.child_complaint}
                                </p>
                            )}

                        </div>

                        {/* Nama Orang Tua */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium">
                                    Nama Orang Tua / Wali <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Isi Nama Orang Tua"
                                    name="guardian_name"
                                    value={form.guardian_name}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                                />
                                {errors.guardian_name && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.guardian_name}
                                    </p>
                                )}

                            </div>

                            {/* Radio Pilihan */}
                            <div className="flex items-center gap-6 text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="parent_type"
                                        value="ayah"
                                        checked={form.guardian_type === "ayah"}
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, guardian_type: e.target.value as any }))
                                        }
                                        className="accent-[#81B7A9]"
                                    />

                                    Ayah
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="parent_type"
                                        value="ibu"
                                        checked={form.guardian_type === "ibu"}
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, guardian_type: e.target.value as any }))
                                        }
                                        className="accent-[#81B7A9]"
                                    />
                                    Ibu
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="parent_type"
                                        value="wali"
                                        checked={form.guardian_type === "wali"}
                                        onChange={(e) =>
                                            setForm((prev) => ({ ...prev, guardian_type: e.target.value as any }))
                                        }
                                        className="accent-[#81B7A9]"
                                    />
                                    Wali
                                </label>

                            </div>
                        </div>


                        {/* Kontak */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">
                                    Nomor WhatsApp
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh : 081234567890"
                                    name="guardian_phone"
                                    value={form.guardian_phone}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                                />
                                {errors.guardian_phone && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.guardian_phone}
                                    </p>
                                )}

                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    placeholder="Isi Alamat Email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded border px-3 py-2 text-sm"
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.email}
                                    </p>
                                )}

                            </div>
                        </div>

                        {/* Pilih Layanan */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Pilih Layanan
                            </label>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {[
                                    "Asesmen Tumbuh Kembang",
                                    "Asesmen Terpadu",
                                    "Konsultasi Dokter",
                                    "Konsultasi Psikolog",
                                    "Konsultasi Keluarga",
                                    "Test Psikolog",
                                    "Layanan Minat Bakat",
                                    "Daycare",
                                    "Home Care",
                                    "Hydrotherapy",
                                    "Baby Spa",
                                    "Lainnya",
                                ].map((item) => (
                                    <label key={item} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={form.child_service_choice.includes(item)}
                                            onChange={() => toggleService(item)}
                                            className="accent-[#81B7A9]"

                                        />

                                        {item}
                                    </label>

                                ))}
                            </div>
                            {errors.child_service_choice && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.child_service_choice}
                                </p>
                            )}

                        </div>

                        {/* ACTION */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded border border-[#81B7A9] px-4 py-2 text-sm text-[#81B7A9] hover:bg-[#81B7A9]/10 transition"
                            >
                                Batal
                            </button>

                            <button
                                type="submit"
                                className="rounded bg-[#81B7A9] hover:bg-[#36315B] transition px-4 py-2 text-sm text-white"
                            >
                                Daftar
                            </button>

                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
