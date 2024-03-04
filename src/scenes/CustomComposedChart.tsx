// Bilioteca
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Tipagem
interface CustomComposedChartProps {
  data: any[];
  descriptionKey: string;
  informationKey: string;
}

const CustomComposedChart: React.FC<CustomComposedChartProps> = ({
  data,
  descriptionKey,
  informationKey,
}) => {
  return (
    <ResponsiveContainer width="100%">
      <ComposedChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey={descriptionKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={informationKey} fill="#413ea0" />
        <Line type="monotone" dataKey={informationKey} stroke="#ff7300" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CustomComposedChart;
