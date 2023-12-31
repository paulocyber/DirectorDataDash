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
interface DataProps {
  data: any[];
  DescriptionData: String;
  typeData: String;
  InformationData: String;
}

const CustomBarChart: React.FC<DataProps> = ({
  data,
  DescriptionData,
  typeData,
  InformationData,
}) => {
  return (
    <ResponsiveContainer>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey={DescriptionData} type={typeData} />
        <Tooltip />
        <Legend />
        <Bar dataKey={InformationData} fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
