// lib/api/dashboardOrtu.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";

// -----------------------------------------------------
// GET DASHBOARD STATS
// -----------------------------------------------------
export async function getOrtuDashboardStats() {
  try {
    const res = await axiosInstance.get("/my/dashboard/stats");
    return res.data;
  } catch (error: any) {
    console.error("❌ Error getOrtuDashboardStats:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Gagal memuat statistik dashboard orangtua");
  }
}

// -----------------------------------------------------
// GET CHART DATA
// -----------------------------------------------------
export async function getOrtuDashboardChart() {
  try {
    const res = await axiosInstance.get("/my/dashboard/chart");
    return res.data;
  } catch (error: any) {
    console.error("❌ Error getOrtuDashboardChart:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Gagal memuat chart dashboard orangtua");
  }
}

// -----------------------------------------------------
// GET UPCOMING SCHEDULES (all | observation | assessment)
// -----------------------------------------------------
export async function getOrtuUpcomingSchedules(type: string = "all") {
  try {
    const res = await axiosInstance.get("/my/dashboard/upcoming-schedules", {
      params: { type },
    });

    const data = res.data?.data || [];

    // --- Jika type = all → langsung return semua ---
    if (type === "all") {
      return {
        success: true,
        message: res.data?.message || "Upcoming schedules",
        data,
      };
    }

    // Pastikan filter FE sesuai data BE:
    // BE mengirim: "service_type": "Assessment" / "Observation"
    const filtered = data.filter((item: any) => {
      if (!item.service_type) return false;

      return item.service_type.toLowerCase() === type.toLowerCase();
    });

    return {
      success: true,
      message: res.data?.message || "Upcoming schedules",
      data: filtered,
    };

  } catch (error: any) {
    console.error("❌ Error getOrtuUpcomingSchedules:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Gagal memuat jadwal mendatang");
  }
}
