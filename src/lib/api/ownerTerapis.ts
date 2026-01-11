// lib/api/therapist.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";

// ===============================
// GET THERAPIST BELUM TERVERIFIKASI
// ===============================
function formatDate(dateString: string) {
  if (!dateString) return "";
  return dateString.split(" ").slice(0, 3).join(" "); // contoh: "01 December 2025"
}

export async function getUnverifiedTherapists() {
  try {
    const response = await axiosInstance.get("/users/therapist/unverified");

    // Format tanggal → ambil hanya 3 bagian pertama (misal: "01 December 2025")
    const formattedData = (response.data.data || []).map((item: any) => ({
      ...item,
      createdAt: item.createdAt?.split(" ").slice(0, 3).join(" "),
      updatedAt: item.updatedAt?.split(" ").slice(0, 3).join(" "),
    }));

    return {
      success: response.data.success,
      message: response.data.message,
      data: formattedData,
    };
  } catch (error: any) {
    console.error("API Error getUnverifiedTherapists:", error);

    return {
      success: false,
      message: error.response?.data?.message || "Terjadi kesalahan",
      data: [],
    };
  }
}

export async function activateTherapist(user_id: string) {
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

export async function getAllTherapists() {
  try {
    const response = await axiosInstance.get("/therapists");

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
    console.error("API Error getAllTherapist:", error);

    return {
      success: false,
      message: error.response?.data?.message || "Terjadi kesalahan",
      data: [],
    };
  }
}

export async function deactivateTherapist(user_id: string) {
  try {
    const response = await axiosInstance.get(`/users/${user_id}/deactive`);
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data || null,
    };
  } catch (error: any) {
    console.error("API Error deactivateTherapist:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Terjadi kesalahan",
      data: null,
    };
  }
}

export async function promoteToAssessor(user_id: string) {
  try {
    const response = await axiosInstance.get(`/users/${user_id}/promote-to-assessor`);

    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data || null,
    };
  } catch (error: any) {
    console.error("API Error promoteToAssessor:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Terjadi kesalahan saat mempromosikan ke asesor",
      data: null,
    };
  }
}

export async function getDetailTerapis(therapist_id: string) {
  try {
    const res = await axiosInstance.get(`/therapists/${therapist_id}`);
    if (!res.data.success) return null;

    const data = res.data.data;

    // 🔹 Map field sesuai response backend
    return {
      user_id: data.user_id, // ✅ langsung ambil dari backend
      therapist_id: data.therapist_id,
      nama: data.therapist_name,
      bidang: data.therapist_section,
      username: data.username,
      email: data.email,
      telepon: data.therapist_phone,
      role: data.role ?? "terapis",
      status: data.status,
      ditambahkan: data.created_at,
      diubah: data.updated_at,
    };
  } catch (error) {
    console.error("❌ getDetailTerapis error:", error);
    return null;
  }
}