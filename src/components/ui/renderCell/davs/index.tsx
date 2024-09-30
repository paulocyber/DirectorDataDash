// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { ItemsDav } from "@/utils/types/davs";

export const renderCell = (item: ItemsDav, columnKey: string) => {
    switch (columnKey) {
        case "nDav":
            return item.ID_SDS;
        case "cliente":
            return item.CLIENTE;
        case "vendedor":
            return item.VENDEDOR;
        case "valorBruto":
            return formatCurrency(Number(item.VALOR_BRUTO_SDS.replace(",", ".")));
        case "dataFinalização":
            return item.DATAHORA_FINALIZACAO_SDS.split(' ')[0];
        default:
            return null;
    }
};
