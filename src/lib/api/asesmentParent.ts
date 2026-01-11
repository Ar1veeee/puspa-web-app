// src/lib/api/assessmentParent.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";

export async function getPendingParents(date = "", search = "") {
  try {
    const url = `/assessments/pending/parent?date=${date}&search=${search}`;
    const res = await axiosInstance.get(url);
    return res.data.data;
  } catch (error: any) {
    console.error("Error fetching pending parents:", error?.response || error);
    throw error;
  }
}

export async function getCompletedParents(date = "", search = "") {
  try {
    const url = `/assessments/completed/parent?date=${date}&search=${search}`;
    const res = await axiosInstance.get(url);
    return res.data.data;
  } catch (error: any) {
    console.error("Error fetching completed parents:", error?.response || error);
    throw error;
  }
}
