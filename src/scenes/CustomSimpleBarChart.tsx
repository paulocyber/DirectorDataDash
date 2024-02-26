// Biblioteca

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Tipagem
interface DataProps {
    data: any[],
    DescriptionData: string,
    InformationData: string
}

const CustomSimpleBarChart: React.FC<DataProps> = ({ data, DescriptionData, InformationData }) => {
    return (
        <ResponsiveContainer width="100%" >
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
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#8884d8" />
                <Bar dataKey="uv" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default CustomSimpleBarChart