// Bibliotecas
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Text, Tooltip } from "recharts";
import { useRecoilValue } from "recoil";

// Tipagem
import { graphicData } from "../../models/types";

// Dados
import { vibrantPalette } from "../../data/PaletteData";

// Atom
import { filterDescription } from "../../atom/filterAtom";

// Componente
import renderTooltipContent from "./ToolTipComponente/ToolTip";

const PieChartComponent = ({ data }: graphicData) => {
    const palette = useRecoilValue(filterDescription);

    const renderActiveShape = (props: any) => {
        const RADIAN = Math.PI / 180;
        const {
            cx,
            cy,
            midAngle,
            outerRadius,
            startAngle,
            endAngle,
            payload,
        } = props;

        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? "start" : "end";
        const value = payload.value;

        // Pegando total do centro de custo
        const rate = `${((value / data.reduce((acc, cur) => acc + cur.value, 0)) * 100).toFixed(2)}%`;

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
                    {rate}
                </Text>
            </g>
        );
    };

    return (
        <ResponsiveContainer width="100%">
            <PieChart>
                <Tooltip content={renderTooltipContent} />
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={140}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderActiveShape}
                >
                    {palette.length > 0 ? (
                        palette.map((item, index) => (
                            <Cell
                                key={index}
                                fill={item.id !== undefined ? vibrantPalette[item.id] : vibrantPalette[index % vibrantPalette.length]}
                            />
                        ))
                    ) : (
                        data.map((_, index) => (
                            <Cell
                                key={index}
                                fill={vibrantPalette[index % vibrantPalette.length]}
                            />
                        ))
                    )}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    )
}

export default PieChartComponent