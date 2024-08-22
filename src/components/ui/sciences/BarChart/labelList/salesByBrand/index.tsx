// React
import React from 'react';

// Biblioteca
import { LabelListProps } from 'recharts';

// Tipagem
interface CustomFormattedLabelProps extends Omit<LabelListProps<any>, 'formatter' | 'viewBox'> {
    position: 'top' | 'bottom' | 'left' | 'right';
    formatter: (value: number) => string;
    fill: string;
    className: string;
    value: number;
}

const CustomFormattedLabel: React.FC<CustomFormattedLabelProps> = ({
    x,
    y,
    value,
    position,
    formatter,
    fill,
    className
}) => {
    const isValueNumber = typeof value === 'number';
    const isXDefined = typeof x === 'number';
    const isYDefined = typeof y === 'number';

    if (isValueNumber && isXDefined && isYDefined) {
        const formattedValue = formatter(value);

        // Centralizando o texto
        let yOffset = y;
        if (position === 'top') {
            yOffset -= 10; // Para cima da barra
        } else if (position === 'bottom') {
            yOffset += 15; // Para baixo da barra
        }

        return (
            <text
                x={x + 55}
                y={yOffset}
                fill={fill}
                className={className}
            >
                {formattedValue}
            </text>
        );
    }

    return null;
};

export default CustomFormattedLabel;
