// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";

export const renderCell = (item: ItemsBillsToReceiveData, columnKey: string) => {
    switch (columnKey) {
        case "nDav":
            return <span className={parseInt(item.ATRASO_RCB) > 0 ? "text-red-600 font-bold" : "text-gray-600"}>{item.ID_SDS}</span>;
        case "dataVencimento":
            return <span className={parseInt(item.ATRASO_RCB) > 0 ? "text-red-600 font-bold" : "text-gray-600"}>{item.DATA_VENCIMENTO_RCB.split(" ")[0]}</span>;
        case "vendedor":
            return <div className="lg:w-full w-40 truncate"><span className={parseInt(item.ATRASO_RCB) > 0 ? "text-red-600 font-bold" : "text-gray-600 font-semibold"}>{item.VENDEDOR}</span></div>
        case "cliente":
            return <div className="lg:w-full w-40 truncate"><span className={parseInt(item.ATRASO_RCB) > 0 ? "text-red-600 font-bold" : "text-gray-600 font-semibold"}>{item.APELIDO_PSS}</span></div>
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
}