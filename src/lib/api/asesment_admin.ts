/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";

/* =======================
   INTERFACE
======================= */
export interface Assessment {
  id: number;
  assessment_id: number;
  child_id: string;
  child_name: string;
  guardian_name: string;
  guardian_phone: string;
  type: "paedagog" | "okupasi" | "wicara" | "fisio";
  administrator: string;
  assessor: string | null;
  scheduled_date?: string;
  scheduled_time?: string;
  status: "scheduled" | "completed";
}

/* =======================
   GET ASSESSMENTS (ADMIN)
======================= */
export const getAssessmentsAdmin = async ({
  status,
  type,
  date,
  search,
  limit = 20,
}: {
  status: "scheduled" | "completed";
  type?: "paedagog" | "okupasi" | "wicara" | "fisio";
  date?: string;
  search?: string;
  limit?: number;
}): Promise<Assessment[]> => {
  const endpoint =
    status === "scheduled"
      ? "/assessments/scheduled/admin"
      : "/assessments/completed/admin";

  try {
    const params: Record<string, any> = { limit };

    if (type) params.type = type;
    if (date) params.date = date;
    if (search) params.search = search;

    const res = await axiosInstance.get(endpoint, { params });
    return res.data?.data ?? [];
  } catch (error: any) {
    console.error("❌ getAssessmentsAdmin error:", {
      endpoint,
      status: error.response?.status,
      message: error.response?.data || error.message,
    });
    throw error;
  }
};

/* =======================
   DETAIL ASSESSMENT (ADMIN)
======================= */
export interface AssessmentDetail {
  observation_id: number;
  child_name: string;
  child_birth_date: string;
  child_age: string;
  child_gender: string;
  child_school: string;
  child_address: string;
  scheduled_date: string;
  scheduled_time: string;
  parent_type: string;
  parent_name: string;
  relationship: string;
  parent_phone: string;
  admin_name: string;
  type: string;
}

export const getAssessmentDetailAdmin = async (
  assessmentId: number
): Promise<AssessmentDetail> => {
  try {
    const res = await axiosInstance.get(
      `/assessments/${assessmentId}/detail/admin`
    );
    return res.data?.data;
  } catch (error: any) {
    console.error("❌ getAssessmentDetailAdmin error:", {
      assessmentId,
      status: error.response?.status,
      message: error.response?.data || error.message,
    });
    throw error;
  }
};

/* =======================
   GET ANSWERS (ADMIN)
   ⚠️ REUSE ENDPOINT ASSESSOR (READ-ONLY)
======================= */
export interface AssessmentAnswerItem {
  question_id: number;
  question_text: string;
  answer: any;
  note: string | null;
}

export const getAssessmentAnswersAdmin = async (
  assessmentId: number,
  type: "paedagog" | "okupasi" | "wicara" | "fisio"
): Promise<AssessmentAnswerItem[]> => {
  try {
    const res = await axiosInstance.get(
      `/assessments/${assessmentId}/answer/${type}_assessor`
    );
    return res.data?.data ?? [];
  } catch (error: any) {
    console.error("❌ getAssessmentAnswersAdmin error:", {
      assessmentId,
      type,
      status: error.response?.status,
      message: error.response?.data || error.message,
    });
    throw error;
  }
};

/* =======================
   GET QUESTIONS (ADMIN)
======================= */
export const getAssessmentQuestionsAdmin = async (
  type:
    | "paedagog"
    | "okupasi"
    | "wicara_oral"
    | "wicara_bahasa"
    | "fisio"
) => {
  const endpoint = `/assessments/${type}/question`;

  try {
    const res = await axiosInstance.get(endpoint);
    const data = res.data?.data ?? {};

    return {
      assessment_type: data.assessment_type || type,
      groups: Array.isArray(data.groups) ? data.groups : [],
    };
  } catch (error: any) {
    console.error("❌ getAssessmentQuestionsAdmin error:", {
      endpoint,
      status: error.response?.status,
      message: error.response?.data || error.message,
    });
    throw error;
  }
};
