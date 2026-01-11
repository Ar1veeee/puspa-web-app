/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getAssessmentDetail } from "@/lib/api/asesment";

import SidebarTerapis from "@/components/layout/sidebar_terapis";
import HeaderTerapis from "@/components/layout/header_terapis";
import { X } from "lucide-react";

export default function DetailAssessmentPage() {
  const params = useSearchParams();
  const assessmentId = params.get("assessment_id");

  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assessmentId) return;
    const fetchDetail = async () => {
      try {
        const data = await getAssessmentDetail(assessmentId);
        setDetail(data);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [assessmentId]);

  if (!assessmentId) return <p>Assessment ID tidak ditemukan!</p>;

  // ============================
  // LOADING SPINNER
  // ============================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB]">
        <div className="w-12 h-12 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-[#F9FAFB]">

      {/* SIDEBAR */}
      <SidebarTerapis />

      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <HeaderTerapis />

        {/* CONTENT */}
        <div className="p-6 w-full text-[#36315B]">


          {/* TITLE BAR */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Detail Assessment</h1>
            <X
              size={24}
              className="cursor-pointer"
              onClick={() => history.back()}
            />
          </div>

          {/* GREEN LINE */}
          <div className="h-1 bg-[#81B7A9] rounded-full mb-6" />

          {/* ===================== INFORMASI ANAK ===================== */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Informasi Anak</h2>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Nama Lengkap : {detail.child_name}</li>
              <li>Tanggal Lahir : {detail.child_birth_date}</li>
              <li>Usia : {detail.child_age}</li>
              <li>Jenis Kelamin : {detail.child_gender}</li>
              <li>Sekolah : {detail.child_school}</li>
              <li>Alamat : {detail.child_address}</li>
              <li>Tanggal Asesment : {detail.scheduled_date}</li>
              <li>Waktu : {detail.scheduled_time}</li>
            </ul>
          </div>

          {/* ===================== ORANGTUA ===================== */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Informasi Orangtua / Wali</h2>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Nama Orangtua : {detail.parent_name}</li>
              <li>Hubungan : {detail.relationship}</li>
              <li>Nomor WhatsApp : {detail.parent_phone}</li>
            </ul>
          </div>

          {/* ===================== ADMIN ===================== */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Admin</h2>
            <p className="text-sm">{detail.admin_name}</p>
          </div>

          {/* ===================== JENIS ASSESSMENT ===================== */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Jenis Assessment</h2>
            <p className="text-sm">{detail.type}</p>
          </div>

          {/* ===================== KELUHAN ===================== */}
          {detail?.complaint && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Keluhan</h2>
              <p className="text-sm">{detail.complaint}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
