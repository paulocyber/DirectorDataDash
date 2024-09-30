// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { ProductsDav } from "@/utils/types/davs";

export const renderCell = (item: ProductsDav, columnKey: string) => {

    console.log("Dados de itens: ", item)
    switch (columnKey) {
        case "codigodoproduto":
            return item.CODIGO_PRD;
        case "produto":
            return item.DESCRICAO_PRD;
        case "promoção":
            return item.ITEM_PROMOCAO_SDI ? "Não" : "Sim";
        case "desconto":
            return item.PERC_DESCONTO_SDI
        case "quantidadedisponivel":
            return item.QTDE_DISPONIVEL_SDI
        case "quantidadedasaida":
            return item.QTDE_SDI
        case "valordoacrescimo":
            return item.VALOR_ACRESCIMO_SDI
        case "valorbruto":
            return formatCurrency(Number(item.VALOR_BRUTO_SDI.replace(",", ".")))
        case "valordesconto":
            return formatCurrency(Number(item.VALOR_DESCONTO_SDI.replace(",", ".")))
        case "valorliquido":
            return formatCurrency(Number(item.VALOR_LIQUIDO_SDI.replace(",", ".")))
        default:
            return null;
    }
}