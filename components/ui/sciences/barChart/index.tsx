// Biblioteca
import {
  Bar,
  BarChart as BarChartComponents,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  TooltipProps,
} from "recharts";

// Utils
import { formatCurrency } from "@/utils/mask/money";
import { truncateString } from "@/utils/mask/truncateString";

// Tipagem
interface BarChartData {
  value?: number;
  [key: string]: any;
}

interface BarChartProps<T extends BarChartData> {
  data: T[];
  dataKey: string;
  displayToolTip?: boolean;
  ToolTipComponent?: (props: any) => JSX.Element;
  LabelListProps?: boolean;
  displayXAxis?: boolean;
  dataKeyXAxis?: string;
  displayCartesianGrid?: boolean;
  palette: string[];
  showDataKeyLabel?: boolean;
  labelDataKey?: string;
  labelOffset?: number;
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
  showDataKeyLabel = false,
  labelDataKey,
  labelOffset,
}: BarChartProps<T>) {
  const formatLabel = (label: React.ReactNode) => {
    const value = typeof label === "number" ? label : Number(label) || 0;
    const formattedValue = formatCurrency(value);
    const maxLength = 15;
    return formattedValue.length > maxLength
      ? `${formattedValue.substring(0, maxLength)}...`
      : formattedValue;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChartComponents
        data={data}
        margin={{ top: 25, right: 20, left: 30, bottom: 10 }}
      >
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
            <Cell
              key={index}
              fill={item.color || palette[index % palette.length]}
            />
          ))}

          {LabelListProps && (
            <LabelList
              position="top"
              fill="#1F2937"
              formatter={formatLabel}
              className="font-bold text-[11px] lg:flex hidden"
              offset={labelOffset}
            />
          )}

          {showDataKeyLabel && (
            <LabelList
              dataKey={labelDataKey ?? dataKey}
              position="top"
              offset={labelOffset}
              formatter={formatLabel}
              className="font-bold text-gray-800 text-[11px] lg:flex hidden"
            />
          )}
        </Bar>
      </BarChartComponents>
    </ResponsiveContainer>
  );
}
