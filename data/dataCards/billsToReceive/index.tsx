// Utils
import { sumValuesByKey } from "@/utils/functions/sumValues";
import { formatCurrency } from "@/utils/mask/money";

// React
import { GiTakeMyMoney } from "react-icons/gi";
import { IoIosPeople, IoMdWarning } from "react-icons/io";

// Tipagem
import { ItemsBillsToReceive } from "@/types/billsToReceive";
interface BilletsInfoCardProps {
  allBilletsData: ItemsBillsToReceive[];
  filter?:
    | { ID_PSS: string; NOME_PSS: string; APELIDO_PSS: string }[]
    | string[];
}

export default function BilletsInfoCard({
  allBilletsData,
  filter,
}: BilletsInfoCardProps) {
  const openBills = allBilletsData.filter(
    (bill) => bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4"
  );
  const paidBills = allBilletsData.filter(
    (bill) => bill.STATUS_RCB === "2" || bill.STATUS_RCB === "4"
  );
  const overdueBills = allBilletsData.filter(
    (bill: ItemsBillsToReceive) =>
      (bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4") &&
      parseInt(bill.ATRASO_RCB) > 0
  );

  const totalPendingAmount = sumValuesByKey(
    overdueBills,
    (bill) => bill.RESTANTE_RCB
  );
  const totalOpenAmount = sumValuesByKey(
    openBills,
    (bill) => bill.RESTANTE_RCB
  );
  const totalReceivedAmount = sumValuesByKey(
    paidBills,
    (bill) => bill.VALOR_PAGO_RCB
  );
  const totalCompletedPayments = paidBills.length;

  const infoDetailCard = [
    {
      icon: <IoMdWarning className="w-5 h-5 text-white" />,
      title: "Notas em aberto",
      value: formatCurrency(totalOpenAmount),
    },
    {
      icon: <GiTakeMyMoney className="w-5 h-5 text-white" />,
      title: "Notas vencidas",
      value: formatCurrency(totalPendingAmount),
    },
    {
      icon: <IoIosPeople className="w-5 h-5 text-white" />,
      title:
        filter?.length === 0
          ? "Clientes com Pagamento Concluído"
          : "Valor recebido",
      value:
        filter?.length === 0
          ? totalCompletedPayments.toString()
          : formatCurrency(totalReceivedAmount),
    },
  ];

  return infoDetailCard;
}
