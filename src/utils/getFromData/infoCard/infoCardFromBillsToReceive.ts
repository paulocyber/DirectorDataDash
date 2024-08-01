// Utils
import { TotalSum } from "@/utils/totalSum";
import { formatCurrency } from "@/utils/masks/formatCurrency";

// Biblioteca
import { FaMoneyBillTrendUp } from "react-icons/fa6";

// Tipagem
import { BillsToReceiveItem } from "@/utils/types/billsToReceive";

export function InfoCardFromBillsToReceive({
  billsPay,
  billsOpen,
  lateBills
}: {
  billsPay: BillsToReceiveItem[];
  billsOpen: BillsToReceiveItem[];
  lateBills: BillsToReceiveItem[];
}) {
  const totalAmountPaid = TotalSum(billsPay, "VALOR_JA_PAGO");
  const totalAmountOpen = TotalSum(billsOpen, "VALOR_ORIGINAL");
  const lateTotalAmount = TotalSum(lateBills, "VALORES_RESTANTE");

  const infoDetailCard = [
    {
      icon: FaMoneyBillTrendUp,
      title: "Total A Receber",
      value: formatCurrency(totalAmountOpen),
    },
    {
      icon: FaMoneyBillTrendUp,
      title: "Total Vencidos",
      value: formatCurrency(lateTotalAmount),
    },
    {
      icon: FaMoneyBillTrendUp,
      title: "Total Recebido",
      value: formatCurrency(totalAmountPaid),
    }
  ];

  return infoDetailCard;
}

// }controle de estqoue
