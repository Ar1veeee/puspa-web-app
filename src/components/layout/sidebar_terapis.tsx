"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutGrid,
  Search,
  ClipboardList,
  Settings,
  LogOut,
  Users,
  Handshake,
  IdCard,
  UsersRound,
  ChevronDown,
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
  isMobile?: boolean;
  onClose?: () => void;
}

// ================= BASE MENU =================
export const baseMenu: MenuGroup[] = [
  {
    section: null,
    items: [{ name: "Dashboard", href: "/terapis/dashboard", icon: LayoutGrid }],
  },
  {
    section: "PENDATAAN",
    items: [
      { name: "Observasi", href: "/terapis/observasi", icon: Search },
      {
        name: "Assessment",
        href: "#",
        icon: ClipboardList,
        dropdown: [
          { name: "Assessor", href: "/terapis/asessment", icon: IdCard },
          { name: "Orangtua", href: "/terapis/asessmentOrtu", icon: UsersRound },
        ],
      },
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
          { name: "Ubah Profil", href: "/terapis/profileTerapis" },
          { name: "Ubah Password", href: "/terapis/ubahPassword" },
        ],
      },
      { name: "Log Out", href: "/auth/login", icon: LogOut },
    ],
  },
];

// ================= SIDEBAR COMPONENT =================
export default function SidebarTerapis({ activePage }: SidebarProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role");
      setRole(storedRole);
    }
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Jika bukan asesor, hilangkan menu "Assessment"
  const menu =
    role === "asesor"
      ? baseMenu
      : baseMenu.map((group) => ({
          ...group,
          items: group.items.filter((item) => item.name !== "Assessment"),
        }));

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md shadow-[#ADADAD] p-4 flex flex-col">
      <div className="flex justify-center mb-6">
        <Image src="/logo.png" alt="Logo Puspa" width={160} height={50} priority />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto">
        {menu.map((group, idx) => (
          <div key={idx}>
            {group.section && (
              <p className="text-xs font-bold uppercase mb-2 text-[#36315B] tracking-wide">
                {group.section}
              </p>
            )}

            <div className="space-y-1">
              {group.items.map((item, i) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/") ||
                  activePage === item.name.toLowerCase();

                if (item.dropdown && item.dropdown.length > 0) {
                  const isOpen = openDropdown === item.name;
                  return (
                    <div key={i}>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isOpen || isActive
                            ? "bg-[#C0DCD6] text-[#36315B] font-semibold"
                            : "text-[#36315B] hover:bg-[#81B7A9] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon && <item.icon size={20} />}
                          <span>{item.name}</span>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {isOpen && (
                        <div className="mt-2 ml-3 p-2 border border-[#81B7A9] rounded-lg bg-[#F8F8F8] space-y-1">
                          {item.dropdown.map((subItem, j) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <Link
                                key={j}
                                href={subItem.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                                  isSubActive
                                    ? "bg-[#C0DCD6] text-[#36315B] font-semibold"
                                    : "text-[#36315B] hover:bg-[#81B7A9] hover:text-white"
                                }`}
                              >
                                {subItem.icon && <subItem.icon size={18} />}
                                <span>{subItem.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={i}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#C0DCD6] text-[#36315B] font-semibold"
                        : "text-[#36315B] hover:bg-[#81B7A9] hover:text-white"
                    }`}
                  >
                    {item.icon && <item.icon size={20} />}
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
