// Biblioteca
import { Pie, PieChart, ResponsiveContainer, Cell, PieLabelRenderProps, Tooltip } from "recharts";

// React
import React from "react";

// Dados
import vibrantPalette from "@/data/palettes/vibrant.json";

// Tipagem
interface CustomActiveShapePieChartProps<T> {
    data: T[];
    valueKey: keyof T;
    displayToolTip: boolean;
    ToolTipComponent?: React.FC<any>;
    label?: (props: PieLabelRenderProps) => JSX.Element;
}

const calculatePercentages = <T,>(data: T[], valueKey: keyof T) => {
    const total = data.reduce((sum, item) => sum + (item[valueKey] as unknown as number), 0);
    return data.map(item => ({
        ...item,
        percentage: ((item[valueKey] as unknown as number) / total) * 100,
    }));
};

export const CustomActiveShapePieChart = <T,>({ data, valueKey, displayToolTip, ToolTipComponent, label }: CustomActiveShapePieChartProps<T>) => {
    const dataWithPercentages = calculatePercentages(data, valueKey);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                {displayToolTip && <Tooltip content={ToolTipComponent} />}
                <Pie
                    data={dataWithPercentages}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={118}
                    fill="#8884d8"
                    dataKey="percentage" 
                    label={label}
                    labelLine={false}
                >
                    {dataWithPercentages.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={vibrantPalette[index]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};