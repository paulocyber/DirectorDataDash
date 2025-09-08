// Bibliotecas
import { Tooltip } from "@heroui/react";

// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { ItemsBillsToReceive } from "@/types/billsToReceive";

export const renderCell = (item: ItemsBillsToReceive, columnKey: string) => {
  switch (columnKey) {
    case "#":
      return (
        <Tooltip content={`Atraso: ${item.ATRASO_RCB} Dias`}>
          <span
            className={`flex items-center justify-center w-4 h-4 rounded-full ${parseInt(item.ATRASO_RCB) === 0 ? "bg-blue-500" : parseInt(item.ATRASO_RCB) > 0 && parseInt(item.ATRASO_RCB) < 30 ? "bg-yellow-400" : parseInt(item.ATRASO_RCB) >= 60 ? "bg-red-500" : "bg-gray-300"}`}
          ></span>
        </Tooltip>
      );
    case "nDav":
      return <span className="text-gray-600">{item.ID_ORIGEM}</span>;
    case "dataVencimento":
      return (
        <span className="text-gray-600">
          {item.DATA_VENCIMENTO_RCB.split(" ")[0]}
        </span>
      );
    case "cliente":
      return (
        <span className="text-gray-600 lg:w-full w-40 truncate">
          {item.APELIDO_PSS}
        </span>
      );
    case "valorRestante":
      return (
        <span className="text-red-600 font-bold">
          {formatCurrency(Number(item.RESTANTE_RCB.replace(",", ".")))}
        </span>
      );
    case "valorPago":
      return (
        <span className="text-emerald-600 font-bold">
          {formatCurrency(Number(item.VALOR_PAGO_RCB.replace(",", ".")))}
        </span>
      );
    default:
      return null;
  }
};
