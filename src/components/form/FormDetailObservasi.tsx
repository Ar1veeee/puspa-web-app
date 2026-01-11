/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export default function FormDetailObservasi({
  open,
  onClose,
  pasien,
}: {
  open: boolean;
  onClose: () => void;
  pasien: any | null;
}) {
  if (!open || !pasien) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[480px] max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-[#81B7A9]"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-[#36315B] mb-3">
          Detail Observasi
        </h2>
        <hr className="border-t border-[#81B7A9] mb-3" />

        {/* INFORMASI ANAK */}
        <p className="text-sm font-medium text-[#36315B]">Informasi Anak</p>
        <ul className="text-sm text-[#36315B] space-y-1 mt-2">
          <li>• Nama Lengkap : {pasien.child_name}</li>
          <li>• Tanggal Lahir : {pasien.child_birth_date || "-"}</li>
          <li>• Usia : {pasien.child_age || "-"}</li>
          <li>• Jenis Kelamin : {pasien.child_gender || "-"}</li>
          <li>• Sekolah : {pasien.child_school || "-"}</li>
          <li>• Alamat : {pasien.child_address || "-"}</li>
          <li>• Tanggal Observasi : {pasien.scheduled_date || "-"}</li>
          <li>• Waktu : {pasien.scheduled_time || "-"}</li>
        </ul>

        {/* INFORMASI ORANGTUA / WALI */}
        <div className="mt-5">
          <p className="text-sm font-medium text-[#36315B]">
            Informasi Orangtua / Wali
          </p>

          <ul className="text-sm text-[#36315B] space-y-1 mt-2 ml-3">
            <li>• Nama Orangtua : {pasien.parent_name || "-"}</li>
            <li>• Hubungan : {pasien.parent_type || "-"}</li>
            <li>• Nomor WhatsApp : {pasien.parent_phone || "-"}</li>
          </ul>
        </div>

        {/* INFORMASI ADMIN */}
        <div className="mt-5">
          <p className="text-sm font-medium text-[#36315B]">
            Informasi Admin
          </p>
          <ul className="text-sm text-[#36315B] mt-2 ml-3">
            <li>• Nama Administrator : {pasien.admin_name || "-"}</li>
          </ul>
        </div>

        {/* KELUHAN */}
        {pasien.child_complaint && (
          <div className="mt-4">
            <p className="text-sm font-medium text-[#36315B]">Keluhan</p>
            <p className="text-sm text-[#36315B] mt-1">
              {pasien.child_complaint}
            </p>
          </div>
        )}

        {/* JENIS LAYANAN */}
        {pasien.child_service_choice && (
          <div className="mt-4 mb-3">
            <p className="text-sm font-medium text-[#36315B]">
              Jenis Layanan
            </p>

            <ul className="text-sm text-[#36315B] space-y-1 mt-1 ml-2">
              {Array.isArray(pasien.child_service_choice)
                ? pasien.child_service_choice.map((service: string, i: number) => (
                    <li key={i}>• {service}</li>
                  ))
                : <li>• {pasien.child_service_choice}</li>
              }
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
