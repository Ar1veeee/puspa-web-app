"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  showProfile, // API fetch profile therapist
  AdminProfile,
} from "@/lib/api/ProfileAdmin";

interface AdminProfileContextValue {
  profile: AdminProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<AdminProfile | null>>;
  refreshProfile: () => Promise<void>;
}

const AdminProfileContext = createContext<AdminProfileContextValue | null>(null);

export function AdminProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  const refreshProfile = async () => {
    try {
      // Langsung panggil showProfile (API yang sudah pakai axios instance dengan token di header)
      const data = await showProfile();

// data: ProfileResponse

if (data && data.data) {
  const cleaned = {
  ...data.data,
  profile_picture: data.data.profile_picture
    ? `${data.data.profile_picture}?t=${Date.now()}`
    : null,
};

setProfile(cleaned);
 // ini yang benar
} 

    } catch (err) {
      console.error("Error refreshProfile admin:", err);
      setProfile(null);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <AdminProfileContext.Provider value={{ profile, setProfile, refreshProfile }}>
      {children}
    </AdminProfileContext.Provider>
  );
}

export function useAdminProfile() {
const context = useContext(AdminProfileContext);
  if (!context) {
    throw new Error("useAdminProfile must be used inside AdminProfileProvider");
  }
  return context;
}