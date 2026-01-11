/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";

// ======================================================================
//  TYPE DEFINITIONS - CHILDREN
// ======================================================================
export interface ChildItem {
  child_id: string;
  child_name: string;
  child_gender: string;
  child_birth_date: string;
  child_birth_info: string;
  child_age: string;
  child_school: string;
}

export interface ChildDetail {
  child_id: string;

  child_name: string;
  child_birth_date: string;
  child_birth_info: string;
  child_age: string;
  child_gender: string;
  child_religion: string;
  child_school: string;
  child_address: string;

  father_identity_number: string;
  father_name: string;
  father_phone: string;
  father_birth_date: string;
  father_occupation: string;
  father_relationship: string;

  mother_identity_number: string;
  mother_name: string;
  mother_phone: string;
  mother_birth_date: string;
  mother_occupation: string;
  mother_relationship: string;

  guardian_identity_number: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  guardian_birth_date: string | null;
  guardian_occupation: string | null;
  guardian_relationship: string | null;

  child_complaint: string;
  child_service_choice: string;
}

export interface ChildrenResponse {
  success: boolean;
  message: string;
  data: ChildItem[];
}

export interface AssessmentItem {
  assessment_id: string;
  child_id: string;
  family_id: string;
  child_name: string;
  child_birth_info: string;
  child_age: string;
  child_gender: string;
  child_school: string;
  scheduled_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AssessmentResponse {
  success: boolean;
  message: string;
  data: AssessmentItem[];
}


// ======================================================================
// GET MY ASSESSMENTS
// ======================================================================

export async function getMyAssessments(): Promise<AssessmentResponse> {
  try {
    const token = localStorage.getItem("token");

    const res = await axiosInstance.get("/my/assessments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data as AssessmentResponse;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
}

// ======================================================================
// GET DETAIL MY ASSESSMENT (BY assessment_id)
// ======================================================================
// ======================================================================
// GET DETAIL ASSESSMENT
// ======================================================================
export interface AssessmentDetailItem {
  assessment_detail_id: number;
  type: string; // umum, wicara, paedagog, fisioterapi, okupasi
  status: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  completed_at: string | null;
  parent_completed_status: string | null;
  parent_completed_at: string | null;
  therapist_id: string | null;
  admin_id: string | null;
}

export interface AssessmentDetailResponse {
  success: boolean;
  message: string;
  data: {
    assessment_id: number;
    details: AssessmentDetailItem[];
  };
}

export async function getMyAssessmentDetail(
  assessmentId: string
): Promise<AssessmentDetailResponse> {
  try {
    const token = localStorage.getItem("token");

    const res = await axiosInstance.get(`/my/assessments/${assessmentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data as AssessmentDetailResponse;
  } catch (error) {
    console.error("Error fetching assessment detail:", error);
    throw error;
  }
}


// ======================================================================
//  GET LIST CHILDREN
// ======================================================================
export async function getChildren(): Promise<ChildrenResponse> {
  try {
    const token = localStorage.getItem("token");

    const res = await axiosInstance.get("/my/children", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data as ChildrenResponse;
  } catch (error) {
    console.error("Error fetching children:", error);

    return { success: false, message: "Error", data: [] };
  }
}

// ======================================================================
//  GET DETAIL ANAK
// ======================================================================
export async function getChildDetail(childId: string | number): Promise<ChildDetail> {
  try {
    const token = localStorage.getItem("token");

    const response = await axiosInstance.get(`/my/children/${childId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data;
  } catch (error: any) {
    console.error("Error getChildDetail:", error);
    throw error.response?.data || error;
  }
}

// =======================
export const updateChild = async (childId: string, data: any) => {
  try {
    const token = localStorage.getItem("token");

    if (!childId) {
      console.error("❌ childId tidak ada!");
      throw new Error("Child ID undefined");
    }

    // Backend kamu memakai ULID → selalu UPPERCASE
    const fixedId = String(childId).toUpperCase();

    console.log("➡️ Mengirim update ke:", `/my/children/${fixedId}`);

    const finalData = {
      ...data,
      _method: "PUT",
    };

    const response = await axiosInstance.post(
      `/my/children/${fixedId}`,
      finalData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Update anak sukses:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Gagal update anak:", error.response?.data || error);
    throw error;
  }
};


/// =============================
//  DELETE ANAK (POST + _method DELETE) — FIXED WITH CHILD_ID
// =============================
// =======================
//  DELETE ANAK (POST + _method DELETE)
// =======================
export async function deleteChild(childId: string) {
  try {
    const token = localStorage.getItem("token");

    if (!childId) {
      throw new Error("Child ID undefined");
    }

    // Samakan dengan pola ULID (seperti update)
    const fixedId = String(childId).toUpperCase();

    console.log("🗑️ Menghapus anak:", `/my/children/${fixedId}`);

    const response = await axiosInstance.post(
      `/my/children/${fixedId}`,
      {
        _method: "DELETE",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Delete anak sukses:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Gagal delete anak:", error.response?.data || error);
    throw error;
  }
}


export async function createChild(payload: {
  child_name: string;
  child_gender: string;
  child_birth_place: string;
  child_birth_date: string;
  child_school?: string;
  child_address: string;
  child_complaint?: string;
  child_service_choice: string;
}) {
  try {
    const token = localStorage.getItem("token");

    const response = await axiosInstance.post("/my/children", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error createChild:", error);
    throw error.response?.data || error;
  }
}

export async function downloadAssessmentReport(assessmentId: string) {
  try {
    const token = localStorage.getItem("token");

    const response = await axiosInstance.get(
      `/my/assessments/${assessmentId}/report-download`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // penting agar file bisa di-download
      }
    );

    // Generate file blob URL
    const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = fileUrl;

    // Ambil nama file dari header jika ada
    const filename =
      response.headers["content-disposition"]
        ?.split("filename=")[1]
        ?.replace(/"/g, "") || "laporan-anak.pdf";

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(fileUrl);

    return true;
  } catch (error) {
    console.error("❌ Gagal download laporan:", error);
    throw error;
  }
}
