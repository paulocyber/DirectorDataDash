// Biblioteca
import { PieLabelRenderProps, Sector } from "recharts";

// React
import { JSX } from "react";

// Tipagem
interface DataItem {
    value: number;
}

export const ExternalPieLabel = (props: PieLabelRenderProps & { data: DataItem[] }): JSX.Element => {
    const radian = Math.PI / 180;
    const { cx, cy, midAngle, startAngle, endAngle, payload, outerRadius, value, data } = props;

    const cxNumber = typeof cx === 'number' ? cx : 0;
    const cyNumber = typeof cy === 'number' ? cy : 0;
    const outerRadiusNumber = typeof outerRadius === 'number' ? outerRadius : 0;

    const sin = Math.sin(-radian * midAngle);
    const cos = Math.cos(-radian * midAngle);
    const sx = cxNumber + (outerRadiusNumber + 8) * cos;
    const sy = cyNumber + (outerRadiusNumber + 5) * sin;
    const mx = cxNumber + (outerRadiusNumber + 20) * cos;
    const my = cyNumber + (outerRadiusNumber + 45) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 20;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    const totalValue = (data || []).reduce((acc: number, cur: { value: number }) => acc + cur.value, 0);
    const percentage = totalValue > 0 ? `${((value / totalValue) * 100).toFixed(1)}%` : '0%';

    return (
        <g>
            <Sector
                cx={cxNumber}
                cy={cyNumber}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadiusNumber + 6}
                outerRadius={outerRadiusNumber + 10}
                fill={payload.fill}
            />
            <path
                d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                stroke={payload.fill}
                fill="none"
            />
            <circle cx={ex} cy={ey} r={2} fill={payload.fill} stroke="none" />
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey + 13}
                dy={-10}
                textAnchor={textAnchor}
                fill="text-gray-600"
                className="font-bold text-[11px]"
            >
                {`${percentage}%`}
            </text>
        </g>
    );
};