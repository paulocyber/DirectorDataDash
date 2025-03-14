// Utils
import { formatCurrency } from "@/utils/mask/money";

// Biblioteca
import { Tooltip } from "@heroui/react";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";

export const renderCell = (item: ItemsBillsToReceiveData, columnKey: string) => {
    const atraso = parseFloat(item.ATRASO_RCB);

    switch (columnKey) {
        case "#":
            return (
                <Tooltip content={`Atraso: ${atraso} dias`} placement="top">
                    <div
                        className={`w-4 h-4 rounded-full mx-auto ${atraso === 0
                            ? "bg-blue-500"
                            : atraso > 0 && atraso < 30
                                ? "bg-yellow-400"
                                : atraso >= 60
                                    ? "bg-red-500"
                                    : "bg-gray-300"
                            }`}
                    >
                        {atraso > 0 && atraso < 30 && (
                            <Tooltip content={`Atraso moderado (${atraso} Dias)`} placement="top">
                                <div className="absolute inset-0"></div>
                            </Tooltip>
                        )}
                        {atraso >= 60 && (
                            <Tooltip content={`Atraso alto (${atraso} Dias)`} placement="top">
                                <div className="absolute inset-0"></div>
                            </Tooltip>
                        )}
                        {atraso === 0 && (
                            <Tooltip content="Em aberto" placement="top">
                                <div className="absolute inset-0"></div>
                            </Tooltip>
                        )}
                        {atraso < 0 && (
                            <Tooltip content="Ainda vai se vencer" placement="top">
                                <div className="absolute inset-0"></div>
                            </Tooltip>
                        )}
                    </div>
                </Tooltip>
            );
        case "nDav":
            return <span className="text-gray-600">{item.ID_ORIGEM}</span>;
        case "dataVencimento":
            return <span className="text-gray-600">{item.DATA_VENCIMENTO_RCB.split(" ")[0]}</span>;
        case "cliente":
            return <div className="lg:w-full w-40 truncate"><span className="text-gray-600 font-semibold ">{item.APELIDO_PSS}</span></div>
        case "valorRestante":
            return (
                <span className="text-red-600 font-bold">
                    {formatCurrency(Number(item.RESTANTE_RCB.replace(",", ".")))}
                </span>
            );
        case "valorPago":
            return (
                <span className="text-green-600 font-bold">
                    {formatCurrency(Number(item.VALOR_PAGO_RCB.replace(",", ".")))}
                </span>
            );
        default:
            return null;
    }
};

export const renderCellAdmin = (item: ItemsBillsToReceiveData, columnKey: string) => {
    const atraso = parseFloat(item.ATRASO_RCB);

    switch (columnKey) {
        case "#":
            return (
                <Tooltip content={`Atraso: ${atraso} dias`} placement="top">
                    <div
                        className={`w-4 h-4 rounded-full mx-auto ${atraso === 0
                            ? "bg-blue-500"
                            : atraso > 0 && atraso < 30
                                ? "bg-yellow-400"
                                : atraso >= 60
                                    ? "bg-red-500"
                                    : "bg-gray-300"
                            }`}
                    >
                        {atraso > 0 && atraso < 30 && (
                            <Tooltip content={`Atraso moderado (${atraso} Dias)`} placement="top">
                                <div className="absolute inset-0"></div>
                            </Tooltip>
                        )}
                        {atraso >= 60 && (
                            <Tooltip content={`Atraso alto (${atraso} Dias)`} placement="top">
                                <div className="absolute inset-0"></div>
                            </Tooltip>
                        )}
                        {atraso === 0 && (
                            <Tooltip content="Em aberto" placement="top">
                                <div className="absolute inset-0"></div>
                            </Tooltip>
                        )}
                        {atraso < 0 && (
                            <Tooltip content="Ainda vai se vencer" placement="top">
                                <div className="absolute inset-0"></div>
                            </Tooltip>
                        )}
                    </div>
                </Tooltip>
            );
        case "nDav":
            return <span className="text-gray-600">{item.ID_ORIGEM}</span>;
        case "dataVencimento":
            return <span className="text-gray-600">{item.DATA_VENCIMENTO_RCB.split(" ")[0]}</span>;
        case "vendedor":
            return <span className="text-gray-600">{item.VENDEDOR}</span>;
        case "cliente":
            return <div className="lg:w-full w-40 truncate"><span className="text-gray-600 font-semibold ">{item.APELIDO_PSS}</span></div>
        case "valorRestante":
            return (
                <span className="text-red-600 font-bold">
                    {formatCurrency(Number(item.RESTANTE_RCB.replace(",", ".")))}
                </span>
            );
        case "valorPago":
            return (
                <span className="text-green-600 font-bold">
                    {formatCurrency(Number(item.VALOR_PAGO_RCB.replace(",", ".")))}
                </span>
            );
        default:
            return null;
    }
};
