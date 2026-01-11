"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, User, ChevronRight, ClipboardList, Baby, Mars } from "lucide-react";

import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import {
  getMyAssessments,
  AssessmentItem,
  getMyAssessmentDetail,
} from "@/lib/api/childrenAsesment";

export default function DataUmumPage() {
  const router = useRouter();

  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getMyAssessments();
        setAssessments(res.data || []);
      } catch (error) {
        console.error("Failed to load assessments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSelectAssessment = async (assessment_id: string) => {
    if (!assessment_id) return;

    setLoadingDetail(true);
    try {
      await getMyAssessmentDetail(assessment_id);
      router.push(
        `/orangtua/assessment/kategori?assessment_id=${assessment_id}`
      );
    } catch (error) {
      console.error("Failed to load assessment detail:", error);
      alert("Gagal memuat detail assessment. Silakan coba lagi.");
    } finally {
      setLoadingDetail(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="h-10 w-10 border-4 border-[#409E86] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse text-sm">Memuat daftar assessment...</p>
      </div>
    );
  }

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-6xl">
      <div className="relative">
        {/* Header Section */}
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-[#36315B]">
            Pilih Assessment Anak
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Pilih salah satu jadwal assessment di bawah ini untuk melihat detail data
          </p>
        </div>

        {/* Loading detail overlay */}
        {loadingDetail && (
          <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-[60]">
            <div className="h-12 w-12 border-4 border-[#409E86] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[#36315B] font-bold">Membuka Assessment...</p>
          </div>
        )}

        {/* Assessment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
          {assessments.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-12 border border-dashed border-gray-200 flex flex-col items-center">
              <ClipboardList className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-gray-400 font-medium">Tidak ada data assessment ditemukan.</p>
            </div>
          ) : (
            assessments.map((item) => (
              <div
                key={item.assessment_id}
                onClick={() => handleSelectAssessment(item.assessment_id)}
                className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-[#C0DCD6] transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#EAF4F0] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#EAF4F0] rounded-xl text-[#409E86] group-hover:scale-110 transition-transform duration-300">
                      <Baby size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-[#36315B] group-hover:text-[#409E86] transition-colors line-clamp-1">
                      {item.child_name}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500 font-medium gap-2">
                      <div className="w-8 flex justify-center">
                        <User className="w-4 h-4 text-[#409E86]" />
                      </div>
                      <span>{item.child_age}</span>
                      <div className="mx-1 text-gray-300">
                        <Mars className="w-4 h-4 text-[#409E86]" />
                      </div> <span className="capitalize">{item.child_gender}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 font-medium">
                      <div className="w-8 flex justify-center">
                        <CalendarDays className="w-4 h-4 text-[#409E86]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Jadwal Assessment</span>
                        <span className="text-[#36315B] font-semibold">{item.scheduled_date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#409E86] opacity-60 group-hover:opacity-100 transition-opacity">
                      Lihat Detail
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#409E86] group-hover:text-white transition-all ml-auto">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}