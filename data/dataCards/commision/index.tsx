// React
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";

// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { ItemsComissionCalculation1Data } from "@/types/comission";
import { sumValuesByKey } from "@/utils/functions/sumValues";
interface ComissionInfoCardProps {
  data: ItemsComissionCalculation1Data[];
}

export default function ComissionInfoCard({ data }: ComissionInfoCardProps) {
  const totalSales = sumValuesByKey(data, (item) => item.totalSale.toString());
  const totalCommission = sumValuesByKey(data, (item) =>
    item.totalCommission.toString()
  );

  const infoDetailCard = [
    {
      icon: <FaMoneyBillTrendUp className="w-5 h-5 text-white" />,
      title: "Total de Vendas",
      value: formatCurrency(totalSales),
    },
    {
      icon: <GiTakeMyMoney className="w-5 h-5 text-white" />,
      title: "Total de Comissões",
      value: formatCurrency(totalCommission),
    },
  ];

  return infoDetailCard;
}
