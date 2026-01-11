/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";

export interface Admin {
  admin_id: string;
  admin_name: string;
  username: string;
  email: string;
  admin_phone: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// 🔹 Ambil semua admin
export async function getAdmins(): Promise<Admin[]> {
  const res = await api.get("/admins");
  return res.data.data.map((item: any) => ({
    admin_id: item.admin_id,
    admin_name: item.admin_name,
    username: item.username,
    email: item.email,
    admin_phone: item.admin_phone,
    status: item.status,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
}

export async function getAdminById(id: string): Promise<Admin> {
  const res = await api.get(`/admins/${id}`);
  const item = res.data.data;
  return {
    admin_id: item.admin_id,
    admin_name: item.admin_name,
    username: item.username,
    email: item.email,
    admin_phone: item.admin_phone,
    status: item.status,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}


export async function addAdmin(data: {
  admin_name: string;
  username: string;
  email: string;
  admin_phone: string;
  password?: string;
}) {
  return await api.post("/admins", {
    admin_name: data.admin_name,
    username: data.username,
    email: data.email,
    admin_phone: data.admin_phone,
    password: data.password || "12345678",
  });
}

export async function updateAdmin(id: string, data: {
  admin_name: string;
  username: string;
  email: string;
  admin_phone: string;
}) {
  return await api.put(`/admins/${id}`, {
    admin_name: data.admin_name,
    username: data.username,
    email: data.email,
    admin_phone: data.admin_phone,
  });
}

export async function deleteAdmin(id: string) {
  return await api.delete(`/admins/${id}`);
}