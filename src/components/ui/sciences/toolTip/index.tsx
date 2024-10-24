// React
import React from 'react';

// Biblioteca
import { TooltipProps } from 'recharts';

// Utils
import { formatCurrency } from '@/utils/mask/money';

// Tipagem
interface CustomTooltipProps extends TooltipProps<number, string> {
    dataKey: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, dataKey }) => {
    if (active && payload && payload.length > 0) {
        const data = payload[0].payload[dataKey]; 

        const isArray = Array.isArray(data);

        return (
            <div className="bg-white md:w-full w-48 border rounded-md p-4 shadow-lg">
                {isArray ? (
                    data.map((item, index) => (
                        <p key={index} className="text-xs font-medium text-gray-700">
                            {item}
                        </p>
                    ))
                ) : (
                    <p className="text-xs truncate  font-medium text-gray-700">
                        {data || 'Sem dados disponíveis'}
                    </p>
                )}
                <p className="text-lg font-bold text-emerald-500 mt-2">
                    {payload[0].payload.VALOR_LIQUIDO && formatCurrency(payload[0].payload.VALOR_LIQUIDO)}
                </p>    
            </div>
        );
    }

    return null;
};