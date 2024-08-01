// Biblioteca
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts";

// Utils
import { truncateString } from "@/utils/masks/stringMask";
import { formatCurrency } from "@/utils/masks/formatCurrency";

// Dados
import { vibrantPalette } from "@/data/graphicColorPalette";

// Tipagem 
interface BarChartProps<T> {
    data: T[];
    mask: number;
    keyValue: string;
    description: string;
}
export function BarChartComponent<T>({ data, mask, keyValue, description }: BarChartProps<T>) {
    return (
        <ResponsiveContainer width="100%">
            <BarChart data={data} margin={{ top: 10, right: 40, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 2" />
                <XAxis
                    tickFormatter={(description) => truncateString(description, mask)}
                    tickLine={false}
                    tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 'bold' }}
                    dataKey={description}
                />
                <YAxis
                    tickFormatter={(value) => formatCurrency(value)}
                    tick={{ fontSize: 13, fill: '#4b5563' }}
                />
                <Bar dataKey={keyValue}>
                    {data && data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={vibrantPalette[index % vibrantPalette.length]} />
                    ))}
                    <LabelList dataKey={keyValue} position="top" formatter={(value: number) => formatCurrency(value)} fill="#4b5563" className="font-bold text-xs" />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}