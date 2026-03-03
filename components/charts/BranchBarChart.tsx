"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { formatCLP } from "@/lib/utils";

interface BranchData {
  nombre: string;
  total: number;
  color: string;
}

interface BranchBarChartProps {
  data: BranchData[];
  title: string;
  yLabel?: string;
  height?: number;
  formatAsAmount?: boolean;
}

export function BranchBarChart({
  data,
  title,
  height = 280,
  formatAsAmount = true,
}: BranchBarChartProps) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
          />
          <XAxis
            dataKey="nombre"
            tick={{ fill: "var(--color-muted)", fontSize: 12 }}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: "var(--color-muted)", fontSize: 11 }}
            axisLine={false}
            tickFormatter={(v) =>
              formatAsAmount
                ? `${(v / 1000000).toFixed(1)}M`
                : v.toLocaleString("es-CL")
            }
          />
          <Tooltip
            formatter={(value) =>
              formatAsAmount
                ? formatCLP(value as number)
                : (value as number).toLocaleString("es-CL")
            }
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color || "#f4a7bb"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
