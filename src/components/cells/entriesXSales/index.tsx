// Utils
import { formatCurrency } from "@/utils/mask/money";

// Bibliotecas
import { Tooltip } from "@heroui/react";

// Tipagem
import { EntriesXSales } from "@/types/entriesXSales"

export const renderCell = (item: EntriesXSales, columnKey: string) => {
    const entries = Number(item.ENTRADA.replace(',', '.'));
    const exits = Number(item.SAIDA.replace(',', '.'));

    const priceDifference = exits - entries;
    const unitPrice = exits ? exits : Number(item.PRECO_UNITARIO.replace(',', '.'));
    const unitsToCoverCost = unitPrice !== 0 ? Math.abs(priceDifference) / unitPrice : 0;

    switch (columnKey) {
        case "id":
            return <span className="text-gray-600">{item.ID_PRD}</span>;

        case "descricao":
            return <span className="text-gray-600">{item.DESCRICAO_PRD}</span>;

        case "marca":
            return <span className="text-gray-600">{item.MARCA}</span>;

        case "entrada":
            return <span className="text-gray-600">{item.DATA}</span>;

        case "compra":
            return <span className="text-gray-600">{formatCurrency(Number(item.ENTRADA.replace(',', '.')))}</span>;

        case "venda":
            return <span className="text-gray-600">{formatCurrency(Number(item.SAIDA.replace(',', '.')))}</span>;

        case "diferenca":
            return <span className="text-gray-600">{formatCurrency(Number(item.SAIDA.replace(",", ".")) - Number(item.ENTRADA.replace(",", ".")))}</span>;

        case "qtsPeca":
            if (item.ENTRADA === '0') {
                return <span className="text-gray-600">Já cobriu</span>;
            } else {
                return (
                    <span className="text-gray-600">
                        {unitsToCoverCost.toFixed(2)}
                    </span>
                );
            }

        default:
            return null;
    }
}