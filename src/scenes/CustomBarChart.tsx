import React from "react";
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
interface CustomBarChartProps {
  data: any[];
  descriptionKey: string;
  informationKey: string;
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({
  data,
  descriptionKey,
  informationKey,
}) => {
  return (
    <ResponsiveContainer width="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={descriptionKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={informationKey} fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
