// Biblioteca 
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Componente
import { LabelPieChart } from "./label";

// Dados
import { vibrantPalette } from "@/data/graphicColorPalette";

// Tipagem
import { graphicProps } from "@/utils/types/graphic";
import { ToolTip } from "@/components/toolTipsBillsToPay";

export default function PieChartComponent({ data }: graphicProps) {
    return (
        <ResponsiveContainer className="w-full">
            <PieChart>
                <Tooltip content={ToolTip} />
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={140}
                    fill="#8884d8"
                    dataKey="value"
                    label={(props) => <LabelPieChart {...props} data={data} />}
                >
                    {data.map((item, index) => (
                        <Cell key={index} fill={item.color !== '' ? item.color : vibrantPalette[index % vibrantPalette.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    )
}