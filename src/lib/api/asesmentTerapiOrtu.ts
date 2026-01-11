/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";

// Daftar tipe assessment parent yang valid
export type ParentAssessmentType =
  | "parent_general"
  | "parent_fisio"
  | "parent_wicara"
  | "parent_okupasi"
  | "parent_paedagog";

// Fetch pertanyaan assessment parent
export const getParentAssessmentQuestions = async (
  type: ParentAssessmentType
) => {
  try {
    const endpoint = `/my/assessments/${type}/question`;
    const res = await axiosInstance.get(endpoint);

    return res.data;
  } catch (error: any) {
    console.error(`Error fetching parent assessment questions (${type}):`, error);
    throw new Error(
      error.response?.data?.message || "Gagal mengambil data pertanyaan"
    );
  }
};

export type ParentSubmitType =
  | "fisio_parent"
  | "umum_parent"
  | "wicara_parent"
  | "paedagog_parent"
  | "okupasi_parent";

// ==============================
// API SUBMIT JAWABAN PARENT
// ==============================
export const submitParentAssessment = async (
  assessmentId: string | number,
  type: ParentSubmitType,
  payload: any
) => {
  try {
    const endpoint = `/my/assessments/${assessmentId}/submit/${type}`;

    const res = await axiosInstance.post(endpoint, payload);

    return res.data;
  } catch (error: any) {
    console.error(`Error submitting parent assessment (${type}):`, error);
    throw new Error(
      error.response?.data?.message ||
        "Gagal mengirim jawaban assessment parent"
    );
  }
};

export const getParentAssessmentAnswers = async (
  assessmentId: string | number,
  type: ParentSubmitType // "fisio_parent", "wicara_parent", "paedagog_parent", "okupasi_parent", "umum_parent"
) => {
  try {
    const endpoint = `/my/assessments/${assessmentId}/answer/${type}`;
    const res = await axiosInstance.get(endpoint);

    return res.data;
  } catch (error: any) {
    console.error(`Error fetching parent assessment answers (${type}):`, error);
    throw new Error(
      error.response?.data?.message || "Gagal mengambil jawaban assessment parent"
    );
  }
};

// ==============================
// API UPDATE IDENTITAS ORANG TUA
// ==============================
export interface ParentIdentityPayload {
  father_identity_number: string | null;
  father_name: string | null;
  father_phone: string | null;
  father_birth_date: string | null;
  father_occupation: string | null;
  father_relationship: string | null;

  mother_identity_number: string | null;
  mother_name: string | null;
  mother_phone: string | null;
  mother_birth_date: string | null;
  mother_occupation: string | null;
  mother_relationship: string | null;

  guardian_identity_number: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  guardian_birth_date: string | null;
  guardian_occupation: string | null;
  guardian_relationship: string | null;

  _method?: string;
}

// ==============================
// API UPDATE IDENTITAS ORANG TUA
// ==============================
export const updateParentIdentity = async (payload: ParentIdentityPayload) => {
  try {
    const cleanPayload = Object.fromEntries(
      Object.entries(payload).map(([key, val]) => [key, val ?? ""])
    );

    const endpoint = `/my/identity`;

    const body = {
      ...cleanPayload,
      _method: "PUT",
    };

    const res = await axiosInstance.post(endpoint, body);

    return res.data;
  } catch (error: any) {
    console.error("❌ Error updating parent identity:", error.response?.data);
    throw new Error(
      error.response?.data?.message ||
        "Gagal memperbarui data identitas orang tua"
    );
  }
};
