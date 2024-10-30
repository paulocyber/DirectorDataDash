// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { ItemsDavData } from "@/types/davs";

export const renderCell = (item: ItemsDavData, columnKey: string) => {
    switch (columnKey) {
        case "nDav":
            return item.ID_SDS;
        case "cliente":
            return item.CLIENTE;
        case "vendedor":
            return item.VENDEDOR;
        case "valorBruto":
            return formatCurrency(Number(item.VALOR_BRUTO_SDS.replace(",", ".")));
        case "custoMercadoria":
            return formatCurrency(Number(item.PRECO_CUSTO_ALE.replace(",", ".")));
        case "lucroTotal":
            return formatCurrency(Number(item.LUCRO.replace(",", ".")));
        case "dataFinalização":
            return item.DATAHORA_FINALIZACAO_SDS.split(' ')[0];
        default:
            return null;
    }
};
