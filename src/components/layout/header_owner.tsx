"use client";

import Image from "next/image";
import { Bell, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { menu } from "./sidebar_owner";


interface MenuItem {
  name: string;
  href: string;
}

interface MenuGroup {
  title?: string;
  items: MenuItem[];
}


export default function Header() {
  const pathname = usePathname();

  const allItems = (menu as MenuGroup[]).flatMap(
  (group) => group.items
);

  const activeItem = allItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );


  // Custom title untuk Owner Pages yang tidak ada di menu
  const routeTitles: Record<string, string> = {
    "/owner/dashboard_Owner": "Dashboard",
    "/owner/verifAdmin": "Verifikasi Admin",
    "/owner/verifTerapis": "Verifikasi Terapis",
    "/owner/allAdmin": "Data Admin",
    "/owner/allTerapis": "Data Terapis",
    "/owner/allPasien": "Data Pasien/Anak",
    "/owner/ubahPassword": "Pengaturan",
  };

  const title = routeTitles[pathname] || (activeItem ? activeItem.name : "Dashboard");

  // 🔥 Kalau mau, nanti bisa ambil foto user dari context
  const profilePicture: string | null = null; // ganti kalau pakai context/user state

  return (
    <header className="w-full flex justify-between items-center p-4 bg-white shadow text-[#36315B]">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="flex items-center gap-3">
        <span>Hallo, Owner Puspa</span>

        {/* Avatar / Profil */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt="Admin"
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-gray-500" />
          )}
        </div>

        <button className="relative flex items-center justify-center w-10 h-10 border border-[#36315B] rounded-lg hover:bg-[#81B7A9] hover:text-white transition">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
