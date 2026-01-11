import axiosInstance from "../axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";
  return { Authorization: `${tokenType} ${token}` };
};


export async function getScheduledObservations(date?: string, search?: string) {
  const query = new URLSearchParams();
  if (date) query.append("date", date);
  if (search) query.append("search", search);

  const res = await axiosInstance.get(`/observations/scheduled?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}



// Ambil detail observasi scheduled
export async function getScheduledObservationDetail(observation_id: string) {
  const res = await axiosInstance.get(
    `/observations/${observation_id}/detail?type=scheduled`,
    { headers: getAuthHeaders() }
  );

  // langsung kembalikan data BE tanpa rename
  return res.data.data;
}


export async function getCompletedObservations(date?: string, search?: string) {
  const query = new URLSearchParams();
  if (date) query.append("date", date);
  if (search) query.append("search", search);

  const res = await axiosInstance.get(`/observations/completed?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}


export async function getCompletedObservationDetail(observation_id: string) {
  const res = await axiosInstance.get(`/observations/completed/${observation_id}`, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
}

export async function getCompletedObservationSummary(observation_id: string) {
  const res = await axiosInstance.get(
    `/observations/completed/${observation_id}/summary`,
    { headers: getAuthHeaders() }
  );
  return res.data;
}


export async function getObservationAnswers(observation_id: string) {
  const res = await axiosInstance.get(`/observations/answer/${observation_id}`, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
}


export async function updateObservationAgreement(
  id: string,
  agreementStatus: "approved" | "rejected"
) {
  const res = await axiosInstance.patch(
    `/observations/${id}/assessment-agreement`,
    { agreement_status: agreementStatus },
    { headers: getAuthHeaders() }
  );
  return res.data;
}
