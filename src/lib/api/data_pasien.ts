import api from "@/lib/axios";

// ======================
// ✅ INTERFACES
// ======================
export interface Pasien {
  child_id: string;
  child_name: string;
  child_birth_info: string;
  child_birth_date?: string;
  child_age: string;
  child_gender?: string | null;
  child_religion: string | null;
  child_school: string | null;
  child_address: string | null;
  child_complaint?: string | null;
  child_service_choice?: string | null;

  father_identity_number?: string | null;
  father_name?: string | null;
  father_phone?: string | null;
  father_birth_date?: string | null;
  father_age?: string | null;
  father_occupation?: string | null;
  father_relationship?: string | null;

  mother_identity_number?: string | null;
  mother_name?: string | null;
  mother_phone?: string | null;
  mother_birth_date?: string | null;
  mother_age?: string | null;
  mother_occupation?: string | null;
  mother_relationship?: string | null;

  guardian_identity_number?: string | null;
  guardian_name?: string | null;
  guardian_phone?: string | null;
  guardian_birth_date?: string | null;
  guardian_age?: string | null;
  guardian_occupation?: string | null;
  guardian_relationship?: string | null;

  created_at?: string;
  updated_at?: string;
}

// Payload untuk update pasien
export interface UpdatePasienPayload {
  child_name?: string;
  child_birth_info?: string;
  child_birth_date?: string | null;
  child_gender?: string | null;
  child_religion?: string | null;
  child_school?: string | null;
  child_address?: string | null;
  child_complaint?: string | null;
  child_service_choice?: string | null;

  father_name?: string | null;
  father_age?: string | null;
  father_birth_date?: string | null;
  father_occupation?: string | null;
  father_phone?: string | null;
  father_relationship?: string | null;
  father_identity_number?: string | null;

  mother_name?: string | null;
  mother_age?: string | null;
  mother_birth_date?: string | null;
  mother_occupation?: string | null;
  mother_phone?: string | null;
  mother_relationship?: string | null;
  mother_identity_number?: string | null;

  guardian_name?: string | null;
  guardian_age?: string | null;
  guardian_birth_date?: string | null;
  guardian_occupation?: string | null;
  guardian_phone?: string | null;
  guardian_relationship?: string | null;
  guardian_identity_number?: string | null;
}

// ======================
// ✅ GET ALL PASIEN
// ======================
export async function getAllPasien(): Promise<Pasien[]> {
  try {
    const res = await api.get("/children");
    return res.data?.data || [];
  } catch (error: any) {
    console.error("Gagal mengambil data pasien:", error.response || error);
    throw error;
  }
}

// ======================
// ✅ GET DETAIL PASIEN
// ======================
export async function getDetailPasien(childId: string): Promise<Pasien> {
  try {
    const res = await api.get(`/children/${childId}`);
    return { ...res.data?.data, child_id: childId }; 
  } catch (error: any) {
    console.error(`Gagal mengambil detail pasien ID ${childId}:`, error.response || error);
    throw error;
  }
}

// ======================
// ✅ UPDATE PASIEN
// ======================
export async function updatePasien(childId: string, data: UpdatePasienPayload) {
  if (!childId) throw new Error("child_id tidak boleh kosong");
  try {
    const res = await api.put(`/children/${childId}`, data);
    return res.data;
  } catch (error: any) {
    console.error(`Gagal memperbarui pasien ID ${childId}:`, error.response || error);
    throw error;
  }
}

// ======================
// ✅ DELETE PASIEN
// ======================
export async function deletePasien(childId: string) {
  if (!childId) throw new Error("child_id tidak boleh kosong");
  try {
    const res = await api.delete(`/children/${childId}`);
    return res.data;
  } catch (error: any) {
    console.error(`Gagal menghapus pasien ID ${childId}:`, error.response || error);
    throw error;
  }
}

// ======================
// ✅ ALIAS EXPORTS (Untuk Page.tsx)
// ======================
// Tambahkan baris di bawah ini agar import di page.tsx tidak error
export const getPatients = getAllPasien;
export const getPatientById = getDetailPasien;
export const updatePatient = updatePasien;
export const deletePatient = deletePasien;

// Alias untuk Type/Interface
export type PatientList = Pasien;
export type PatientDetail = Pasien;
export type PatientUpdatePayload = UpdatePasienPayload;