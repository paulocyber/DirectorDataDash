// Bilioteca
import { Area, Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';

// Tipagem
interface DataProps {
    data: any[]
    DescriptionData: string,
    InformationData: string,
}

const CustomComposedChart: React.FC<DataProps> = ({ data, DescriptionData, InformationData }) => {
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
                <XAxis dataKey={DescriptionData} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={InformationData} fill="#413ea0" />
                <Line type="monotone" dataKey={InformationData} stroke="#ff7300" />
            </ComposedChart>
        </ResponsiveContainer>
    )
}

export default CustomComposedChart