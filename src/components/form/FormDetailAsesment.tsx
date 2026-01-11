/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export default function FormDetailAsesment({
  open,
  onClose,
  pasien,
}: {
  open: boolean;
  onClose: () => void;
  pasien: any | null;
}) {
  if (!open) return null;

  if (open && !pasien) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
        <div className="bg-white p-6 rounded-lg text-sm">
          Memuat detail asesmen...
        </div>
      </div>
    );
  }

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
          Detail Asesmen
        </h2>
        <hr className="border-t border-[#81B7A9] mb-3" />

        {/* INFORMASI ANAK */}
        <p className="text-sm font-medium text-[#36315B]">
          Informasi Anak
        </p>
        <ul className="text-sm text-[#36315B] space-y-1 mt-2">
          <li>Nama: {pasien.child_name}</li>
          <li>Tanggal Lahir: {pasien.child_birth_date}</li>
          <li>Usia: {pasien.child_age}</li>
          <li>Jenis Kelamin: {pasien.child_gender}</li>
          <li>Sekolah: {pasien.child_school}</li>
          <li>Alamat: {pasien.child_address}</li>
          <li>Tanggal Asesmen: {pasien.scheduled_date}</li>
          <li>Waktu: {pasien.scheduled_time}</li>
          <li>Tipe Asesmen: {pasien.type}</li>


        </ul>

        {/* INFORMASI ORANGTUA / WALI */}
        <div className="mt-5">
          <p className="text-sm font-medium text-[#36315B]">
            Informasi Orangtua / Wali
          </p>

          <ul className="text-sm text-[#36315B] space-y-1 mt-2 ml-3">
            <li>• Nama Orangtua : {pasien.parent_name}</li>
            <li>• Nomor WhatsApp : {pasien.parent_phone}</li>
            <li>• Status Orangtua : {pasien.parent_type}</li>
            <li>• Hubungan : {pasien.relationship}</li>
          </ul>
        </div>

        {/* INFORMASI ADMIN */}
        <div className="mt-5">
          <p className="text-sm font-medium text-[#36315B]">
            Informasi Admin
          </p>
          <ul className="text-sm text-[#36315B] mt-2 ml-3">

            <li>• Nama Administrator : {pasien.admin_name}</li>

          </ul>
        </div>


      </div>
    </div>
  );
}
