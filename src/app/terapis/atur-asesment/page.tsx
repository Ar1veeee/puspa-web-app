"use client";

import { useState } from "react";
import DatePicker from "@/components/dashboard/datepicker";

export default function AturAsesmentPage() {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // buat trigger refresh data kalau perlu
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // contoh data pasien
  const pasien = {
    id: 1,
    observation_id: "OBS001",
    nama: "Budi Santoso",
  };

  // dipanggil setelah berhasil update tanggal asesmen
  const handleUpdate = () => {
    console.log("Tanggal asesmen berhasil diperbarui!");
    setRefreshKey((prev) => prev + 1); // kalau nanti mau trigger fetch data ulang
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Atur Asesmen</h1>

      <div className="mb-4">
        <button
          onClick={() => setOpen(true)}
          className="bg-[#81B7A9] text-white px-4 py-2 rounded hover:bg-[#5f9d8f]"
        >
          Pilih Tanggal Asesmen
        </button>
      </div>

      {selectedDate && (
        <p className="text-gray-700">
          <b>Tanggal asesmen terpilih:</b>{" "}
          {new Date(selectedDate).toLocaleDateString("id-ID")}
        </p>
      )}

      {open && (
        <DatePicker
          pasien={pasien}
          initialDate={selectedDate || undefined}
          onClose={() => setOpen(false)}
          onUpdate={() => {
            handleUpdate();
            setSelectedDate(new Date().toISOString());
          }}
        />
      )}
    </div>
  );
}
