"use client";

import { Clock } from "lucide-react";

interface Jadwal {
  id?: string | number;
  nama_pasien?: string;
  jenis_terapi?: string;
  waktu?: string;
  nama_terapis?: string;
}

interface JadwalTableProps {
  jadwal: Jadwal[];
  loading: boolean;
  emptyMessage?: string;
}

export default function JadwalTable({
  jadwal,
  loading,
  emptyMessage = "Tidak ada jadwal hari ini",
}: JadwalTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md shadow-[#ADADAD] p-4 text-[#36315B]">
      <h3 className="font-bold text-lg mb-4">Jadwal Terapi Hari Ini</h3>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#81B7A9]"></div>
        </div>
      ) : jadwal.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400">
          <Clock className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg font-medium">{emptyMessage}</p>
          <p className="text-sm mt-1">Cek kembali besok</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
            {jadwal.map((item, index) => (
              <div
                key={item.id ?? index}
                className="p-3 bg-gray-50 rounded-lg border-l-4 border-[#81B7A9]"
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-[#36315B]">
                    {item.nama_pasien ?? "-"}
                  </h4>
                  <span className="text-sm bg-[#81B7A9]/10 px-2 py-1 rounded-full text-[#81B7A9]">
                    {item.waktu ?? "-"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-1">
                  Jenis Terapi: {item.jenis_terapi ?? "-"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
