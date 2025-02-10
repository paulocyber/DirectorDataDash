// Utils
import { formatCurrency } from "@/utils/mask/money";

// Bibliotecas
import { Tooltip } from "@nextui-org/react";

// Tipagem
import { EntriesXSales } from "@/types/entriesXSales"

export const renderCell = (item: EntriesXSales, columnKey: string) => {
    const priceDifference = Number(item.VALOR_VENDA.replace(",", ".")) - Number(item.VALOR_FINAL)
    const unitPrice = Number(item.VALOR_LIQUIDO) ? Number(item.VALOR_LIQUIDO) : Number(item.VALOR_UNITARIO.replace(",", "."))
    const unitsToCoverCost = unitPrice !== 0 ? Math.abs(priceDifference) / unitPrice : 0

    switch (columnKey) {
        case "cobriu":
            return (
                <Tooltip content={unitsToCoverCost > 0 ? "NEGATIVO" : "COBRIU O CUSTO" as any}>
                    <div
                        className={`flex items-center justify-center w-4 h-4 rounded-full ${unitsToCoverCost > 0 ? "bg-red-500" : "bg-green-500"
                            }`}
                    ></div>
                </Tooltip>
            );

        case "id":
            return <span className="text-gray-600">{item.ID_PRD}</span>;

        case "descricao":
            return <span className="text-gray-600">{item.DESCRICAO_PRD}</span>;

        case "marca":
            return <span className="text-gray-600">{item.MARCAS}</span>;

        case "entrada":
            return <span className="text-gray-600">{item.DATA.split(' ')[0]}</span>;

        case "compra":
            return <span className="text-gray-600">{formatCurrency(Number(item.VALOR_FINAL.replace(",", ".")))}</span>;

        case "venda":
            return <span className="text-gray-600">{formatCurrency(Number(item.VALOR_VENDA.replace(",", ".")))}</span>;

        case "diferenca":
            return <span className="text-gray-600">{formatCurrency(Number(item.VALOR_VENDA.replace(",", ".")) - Number(item.VALOR_FINAL))}</span>;

        case "qtsPeca":
            return (
                <span className="text-gray-600">
                    {unitsToCoverCost.toFixed(0)}
                </span>
            );

        default:
            return null;
    }
}