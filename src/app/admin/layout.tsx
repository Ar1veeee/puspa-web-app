"use client";

import { Suspense } from "react";
import { AdminProfileProvider } from "@/context/ProfileAdminContext";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProfileProvider>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">
            Memuat halaman...
          </div>
        }
      >
        <div className="flex h-screen">
          {/* SIDEBAR */}
          <aside className="sticky top-0 h-screen">
            <Sidebar />
          </aside>

          {/* MAIN AREA */}
          <div className="flex flex-col flex-1">
            {/* HEADER */}
            <header className="sticky top-0 z-30 bg-white shadow px-6">
              <Header />
            </header>

            {/* CONTENT */}
            <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
              {children}
            </main>
          </div>
        </div>
      </Suspense>
    </AdminProfileProvider>
  );
}
