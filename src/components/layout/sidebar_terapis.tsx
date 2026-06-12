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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

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
  const { isCollapsed, toggleSidebar } = useSidebar();

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
    <aside className="w-64 min-h-screen bg-white shadow-md shadow-[#ADADAD] p-4 flex flex-col transition-all duration-300">
      {/* Sidebar Header: Logo + Toggle */}
      <div className="flex items-center justify-between mb-6 relative">
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

      <nav className="flex-1 space-y-6 overflow-y-auto">
        {menu.map((group, idx) => (
          <div key={idx}>
            {group.section && (
              <p className="sidebar-section-title text-xs font-bold uppercase mb-2 text-[#36315B] tracking-wide">
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
                  const isChildActive = item.dropdown.some(
                    (sub) => pathname === sub.href || pathname.startsWith(sub.href + "/")
                  );

                  return (
                    <div key={i} className="relative group/menu">
                      <button
                        onClick={() => {
                          if (!isCollapsed) {
                            toggleDropdown(item.name);
                          }
                        }}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isCollapsed
                            ? (isChildActive
                                ? "bg-[#C0DCD6] text-[#36315B] font-semibold"
                                : "text-[#36315B] hover:bg-[#81B7A9] hover:text-white")
                            : ((isOpen || isChildActive)
                                ? "bg-[#C0DCD6] text-[#36315B] font-semibold"
                                : "text-[#36315B] hover:bg-[#81B7A9] hover:text-white")
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon && <item.icon size={20} className="shrink-0" />}
                          <span className="sidebar-text">{item.name}</span>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`sidebar-chevron transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {isOpen && !isCollapsed && (
                        <div className="sidebar-text mt-2 ml-3 p-2 border border-[#81B7A9] rounded-lg bg-[#F8F8F8] space-y-1">
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

                      {/* Floating Submenu for Collapsed State */}
                      <div className="absolute left-full top-0 ml-2 hidden group-hover/menu:block sidebar-collapsed-submenu bg-white shadow-xl border border-gray-200 rounded-xl p-2 min-w-[200px] z-50 space-y-1">
                        <div className="px-3 py-1 text-xs font-bold text-gray-400 border-b border-gray-100 mb-1">
                          {item.name}
                        </div>
                        {item.dropdown.map((subItem, j) => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link
                              key={j}
                              href={subItem.href}
                              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                                isSubActive
                                  ? "bg-[#C0DCD6] text-[#36315B] font-semibold"
                                  : "text-[#36315B] hover:bg-[#81B7A9]/10"
                              }`}
                            >
                              {subItem.icon && <subItem.icon size={18} />}
                              <span>{subItem.name}</span>
                            </Link>
                          );
                        })}
                      </div>
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
                    {item.icon && <item.icon size={20} className="shrink-0" />}
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
