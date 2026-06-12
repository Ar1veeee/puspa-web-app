"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Baby,
  UserSquare2,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  User,
  Lock,
  LogOut,
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { useSidebar } from "@/context/SidebarContext";

export const menuOrangtua = [
  {
    name: "Dashboard",
    icon: <LayoutGrid size={20} className="shrink-0" />,
    path: "/orangtua/dashboard",
  },
  {
    name: "Anak",
    icon: <Baby size={20} className="shrink-0" />,
    path: "/orangtua/anak",
  },
  {
    name: "Assessment",
    icon: <UserSquare2 size={20} className="shrink-0" />,
    path: "/orangtua/assessment",
  },
  {
    name: "Help",
    icon: <HelpCircle size={20} className="shrink-0" />,
    path: "/orangtua/help",
  },
];

export default function SidebarOrangtua() {
  const pathname = usePathname();
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const { profile } = useProfile();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const guardianName = profile?.guardian_name || "User";
  const email = profile?.email || "-";
  const avatar = profile?.profile_picture;

  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
      {/* Logo Section */}
      <div className="flex items-center justify-between px-6 py-8 relative">
        <div className="sidebar-logo-wide">
          <Image
            src="/logo.png"
            alt="Puspa Logo"
            width={120}
            height={40}
            priority
            className="object-contain"
          />
        </div>
        <div className="sidebar-logo-mini hidden w-full justify-center">
          <Image
            src="/favicon.ico"
            alt="Logo"
            width={28}
            height={28}
            priority
            className="object-contain"
          />
        </div>
        <button 
          onClick={toggleSidebar}
          className={`text-[#36315B] hover:bg-[#81B7A9]/10 p-1.5 rounded-lg transition-colors cursor-pointer ${isCollapsed ? "mx-auto" : ""}`}
          title={isCollapsed ? "Tampilkan Menu" : "Sembunyikan Menu"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu Section */}
      <div className="flex-1 px-6 space-y-2 overflow-y-auto">
        {menuOrangtua.map((item) => {
          const active = pathname === item.path;
          return (
            <Link key={item.name} href={item.path}>
              <div
                className={`flex mb-2 items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all ${
                  active
                    ? "bg-[#C0DCD6] text-[#36315B] font-semibold"
                    : "text-[#36315B] hover:bg-[#C0DCD6]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="sidebar-text">{item.name}</span>
                </div>
                <ChevronRight size={18} className="sidebar-chevron text-[#36315B]" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Profile Dropdown Section at bottom */}
      <div className="px-6 py-4 border-t border-gray-200 mt-auto bg-white">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setOpenProfileMenu(!openProfileMenu)}
        >
          <div className="flex items-center gap-3 min-w-0">
            {avatar ? (
              <Image
                src={avatar}
                alt="User Avatar"
                width={36}
                height={36}
                className="rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-gray-500" />
              </div>
            )}

            <div className="sidebar-text flex flex-col min-w-0">
              <span className="text-sm font-semibold text-[#36315B] truncate">
                {guardianName}
              </span>
              <span className="text-xs text-[#36315B]/70 truncate">{email}</span>
            </div>
          </div>

          <div className="sidebar-chevron">
            {openProfileMenu ? (
              <ChevronDown size={18} className="text-[#36315B] shrink-0" />
            ) : (
              <ChevronRight size={18} className="text-[#36315B] shrink-0" />
            )}
          </div>
        </div>

        {openProfileMenu && (
          <div className="sidebar-text mt-3 ml-2 space-y-1">
            <Link href="/orangtua/profil">
              <div className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg cursor-pointer transition ${pathname === "/orangtua/profil" ? "text-[#36315B] font-semibold bg-[#C0DCD6]" : "text-[#36315B] hover:bg-gray-100"}`}>
                <User size={16} /> Profil
              </div>
            </Link>
            <Link href="/orangtua/ubahPassword">
              <div className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg cursor-pointer transition ${pathname === "/orangtua/ubahPassword" ? "text-[#36315B] font-semibold bg-[#C0DCD6]" : "text-[#36315B] hover:bg-gray-100"}`}>
                <Lock size={16} /> Ubah Password
              </div>
            </Link>
            <Link href="/auth/login">
              <div className="flex items-center gap-3 text-sm px-3 py-2 rounded-lg cursor-pointer text-red-600 hover:bg-red-50 transition">
                <LogOut size={16} /> Logout
              </div>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}