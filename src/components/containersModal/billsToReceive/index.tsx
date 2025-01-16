import { formatCurrency } from "@/utils/mask/money";
import { calculateTotalByKey } from "@/utils/functions/sumValues";

// Biblioteca
import { ScrollShadow, Tab, Tabs } from "@nextui-org/react";

// React
import { useState } from "react";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";

interface ContainerModalProps {
    summaryBilletData: ItemsBillsToReceiveData[];
    summaryReceiveReleaseData: ItemsBillsToReceiveData[];
}

export function ContainerModal({ summaryBilletData, summaryReceiveReleaseData }: ContainerModalProps) {
    const [selected, setSelected] = useState<string | undefined>("vencimentos");

    return (
        <div className="flex flex-col items-center w-full dark:bg-gray-900">
            <Tabs
                aria-label="Options"
                className="w-full"
                classNames={{
                    base: "w-full",
                    panel: "w-full overflow-auto",
                }}
                color="primary"
                variant="underlined"
                selectedKey={selected}
                onSelectionChange={(key) => setSelected(key.toString())}
            >
                <Tab key="vencimentos" title="Recebimentos">
                    <div className="w-full flex flex-col gap-2">
                        {summaryBilletData.map((relatory, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
                            >
                                <div className="flex flex-col w-1/3">
                                    <h2 className="text-sm font-semibold text-gray-600 dark:text-white/80">Mês/Ano:</h2>
                                    <span className="text-base font-medium text-gray-800 dark:text-white">
                                        {relatory.MES_ANO}
                                    </span>
                                </div>

                                <div className="flex flex-col w-1/3">
                                    <h2 className="text-sm font-semibold text-gray-600 dark:text-white/80">Valor:</h2>
                                    <span className="text-base font-medium text-green-600 dark:text-green-400">
                                        {formatCurrency(Number(relatory.VALOR_PAGO_RCB.replace(",", ".")))}
                                    </span>
                                </div>

                                <div className="flex flex-col w-1/4">
                                    <h2 className="text-sm font-semibold text-gray-600 dark:text-white/80">%</h2>
                                    <span className="text-base font-medium text-blue-600 dark:text-blue-400">
                                        {relatory.PORCENTAGEM}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Tab>
                <Tab key="emissao" title="Emissão">
                    <ScrollShadow className="relative w-full h-[20rem] overflow-auto" size={100}>
                        <div className="flex flex-col gap-2">
                            {summaryReceiveReleaseData.map((relatory, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <div className="flex flex-col w-1/3">
                                        <h2 className="text-sm font-semibold text-gray-600 dark:text-white/80">Mês/Ano:</h2>
                                        <span className="text-base font-medium text-gray-800 dark:text-white">
                                            {relatory.DATA_LANCAMENTO}
                                        </span>
                                    </div>

                                    <div className="flex flex-col w-1/3">
                                        <h2 className="text-sm font-semibold text-gray-600 dark:text-white/80">Valor:</h2>
                                        <span className="text-base font-medium text-green-600 dark:text-green-400">
                                            {formatCurrency(Number(relatory.VALOR_RCB.replace(",", ".")))}
                                        </span>
                                    </div>

                                    <div className="flex flex-col w-1/4">
                                        <h2 className="text-sm font-semibold text-gray-600 dark:text-white/80">Restante:</h2>
                                        <span className="text-base font-medium text-blue-600 dark:text-blue-400">
                                            {formatCurrency(Number(relatory.RESTANTE_RCB.replace(",", ".")))}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollShadow>
                </Tab>
            </Tabs>

            <div className="flex w-full py-2 justify-between items-center">
                <h2 className="text-base font-semibold text-gray-700 dark:text-white">
                    Total:
                </h2>
                {selected === 'vencimentos'
                    ? <span className="text-lg font-bold text-emerald-600">{formatCurrency(calculateTotalByKey(summaryBilletData, (item) => item.VALOR_PAGO_RCB))}</span>
                    : <span className="text-lg font-bold text-emerald-600">{formatCurrency(calculateTotalByKey(summaryReceiveReleaseData, (item) => item.RESTANTE_RCB))}</span>
                }
            </div>
        </div>
    );
}
