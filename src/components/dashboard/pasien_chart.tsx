/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type CategoryItem = {
  name: string;
  value: number;
};

export default function PasienChart({ apiData }: { apiData: CategoryItem[] }) {
  const COLORS = ["#8FA7A1", "#5B4DA3", "#F59E0B", "#10B981", "#3B82F6"];

  const hasData = apiData && apiData.length > 0;

  const dataToUse = hasData
    ? apiData
    : [{ name: "Tidak ada data", value: 1 }];

  // Fungsi untuk format label di luar: hanya persentase
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20; // jarak label dari pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#36315B"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md shadow-[#ADADAD] p-4 text-[#36315B]">
      <h3 className="font-bold mb-3 text-lg">Kategori Pasien</h3>

      {!hasData && (
        <p className="text-sm text-gray-400 mb-2">
          Belum ada data kategori pasien
        </p>
      )}

      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={dataToUse}
              dataKey="value"
              nameKey="name"
              outerRadius={70}
              innerRadius={20} // agar menjadi donut
              label={renderCustomizedLabel}
              labelLine={true}
            >
              {dataToUse.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                fontFamily: "Playpen Sans, sans-serif",
                color: "#36315B",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
