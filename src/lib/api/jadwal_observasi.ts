/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";

export interface Jadwal {
  observation_id: number;
  nama: string;
  usia: string;
  jenisKelamin: string;
  sekolah: string;
  orangtua: string;
  telepon: string;
  tanggalObservasi?: string | null;
  waktu?: string | null;
  observer?: string | null;
  assessment_status: string;
}

// ========================================================
// GET OBSERVATIONS (Pending / Scheduled / Completed)
// ========================================================
export async function getObservations(
  status: "pending" | "scheduled" | "completed",
  search: string = "",
  date?: string
) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    let endpoint = "/observations";

    if (status === "pending") endpoint = "/observations/pending";
    if (status === "scheduled") endpoint = "/observations/scheduled";
    if (status === "completed") endpoint = "/observations/completed";

    console.log("Fetching observations from:", endpoint);

    const params: any = { search };

    if (date) params.date = date;   // ⬅ hanya kirim kalau ada

    const res = await api.get(endpoint, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });

    const list = res.data?.data || [];

    return list.map((item: any) => {
      const isPending = status === "pending";
      const isScheduled = status === "scheduled";
      const isCompleted = status === "completed";

      return {
        observation_id: item.observation_id,
        nama: item.child_name,
        usia: isPending ? item.child_age : "-",
        jenisKelamin: isPending ? item.child_gender : "-",
        sekolah: isPending ? item.child_school : "-",
        orangtua: item.guardian_name,
        telepon: item.guardian_phone,

        tanggalObservasi: item.scheduled_date || null,
        waktu: isScheduled ? item.scheduled_time : item.time || "-",

        // Observer untuk completed, administrator untuk scheduled
        observer: isCompleted ? item.observer : item.administrator || "-",

            assessment_status: item.assessment_status || "-", // ⬅ tambahkan ini

      };
    });

  } catch (error) {
    console.error("ERROR getObservations:", error);
    return [];
  }
}


// ========================================================
// UPDATE OBSERVATION SCHEDULE (PUT)
// ========================================================
export async function updateObservationSchedule(
  observation_id: number,
  scheduled_date: string,
  scheduled_time: string
) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const res = await api.post(
      `/observations/${observation_id}`,
      {
        scheduled_date,
        scheduled_time,
        _method: "PUT",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("UPDATE RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.error("ERROR updateObservationSchedule:", error);
    throw error;
  }
}

// ========================================================
// CREATE OBSERVATION AGREEMENT → JADWAL ASESMEN
// POST /observations/{id}/agreement
// ========================================================
export async function createObservationAgreement(
  observation_id: number,
  scheduled_date: string,
  scheduled_time: string
) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await api.put(
      `/observations/${observation_id}/agreement`,
      { scheduled_date, scheduled_time },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("AGREEMENT RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.error("ERROR createObservationAgreement:", error);
    throw error;
  }
}


export async function getObservationDetail(observation_id: number, type: "pending" | "scheduled" | "completed") {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await api.get(`/observations/${observation_id}/detail`, {
      params: { type },
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data?.data || null;
  } catch (err) {
    console.error("ERROR getObservationDetail:", err);
    return null;
  }
}
