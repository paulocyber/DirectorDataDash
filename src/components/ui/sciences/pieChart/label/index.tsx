// Biblioteca
import { Sector, Text } from "recharts";

// Tipagem
import { grapichData } from "@/utils/types/graphic";

export const LabelPieChart = (props: any) => {
    const radian = Math.PI / 180;
    const { cx, cy, midAngle, outerRadius, startAngle, endAngle, payload } = props

    const sin = Math.sin(-radian * midAngle);
    const cos = Math.cos(-radian * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 5) * sin;
    const mx = cx + (outerRadius + 20) * cos;
    const my = cy + (outerRadius + 38) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    const value = payload.value;

    // Pegando total do centro de custo
    const totalValue = props.data.reduce((acc: number, cur: grapichData) => acc + cur.value, 0);
    const percentage = `${((value / totalValue) * 100).toFixed(2)}%`;

    return (
        <g className="">
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={payload.fill}
            />
            <path
                d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                stroke={payload.fill}
                fill="none"
            />
            <circle cx={ex} cy={ey} r={2} fill={payload.fill} stroke="none" />
            <Text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey + 13}
                dy={-10}
                textAnchor={textAnchor}
                fill="text-gray-600"
                className="font-bold text-[11px]"
            >
                {percentage}
            </Text>
        </g>
    )
}
