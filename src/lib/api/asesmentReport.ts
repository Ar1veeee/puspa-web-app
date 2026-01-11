import api from "@/lib/axios";

/**
 * Upload report assessment (PDF)
 * Endpoint:
 * POST /assessments/{assessment_id}/report-upload
 */
export async function uploadAssessmentReport(
  assessmentId: number,
  file: File
) {
  const formData = new FormData();
  formData.append("report-file", file); // HARUS sama dengan key di Postman

  return api.post(
    `/assessments/${assessmentId}/report-upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}
