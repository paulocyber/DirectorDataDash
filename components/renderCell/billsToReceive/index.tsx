// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { ItemsBillsToReceive } from "@/types/billsToReceive";

export const renderCell = (item: ItemsBillsToReceive, columnKey: string) => {
  switch (columnKey) {
    case "nDav":
      return <span className="text-gray-600">{item.ID_SDS}</span>;
    case "dataVencimento":
      return (
        <span className="text-gray-600 font-semibold">
          {item.DATA_VENCIMENTO_RCB.split(" ")[0]}
        </span>
      );
    case "vendedor":
      return <span className="text-gray-600">{item.VENDEDOR}</span>;
    case "cliente":
      return <span className="text-gray-600">{item.APELIDO_PSS}</span>;
    case "valorRestante":
      return (
        <span className="text-red-600 font-extrabold">
          {formatCurrency(Number(item.RESTANTE_RCB.replace(",", ".")))}
        </span>
      );
    case "valorPago":
      return (
        <span className="text-emerald-600 font-extrabold">
          {formatCurrency(Number(item.VALOR_PAGO_RCB.replace(",", ".")))}
        </span>
      );
    default:
      return null;
  }
};
