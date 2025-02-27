// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { ItemsDavData } from "@/types/dav";

export const renderCell = (item: ItemsDavData, columnKey: string) => {
    switch (columnKey) {
        case "nDav":
            return <span className="text-gray-600">{item.ID_SDS}</span>;
        case "cliente":
            return <span className="text-gray-600 font-semibold">{item.CLIENTE}</span>
        case "vendedor":
            return <span className="text-gray-600">{item.VENDEDOR}</span>
        case "valorBruto":
            return <span className="text-gray-600">{formatCurrency(Number(item.VALOR_BRUTO_SDS.replace(",", ".")))}</span>
        case "dataFinalização":
            return <span className="text-gray-600">{item.DATAHORA_FINALIZACAO_SDS.split(' ')[0]}</span>
        case "frmPagamento":
            return <span className="text-gray-600">{item.FORMAPAGAMENTO}</span>
        default:
            return null;
    }
}