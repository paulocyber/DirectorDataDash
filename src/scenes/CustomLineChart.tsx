// Bibliotecas
import { CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart } from "recharts"

// Tipagem
interface DataProps {
    data: any[];
    typeData: "monotone";
    InformationData: string;
    DescriptionData: string;
}

const CustomLineChart: React.FC<DataProps> = ({ data, typeData, InformationData, DescriptionData }) => {
    return (
        <ResponsiveContainer width="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={DescriptionData} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type={typeData} dataKey={InformationData} stroke="#3B82F6" />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default CustomLineChart