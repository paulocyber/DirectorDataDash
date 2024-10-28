// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { BillsToReceiveData } from "@/types/billsToReceive";

export const renderCell = (item: BillsToReceiveData, columnKey: string) => {
  const atraso = parseFloat(item.ATRASO_RCB);

  switch (columnKey) {
    case "#":
      return (
        <p
          className={`w-5 h-5 rounded-full ${atraso === 0 ? "bg-blue-600" : // Azul para 0 dias
            atraso > 0 && atraso < 30 ? "bg-yellow-500" : // Amarelo para 1 a 29 dias
              atraso >= 60 ? "bg-red-600" : // Vermelho para 60 dias ou mais
                ""
            }`}
        ></p>
      );
    case "idCliente":
      return item.ID_PSS;
    case "nDav":
      return item.ID_ORIGEM;
    case "dataVencimento":
      return item.DATA_VENCIMENTO_RCB.split(" ")[0];
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
