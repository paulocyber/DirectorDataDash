// Utils
import { sumValuesByKey } from "@/utils/functions/sumValues";
import { formatCurrency } from "@/utils/mask/money";

// Bibliotecas
import { IoIosPeople, IoMdWarning } from "react-icons/io";
import { GiTakeMyMoney } from "react-icons/gi";

// Tipagem
import { ItemsBillsToReceive } from "@/types/billsToReceive";
interface LateCustomerProps {
  billetsInOpen: ItemsBillsToReceive[];
}

export default function LateCustomerCard({ billetsInOpen }: LateCustomerProps) {
  const valueLate = sumValuesByKey(billetsInOpen, (item) => item.RESTANTE_RCB);
  const valueReceive = sumValuesByKey(
    billetsInOpen,
    (item) => item.VALOR_PAGO_RCB
  );
  const totalLateCustomer = billetsInOpen.length.toString();

  const infoCard = [
    {
      icon: <IoMdWarning className="w-5 h-5 text-white" />,
      title: "Notas Vencidas",
      value: formatCurrency(valueLate),
    },
    {
      icon: <GiTakeMyMoney className="w-5 h-5 text-white" />,
      title: "Total de Pagamentos Realizados",
      value: formatCurrency(valueReceive),
    },
    {
      icon: <IoIosPeople className="w-5 h-5 text-white" />,
      title: "Total de Clientes Atrasados",
      value: totalLateCustomer,
    },
  ];

  return infoCard;
}
