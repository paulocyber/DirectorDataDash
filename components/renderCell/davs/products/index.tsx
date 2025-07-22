'use client'

// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { DavProductItemData, } from "@/types/davs";

export const renderCell = (item: DavProductItemData, columnKey: string) => {

    switch (columnKey) {
        case "codigodoproduto":
            return <span className="text-gray-600">{item.CODIGO_PRD}</span>;
        case "produto":
            return <span className="text-gray-600 font-semibold">{item.DESCRICAO_PRD}</span>
        case "promoção":
            return <span className="text-gray-600">{item.ITEM_PROMOCAO_SDI ? "Não" : "Sim"}</span>
        case "desconto":
            return <span className="text-gray-600">{item.PERC_DESCONTO_SDI}</span>
        case "quantidadedisponivel":
            return <span className="text-gray-600">{item.QTDE_DISPONIVEL_SDI}</span>
        case "quantidadedasaida":
            return <span className="text-gray-600">{item.QTDE_SDI}</span>
        case "valordoacrescimo":
            return <span className="text-gray-600">{item.VALOR_ACRESCIMO_SDI}</span>
        case "valorbruto":
            return <span className="text-gray-600">{formatCurrency(Number(item.VALOR_BRUTO_SDI.replace(",", ".")))}</span>
        case "valordesconto":
            return <span className="text-gray-600">{formatCurrency(Number(item.VALOR_DESCONTO_SDI.replace(",", ".")))}</span>
        case "valorliquido":
            return <span className="text-gray-600">{formatCurrency(Number(item.VALOR_LIQUIDO_SDI.replace(",", ".")))}</span>
        default:
            return null;
    }
}