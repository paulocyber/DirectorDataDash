// Componentes
import { Tooltip } from "@heroui/react";

// Tipagem
import { ItemsBillsToPay } from "@/types/billsToPay";
import { formatCurrency } from "@/utils/mask/money";

export function RenderCell(item: ItemsBillsToPay, columnKey: string) {
  switch (columnKey) {
    case "foipago":
      return (
        <Tooltip
          content={
            item.STATUS_PGM === "1"
              ? "Em aberto"
              : item.STATUS_PGM === "2"
                ? "Pago"
                : "Pago / parcial"
          }
        >
          <div
            className={`flex items-center justify-center w-4 h-4 rounded-full ${
              item.STATUS_PGM === "1"
                ? "bg-blue-500"
                : item.STATUS_PGM === "2"
                  ? "bg-green-500"
                  : "bg-gray-400"
            }`}
          ></div>
        </Tooltip>
      );

    case "data":
      return (
        <span className="text-gray-600">
          {" "}
          {item.DATA_VENCIMENTO_PGM.split(" ")[0]}
        </span>
      );

    case "valor":
      return (
        <span className="text-gray-600">
          {formatCurrency(Number(item.VALOR_PGM.replace(",", ".")))}
        </span>
      );

    case "descricao":
      return <span className="text-gray-600">{item.NUMERO_DOCUMENTO_PGM}</span>;

    case "naturezadocusto":
      return <span className="text-gray-600">{item.GRUPO_CENTRO}</span>;

    case "categoriadadespesa":
      return <span className="text-gray-600">{item.NOME_PSS}</span>;

    case "centrodecusto":
      return <span className="text-gray-600"> {item.CENTRO_CUSTO}</span>;

    case "formadepagamento":
      return <span className="text-gray-600">{item.DESCRICAO_FRM}</span>;

    default:
      null;
  }
}
