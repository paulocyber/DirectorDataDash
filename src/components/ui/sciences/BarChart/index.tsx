// Biblioteca
import { Bar, BarChart as BarChartComponents, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis, TooltipProps } from "recharts";

// Utils
import { formatCurrency } from "@/utils/mask/money";
import { truncateString } from "@/utils/mask/trucanteString";

// Tipagem
interface BarChartData {
    value?: number;
    [key: string]: any;
}

interface BarChartProps<T extends BarChartData> {
    data: T[];
    dataKey: string;
    displayToolTip?: boolean;
    ToolTipComponent?: (props: TooltipProps<number, string>) => React.ReactNode;
    LabelListProps?: boolean;
    displayXAxis?: boolean;
    dataKeyXAxis?: string;
    displayCartesianGrid?: boolean;
    palette: string[];
}

export default function BarChart<T extends BarChartData>({
    data,
    dataKey,
    displayToolTip,
    ToolTipComponent,
    LabelListProps,
    displayXAxis,
    dataKeyXAxis,
    displayCartesianGrid,
    palette,
}: BarChartProps<T>) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChartComponents outerRadius="100%" data={data} margin={{ top: 25, right: 20, left: 20, bottom: 0 }}>
                {displayToolTip && <Tooltip content={ToolTipComponent} />}
                {displayCartesianGrid && <CartesianGrid strokeDasharray="3 2" />}
                {displayXAxis && (
                    <XAxis
                        tickFormatter={(dataKeyXAxis) => truncateString(dataKeyXAxis, 7)}
                        tickLine={false}
                        dataKey={dataKeyXAxis}
                        className="font-bold text-[10px] w-20 hidden md:flex truncate"
                    />
                )}
                <YAxis
                    tickFormatter={(value) => {
                        const formattedValue = formatCurrency(value);
                        const maxLength = 10;
                        return formattedValue.length > maxLength
                            ? `${formattedValue.substring(0, maxLength)}...`
                            : formattedValue;
                    }}
                    fill="text-gray-600"
                    allowDataOverflow={true}
                    className="font-bold text-[12px]"
                />
                <Bar dataKey={dataKey}>
                    {data.map((item, index) => (
                        <Cell key={index} fill={item.color || palette[index % palette.length]} />
                    ))}
                    {LabelListProps && (
                        <LabelList
                            position="top"
                            fill="#4b5563"
                            formatter={(value: number) => {
                                const formattedValue = formatCurrency(value);
                                const maxLength = 15;
                                return formattedValue.length > maxLength
                                    ? `${formattedValue.substring(0, maxLength)}...`
                                    : formattedValue;
                            }}
                            className="font-bold text-[11px] lg:flex hidden"
                        />
                    )}
                </Bar>
            </BarChartComponents>
        </ResponsiveContainer>
    );
}
