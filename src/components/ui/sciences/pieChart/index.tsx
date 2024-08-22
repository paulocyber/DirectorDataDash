// Biblioteca
import { Cell, Pie, PieChart as PieChartComponents, PieLabelRenderProps, ResponsiveContainer, Tooltip } from "recharts";

// Dados
import { vibrantPalette } from "@/data/graphicColorPalette/vibrantPalette";

// componentes

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
        <ResponsiveContainer width="100%">
            <PieChartComponents margin={{ top: 20, right: 80, left:80, bottom: 20 }}>
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
                        <Cell key={index} fill={(item as any).color !== '' ? (item as any).color : vibrantPalette[index % vibrantPalette.length]} />
                    ))}
                </Pie>
            </PieChartComponents>
        </ResponsiveContainer>
    );
}
