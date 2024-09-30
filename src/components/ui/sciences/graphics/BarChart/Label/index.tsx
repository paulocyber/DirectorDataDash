// React
import React from 'react';

// Tipagem
interface CustomLabelContentProps {
    value?: string | number;
    x?: number | string;
    y?: number | string;
    data: { value: number }[];
}

const CustomLabelContent: React.FC<CustomLabelContentProps> = ({ value, x, y, data }) => {
    if (typeof value !== 'undefined') {
        const numericValue = Number(value);
        if (!isNaN(numericValue) && data.length !== 0) {
            const totalValue = data.reduce((acc, cur) => acc + cur.value, 0);
            const rate = `${((numericValue / totalValue) * 100).toFixed(2)}%`;
            const yOffset = typeof y === 'number' ? y + 13 : 0;
            const xOffset = typeof x === 'number' ? x + 20 : 0;

            return (
                <div className="overflow-auto w-full h-[50px] z-50">
                    <text
                        x={xOffset}
                        y={yOffset}
                        dy={-5}
                        textAnchor="middle"
                        fill="text-gray-600"
                        className="font-bold text-[11px] px-8 truncate "
                    >
                        {rate}
                    </text>
                </div>
            );
        }
    }
    return null;
};

export default CustomLabelContent;
