/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CalendarDays, Users } from "lucide-react";

interface CardInfoProps {
  stats: any;
  loading: boolean;
  date?: string;
}

export default function CardInfo({ stats, loading, date }: CardInfoProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4 my-4 text-[#36315B]">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 bg-white rounded-lg shadow-md shadow-[#ADADAD] animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded-full mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 my-4 text-[#36315B]">
      <div className="p-4 bg-white rounded-lg shadow-md shadow-[#ADADAD] flex items-center gap-3">
        <CalendarDays className="text-[#81B7A9]" />
        <div>
          <p className="text-sm">Sesi Observasi Hari Ini</p>
          <h3 className="text-lg font-bold">
            {stats?.metrics?.observation_today || 0}
          </h3>
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md shadow-[#ADADAD] flex items-center gap-3">
        <CalendarDays className="text-[#81B7A9]" />
        <div>
          <p className="text-sm">Sesi Asesmen Hari Ini</p>
          <h3 className="text-lg font-bold">
            {stats?.metrics?.assessment_today || 0}
          </h3>
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md shadow-[#ADADAD] flex items-center gap-3">
        <Users className="text-[#81B7A9]" />
        <div>
          <p className="text-sm">Total Pasien Aktif</p>
          <h3 className="text-lg font-bold">
            {stats?.metrics?.active_patients || 0}
          </h3>
        </div>
      </div>
      
      {date && (
        <div className="col-span-3 text-center text-sm text-gray-500 mt-2 pt-2 border-t">
          {date}
        </div>
      )}
    </div>
  );
}
