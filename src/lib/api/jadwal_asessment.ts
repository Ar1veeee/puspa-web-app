// src/lib/api/jadwal_asesmen.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import type { Jadwal } from "@/app/admin/jadwal_asesmen/page"; // sesuaikan path

export async function getAssessmentsAdmin(
  status: "scheduled" | "completed",
  search: string = "",
  date?: string
): Promise<Jadwal[]> {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return [];

    let endpoint = "/assessments";
    if (status === "scheduled") endpoint = "/assessments/scheduled/admin";
    if (status === "completed") endpoint = "/assessments/completed/admin";

    const params: Record<string, any> = {};
    if (search) params.search = search;
    if (date && date.trim() !== "") params.date = date;

    const res = await api.get(endpoint, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });

    const list = res.data?.data || [];

    return list.map((item: any) => ({
      assessment_id: item.assessment_id,
      nama: item.child_name,
      orangtua: item.guardian_name,
      telepon: item.guardian_phone,
      tipe: Array.isArray(item.type) && item.type.length > 0
        ? item.type.join(", ")
        : item.type || "-",
      administrator: item.administrator || "-",
      asessor: item.assessor || "-",
      tanggalObservasi: item.scheduled_date || "-",
      waktu: item.scheduled_time || "-",
    }));
  } catch (error) {
    console.error("❌ ERROR getAssessmentsAdmin:", error);
    return [];
  }
}

export async function updateAsessmentSchedule(
  assessment_id: number,
  scheduled_date: string,
  scheduled_time: string
) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const res = await api.post(
      `/assessments/${assessment_id}`,
      {
        scheduled_date,
        scheduled_time,
        _method: "PATCH",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("❌ ERROR updateAsessmentSchedule:", error);
    throw error;
  }
}

// src/lib/api/jadwal_asesmen.ts
export async function getAssessmentDetail(assessment_id: number) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await api.get(
    `/assessments/${assessment_id}/detail`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.data;
}
