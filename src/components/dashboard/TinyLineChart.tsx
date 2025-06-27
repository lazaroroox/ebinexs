import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const transformData = (data: Array<{ accumulated: number }>) => {
  const points = data.map((item) => ({ pv: item.accumulated }));

  points.unshift({ pv: 0 });

  return { points };
};

interface TinyLineChartProps {
  data: Array<{ accumulated: number }>;
  color?: string;
  id?: string;
}

const TinyLineChart = ({
  data,
  color = "#00B474",
  id = "default",
}: TinyLineChartProps) => {
  const { points } = transformData(data);

  const gradientId = useMemo(() => `areaGradient-${id}`, [id]);

  return (
    <ResponsiveContainer width="100%" height={100}>
      <AreaChart data={points} style={{ cursor: "pointer" }}>
        {/* Definição do gradiente */}
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>

        {/* Gradiente abaixo da linha */}
        <Area
          type="monotone"
          dataKey="pv"
          stroke={color} // Cor da borda do contorno
          strokeWidth={2} // Largura do contorno
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TinyLineChart;
