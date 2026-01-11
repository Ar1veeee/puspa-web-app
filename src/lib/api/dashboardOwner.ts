// lib/api/dashboardOwner.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";

// ---------------------------------------------
// GET OWNER DASHBOARD
// ---------------------------------------------
export async function getOwnerDashboard(month: number, year: number) {
  try {
    const res = await axiosInstance.get("/owners/dashboard", {
      params: {
        month,
        year,
      },
    });

    return res.data;
  } catch (error: any) {
    console.error(
      "Error fetching owner dashboard:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Failed to load Owner Dashboard"
    );
  }
}
