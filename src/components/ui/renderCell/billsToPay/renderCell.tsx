// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { BillsToPayData } from "@/types/billsToPay";

export const renderCell = (item: BillsToPayData, columnKey: string) => {
  switch (columnKey) {
    case "foipago":
      return (
        <p
          className={`p-[0.6em] rounded-full ${item.STATUS_PGM != "2" ? "bg-blue-500" : "bg-green-500"
            }`}
        ></p>
      );
    case "data":
      return item.DATA_VENCIMENTO_PGM.split(" ")[0];
    case "valor":
      return formatCurrency(Number(item.VALOR_PGM.replace(",", ".")));
    case "descricao":
      return item.NUMERO_DOCUMENTO_PGM;
    case "naturezadocusto":
      return item.GRUPO_CENTRO;
    case "categoriadadespesa":
      return item.NOME_PSS;
    case "centrodecusto":
      return item.CENTRO_CUSTO;
    case "formadepagamento":
      return item.DESCRICAO_FRM;
    default:
      return null;
  }
};
