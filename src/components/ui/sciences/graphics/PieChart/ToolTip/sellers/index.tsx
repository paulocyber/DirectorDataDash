// React
import React from 'react';

// Biliotecas
import { TooltipProps } from 'recharts';

// Utils
import { formatCurrency } from '@/utils/mask/money';

export const SalesTooltip : React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {

        return (
            <div className="bg-white border rounded-md p-4 shadow-lg">
                <p className="text-xs font-medium text-gray-700">{payload[0].payload.VENDEDOR}</p>
                <p className="text-lg font-bold text-emerald-500">{formatCurrency(payload[0].payload.VALOR_TOTAL_LIQUIDO)}</p>
                
            </div>
        );
    }

    return null;
};

export const SellersTooltip : React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
        const { NOME_CLIENTE, VALOR_LIQUIDO } = payload[0].payload;
        
        return (
            <div className="bg-white border rounded-md p-4 shadow-lg">
                <p className="text-xs font-medium text-gray-700">{NOME_CLIENTE} </p>
                <p className="text-lg font-bold text-emerald-500">{formatCurrency(VALOR_LIQUIDO)}</p>
                
            </div>
        );
    }

    return null;
};
