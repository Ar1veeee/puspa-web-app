// lib/api/ownerAdmin.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";

// ===============================
// GET ADMIN BELUM TERVERIFIKASI
// ===============================
function formatDate(dateString: string) {
  if (!dateString) return "";
  return dateString.split(" ").slice(0, 3).join(" "); // contoh: "01 December 2025"
}

export async function getUnverifiedAdmins() {
  try {
    const response = await axiosInstance.get("/users/admin/unverified");

    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data || [],
    };
  } catch (error: any) {
    console.error("API Error getUnverifiedAdmins:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Terjadi kesalahan",
      data: [],
    };
  }
}

// ===============================
// AKTIVASI ADMIN (GET REQUEST)
// ===============================
export async function activateAdmin(user_id: string) {
  try {
    const response = await axiosInstance.get(`/users/${user_id}/activate`);

    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data || null,
    };
  } catch (error: any) {
    console.error("API Error activateAdmin:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Terjadi kesalahan",
      data: null,
    };
  }
}

export async function getAllAdmins() {
  try {
    const response = await axiosInstance.get("/admins");

    // Format tanggal agar jam tidak muncul
    const formattedData = (response.data.data || []).map((item: any) => ({
      ...item,
      created_at: formatDate(item.created_at),
      updated_at: formatDate(item.updated_at),
    }));

    return {
      success: response.data.success,
      message: response.data.message,
      data: formattedData,
    };
  } catch (error: any) {
    console.error("API Error getAllAdmins:", error);

    return {
      success: false,
      message: error.response?.data?.message || "Terjadi kesalahan",
      data: [],
    };
  }
}

export async function deactivateAdmin(user_id: string) {
  try {
    const response = await axiosInstance.get(`/users/${user_id}/deactive`);

    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data || null,
    };
  } catch (error: any) {
    console.error("API Error deactivateAdmin:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Terjadi kesalahan",
      data: null,
    };
  }
}
