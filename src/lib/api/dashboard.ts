/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";

// ==========================
// TYPE DEFINITIONS
// ==========================
export interface DashboardDate {
  current: string;
  formatted: string;
}

export interface DashboardMetrics {
  assessment_today: number;
  observation_today: number;
  active_patients: number;
}

export interface PatientCategory {
  type: string;
  type_key: string;
  count: string;
  percentage: number;
}

export interface DashboardStats {
  date: DashboardDate;
  metrics: DashboardMetrics;
  patient_categories: PatientCategory[];
}

// ==========================
// API CALL
// ==========================
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await api.get("/admins/dashboard/stats");

    // Debug jika API mengirim HTML, bukan JSON
    if (typeof res.data !== "object") {
      console.error("❌ Dashboard API mengirim non-JSON:", res.data);
      throw new Error("Dashboard API returned invalid JSON");
    }

    return res.data?.data;
  } catch (error: any) {
    console.error("❌ Gagal mengambil dashboard stats:", error.response || error);
    throw error;
  }
}
