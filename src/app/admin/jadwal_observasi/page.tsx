/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Search as SearchIcon, Settings, ChevronDown, Eye, Clock3 } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import FormAturAsesmen from "@/components/form/FormAturAsesmen";
import FormDetailObservasi from "@/components/form/FormDetailObservasi";
import {
  getObservations,
  Jadwal,
  updateObservationSchedule,
  createObservationAgreement  // ← TAMBAH INI
} from "@/lib/api/jadwal_observasi";
import { useSearchParams } from "next/navigation";



export default function JadwalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();


  const [search, setSearch] = useState("");
  const initialTab =
    searchParams.get("tab") === "selesai"
      ? "selesai"
      : searchParams.get("tab") === "terjadwal"
        ? "terjadwal"
        : "menunggu";

  const [tab, setTab] =
    useState<"menunggu" | "terjadwal" | "selesai">(initialTab);

  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [originalList, setOriginalList] = useState<Jadwal[]>([]);

  const [selectedPasien, setSelectedPasien] = useState<Jadwal | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openAsesmen, setOpenAsesmen] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState<any | null>(null);
  const [filterDate, setFilterDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);




  // =====================
  // Fetch Jadwal
  // =====================
  const fetchJadwal = async () => {
    setLoading(true);
    setError(null);

    try {
      let status: "pending" | "scheduled" | "completed";

      if (tab === "menunggu") status = "pending";
      else if (tab === "terjadwal") status = "scheduled";
      else status = "completed";


      const data = await getObservations(status, debouncedSearch);
      setJadwalList(data);
      setOriginalList(data);

    } catch (err) {
      console.error("Gagal memuat data jadwal:", err);
      setError("Gagal memuat data jadwal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, [debouncedSearch]);


  useEffect(() => {
    fetchJadwal();
    setSelectedDate(null);
  }, [tab]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // jeda 0.5 detik

    return () => clearTimeout(handler);
  }, [search]);

  // =====================
  // Filter by search
  // =====================
  const filtered = originalList.filter((j) => {
    const q = search.toLowerCase();
    const matchSearch =
      (j.nama || "").toLowerCase().includes(q) ||
      (j.sekolah || "").toLowerCase().includes(q) ||
      (j.orangtua || "").toLowerCase().includes(q);

    const matchDateFromCalendar =
      tab === "terjadwal" && selectedDate
        ? j.tanggalObservasi === selectedDate
        : true;

    const matchDateFromInput =
      tab === "selesai" && filterDate
        ? j.tanggalObservasi === format(new Date(filterDate), "dd/MM/yyyy")
        : true;

    return matchSearch && matchDateFromCalendar && matchDateFromInput;
  });


  // =====================
  // Handle Calendar Select
  // =====================
  const handleDateSelect = (date: Date) => {
    const formatted = format(date, "dd/MM/yyyy");
    setSelectedDate(formatted);

    const hasilFilter = originalList.filter(
      (item) => item.tanggalObservasi === formatted
    );

    setJadwalList(hasilFilter);
  };



  // =====================
  // Navigation actions
  // =====================
  const handleRiwayatJawaban = (observation_id: number) => router.push(`/admin/riwayat-hasil?observation_id=${observation_id}`);
  const handleLihatHasil = (id: number) => router.push(`/admin/hasil-observasi?observation_id=${id}`);
  const handleAturAsesmen = (pasien: Jadwal) => {
    setSelectedPasien(pasien);
    setOpenAsesmen(true);
    setOpenDropdown(null);
  };

  // =====================
  // Click outside dropdown
  // =====================
  useEffect(() => {
    const close = () => setOpenDropdown(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // =====================
  // Dual Calendar Component
  // =====================
  const DualCalendar = () => {
    return (
      <div className="flex justify-center gap-6 bg-[#F9FAFB] p-4 rounded-lg">

        {/* Calendar bulan ini */}
        <Calendar
          onChange={(value) => handleDateSelect(value as Date)}
          locale="id-ID"
          showNeighboringMonth={false}
          next2Label={null}
          prev2Label={null}
          value={selectedDate ? new Date(selectedDate.split("/").reverse().join("-")) : new Date()}
        />

        {/* Calendar bulan depan */}
        <Calendar
          onChange={(value) => handleDateSelect(value as Date)}
          locale="id-ID"
          showNeighboringMonth={false}
          next2Label={null}
          prev2Label={null}
          value={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)}
        />

      </div>
    );
  };

  // =====================
  // Render
  // =====================
  return (
    <div className="flex min-h-screen bg-gray-50">


      <div className="flex flex-col flex-1">


        <main className="p-6 space-y-6 relative">
          <h1 className="text-2xl font-semibold text-[#36315B] mb-2">Observasi</h1>

          {tab === "terjadwal" && (
            <>
              <DualCalendar />

              {selectedDate && (
                <div className="flex justify-center mt-2">
                  <button
                    onClick={() => {
                      setSelectedDate(null);
                      setJadwalList(originalList);
                    }}
                    className="px-4 py-2 text-sm border rounded-full hover:bg-gray-100"
                  >
                    Reset Filter Tanggal
                  </button>
                </div>
              )}
            </>
          )}


          {/* TAB + SEARCH */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-6">
              {["menunggu", "terjadwal", "selesai"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t as any)}
                  className={`relative pb-2 text-sm font-medium ${tab === t
                      ? "text-[#36315B] border-b-2 border-[#81B7A9] font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {t === "menunggu" ? "Menunggu" : t === "terjadwal" ? "Terjadwal" : "Selesai"}
                </button>
              ))}
            </div>

            {/* SEARCH BAR */}
            {tab === "selesai" ? (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
                {/* Filter tanggal */}
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="border border-[#ADADAD] rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#81B7A9]"
                />

                {/* Search pasien */}
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Cari Pasien"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-[#ADADAD] rounded-full pl-4 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-[#81B7A9]"
                  />
                  <SearchIcon
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            ) : (

              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Cari Pasien"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-[#ADADAD] rounded-full pl-3 pr-9 py-2 text-sm outline-none focus:ring-2 focus:ring-[#81B7A9]"
                />
                <SearchIcon size={16} className="absolute right-3 top-2.5 text-gray-400" />
              </div>
            )}

          </div>

          {/* TABEL */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            {/* Loading */}
            {loading ? (
              <p className="text-center text-gray-500 py-10">Memuat data...</p>
            ) : error ? (
              <p className="text-center text-red-500 py-10">{error}</p>
            ) : filtered.length === 0 ? (
              selectedDate && tab === "terjadwal" ? (
                <p className="text-center text-gray-500 py-10">
                  Tidak ada jadwal untuk tanggal{" "}
                  {(() => {
                    const [d, m, y] = selectedDate.split("/");
                    return format(new Date(`${y}-${m}-${d}`), "dd MMMM yyyy", { locale: id });
                  })()}
                </p>
              ) : (
                <p className="text-center text-gray-500 py-10">Tidak ada data.</p>
              )
            ) : tab === "selesai" ? (
              // TABEL STATUS SELESAI
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[#36315B] bg-gray-50">
                    <th className="p-3 text-left">Nama Pasien</th>
                    <th className="p-3 text-left">Nama Orangtua</th>
                    <th className="p-3 text-left">Observer</th>
                    <th className="p-3 text-left">Tanggal Observasi</th>
                    <th className="p-3 text-left">Waktu</th>
                    <th className="p-3 text-left">Status Asesmen</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((j) => (
                    <tr key={j.observation_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">{j.nama}</td>
                      <td className="p-3">{j.orangtua}</td>
                      <td className="p-3">{j.observer || "-"}</td>
                      <td className="p-3">{j.tanggalObservasi || "-"}</td>
                      <td className="p-3">{j.waktu || "-"}</td>
                      <td className="p-3">{j.assessment_status || "-"}</td>
<td className="p-3 text-center relative">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setSelectedPasien(j);
      setOpenDropdown(
        openDropdown === j.observation_id ? null : j.observation_id
      );
    }}
    className="px-3 py-1 border border-[#80C2B0] text-[#5F52BF] rounded
               hover:bg-[#E9F4F1] text-xs inline-flex items-center"
  >
    <Settings size={14} className="mr-1" />
    Aksi
    <ChevronDown size={12} className="ml-1" />
  </button>

  {/* DROPDOWN */}
  {openDropdown === j.observation_id && (
    <div
      className="absolute top-full mt-2 right-0 w-56 bg-white
                 border border-[#80C2B0] rounded-lg shadow-lg z-50"
    >
      <div className="divide-y divide-gray-200 text-left">

        {tab === "selesai" && (
          <>
            <button
              onClick={() => handleAturAsesmen(j)}
              className="flex items-center w-full px-4 py-3 text-sm hover:bg-[#E9F4F1]"
            >
              <Settings size={16} className="mr-2" />
              Atur Asesmen
            </button>

            <button
              onClick={() => handleRiwayatJawaban(j.observation_id)}
              className="flex items-center w-full px-4 py-3 text-sm hover:bg-[#E9F4F1]"
            >
              <Clock3 size={16} className="mr-2" />
              Riwayat Jawaban
            </button>

            <button
              onClick={() => handleLihatHasil(j.observation_id)}
              className="flex items-center w-full px-4 py-3 text-sm hover:bg-[#E9F4F1]"
            >
              <Eye size={16} className="mr-2" />
              Lihat Hasil
            </button>
          </>
        )}
      </div>
    </div>
  )}
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // TABEL MENUNGGU & TERJADWAL
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[#36315B] bg-gray-50">
                    <th className="p-3 text-left">Nama Pasien</th>
                    <th className="p-3 text-left">Nama Orangtua</th>
                    <th className="p-3 text-left">Telepon</th>

                    {tab === "terjadwal" && (
                      <>
                        <th className="p-3 text-left">Administrator</th>
                        <th className="p-3 text-left">Tanggal Observasi</th>
                        <th className="p-3 text-left">Waktu</th>
                      </>
                    )}

                    {tab === "menunggu" && (
                      <>
                        <th className="p-3 text-left">Sekolah</th>
                        <th className="p-3 text-left">Usia</th>
                        <th className="p-3 text-left">Jenis Kelamin</th>
                      </>
                    )}

                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((j) => (
                    <tr key={j.observation_id} className="border-b border-gray-100">
                      <td className="p-3">{j.nama || "-"}</td>
                      <td className="p-3">{j.orangtua || "-"}</td>
                      <td className="p-3">{j.telepon || "-"}</td>

                      {tab === "terjadwal" && (
                        <>
                          <td className="p-3">{j.observer || "-"}</td>
                          <td className="p-3">{j.tanggalObservasi || "-"}</td>
                          <td className="p-3">{j.waktu || "-"}</td>
                        </>
                      )}

                      {tab === "menunggu" && (
                        <>
                          <td className="p-3">{j.sekolah || "-"}</td>
                          <td className="p-3">{j.usia || "-"}</td>
                          <td className="p-3">{j.jenisKelamin || "-"}</td>
                        </>
                      )}

                      <td className="p-3 text-center relative">
  {tab === "terjadwal" ? (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedPasien(j);
          setOpenDropdown(
            openDropdown === j.observation_id ? null : j.observation_id
          );
        }}
        className="px-3 py-1 border border-[#80C2B0] text-[#5F52BF] rounded
                   hover:bg-[#E9F4F1] text-xs inline-flex items-center"
      >
        <Settings size={14} className="mr-1" />
        Aksi
        <ChevronDown size={12} className="ml-1" />
      </button>

      {/* DROPDOWN INLINE KHUSUS TAB TERJADWAL */}
      {openDropdown === j.observation_id && (
        <div
          className="absolute top-full mt-2 right-0 w-56 bg-white
                     border border-[#80C2B0] rounded-lg shadow-lg z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="divide-y divide-gray-200 text-left">
            <button
              onClick={() => handleAturAsesmen(j)}
              className="flex items-center w-full px-4 py-3 text-sm hover:bg-[#E9F4F1]"
            >
              <Settings size={16} className="mr-2" />
              Edit Jadwal
            </button>

            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  const res = await fetch(
                    `/api/observations/${j.observation_id}/detail?type=scheduled`,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  const data = await res.json();
                  setSelectedObservation(data.data);
                  setOpenDetail(true);
                  setOpenDropdown(null);
                } catch {
                  alert("Gagal memuat detail observasi");
                }
              }}
              className="flex items-center w-full px-4 py-3 text-sm hover:bg-[#E9F4F1]"
            >
              <Eye size={16} className="mr-2" />
              Detail
            </button>
          </div>
        </div>
      )}
    </>
  ) : (
    <button
      onClick={() => {
        setSelectedPasien(j);
        setOpenAsesmen(true);
      }}
      className="px-4 py-1 text-sm rounded bg-[#81B7A9] hover:bg-[#36315B] text-white transition"
    >
      {tab === "menunggu" ? "Atur Jadwal" : "Atur Asesmen"}
    </button>
  )}
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* DROPDOWN AKSI */}
          {/* DROPDOWN AKSI */}
          

        </main>
      </div>

      {openDetail && selectedObservation && (
        <FormDetailObservasi
          open={openDetail}
          onClose={() => {
            setOpenDetail(false);
            setSelectedObservation(null);
          }}
          pasien={selectedObservation}
        />
      )}


      {/* MODAL ATUR ASESMEN - FIXED ENDPOINT */}
      {openAsesmen && selectedPasien && (
        <FormAturAsesmen
          title={
            tab === "menunggu" ? "Atur Jadwal" :
              tab === "terjadwal" ? "Edit Observasi" :
                "Atur Asesmen"
          }
          pasienName={selectedPasien.nama}
          initialDate={selectedPasien.tanggalObservasi || ""}
          initialTime={selectedPasien.waktu || ""}
          onClose={() => {
            setOpenAsesmen(false);
            setSelectedPasien(null);
          }}
          onSave={async (date, time) => {
            if (!selectedPasien) return;
            try {
              setLoading(true);
              if (tab === "selesai") {
                // TAB SELSAI → JADWAL ASESMEN
                await createObservationAgreement(selectedPasien.observation_id, date, time);
                alert("✅ Asesmen berhasil dijadwalkan!");
              } else {
                // TAB LAIN → OBSERVASI
                await updateObservationSchedule(selectedPasien.observation_id, date, time);
                alert("✅ Jadwal observasi berhasil disimpan!");
              }
              setOpenAsesmen(false);
              setSelectedPasien(null);
              fetchJadwal();
            } catch (err) {
              console.error(err);
              alert("❌ Gagal menyimpan jadwal!");
            } finally {
              setLoading(false);
            }
          }}
        />
      )}
    </div>
  );
}
