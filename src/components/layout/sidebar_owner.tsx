/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ShieldCheck,
  Settings,
  LogOut,
  User,
  Users,
  UserCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/context/SidebarContext";

/* ------------------ TYPES ------------------ */

interface DropdownItem {
  name: string;
  href: string;
}

interface BaseMenuItem {
  name: string;
  href: string;
  icon: any;
}

interface MenuItemWithDropdown extends BaseMenuItem {
  dropdown: DropdownItem[];
}

type MenuItem = BaseMenuItem | MenuItemWithDropdown;

interface MenuGroup {
  section: string | null;
  items: MenuItem[];
}

interface SidebarProps {
  activePage?: string;
}

/* ------------------ MENU DATA ------------------ */

export const menu: MenuGroup[] = [
  {
    section: null,
    items: [
      { name: "Dashboard", href: "/owner/dashboard-Owner", icon: LayoutGrid },
    ],
  },
  {
    section: "MANAJEMEN AKUN",
    items: [
      { name: "Verifikasi Admin", href: "/owner/verifAdmin", icon: ShieldCheck },
      { name: "Verifikasi Terapis", href: "/owner/verifTerapis", icon: ShieldCheck },
      { name: "Admin", href: "/owner/allAdmin", icon: User },
      { name: "Terapis", href: "/owner/allTerapis", icon: Users },
      { name: "Pasien / Anak", href: "/owner/allPasien", icon: UserCheck },
    ],
  },
  {
    section: "KELOLA AKUN",
    items: [
      {
        name: "Pengaturan",
        href: "#",
        icon: Settings,
        dropdown: [
          { name: "Ubah Password", href: "/owner/ubahPassword" },
        ],
      },
      { name: "Log Out", href: "/auth/login", icon: LogOut },
    ],
  },
];

/* ------------------ SIDEBAR COMPONENT ------------------ */

export default function Sidebar({ activePage }: SidebarProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState(false);
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md shadow-[#ADADAD] p-6 flex flex-col transition-all duration-300">
      {/* Sidebar Header: Logo + Toggle */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="sidebar-logo-wide">
          <Image src="/logo.png" alt="Logo Puspa" width={140} height={40} priority className="object-contain" />
        </div>
        <div className="sidebar-logo-mini hidden w-full justify-center">
          <Image src="/favicon.ico" alt="Logo" width={28} height={28} className="object-contain" />
        </div>
        <button 
          onClick={toggleSidebar}
          className={`text-[#36315B] hover:bg-[#81B7A9]/10 p-1.5 rounded-lg transition-colors cursor-pointer ${isCollapsed ? "mx-auto" : ""}`}
          title={isCollapsed ? "Tampilkan Menu" : "Sembunyikan Menu"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-8">
        {menu.map((group, idx) => (
          <div key={idx}>
            {group.section && (
              <p className="sidebar-section-title text-xs font-bold uppercase mb-3 text-[#36315B] tracking-widest">
                {group.section}
              </p>
            )}

            <div className="space-y-1">
              {group.items.map((item, i) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/") ||
                  activePage === item.name.toLowerCase();

                /* ---------- ITEM DENGAN DROPDOWN ---------- */
                if ("dropdown" in item) {
                  const isChildActive = item.dropdown.some(
                    (sub) => pathname === sub.href || pathname.startsWith(sub.href + "/")
                  );
                  return (
                    <div key={i} className="relative group/menu space-y-1">
                      <button
                        onClick={() => {
                          if (!isCollapsed) {
                            setOpenDropdown(!openDropdown);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-colors group ${
                          isCollapsed
                            ? (isChildActive
                                ? "bg-[#C0DCD6] text-[#36315B] font-semibold"
                                : "text-[#36315B] hover:bg-[#81B7A9] hover:text-white")
                            : ((isChildActive || openDropdown)
                                ? "bg-[#C0DCD6] text-[#36315B] font-semibold"
                                : "text-[#36315B] hover:bg-[#81B7A9] hover:text-white")
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon
                            size={20}
                            className={`shrink-0 ${
                              isCollapsed
                                ? (isChildActive ? "text-[#36315B]" : "text-[#36315B] group-hover:text-white")
                                : ((isChildActive || openDropdown) ? "text-[#36315B]" : "text-[#36315B] group-hover:text-white")
                            }`}
                          />
                          <span className="sidebar-text">{item.name}</span>
                        </span>

                        <ChevronDown
                          size={18}
                          className={`sidebar-chevron transition-transform ${
                            openDropdown ? "rotate-180" : ""
                          } ${
                            isCollapsed
                              ? (isChildActive ? "text-[#36315B]" : "text-[#36315B] group-hover:text-white")
                              : ((isChildActive || openDropdown) ? "text-[#36315B]" : "text-[#36315B] group-hover:text-white")
                          }`}
                        />
                      </button>

                      {/* Dropdown Content */}
                      {openDropdown && !isCollapsed && (
                        <div className="sidebar-text ml-10 space-y-1">
                          {item.dropdown.map((sub, si) => (
                            <Link
                              key={si}
                              href={sub.href}
                              className={`block px-3 py-1 text-sm rounded-md transition-colors ${
                                pathname === sub.href
                                  ? "text-[#36315B] font-semibold bg-[#C0DCD6]"
                                  : "text-[#36315B] hover:bg-[#81B7A9] hover:text-white"
                              }`}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Floating Submenu for Collapsed State */}
                      <div className="absolute left-full top-0 ml-2 hidden group-hover/menu:block sidebar-collapsed-submenu bg-white shadow-xl border border-gray-200 rounded-xl p-2 min-w-[200px] z-50 space-y-1">
                        <div className="px-3 py-1 text-xs font-bold text-gray-400 border-b border-gray-100 mb-1">
                          {item.name}
                        </div>
                        {item.dropdown.map((sub, si) => (
                          <Link
                            key={si}
                            href={sub.href}
                            className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                              pathname === sub.href
                                ? "text-[#36315B] font-semibold bg-[#C0DCD6]"
                                : "text-[#36315B] hover:bg-[#81B7A9]/10"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                /* ---------- ITEM BIASA ---------- */
                return (
                  <Link
                    key={i}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm group ${
                      isActive
                        ? "bg-[#C0DCD6] text-[#36315B] font-semibold"
                        : "text-[#36315B] hover:bg-[#81B7A9] hover:text-white"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={`shrink-0 ${
                        isActive
                          ? "text-[#36315B]"
                          : "text-[#36315B] group-hover:text-white"
                      }`}
                    />
                    <span className="sidebar-text">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
