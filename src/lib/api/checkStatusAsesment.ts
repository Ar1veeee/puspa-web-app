import axiosInstance from "@/lib/axios";

/* =======================
 * TYPES
 * ======================= */

export interface AssessmentDetail {
  assessment_detail_id: number;
  type: "umum" | "fisio" | string;
  status: "scheduled" | "completed" | string;
  scheduled_date: string;
  scheduled_time: string;
  completed_at: string | null;
  parent_completed_status: "pending" | "completed" | string;
  parent_completed_at: string | null;
  therapist_id: string | null;
  admin_id: string;
}

export interface AssessmentReport {
  available: boolean;
  uploaded_at: string | null;
  download_url: string | null;
}

export interface AssessmentData {
  assessment_id: number;
  details: AssessmentDetail[];
  report: AssessmentReport;
}

export interface GetAssessmentResponse {
  success: boolean;
  message: string;
  data: AssessmentData;
}

/* =======================
 * API FUNCTION
 * ======================= */

/**
 * Get assessment detail & check report download availability
 */
export const getMyAssessmentDetail = async (
  assessmentId: number | string
): Promise<AssessmentData> => {
  const res = await axiosInstance.get<GetAssessmentResponse>(
    `/my/assessments/${assessmentId}`
  );

  return res.data.data;
};
