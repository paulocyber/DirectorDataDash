// Bibliotecas
import {
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
} from "recharts";

// Tipagem
interface CustomLineChartProps {
  data: any[];
  lineType: "monotone";
  informationKey: string;
  descriptionKey: string;
}

const CustomLineChart: React.FC<CustomLineChartProps> = ({
  data,
  lineType,
  informationKey,
  descriptionKey,
}) => {
  return (
    <ResponsiveContainer width="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={descriptionKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type={lineType} dataKey={informationKey} stroke="#3B82F6" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart;
