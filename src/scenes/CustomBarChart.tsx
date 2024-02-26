import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Tipagem;
interface DataProps {
    data: any[];
    DescriptionData: string;
    InformationData: string;
}

const CustomBarChart: React.FC<DataProps> = ({ data, DescriptionData, InformationData }) => {
    return (
        <ResponsiveContainer width="100%" >
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={DescriptionData} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={InformationData} fill="#3B82F6" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default CustomBarChart