import React, { useEffect, useState } from 'react';

interface NumberAnimationProps {
    value: string;
}

const NumberAnimation: React.FC<NumberAnimationProps> = ({ value }) => {
    const [displayedValue, setDisplayedValue] = useState<number | string>(0);

    // Função para verificar se o valor contém letras
    const containsLetters = (str: string) => /[a-zA-Z]/.test(str);

    // Se tiver prefixo R$
    const hasMask = value.startsWith('R$');

    // Remove o prefixo e outros caracteres não numéricos
    const numericValue = parseFloat(value.replace('R$', '').replace(/\./g, '').replace(',', '.'));

    useEffect(() => {
        if (containsLetters(value)) {
            setDisplayedValue(value); // Exibe o valor como está se contiver letras
        } else {
            const numberDivision = numericValue / 30;
            const animationRuntimeMS = 50;
            let dynamicNumber = 0;

            const animateNumbers = setInterval(() => {
                if (dynamicNumber < numericValue) {
                    dynamicNumber += numberDivision;
                    setDisplayedValue(Math.floor(dynamicNumber));
                } else {
                    setDisplayedValue(numericValue);
                    clearInterval(animateNumbers);
                }
            }, Math.random() * animationRuntimeMS);

            return () => clearInterval(animateNumbers);
        }
    }, [numericValue, value]);

    // Formatar o valor exibido
    const formatValue = (val: number | string) => {
        if (typeof val === 'string') {
            return val; // Retorna o valor como string se contiver letras
        } else if (hasMask) {
            return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else {
            return val.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        }
    };

    return <span>{formatValue(displayedValue)}</span>;
};

export default NumberAnimation;
