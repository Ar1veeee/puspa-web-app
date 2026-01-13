"use client";

import Image from "next/image";
import { Bell, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { baseMenu } from "@/components/layout/sidebar";
import { useAdminProfile } from "@/context/ProfileAdminContext";

interface HeaderTerapisProps {
  pageTitle?: string;
}

export default function HeaderTerapis({ pageTitle }: HeaderTerapisProps) {
  const pathname = usePathname();
  const { profile } = useAdminProfile();

  // ===============================
  // Cari menu aktif dari sidebar
  // ===============================
  const allItems = baseMenu.flatMap((group) => group.items);

  const activeItem =
    allItems.find(
      (item) =>
        pathname === item.href ||
        pathname.startsWith(item.href + "/") ||
        (item.dropdown &&
          item.dropdown.some((sub) => pathname.startsWith(sub.href)))
    ) || null;

  // ===============================
  // Fallback title berdasarkan path
  // (untuk page detail / riwayat)
  // ===============================
  const getTitleFromPath = (pathname: string): string | null => {
    
    if (pathname.startsWith("/admin/riwayat-hasil")) return "Observasi";
    if (pathname.startsWith("/admin/hasil-observasi")) return "Observasi";
    if (pathname.startsWith("/admin/ortu/upload_file")) return "Asesmen";
    if (pathname.startsWith("/admin/ortu/data_umum")) return "Formulir Asessment untuk Orangtua";
    if (pathname.startsWith("/admin/ortu/okupasi")) return "Formulir Asessment untuk Orangtua";
    if (pathname.startsWith("/admin/ortu/paedagog")) return "Formulir Asessment untuk Orangtua";
    if (pathname.startsWith("/admin/ortu/wicara")) return "Formulir Asessment untuk Orangtua";
    if (pathname.startsWith("/admin/ortu/fisioterapi")) return "Formulir Asessment untuk Orangtua";
    if (pathname.startsWith("/admin/asesor/okupasi")) return "Asesmen Okupasi";
    if (pathname.startsWith("/admin/asesor/paedagog")) return "Asesmen Paedagog";
    if (pathname.startsWith("/admin/asesor/wicara")) return "Asesmen Terapi Wicara";
    if (pathname.startsWith("/admin/asesor/fisioterapi")) return "Asesmen Fisioterapi";
    return null;
  };

  // ===============================
  // Final title (prioritas berurutan)
  // ===============================
  const title =
    pageTitle ||
    activeItem?.name ||
    getTitleFromPath(pathname) ||
    "Dashboard";

  // ===============================
  // Foto profil aman (string/null)
  // ===============================
  const profileImage: string | null =
    profile?.profile_picture && profile.profile_picture !== ""
      ? profile.profile_picture
      : null;

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow text-[#36315B]">
      {/* Judul halaman */}
      <h2 className="text-xl font-semibold">{title}</h2>

      {/* Area kanan */}
      <div className="flex items-center gap-4">
        <span className="font-medium">
          Hallo, {profile?.admin_name || "Admin"}
        </span>

        {/* Foto / icon user */}
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-100">
          {profileImage ? (
            <Image
              key={profileImage}
              src={profileImage}
              alt="Foto Profil"
              width={40}
              height={40}
              className="object-cover"
              unoptimized
            />
          ) : (
            <User className="w-6 h-6 text-gray-500" />
          )}
        </div>

        {/* Notifikasi */}
        <button className="relative flex items-center justify-center w-10 h-10 border border-[#36315B] rounded-lg hover:bg-[#81B7A9] hover:text-white transition">
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
