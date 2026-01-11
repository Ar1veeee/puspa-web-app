"use client";

import React, { useState } from "react";
import SidebarOrangtua from "@/components/layout/sidebar-orangtua";
import HeaderOrangtua from "@/components/layout/header-orangtua";

export default function ResponsiveOrangtuaLayout({
  children,
  maxWidth = "max-w-5xl",
}: {
  children: React.ReactNode;
  maxWidth?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // Tambahkan overflow-x-hidden untuk mencegah scrolling horizontal yang tidak diinginkan pada mobile
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* SIDEBAR */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:z-30 md:shadow-none md:border-r`}
      >
        <SidebarOrangtua />
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64 min-w-0 transition-all duration-300">
        {/* HEADER + HAMBURGER MOBILE */}
        <div className="sticky top-0 z-30 flex items-center justify-between bg-white shadow-sm px-4 md:px-8 py-3 md:py-4">
          {/* Hamburger mobile - Perbesar area tekan */}
          <button
            className="md:hidden p-2 -ml-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#409E86] transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <HeaderOrangtua />
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {/* Tambahkan w-full untuk memastikan konten melebar penuh pada mobile */}
          <div className={`mx-auto w-full ${maxWidth}`}>{children}</div>
        </main>
      </div>
    </div>
  );
}