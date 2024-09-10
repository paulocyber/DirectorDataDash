// React
import React from 'react';

// Biliotecas
import { TooltipProps } from 'recharts';

// Utils
import { formatCurrency } from '@/utils/mask/formatCurrency';

const SalesTooltip : React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
        const { name, value } = payload[0];
        const numericValue = typeof value === 'number' ? value : 0; // Defina um valor padrão se `value` não for um número

        return (
            <div className="bg-white border rounded-md p-4 shadow-lg">
                <p className="text-xs font-medium text-gray-700">Valor das Vendas: </p>
                <p className="text-lg font-bold text-emerald-500">{formatCurrency(numericValue)}</p>
            </div>
        );
    }

    return null;
};


export default SalesTooltip ;
