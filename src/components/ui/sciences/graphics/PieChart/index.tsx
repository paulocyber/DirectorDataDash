// Bibliotecas
import { Cell, Pie, PieChart as PieChartComponents, PieLabelRenderProps, ResponsiveContainer, Tooltip } from "recharts";

// Dados
import vibrantPallete from "@/data/palettes/vibrant.json"

// Tipagem
interface PieChartProps<T> {
    data: T[];
    dataKey: string;
    displayToolTip: boolean;
    ToolTipComponent?: React.FC<any>;
    label?: (props: PieLabelRenderProps) => JSX.Element;
}

export default function PieChart<T>({ data, dataKey, displayToolTip, ToolTipComponent, label }: PieChartProps<T>) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChartComponents margin={{ top: 20, right: 80, left: 80, bottom: 20 }} >
                {displayToolTip && <Tooltip content={ToolTipComponent} />}
                <Pie
                    data={data}
                    labelLine={false}
                    label={label}
                    outerRadius="80%"
                    fill="#8884d8"
                    dataKey={dataKey}
                >
                    {data.map((item, index) => (
                        <Cell key={`cell-${index}`} fill={(item as any).color || vibrantPallete[index % vibrantPallete.length]} />
                    ))}
                </Pie>
            </PieChartComponents>
        </ResponsiveContainer>
    )
}