// Biblioteca
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Utils
import { formatCurrency } from "@/utils/mask/formatCurrency";

// Dados
import { highlightedColor, lightColor } from "@/data/graphicColorPalette/palletBrand";

// Tipagem 
interface BarChartComparisonProps<T> {
    data: T[];
    xKey: string;
    dataKeyOne: string;
    dataKeyTwo: string;
    nameKeyOne: string;
    nameKeyTwo: string;
}

export default function BarChartComparison<T>({ data, xKey, dataKeyOne, dataKeyTwo, nameKeyOne, nameKeyTwo }: BarChartComparisonProps<T>) {
    return (
        <ResponsiveContainer width="100%">
            <BarChart outerRadius="80%" data={data} margin={{ top: 25, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 2" />
                <XAxis
                    dataKey={xKey}
                    tickFormatter={(value) => value}
                    tickLine={false}
                    className="font-bold text-[11px]"
                />
                <YAxis
                    tickFormatter={(value) => {
                        const formattedValue = formatCurrency(value);
                        const maxLength = 10;
                        if (formattedValue.length > maxLength) {
                            return `${formattedValue.substring(0, maxLength)}...`;
                        }
                        return formattedValue;
                    }}
                    fill="text-gray-600"
                    allowDataOverflow={true}
                    className="font-bold text-[12px]"
                />
                <Tooltip
                    content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;

                        return (
                            <div className="p-2 bg-white border border-gray-300 rounded shadow-lg">
                                <p className="text-sm text-gray-800">{label}:</p>
                                {payload.map((data, index) => {
                                    const value = data.value as number;
                                    return (
                                        <p key={index} className="text-sm" style={{ color: data.color }}>
                                            {data.name}: {formatCurrency(value)}
                                        </p>
                                    );
                                })}
                            </div>
                        );
                    }}
                    wrapperStyle={{ pointerEvents: "none" }}
                />
                <Bar dataKey={dataKeyOne} name={nameKeyOne}>
                    <LabelList
                        position="top"
                        fill="#4b5563"
                        formatter={(value: number) => formatCurrency(value)}
                        className="font-bold text-[11px]"
                    />
                    {data.map((item, index) => (
                        <Cell
                            key={index}
                            fill={highlightedColor[index % highlightedColor.length]}
                        />
                    ))}
                </Bar>

                <Bar dataKey={dataKeyTwo} name={nameKeyTwo}>
                    <LabelList
                        position="top"
                        fill="#4b5563"
                        formatter={(value: number) => formatCurrency(value)}
                        className="font-bold text-[11px]"
                    />
                    {data.map((item, index) => (
                        <Cell
                            key={index}
                            fill={lightColor[index % lightColor.length]}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}