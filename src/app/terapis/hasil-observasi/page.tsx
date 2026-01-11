/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import {
  getObservationDetail,
  getObservations,
  CompletedObservationDetail,
} from "@/lib/api/observasiSubmit";

export default function HasilObservasiFrame() {
  const searchParams = useSearchParams();
  const observationId = searchParams.get("id");

  const [data, setData] = useState<CompletedObservationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!observationId) {
      setError("⚠️ Observation ID tidak ditemukan.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Ambil daftar observasi completed
        const list = await getObservations("completed");

        // Ambil detail observasi spesifik
        const detail = await getObservationDetail(observationId, "completed");

        // Cari tanggal scheduled terkait
        const scheduleItem = list.find(
          (item) => item.observation_id?.toString() === observationId
        );

        if (!detail) {
          setError("Data hasil observasi tidak ditemukan.");
          setData(null);
        } else {
          setData({
            ...detail,
            scheduled_date: scheduleItem?.scheduled_date || "-",
          });
          setError(null);
        }
      } catch (err: any) {
        console.error("❌ Error fetch observation detail:", err);
        if (err?.response?.status === 429) {
          setError("Terlalu banyak permintaan. Coba lagi beberapa saat.");
        } else {
          setError("Terjadi kesalahan saat mengambil data observasi.");
        }
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [observationId]);

  return (
    <div className="flex h-screen text-[#36315B] font-playpen">
      <SidebarTerapis />
      <div className="flex flex-col flex-1 bg-gray-50">
        <HeaderTerapis />

        <main className="p-10 bg-white m-4 rounded-xl shadow-md overflow-auto">
          <div className="flex justify-end mb-4">
  <button
    onClick={() => (window.location.href = "/terapis/observasi/riwayat")}
    className="text-[#36315B] hover:text-red-500 font-bold text-2xl"
  >
    ✕
  </button>
</div>
          {loading ? (
            <div className="flex items-center justify-center h-96 text-gray-500 animate-pulse">
              Memuat hasil observasi...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-96 text-red-500 font-semibold">
              {error}
            </div>
          ) : !data ? (
            <div className="flex items-center justify-center h-96 text-gray-500">
              Data hasil observasi tidak ditemukan.
            </div>
          ) : (
            <>
              {/* Judul Halaman */}
              <h1 className="text-center text-2xl font-extrabold text-[#2E2E4D] mb-10">
                HASIL OBSERVASI
              </h1>

              {/* Informasi Anak */}
              <section className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Informasi Anak
                </h2>
                <hr className="border-gray-300 mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-2 gap-y-4 text-sm">
                  <InfoItem label="Nama" value={data.child_name} />
                  <InfoItem
                    label="Tempat, Tanggal Lahir"
                    value={data.child_birth_place_date}
                  />
                  <InfoItem label="Usia" value={data.child_age} />
                  <InfoItem label="Jenis Kelamin" value={data.child_gender} />
                  <InfoItem label="Sekolah" value={data.child_school} />
                  <InfoItem label="Alamat" value={data.child_address} />
                  <InfoItem label="Nama Orang Tua" value={data.parent_name} />
                  <InfoItem label="Hubungan (Ayah/Ibu)" value={data.parent_type} />
                  <InfoItem
                    label="Tanggal Observasi"
                    value={data.scheduled_date}
                  />
                </div>
              </section>

              {/* Ringkasan Observasi */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Ringkasan Observasi
                </h2>
                <hr className="border-gray-300 mb-6" />

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center mb-5">
                  <span className="font-semibold text-[#36315B]">
                    Total Skor
                  </span>
                  <span className="text-[#36315B] font-bold text-lg">
                    {data.total_score ?? 0}
                  </span>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
                  <p className="text-sm text-[#36315B] mb-1 font-semibold">
                    Rekomendasi
                  </p>
                  <p className="text-[#36315B] font-medium">
                    {data.recommendation || "-"}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-[#36315B] mb-1 font-semibold">
                    Kesimpulan Observasi
                  </p>
                  <p className="text-[#36315B] font-medium">
                    {data.conclusion || "-"}
                  </p>
                </div>
              </section>

              {/* Tombol Kembali */}
              <div className="mt-10 flex justify-end">
                <button
                  onClick={() => history.back()}
                  className="px-6 py-2 bg-[#81B7A9] hover:bg-[#36315B] text-white font-semibold rounded-lg transition"
                >
                  Kembali
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* Komponen InfoItem reusable */
function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-[#36315B] font-semibold">{label}</p>
      <p className="font-medium text-[#36315B]">{value ?? "-"}</p>
    </div>
  );
}
