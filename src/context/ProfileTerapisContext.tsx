"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  showProfile, // API fetch profile therapist
  TherapistProfile,
} from "@/lib/api/ProfileTerapis";

interface TherapistProfileContextValue {
  profile: TherapistProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<TherapistProfile | null>>;
  refreshProfile: () => Promise<void>;
}

const TherapistProfileContext = createContext<TherapistProfileContextValue | null>(null);

export function TherapistProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<TherapistProfile | null>(null);

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
      console.error("Error refreshProfile therapist:", err);
      setProfile(null);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <TherapistProfileContext.Provider value={{ profile, setProfile, refreshProfile }}>
      {children}
    </TherapistProfileContext.Provider>
  );
}

export function useTherapistProfile() {
  const context = useContext(TherapistProfileContext);
  if (!context) {
    throw new Error("useTherapistProfile must be used inside TherapistProfileProvider");
  }
  return context;
}