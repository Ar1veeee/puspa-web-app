/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { Users } from "lucide-react";

// ✅ PERBAIKAN: Tambahkan Index Signature [key: string]: any
// Ini memberitahu TypeScript bahwa objek ini bisa diakses dengan kunci string apa pun,
// yang diperlukan oleh komponen internal Recharts.
interface ChartItem {
  name: string;
  value: number;
  percentage: number;
  [key: string]: any; 
}

interface PasienChartProps {
  data: any[];
  loading: boolean;
}

type PieLabelProps = {
  name?: string;
  payload?: {
    percentage?: number;
  };
};

export default function PasienChartAdmin({ data, loading }: PasienChartProps) {
  const COLORS = ["#81B7A9", "#6356C1", "#F59E0B", "#10B981", "#3B82F6"];
  const CATEGORY_LABEL_MAP: Record<string, string> = {
    fisio: "Fisioterapi",
  };

  const chartData: ChartItem[] = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item: any) => {
      const key = item.type_key?.toLowerCase();

      return {
        name: CATEGORY_LABEL_MAP[key] || item.type || "Unknown",
        value: Number(item.count) || 0,
        percentage: Number(item.percentage) || 0,
      };
    });
  }, [data]);

  const hasData = chartData.length > 0 && chartData.some(d => d.value > 0);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#81B7A9]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 text-[#36315B]">
      <h3 className="font-bold text-lg mb-4">Kategori Pasien</h3>

      {hasData ? (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={30}
                paddingAngle={3}
                label={(props) => {
                  const { name, payload } = props as PieLabelProps;

                  const percentage =
                    typeof payload?.percentage === "number"
                      ? payload.percentage.toFixed(1)
                      : "0.0";

                  return `${name}\n${percentage}%`;
                }}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name, props) => {
                  const percentage = props?.payload?.percentage;
                  return [
                    `${value} pasien (${percentage?.toFixed?.(1) ?? 0}%)`,
                    name as string,
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400">
          <Users className="w-20 h-20 opacity-30" />
          <p className="text-lg font-semibold">Belum ada data</p>
          <p className="text-sm">Kategori pasien akan muncul di sini</p>
        </div>
      )}

      {hasData && (
        <div className="mt-4 space-y-1">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{item.name}</span>
              <span className="ml-auto font-medium">
                {item.value} ({item.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}