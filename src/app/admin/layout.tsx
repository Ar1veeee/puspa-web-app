"use client";

import { Suspense } from "react";
import { AdminProfileProvider } from "@/context/ProfileAdminContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProfileProvider>
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">
          Memuat halaman...
        </div>
      }>
        {children}
      </Suspense>
    </AdminProfileProvider>
  );
}