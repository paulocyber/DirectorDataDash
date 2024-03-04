// Biblioteca
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Tipagem
interface CustomSimpleBarChartProps {
  data: any[];
  xAxisKey: string;
  barKeys: string[];
}

const CustomSimpleBarChart: React.FC<CustomSimpleBarChartProps> = ({
  data,
  xAxisKey,
  barKeys,
}) => {
  return (
    <ResponsiveContainer width="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {barKeys.map((barKey, index) => (
          <Bar key={index} dataKey={barKey} fill={`#${index}${index}4d8`} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomSimpleBarChart;
