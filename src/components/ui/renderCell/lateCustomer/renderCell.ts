// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { BillsToReceiveData } from "@/types/billsToReceive";

export const renderCell = (item: BillsToReceiveData, columnKey: string) => {
  switch (columnKey) {
    case "nDav":
      return item.ID_ORIGEM;
    case "dataVencimento":
      return item.DATA_VENCIMENTO_RCB.split(' ')[0];
    case "cliente":
      return item.APELIDO_PSS;
    case "valorRestante":
      return formatCurrency(Number(item.RESTANTE_RCB.replace(",", ".")));
    case "valorPago":
      return formatCurrency(Number(item.VALOR_PAGO_RCB.replace(",", ".")));
    case "formaDePagamento":
      return item.FORMA_PAGAMENTO;
    default:
      return null;
  }
};
