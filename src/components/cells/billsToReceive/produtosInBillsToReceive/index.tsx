// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { ItemsDavProductsResponse } from "@/types/dav";

export const renderCell = (item: ItemsDavProductsResponse, columnKey: string) => {
    switch (columnKey) {
        case "nDav":
            return <span className="text-gray-600">{item.ID_SDS}</span>;
        case "produto":
            return <span className="text-gray-600">{item.DESCRICAO_PRD}</span>;
        case "quantidade":
            return <div className="lg:w-full w-40 truncate"><span className="text-gray-600 font-semibold ">{item.QTDE_SDI}</span></div>
        case "valorBruto":
            return <div className="lg:w-full w-40 truncate"><span className="text-gray-600 font-semibold ">{formatCurrency(Number(item.VALOR_BRUTO_SDI))}</span></div>
        case "valorPago":
            return (
                <span className="text-green-600 font-bold">
                    {formatCurrency(Number(item.VALOR_LIQUIDO_SDI.replace(",", ".")))}
                </span>
            );
        case "quantidadeEstoque":
            return <div className="lg:w-full w-40 truncate"><span className="text-gray-600 font-semibold ">{item.QTDE_DISPONIVEL_SDI}</span></div>

        default:
            return null;
    }
}