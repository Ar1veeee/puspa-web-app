/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";

// ==============================
// TIPE DATA
// ==============================
export type ParentAnswerType =
  | "umum_parent"
  | "okupasi_parent"
  | "paedagog_parent"
  | "fisio_parent"
  | "wicara_parent";

// ==============================
// FETCH JAWABAN ASSESSMENT PARENT
// ==============================
export const getParentAssessmentAnswer = async (
  assessmentId: string | number,
  type: ParentAnswerType
) => {
  try {
    const endpoint = `/assessments/${assessmentId}/answer/${type}`;
    const res = await axiosInstance.get(endpoint);
    return res.data;
  } catch (error: any) {
    console.error(`❌ Error fetching parent assessment answer (${type}):`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message ||
        "Gagal mengambil jawaban assessment parent"
    );
  }
};

// ==============================
// CONVENIENCE FUNCTIONS (khusus tiap tipe)
// ==============================
export const getUmumParentAnswer = async (assessmentId: string | number) =>
  getParentAssessmentAnswer(assessmentId, "umum_parent");

export const getOkupasiParentAnswer = async (assessmentId: string | number) =>
  getParentAssessmentAnswer(assessmentId, "okupasi_parent");

export const getPaedagogParentAnswer = async (assessmentId: string | number) =>
  getParentAssessmentAnswer(assessmentId, "paedagog_parent");

export const getFisioParentAnswer = async (assessmentId: string | number) =>
  getParentAssessmentAnswer(assessmentId, "fisio_parent");

export const getWicaraParentAnswer = async (assessmentId: string | number) =>
  getParentAssessmentAnswer(assessmentId, "wicara_parent");
