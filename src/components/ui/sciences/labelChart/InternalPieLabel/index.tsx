// Bibliotecas
import { PieLabelRenderProps } from "recharts";

export const InternalPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
    const RADIAN = Number(Math.PI) / 180;

    const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
    const x = Number(cx) + radius * Math.cos(-Number(midAngle) * RADIAN);
    const y = Number(cy) + radius * Math.sin(-Number(midAngle) * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            className="font-bold"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={13}
        >
            {(percent! * 100).toFixed(1)}%
        </text>
    );
};