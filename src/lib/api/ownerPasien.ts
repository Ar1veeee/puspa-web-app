/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";

// ===============================
// GET THERAPIST BELUM TERVERIFIKASI
// ===============================
function formatDate(dateString: string) {
  if (!dateString) return "";
  return dateString.split(" ").slice(0, 3).join(" "); // contoh: "01 December 2025"
}
export async function getAllChildren() {
  try {
    const response = await axiosInstance.get("/children");

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
    console.error("API Error getAllPatients:", error);

    return {
      success: false,
      message: error.response?.data?.message || "Terjadi kesalahan",
      data: [],
    };
  }
}
