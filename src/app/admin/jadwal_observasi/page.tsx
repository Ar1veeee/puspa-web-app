"use client";

import { useEffect, useState } from "react";
import {
  Search as SearchIcon,
  Settings,
  ChevronDown,
  Eye,
  Clock3,
  Calendar as CalendarIcon,
  Clock,
  Activity,
  CheckCircle2,
  ListTodo,
  ClipboardList,
  BookOpen,
  MapPin,
  UserCheck,
  Phone,
} from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import FormAturAsesmen from "@/components/form/FormAturAsesmen";
import FormDetailObservasi from "@/components/form/FormDetailObservasi";
import {
  getObservations,
  Jadwal,
  updateObservationSchedule,
  createObservationAgreement,
} from "@/lib/api/jadwal_observasi";

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

  const [tab, setTab] = useState<"menunggu" | "terjadwal" | "selesai">(
    initialTab,
  );

  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [originalList, setOriginalList] = useState<Jadwal[]>([]);

  const [selectedPasien, setSelectedPasien] = useState<Jadwal | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openAsesmen, setOpenAsesmen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState<any | null>(
    null,
  );

  const [filterDate, setFilterDate] = useState("");
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
    }, 500);
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
      (item) => item.tanggalObservasi === formatted,
    );
    setJadwalList(hasilFilter);
  };

  // =====================
  // Navigation actions
  // =====================
  const handleRiwayatJawaban = (observation_id: number) =>
    router.push(`/admin/riwayat-hasil?observation_id=${observation_id}`);
  const handleLihatHasil = (id: number) =>
    router.push(`/admin/hasil-observasi?observation_id=${id}`);
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

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-transparent">
      <div className="flex flex-col flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E5C58] tracking-tight flex items-center gap-2">
              <ClipboardList className="w-7 h-7 text-[#2B7A75]" />
              Jadwal Observasi Anak
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola dan pantau antrean penjadwalan observasi pasien.
            </p>
          </div>
        </div>

        <main className="space-y-6">
          {/* Calendar Toggle for Terjadwal Tab */}
          <AnimatePresence mode="wait">
            {tab === "terjadwal" && (
              <motion.div
                key="kalender-terjadwal"
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 bg-white border border-teal-100 p-6 rounded-3xl shadow-sm overflow-hidden mb-4">
                  <div className="custom-calendar-container">
                    <Calendar
                      onChange={(value) => handleDateSelect(value as Date)}
                      locale="id-ID"
                      showNeighboringMonth={false}
                      next2Label={null}
                      prev2Label={null}
                      value={
                        selectedDate
                          ? new Date(
                              selectedDate.split("/").reverse().join("-"),
                            )
                          : new Date()
                      }
                      className="border-none shadow-sm rounded-xl font-sans! text-sm"
                    />
                  </div>

                  <div className="hidden sm:block h-64 w-px bg-gray-200" />

                  <div className="custom-calendar-container">
                    <Calendar
                      onChange={(value) => handleDateSelect(value as Date)}
                      locale="id-ID"
                      showNeighboringMonth={false}
                      next2Label={null}
                      prev2Label={null}
                      value={
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
                          1,
                        )
                      }
                      className="border-none shadow-sm rounded-xl font-sans! text-sm"
                    />
                  </div>

                  <style
                    dangerouslySetInnerHTML={{
                      __html: `
                    .react-calendar { width: 300px; max-width: 100%; font-family: inherit; border: none; background: transparent; }
                    .react-calendar__navigation button { min-width: 44px; background: none; font-size: 16px; margin-top: 8px; font-weight: bold; color: #1E5C58; border-radius: 8px; }
                    .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus { background-color: #F4F9F8; }
                    .react-calendar__month-view__weekdays { text-transform: uppercase; font-weight: bold; font-size: 0.75em; color: #64748b; margin-bottom: 8px;}
                    .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none; }
                    .react-calendar__tile { max-width: 100%; padding: 10px 6px; background: none; text-align: center; line-height: 16px; font-size: 14px; border-radius: 8px; font-weight: 500;}
                    .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus { background-color: #F4F9F8; color: #1E5C58; border-radius: 8px; }
                    .react-calendar__tile--active { background: #2B7A75 !important; color: white !important; font-weight: bold; border-radius: 8px; }
                    .react-calendar__tile--now { background: #e0f2fe; color: #0284c7; font-weight: bold; border-radius: 8px;}
                  `,
                    }}
                  />
                </div>

                <AnimatePresence>
                  {selectedDate && (
                    <motion.div
                      key="hapus-filter-btn"
                      initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        overflow: "visible",
                      }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-center mt-4"
                    >
                      <button
                        onClick={() => {
                          setSelectedDate(null);
                          setJadwalList(originalList);
                        }}
                        className="cursor-pointer px-5 py-2 text-xs font-bold bg-white text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50 hover:text-gray-700 shadow-sm transition-all"
                      >
                        Hapus Filter: {selectedDate} ✕
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TAB & SEARCH NAVIGATION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            {/* TABS */}
            <div className="flex w-full md:w-auto p-1 bg-gray-50/50 rounded-xl relative">
              {["menunggu", "terjadwal", "selesai"].map((t) => {
                const isActive = tab === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t as any)}
                    className={`cursor-pointer relative flex-1 md:w-32 py-2.5 text-sm font-bold capitalize transition-all z-10 
                      ${isActive ? "text-[#1E5C58]" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabObservasi"
                        className="absolute inset-0 bg-white rounded-lg shadow-sm border border-teal-50"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative flex items-center justify-center gap-1.5 z-20">
                      {t === "menunggu" && <Activity className="w-4 h-4" />}
                      {t === "terjadwal" && (
                        <CalendarIcon className="w-4 h-4" />
                      )}
                      {t === "selesai" && <CheckCircle2 className="w-4 h-4" />}
                      {t}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* SEARCH */}
            <div className="flex w-full md:w-auto gap-2">
              {tab === "selesai" && (
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] text-[#1E5C58]"
                />
              )}

              <div className="relative flex-1 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <SearchIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari pasien / orangtua..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] transition-all font-medium text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* TABLE */}
          {/* Table Container (Desktop) & Cards (Mobile) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-teal-50 overflow-visible flex-1 flex flex-col"
          >
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-visible pb-24">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#F4F9F8] border-b border-teal-100">
                    <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                      Informasi Pasien
                    </th>
                    {tab === "menunggu" && (
                      <>
                        <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                          Detail Anak
                        </th>
                        <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                          Kontak Wali
                        </th>
                      </>
                    )}
                    {tab === "terjadwal" && (
                      <>
                        <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                          Jadwal Observasi
                        </th>
                        <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                          Administrator
                        </th>
                      </>
                    )}
                    {tab === "selesai" && (
                      <>
                        <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                          Jadwal Observasi
                        </th>
                        <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                          Administrator
                        </th>
                        <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                          Status Asesmen
                        </th>
                      </>
                    )}
                    <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider text-center">
                      Tindakan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-gray-400"
                      >
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-8 h-8 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
                          <p className="text-sm font-medium">
                            Memuat data observasi...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-red-500 font-medium"
                      >
                        {error}
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-gray-400"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <ListTodo className="w-10 h-10 text-gray-300 mb-2" />
                          <p className="text-sm font-medium">
                            Tidak ada data jadwal ditemukan.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((j) => (
                      <tr
                        key={j.observation_id}
                        className="hover:bg-[#F4F9F8]/50 transition-colors group"
                      >
                        {/* Info Pasien (All Tabs) */}
                        <td className="py-4 px-6">
                          <p className="text-sm font-bold text-[#1E5C58] mb-1">
                            {j.nama || "Tidak ada nama"}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full capitalize">
                              Wali: {j.orangtua || "-"}
                            </span>
                          </div>
                        </td>

                        {/* --- TAB MENUNGGU --- */}
                        {tab === "menunggu" && (
                          <>
                            <td className="py-4 px-6">
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                                  <Activity className="w-3.5 h-3.5 text-teal-600" />{" "}
                                  {j.usia || "-"} Tahun •{" "}
                                  {j.jenisKelamin || "-"}
                                </div>
                                <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                                  <BookOpen className="w-3.5 h-3.5" />{" "}
                                  {j.sekolah || "Tidak ada asal sekolah"}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm font-medium text-gray-600">
                              {j.telepon || "-"}
                            </td>
                          </>
                        )}

                        {/* --- TAB TERJADWAL & SELESAI --- */}
                        {(tab === "terjadwal" || tab === "selesai") && (
                          <>
                            <td className="py-4 px-6">
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-[#2B7A75] flex items-center gap-1.5">
                                  <CalendarIcon className="w-4 h-4" />{" "}
                                  {j.tanggalObservasi || "Belum ditentukan"}
                                </div>
                                <div className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" /> Pukul{" "}
                                  {j.waktu || "-"}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg w-fit">
                                <UserCheck className="w-3.5 h-3.5" />{" "}
                                {j.observer || "-"}
                              </div>
                            </td>
                          </>
                        )}

                        {/* --- KHUSUS TAB SELESAI (Status) --- */}
                        {tab === "selesai" && (
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider
                              ${
                                j.assessment_status
                                  ?.toLowerCase()
                                  .includes("selesai")
                                  ? "bg-green-100 text-green-700"
                                  : j.assessment_status
                                        ?.toLowerCase()
                                        .includes("menunggu")
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {j.assessment_status || "Terdata"}
                            </span>
                          </td>
                        )}

                        {/* Aksi Button */}
                        <td className="py-4 px-6 text-center relative">
                          {tab === "menunggu" && (
                            <button
                              onClick={() => {
                                setSelectedPasien(j);
                                setOpenAsesmen(true);
                              }}
                              className="cursor-pointer px-4 py-2 text-xs font-bold rounded-xl bg-[#2B7A75] hover:bg-[#1E5C58] text-white transition-all shadow-md shadow-teal-500/20 active:scale-95 inline-flex gap-1.5 items-center justify-center m-auto"
                            >
                              <CalendarIcon className="w-3.5 h-3.5" /> Atur
                              Jadwal
                            </button>
                          )}

                          {tab === "terjadwal" && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPasien(j);
                                  setOpenDropdown(
                                    openDropdown === j.observation_id
                                      ? null
                                      : j.observation_id,
                                  );
                                }}
                                className="cursor-pointer px-4 py-2 text-xs font-bold text-amber-700 border border-amber-200 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all shadow-sm active:scale-95 inline-flex items-center justify-center m-auto"
                              >
                                Kelola{" "}
                                <ChevronDown size={14} className="ml-1" />
                              </button>

                              {/* Dropdown Terjadwal */}
                              <AnimatePresence>
                                {openDropdown === j.observation_id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex flex-col p-1">
                                      <button
                                        onClick={() => handleAturAsesmen(j)}
                                        className="cursor-pointer flex items-center w-full px-3 py-2 text-xs font-bold text-gray-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors"
                                      >
                                        <Settings size={14} className="mr-2" />{" "}
                                        Edit Jadwal
                                      </button>
                                      <button
                                        onClick={async () => {
                                          try {
                                            const token =
                                              localStorage.getItem("token");
                                            const res = await fetch(
                                              `/api/observations/${j.observation_id}/detail?type=scheduled`,
                                              {
                                                headers: {
                                                  Authorization: `Bearer ${token}`,
                                                },
                                              },
                                            );
                                            const data = await res.json();
                                            setSelectedObservation(data.data);
                                            setOpenDetail(true);
                                            setOpenDropdown(null);
                                          } catch {
                                            alert(
                                              "Gagal memuat detail observasi",
                                            );
                                          }
                                        }}
                                        className="cursor-pointer flex items-center w-full px-3 py-2 text-xs font-bold text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-colors"
                                      >
                                        <Eye size={14} className="mr-2" /> Lihat
                                        Rincian
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          )}

                          {tab === "selesai" && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPasien(j);
                                  setOpenDropdown(
                                    openDropdown === j.observation_id
                                      ? null
                                      : j.observation_id,
                                  );
                                }}
                                className="cursor-pointer px-4 py-2 text-xs font-bold text-gray-700 border border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all shadow-sm active:scale-95 inline-flex items-center justify-center m-auto"
                              >
                                Tindakan Lanjut{" "}
                                <ChevronDown size={14} className="ml-1" />
                              </button>

                              {/* Dropdown Selesai */}
                              <AnimatePresence>
                                {openDropdown === j.observation_id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex flex-col p-1 gap-1">
                                      <button
                                        onClick={() => handleAturAsesmen(j)}
                                        className="cursor-pointer flex items-center w-full px-3 py-2.5 text-xs font-bold text-[#2B7A75] bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors"
                                      >
                                        <Settings size={14} className="mr-2" />{" "}
                                        Atur Jadwal Asesmen
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleRiwayatJawaban(j.observation_id)
                                        }
                                        className="cursor-pointer flex items-center w-full px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                                      >
                                        <Clock3 size={14} className="mr-2" />{" "}
                                        Riwayat Jawaban
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleLihatHasil(j.observation_id)
                                        }
                                        className="cursor-pointer flex items-center w-full px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                                      >
                                        <Eye size={14} className="mr-2" />{" "}
                                        Laporan Hasil
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex-1 overflow-y-auto w-full p-4 space-y-4">
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-400">
                  <div className="w-8 h-8 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
                  <p className="text-sm font-medium">Memuat data...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <ListTodo className="w-10 h-10 text-gray-300 mb-2" />
                  <p className="text-sm font-medium">
                    Tidak ada data ditemukan.
                  </p>
                </div>
              ) : (
                filtered.map((j) => (
                  <div
                    key={j.observation_id}
                    className="bg-[#F4F9F8]/30 border border-teal-50 rounded-2xl p-4 shadow-xs"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-bold text-[#1E5C58]">
                          {j.nama}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                          Wali: {j.orangtua || "-"}
                        </p>
                      </div>
                      {tab === "selesai" && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest
                          ${
                            j.assessment_status
                              ?.toLowerCase()
                              .includes("selesai")
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : j.assessment_status
                                    ?.toLowerCase()
                                    .includes("menunggu")
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {j.assessment_status || "Terdata"}
                        </span>
                      )}
                    </div>

                    <div className="bg-white/50 p-3 rounded-xl border border-white/50 space-y-3 mb-4">
                      {tab === "menunggu" ? (
                        <>
                          <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                            <Activity className="w-3.5 h-3.5 text-teal-600/60" />
                            {j.usia || "-"} Tahun • {j.jenisKelamin || "-"}
                          </div>
                          <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                            <BookOpen className="w-3.5 h-3.5 text-teal-600/60" />
                            <span className="truncate">{j.sekolah}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                            <Phone className="w-3.5 h-3.5 text-teal-600/60" />
                            {j.telepon || "-"}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2.5 text-xs font-bold text-[#2B7A75]">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            {j.tanggalObservasi || "Belum ditentukan"}
                          </div>
                          <div className="flex items-center gap-2.5 text-[11px] font-bold text-gray-500 ml-1">
                            <Clock className="w-3 h-3" />
                            Pukul {j.waktu || "-"}
                          </div>
                          <div className="h-px bg-teal-50/50 w-full" />
                          <div className="flex items-center gap-2.5 text-xs text-teal-700 font-bold">
                            <UserCheck className="w-3.5 h-3.5" />
                            {j.observer || "-"}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-teal-50/50">
                      <p className="text-[10px] font-bold text-gray-300 italic">
                        ID: #{j.observation_id}
                      </p>

                      <div className="flex gap-2">
                        {tab === "menunggu" && (
                          <button
                            onClick={() => {
                              setSelectedPasien(j);
                              setOpenAsesmen(true);
                            }}
                            className="px-3 py-1.5 bg-[#2B7A75] text-white rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-all"
                          >
                            Atur Jadwal
                          </button>
                        )}

                        {tab === "terjadwal" && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleAturAsesmen(j)}
                              className="p-1.5 bg-white border border-teal-50 text-amber-600 rounded-lg shadow-xs active:scale-90 transition-transform"
                            >
                              <Settings size={16} />
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem("token");
                                  const res = await fetch(
                                    `/api/observations/${j.observation_id}/detail?type=scheduled`,
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    },
                                  );
                                  const data = await res.json();
                                  setSelectedObservation(data.data);
                                  setOpenDetail(true);
                                } catch {
                                  alert("Gagal memuat detail observasi");
                                }
                              }}
                              className="p-1.5 bg-white border border-teal-50 text-[#2B7A75] rounded-lg shadow-xs active:scale-90 transition-transform"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        )}

                        {tab === "selesai" && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleAturAsesmen(j)}
                              className="p-1.5 bg-teal-50 text-[#2B7A75] rounded-lg font-bold text-[10px] border border-teal-100 flex items-center gap-1 active:scale-95"
                              title="Jadwal Asesmen"
                            >
                              <Settings size={14} /> Asesmen
                            </button>
                            <button
                              onClick={() =>
                                handleRiwayatJawaban(j.observation_id)
                              }
                              className="p-1.5 bg-white border border-teal-50 text-gray-500 rounded-lg shadow-xs active:scale-90 transition-transform"
                            >
                              <Clock3 size={15} />
                            </button>
                            <button
                              onClick={() => handleLihatHasil(j.observation_id)}
                              className="p-1.5 bg-white border border-teal-50 text-gray-500 rounded-lg shadow-xs active:scale-90 transition-transform"
                            >
                              <Eye size={15} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Table Info */}
            <div className="bg-white border-t border-gray-100 px-6 py-4 rounded-b-3xl">
              <p className="text-xs font-medium text-gray-500">
                Menampilkan{" "}
                <span className="font-bold text-[#1E5C58]">
                  {filtered.length}
                </span>{" "}
                rekam jadwal {tab}
              </p>
            </div>
          </motion.div>
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

      {/* MODAL ATUR ASESMEN */}
      {openAsesmen && selectedPasien && (
        <FormAturAsesmen
          title={
            tab === "menunggu"
              ? "Atur Jadwal Observasi"
              : tab === "terjadwal"
                ? "Perbarui Jadwal Observasi"
                : "Buat Jadwal Asesmen"
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
              if (tab === "selesai") {
                await createObservationAgreement(
                  selectedPasien.observation_id,
                  date,
                  time,
                );
                alert("Asesmen berhasil dijadwalkan!");
              } else {
                await updateObservationSchedule(
                  selectedPasien.observation_id,
                  date,
                  time,
                );
                alert("Jadwal observasi sukses disimpan!");
              }
              setOpenAsesmen(false);
              setSelectedPasien(null);
              fetchJadwal();
            } catch (err) {
              console.error(err);
              alert("Gagal menyimpan jadwal.");
            }
          }}
        />
      )}
    </div>
  );
}
