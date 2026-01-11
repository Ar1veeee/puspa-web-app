/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import CardInfo from "@/components/dashboard/card_info";
import JadwalTable from "@/components/dashboard/jadwal_table";
import PasienChartAdmin from "@/components/dashboard/pasien_chart_admin";
import FormTambahAdmin from "@/components/form/FormTambahAdmin";
import FormTambahTerapis from "@/components/form/FormTambahTerapis";
import { Menu, X } from "lucide-react";
import api from "@/lib/axios";
import { addAdmin } from "@/lib/api/data_admin";
import { addTerapis } from "@/lib/api/data_terapis";
import {
  getDashboardStats,
  getTodaySchedule,
  DashboardStats,
  PatientCategory,
  TodaySchedule,
} from "@/lib/api/dashboard_admin";

// =======================
// Main Dashboard Component
// =======================
export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<TodaySchedule[]>([]);
  const [patientCategories, setPatientCategories] = useState<PatientCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [openTambahAdmin, setOpenTambahAdmin] = useState(false);
  const [openTambahTerapis, setOpenTambahTerapis] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTambahAdmin = async (data: {
    admin_name: string;
    username: string;
    email: string;
    admin_phone: string;
    password?: string;
  }) => {
    try {
      await addAdmin(data);
      setOpenTambahAdmin(false);
      fetchDashboardData();
    } catch (error) {
      console.error("❌ Gagal menambah admin dari dashboard:", error);
    }
  };

  const handleTambahTerapis = async (data: {
    nama: string;
    bidang: string;
    username: string;
    email: string;
    telepon: string;
    password: string;
  }) => {
    try {
      await addTerapis(data);
      setOpenTambahTerapis(false);
      fetchDashboardData(); // refresh data dashboard
      alert("Terapis berhasil ditambahkan!");
    } catch (err) {
      console.error("❌ Gagal menambah terapis dari dashboard:", err);
      alert("Gagal menambah terapis");
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, scheduleData] = await Promise.all([getDashboardStats(), getTodaySchedule()]);
      setTodaySchedule(scheduleData);
      if (statsData) {
        setStats(statsData);
        setPatientCategories(statsData.patient_categories || []);
      } else {
        setStats(null);
      }
    } catch (error) {
      console.error("❌ Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-20 inset-y-0 left-0 w-64 max-w-full bg-white shadow-md
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar />
      </aside>

      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-30 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Toggle sidebar button */}
      <button
        className="fixed top-4 left-4 z-30 p-2 rounded-md bg-gray-200 hover:bg-gray-300 md:hidden shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <main className="flex-1 flex flex-col overflow-x-hidden">
        <Header />

        <div className="p-6 flex flex-col gap-6">
          {/* Card Info + Buttons */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1 w-full">
              <CardInfo stats={stats} loading={loading} date={stats?.date?.formatted || ""} />
            </div>

            <div className="flex flex-col gap-4 w-full md:w-auto">
              <button
                onClick={() => setOpenTambahAdmin(true)}
                className="px-4 py-2 rounded-lg bg-[#81B7A9] text-white shadow hover:bg-[#6356C1] transition-colors w-full md:w-auto"
                disabled={loading}
              >
                + Tambah Admin
              </button>

              <button
                onClick={() => setOpenTambahTerapis(true)}
                className="px-4 py-2 rounded-lg bg-[#81B7A9] text-white shadow hover:bg-[#6356C1] transition-colors w-full md:w-auto"
                disabled={loading}
              >
                + Tambah Terapis
              </button>
            </div>
          </div>

          {/* Jadwal + Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="overflow-x-auto">
              <JadwalTable jadwal={todaySchedule} loading={loading} emptyMessage="Tidak ada jadwal hari ini" />
            </div>

            <div className="overflow-x-auto">
              <PasienChartAdmin data={patientCategories} loading={loading} />
            </div>
          </div>
        </div>
      </main>

      {/* Forms */}
      <FormTambahAdmin
        open={openTambahAdmin}
        onClose={() => setOpenTambahAdmin(false)}
        onSave={handleTambahAdmin}
      />

      <FormTambahTerapis
        open={openTambahTerapis}
        onClose={() => setOpenTambahTerapis(false)}
        onSave={handleTambahTerapis}
      />
    </div>
  );
}