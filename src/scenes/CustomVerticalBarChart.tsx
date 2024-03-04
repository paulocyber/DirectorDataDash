// Bibliotecas
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

// Tipagem;
interface CustomVerticalBarChartProps {
  data: any[];
  descriptionKey: string;
  valueType: "category";
  informationKey: string;
}

const CustomVerticalBarChart: React.FC<CustomVerticalBarChartProps> = ({
  data,
  descriptionKey,
  valueType,
  informationKey,
}) => {
  return (
    <ResponsiveContainer>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis />
        <YAxis dataKey={descriptionKey} type={valueType} />
        <Tooltip />
        <Legend />
        <Bar dataKey={informationKey} fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomVerticalBarChart;
