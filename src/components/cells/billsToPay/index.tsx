// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { ItemsBillsToPay } from "@/types/billsToPay";

// Componentes
import { Tooltip } from "@nextui-org/react";

export const renderCell = (item: ItemsBillsToPay, columnKey: string) => {
    switch (columnKey) {
        case "foipago":
            return (
                <Tooltip content={item.STATUS_PGM !== "2" ? "Em aberto" : "Pago"}>
                    <div
                        className={`flex items-center justify-center w-4 h-4 rounded-full ${item.STATUS_PGM !== "2" ? "bg-blue-500" : "bg-green-500"
                            }`}
                    ></div>
                </Tooltip>
            );
        case "data":
            return (
                <span className="text-sm font-medium text-gray-700">
                    {item.DATA_VENCIMENTO_PGM.split(" ")[0]}
                </span>
            );
        case "valor":
            return (
                <span className="text-sm font-semibold text-blue-600">
                    {formatCurrency(Number(item.VALOR_PGM.replace(",", ".")))}
                </span>
            );
        case "descricao":
            return (
                <span className="text-sm text-gray-600">
                    {item.NUMERO_DOCUMENTO_PGM}
                </span>
            );
        case "naturezadocusto":
            return (
                <span className="text-sm text-gray-500">
                    {item.GRUPO_CENTRO}
                </span>
            );
        case "categoriadadespesa":
            return (
                <span className="text-sm text-gray-500">
                    {item.NOME_PSS}
                </span>
            );
        case "centrodecusto":
            return (
                <span className="text-sm text-gray-600 font-medium">
                    {item.CENTRO_CUSTO}
                </span>
            );
        case "formadepagamento":
            return (
                <span className="text-sm text-gray-500">
                    {item.DESCRICAO_FRM}
                </span>
            );
        default:
            return null;
    }
};
