// src/lib/api/dashboardTerapis.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";

// -----------------------------------------------------
// 1. Upcoming Schedules (Dashboard Terapis)
// -----------------------------------------------------
export async function getUpcomingSchedules(page: number = 1) {
  try {
    const res = await axiosInstance.get(
      `/asse-thera/upcoming-schedules`,
      {
        params: { page },
      }
    );

    /**
     * Response BE:
     * {
     *   success: true,
     *   message: "Upcoming schedules",
     *   data: []
     * }
     */
    return res.data;
  } catch (error: any) {
    console.error("Error fetching upcoming schedules:", error);
    throw new Error(
      error.response?.data?.message ||
        "Gagal mengambil jadwal terdekat"
    );
  }
}

// -----------------------------------------------------
// 2. Dashboard Metrics (Filter Month & Year)
// -----------------------------------------------------
export async function getDashboardMetrics(
  month?: number | string,
  year?: number | string
) {
  try {
    const params: Record<string, string | number> = {};

    if (month !== undefined && month !== "")
      params.month = month;

    if (year !== undefined && year !== "")
      params.year = year;

    const res = await axiosInstance.get(
      `/asse-thera/dashboard`,
      { params }
    );

    /**
     * Response BE:
     * {
     *   success: true,
     *   data: {
     *     period: {...},
     *     metrics: {...},
     *     patient_categories: [],
     *     trend_chart: []
     *   }
     * }
     */
    return res.data;
  } catch (error: any) {
    console.error("Error fetching dashboard metrics:", error);
    throw new Error(
      error.response?.data?.message ||
        "Gagal mengambil data dashboard terapis"
    );
  }
}
