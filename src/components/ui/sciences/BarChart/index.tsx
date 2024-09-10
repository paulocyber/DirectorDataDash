// Biblioteca
import { Bar, BarChart as BarChartComponents, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Dados
import { formatCurrency } from "@/utils/mask/formatCurrency";

// Tipagem
interface BarChartData {
    value?: number; // Adicione a propriedade 'value'
    [key: string]: any; // Permite outras propriedades
}

interface BarChartProps<T extends BarChartData> {
    data: T[];
    dataKey: string;
    displayToolTip?: boolean;
    ToolTipComponent?: React.FC<any>;
    LabelListProps?: React.ComponentProps<typeof LabelList>;
    displayXAxis?: boolean;
    dataKeyXAxis?: string;
    displayCartesianGrid?: boolean;
    palette: string[]
}

export default function BarChart<T extends BarChartData>({ data, dataKey, displayToolTip, ToolTipComponent, LabelListProps, displayXAxis, dataKeyXAxis, displayCartesianGrid, palette }: BarChartProps<T>) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChartComponents outerRadius="100%" data={data} margin={{ top: 25, right: 20, left: 20, bottom: 0 }}>
                {displayToolTip && <Tooltip content={ToolTipComponent} />}
                {displayCartesianGrid && <CartesianGrid strokeDasharray="3 2" />}
                {displayXAxis && (
                    <XAxis
                        tickFormatter={(dataKeyXAxis) => dataKeyXAxis}
                        tickLine={false}
                        dataKey={dataKeyXAxis}
                        className="font-bold text-[10px] truncate "
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
                        <Cell
                            key={index}
                            fill={item.color || palette[index % palette.length]} // Usar a cor ou o padrão
                        />
                    ))}
                    {LabelListProps ? (
                        <LabelList {...LabelListProps} />
                    ) : (
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
                            className="font-bold text-[11px] "
                        />
                    )}
                </Bar>
            </BarChartComponents>
        </ResponsiveContainer>
    )
}