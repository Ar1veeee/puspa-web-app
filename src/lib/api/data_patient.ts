/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";

/* =========================
   LIST PATIENT (GET /children)
========================= */
export interface PatientList {
  child_id: string;
  child_name: string;
  child_birth_date: string;
  child_age: string;
  child_gender?: string | null;
  child_school: string;
}

export interface PatientCreatePayload {
  child_name: string;
  child_gender: string;
  child_birth_place: string;
  child_birth_date: string;

  child_school?: string;
  child_address?: string;
  child_complaint?: string;
  child_service_choice?: string;

  // 🔥 SESUAI API FINAL
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  guardian_type: "ayah" | "ibu" | "wali";
}

/* =========================
   DETAIL PATIENT (GET /children/{id})
========================= */
export interface PatientDetail {
  child_id: string;

  child_name: string;
  child_birth_info: string;
  child_birth_date: string;
  child_age: string;
  child_gender?: string | null;
  child_religion: string;
  child_school: string;
  child_address: string;

  father_identity_number?: string | null;
  father_name: string;
  father_phone: string;
  father_birth_date: string;
  father_age: string;
  father_occupation: string;
  father_relationship: string;

  mother_identity_number?: string | null;
  mother_name: string;
  mother_phone: string;
  mother_birth_date: string;
  mother_age: string;
  mother_occupation: string;
  mother_relationship: string;

  guardian_identity_number?: string | null;
  guardian_name?: string | null;
  guardian_phone?: string | null;
  guardian_birth_date?: string | null;
  guardian_age?: string | null;
  guardian_occupation?: string | null;
  guardian_relationship?: string | null;

  child_complaint?: string;
  child_service_choice?: string;

  created_at: string;
  updated_at: string;
}

/* =========================
   UPDATE PAYLOAD (PUT children)
========================= */
export interface PatientUpdatePayload {
  child_name: string;
  child_birth_date: string; // YYYY-MM-DD
  child_gender?: string | null;
  child_school: string;
  child_address: string;

  father_identity_number?: string | null;
  father_name?: string | null
  father_phone?: string | null
  father_birth_date?: string | null;
  father_occupation?: string | null
  father_relationship?: string | null

  mother_identity_number?: string | null
  mother_name?: string | null
  mother_phone?: string | null
  mother_birth_date?: string | null;
  mother_occupation?: string | null
  mother_relationship?: string | null

  guardian_identity_number?: string | null;
  guardian_name?: string | null;
  guardian_phone?: string | null;
  guardian_birth_date?: string | null;
  guardian_occupation?: string | null;
  guardian_relationship?: string | null;

  child_complaint?: string;
  child_service_choice?: string;
}

/* =========================
   GET ALL PATIENTS
========================= */
export async function getPatients(): Promise<PatientList[]> {
  const res = await api.get("/children");

  return res.data.data.map((item: any) => ({
    child_id: item.child_id,
    child_name: item.child_name,
    child_birth_date: item.child_birth_date,
    child_age: item.child_age,
    child_gender: item.child_gender,
    child_school: item.child_school,
  }));
}

/* =========================
   GET PATIENT BY ID
========================= */
export async function getPatientById(id: string): Promise<PatientDetail> {
  const res = await api.get(`/children/${id}`);
  const item = res.data.data;

  return {
    child_id: id,

    child_name: item.child_name,
    child_birth_info: item.child_birth_info,
    child_birth_date: item.child_birth_date,
    child_age: item.child_age,
    child_gender: item.child_gender,
    child_religion: item.child_religion,
    child_school: item.child_school,
    child_address: item.child_address,

    father_identity_number: item.father_identity_number,
    father_name: item.father_name,
    father_phone: item.father_phone,
    father_birth_date: item.father_birth_date,
    father_age: item.father_age,
    father_occupation: item.father_occupation,
    father_relationship: item.father_relationship,

    mother_identity_number: item.mother_identity_number,
    mother_name: item.mother_name,
    mother_phone: item.mother_phone,
    mother_birth_date: item.mother_birth_date,
    mother_age: item.mother_age,
    mother_occupation: item.mother_occupation,
    mother_relationship: item.mother_relationship,

    guardian_identity_number: item.guardian_identity_number ?? null,
    guardian_name: item.guardian_name ?? null,
    guardian_phone: item.guardian_phone ?? null,
    guardian_birth_date: item.guardian_birth_date ?? null,
    guardian_age: item.guardian_age ?? null,
    guardian_occupation: item.guardian_occupation ?? null,
    guardian_relationship: item.guardian_relationship ?? null,

    child_complaint: item.child_complaint,
    child_service_choice: item.child_service_choice,

    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

/* =========================
   UPDATE PATIENT
========================= */
export async function updatePatient(
  id: string,
  data: PatientUpdatePayload
) {
  const res = await api.post(`/children/${id}`, {
    ...data,
    _method: "PUT",
  });

  return res.data ?? null;
}

/* =========================
   DELETE PATIENT
========================= */
export async function deletePatient(id: string) {
  return await api.delete(`/children/${id}`);
}

/* =========================
   CREATE PATIENT (POST /children)
========================= */
export interface PatientCreatePayload {
  child_name: string;
  child_gender: string;
  child_birth_place: string;
  child_birth_date: string; // YYYY-MM-DD
  child_school?: string;
  child_address?: string;
  child_complaint?: string;
  child_service_choice?: string;

  email?: string;

  guardian_name: string;
  guardian_phone: string;
  guardian_type: "ayah" | "ibu" | "wali";
}

export async function addPatient(data: PatientCreatePayload) {
  const res = await api.post("/children", data);
  return res.data ?? null;
}
