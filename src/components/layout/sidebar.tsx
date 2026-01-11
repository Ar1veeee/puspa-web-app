"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutGrid,
  Settings,
  LogOut,
  Users,
  ChevronDown,
  UserCog,
  UserSquare2,
  CalendarDays,
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon?: React.ElementType;
  dropdown?: { name: string; href: string; icon?: React.ElementType }[];
}

interface MenuGroup {
  section: string | null;
  items: MenuItem[];
}

interface SidebarProps {
  activePage?: string;
}

// ================= BASE MENU =================
export const baseMenu: MenuGroup[] = [
  {
    section: null,
    items: [{ name: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid }],
  },
  {
    section: "Manajemen Data",
    items: [
      { name: "Admin", href: "/admin/data_admin", icon: UserCog },
      { name: "Terapis", href: "/admin/data_terapis", icon: UserSquare2 },
      { name: "Pasien / Anak", href: "/admin/data_pasien", icon: Users },
      {
        name: "Jadwal",
        href: "/admin/jadwal",
        icon: CalendarDays,
        dropdown: [
          { name: "Observasi", href: "/admin/jadwal_observasi" },
          { name: "Asesmen", href: "/admin/jadwal_asesmen" },
        ],
      },
    ],
  },
  {
    section: "Kelola Akun",
    items: [
      {
        name: "Pengaturan",
        href: "/admin/pengaturan",
        icon: Settings,
        dropdown: [
          { name: "Ubah Profile", href: "/admin/profile_admin" },
          { name: "Ubah Password", href: "/admin/ubah_password" },
        ],
      },
      { name: "Log Out", href: "/auth/login", icon: LogOut },
    ],
  },
];

// ================= SIDEBAR =================
export default function SidebarAdmin({ activePage }: SidebarProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // contoh filter role
  const menu =
    role === "asesor"
      ? baseMenu
      : baseMenu.map((group) => ({
          ...group,
          items: group.items.filter((item) => item.name !== "Asesmen"),
        }));

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md p-4 flex flex-col">
      <div className="flex justify-center mb-6">
        <Image src="/logo.png" alt="Logo Puspa" width={160} height={50} priority />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto">
        {menu.map((group, idx) => (
          <div key={idx}>
            {group.section && (
              <p className="text-xs font-bold uppercase mb-2 text-[#36315B]">
                {group.section}
              </p>
            )}

            {group.items.map((item, i) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              if (item.dropdown) {
                const isOpen = openDropdown === item.name;
                return (
                  <div key={i}>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`w-full flex justify-between items-center px-3 py-2 rounded-lg ${
                        isOpen || isActive
                          ? "bg-[#C0DCD6] font-semibold"
                          : "hover:bg-[#81B7A9] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon && <item.icon size={20} />}
                        {item.name}
                      </div>
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.dropdown.map((sub, j) => (
                          <Link
                            key={j}
                            href={sub.href}
                            className="block px-3 py-2 rounded-md hover:bg-[#81B7A9] hover:text-white text-sm"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={i}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                    isActive
                      ? "bg-[#C0DCD6] font-semibold"
                      : "hover:bg-[#81B7A9] hover:text-white"
                  }`}
                >
                  {item.icon && <item.icon size={20} />}
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
