// Utils
import { formatCurrency } from "./../../../../utils/mask/money/index";

// Tipagem
import { ItemsCoverReportData } from "@/types/coverReport";

export const renderCell = (item: ItemsCoverReportData, columnKey: string) => {
  switch (columnKey) {
    case "tipoDeVenda":
      return (
        <span className="text-gray-600">
          {item.tipo_da_venda ? item.tipo_da_venda : "-"}
        </span>
      );
    case "atendidoPor":
      return (
        <span className="text-gray-600">
          {item.atendido_por ? item.atendido_por : "-"}
        </span>
      );
    case "total":
      return (
        <span className="text-gray-600">{formatCurrency(item.total)}</span>
      );
  }
};
