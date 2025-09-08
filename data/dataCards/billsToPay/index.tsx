// React
import { sumValuesByKey } from "@/utils/functions/sumValues";

// Biblioteca
import { TbMoneybag } from "react-icons/tb";
import { GiPayMoney } from "react-icons/gi";
import { MdOutlineWarningAmber } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";

// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { ItemsBillsToPay } from "@/types/billsToPay";
type SelectionDescription = {
  description: string;
  color: string;
  id: number;
};

interface InfoCardProps {
  openBillets: ItemsBillsToPay[];
  paidBillets: ItemsBillsToPay[];
  overdueBillets: ItemsBillsToPay[];
  costCenterFilter?: SelectionDescription[];
}

export default function BilletsInfoCard({
  openBillets,
  paidBillets,
  overdueBillets,
  costCenterFilter,
}: InfoCardProps) {
  const filteredOpenBills =
    costCenterFilter && costCenterFilter.length > 0
      ? openBillets.filter((billet) =>
          costCenterFilter.some(
            (costCenter) => billet.CENTRO_CUSTO === costCenter.description
          )
        )
      : openBillets;
  
  const totalOutstandingAmount = sumValuesByKey(
    filteredOpenBills,
    (item) => item.VALOR_PGM
  );
  const totalAmountPaid = sumValuesByKey(paidBillets, (item) => item.VALOR_PGM);
  const totalAmountDue = sumValuesByKey(
    overdueBillets,
    (item) => item.RESTANTE_PGM
  );
  const totalPaid = paidBillets.length;

  const infoDetailCard = [
    {
      icon: <TbMoneybag className="w-5 h-5 text-white" />,
      title: "Valores em Aberto",
      value: formatCurrency(totalOutstandingAmount),
    },
    {
      icon: <MdOutlineWarningAmber className="w-5 h-5 text-white" />,
      title: "Valores vencidos",
      value: formatCurrency(totalAmountDue),
    },
    {
      icon: <GiPayMoney className="w-5 h-5 text-white" />,
      title: "Valores pagos",
      value: formatCurrency(totalAmountPaid),
    },
    {
      icon: <RiVerifiedBadgeFill className="w-5 h-5 text-white" />,
      title: "Total de boletos pagos",
      value: totalPaid.toString(),
    },
  ];

  return infoDetailCard;
}
