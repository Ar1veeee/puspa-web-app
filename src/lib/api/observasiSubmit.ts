/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";


// ==================== Interface ====================
export interface CompletedObservationDetail {
  observation_id: number;
  child_name: string;
  child_birth_place_date: string;
  child_age: string;
  child_gender: string;
  child_school: string;
  child_address: string;
  parent_name: string;
  parent_type: string;
  total_score: number;
  recommendation: string;
  conclusion: string;
  scheduled_date?: string;
}

// ==================== Header Token ====================
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";
  return {
    Authorization: `${tokenType} ${token}`,
    "Content-Type": "application/json",
  };
};

// ==================== Observations API ====================

// 🟢 Ambil daftar observasi scheduled atau completed
export const getObservations = async (
  status: "scheduled" | "completed",
  date?: string,
  nama?: string
): Promise<any[]> => {
  try {
    const params: Record<string, string> = {};
    if (date) params.scheduled_date = date;
    if (nama) params.child_name = nama;

    const res = await axiosInstance.get(`/observations/${status}`, {
      headers: getAuthHeaders(),
      params,
    });

    return res.data?.data ?? [];
  } catch (err: any) {
    console.error(`❌ Gagal ambil data observasi (${status}):`, err);
    throw err;
  }
};

// 🟢 Ambil detail observation scheduled/completed
export type ObservationDetailType =
  | "scheduled"
  | "completed"
  | "question"
  | "answer";

// 🟢 Ambil detail observasi (scheduled / completed / question / answer)
export const getObservationDetail = async (
  observation_id: string,
  type: ObservationDetailType
): Promise<any> => {
  if (!observation_id) return null;
  try {
    const res = await axiosInstance.get(
      `/observations/${observation_id}/detail`,
      {
        headers: getAuthHeaders(),
        params: { type },
      }
    );

    return res.data?.data ?? null;
  } catch (err: any) {
    console.error("❌ Gagal ambil detail observasi:", err);
    return null;
  }
};


// 🟢 Ambil pertanyaan observasi
export const getObservationQuestions = async (observation_id: string): Promise<any[]> => {
  if (!observation_id) return [];
  try {
    const res = await axiosInstance.get(
      `/observations/${observation_id}/detail?type=question`,
      { headers: getAuthHeaders() }
    );
    return res.data?.data ?? [];
  } catch (err: any) {
    console.error("❌ Gagal ambil pertanyaan:", err);
    throw err;
  }
};

// 🟢 Submit hasil observasi
export const submitObservation = async (observation_id: string, payload: any): Promise<any> => {
  try {
    const res = await axiosInstance.post(`/observations/${observation_id}/submit`, payload, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err: any) {
    console.error("❌ Gagal submit observasi:", err);
    throw err;
  }
};
// 🟢 Ambil jawaban observasi (answer_details)
export const getObservationAnswers = async (observation_id: string): Promise<any[]> => {
  if (!observation_id) return [];
  try {
    const res = await axiosInstance.get(
      `/observations/${observation_id}/detail?type=completed`,
      { headers: getAuthHeaders() }
    );

    return res.data?.data?.answer_details || [];
  } catch (err: any) {
    console.error("❌ Gagal ambil jawaban observasi:", err);
    return [];
  }
};

