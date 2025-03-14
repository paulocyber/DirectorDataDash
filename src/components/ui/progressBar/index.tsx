// Bibliotecas
import { Progress } from "@heroui/react";

// Tipagem
interface ProgressBarProps {
    minValue: number;
    maxValue: number
}

export default function ProgressBar({ minValue, maxValue }: ProgressBarProps) {
    return (
        <>
            <Progress
                size="md"
                value={minValue}
                maxValue={maxValue !== 0 ? maxValue : 1}
                color="primary"
                showValueLabel={true}
                className=""
                aria-label="Progressão das vendas"
                classNames={{
                    value: "text-sm"
                }}
            />
        </>
    )
}