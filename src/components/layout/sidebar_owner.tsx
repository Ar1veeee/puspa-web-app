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
} from "lucide-react";
import { useState } from "react";

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

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md shadow-[#ADADAD] p-6 flex flex-col">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Image
          src="/logo.png"
          alt="Logo Puspa"
          width={160}
          height={50}
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto space-y-8">
        {menu.map((group, idx) => (
          <div key={idx}>
            {group.section && (
              <p className="text-xs font-bold uppercase mb-3 text-[#36315B] tracking-widest">
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
                  return (
                    <div key={i} className="space-y-1">
                      <button
                        onClick={() => setOpenDropdown(!openDropdown)}
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-colors group ${
                          isActive || openDropdown
                            ? "bg-[#C0DCD6] text-[#36315B] font-semibold"
                            : "text-[#36315B] hover:bg-[#81B7A9] hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon
                            size={20}
                            className={`${
                              isActive || openDropdown
                                ? "text-[#36315B]"
                                : "text-[#36315B] group-hover:text-white"
                            }`}
                          />
                          {item.name}
                        </span>

                        <ChevronDown
                          size={18}
                          className={`transition-transform ${
                            openDropdown ? "rotate-180" : ""
                          } ${
                            isActive || openDropdown
                              ? "text-[#36315B]"
                              : "text-[#36315B] group-hover:text-white"
                          }`}
                        />
                      </button>

                      {/* Dropdown Content */}
                      {openDropdown && (
                        <div className="ml-10 space-y-1">
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
                      className={`${
                        isActive
                          ? "text-[#36315B]"
                          : "text-[#36315B] group-hover:text-white"
                      }`}
                    />
                    <span>{item.name}</span>
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
