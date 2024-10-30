// React
import React from 'react';

// Bibliotecas
import { TooltipProps } from 'recharts';

// Utils
import { formatCurrency } from '@/utils/mask/money';

// Tipagem
interface CustomTooltipProps extends TooltipProps<number, string> {
    dataKey: string;
    valueKey?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, dataKey, valueKey }) => {
    if (active && payload && payload.length > 0) {
        const data = payload[0].payload[dataKey];

        const value = valueKey ? payload[0].payload[valueKey as string] : undefined;

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
                    <p className="text-xs truncate font-medium text-gray-700">
                        {data || 'Sem dados disponíveis'}
                    </p>
                )}
                <p className={`text-lg font-bold ${data === 'Valor em atraso' ? 'text-red-500' : 'text-emerald-500' } mt-2`}>
                    {value !== undefined ? formatCurrency(value) : ''}
                </p>
            </div>
        );
    }

    return null;
};