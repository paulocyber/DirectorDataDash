// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { ItemsDavData } from "@/types/davs";

export const renderCell = (item: ItemsDavData, columnKey: string) => {
  switch (columnKey) {
    case "nDav":
      return <span className="text-gray-600">{item.ID_SDS}</span>;
    case "cliente":
      return (
        <span className="text-gray-600 font-semibold">{item.CLIENTE}</span>
      );
    case "indentificacao":
      return (
        <span className="text-gray-600 font-semibold">
          {item.NOME_CLIENTE_SDS}
        </span>
      );
    case "vendedor":
      return <span className="text-gray-600">{item.VENDEDOR}</span>;
    case "valorLiquido":
      return (
        <span className="text-gray-600">
          {formatCurrency(Number(item.VALOR_LIQUIDO_SDS.replace(",", ".")))}
        </span>
      );
    case "dataFinalização":
      return (
        <span className="text-gray-600">
          {item.DATAHORA_FINALIZACAO_SDS.split(" ")[0]}
        </span>
      );
    default:
      return null;
  }
};
