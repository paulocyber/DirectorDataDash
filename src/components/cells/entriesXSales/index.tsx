// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { EntriesXSales } from "@/types/entriesXSales"

export const renderCell = (item: EntriesXSales, columnKey: string) => {

    switch (columnKey) {
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
            return <span className="text-gray-600">{formatCurrency(Number(item.sellValue.replace(",", ".")))}</span>;

        default:
            return null;
    }
}