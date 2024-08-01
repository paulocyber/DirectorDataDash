// Biblioteca
import { formatCurrency } from "@/utils/masks/formatCurrency";
import { truncateString } from "@/utils/masks/stringMask";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Client = {
    name: string;
    remainingValue: number;
    lateDay: number;
};

type chartData = {
    description: string;
    clients: Client[];
};

interface SimpleBarChartProps {
    data: chartData[];
}

export function SimpleBarChart({ data }: SimpleBarChartProps) {
    // Transformar os dados para o formato adequado para o gráfico
    const transformedData = data.map(item => {
        const clientData = item.clients.reduce((acc, client, index) => {
            acc[`remainingValue_${index}`] = client.remainingValue;
            acc[`lateDay_${index}`] = client.lateDay;
            return acc;
        }, {} as any);

        return {
            description: item.description,
            ...clientData,
        };
    });

    console.log("Transformed Data: ", transformedData);
    console.log("Dados: ", data);

    return (
        <ResponsiveContainer width="100%">
            <BarChart data={transformedData} margin={{ top: 10, right: 25, left: 25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    className="text-gray-600" 
                    tickFormatter={(description) => truncateString(description, 18)} 
                    tickLine={false} 
                    tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 'bold' }} 
                    dataKey="description" 
                />
                <YAxis 
                    tickFormatter={(value) => formatCurrency(value)} 
                    tick={{ fontSize: 13, fill: '#4A4A4A' }}
                />
                <Tooltip />
                {data[0]?.clients.map((client, index) => (
                    <Bar
                        key={index}
                        dataKey={`remainingValue_${index}`}
                        fill="#8884d8"
                        name={client.name}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}
