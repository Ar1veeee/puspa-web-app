"use client";

import { TherapistProfileProvider } from "@/context/ProfileTerapisContext";
import { Suspense } from "react";

export default function TerapisLayout({ children }: { children: React.ReactNode }) {
  return (
    <TherapistProfileProvider>
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">
          Memuat halaman...
        </div>
      }>
        {children}
      </Suspense>
    </TherapistProfileProvider>
  );
}