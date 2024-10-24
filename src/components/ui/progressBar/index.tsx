// Bibliotecas
import { Progress } from "@nextui-org/react";

// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
interface ProgressBarProps {
    minValue: number;
    maxValue: number
}

export default function ProgressBar({minValue, maxValue}: ProgressBarProps) {
    return (
        <>
            <div className="w-full flex px-7">
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
            </div>
            <div className="w-full flex flex-col py-3 px-7">
                <span className="text-xl font-bold text-emerald-500 dark:text-white">{formatCurrency(minValue)}</span>
                <p className="text-sm text-gray-700 dark:text-white">Acumulados da meta de <span className="font-bold">{formatCurrency(maxValue)}</span></p>
            </div>
        </>
    )
}