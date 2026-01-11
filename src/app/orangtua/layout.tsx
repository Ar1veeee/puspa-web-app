"use client";

import { ProfileProvider } from "@/context/ProfileContext";
import { Suspense } from "react";

export default function OrangtuaLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">
          Memuat halaman...
        </div>
      }>
        {children}
      </Suspense>
    </ProfileProvider>
  );
}
