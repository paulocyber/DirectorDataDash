// Utils
import { sumValuesByKey } from "@/utils/functions/sumValues";

// Bibliotecas
import { FaTrophy } from "react-icons/fa";
import { FaArrowTrendDown, FaMoneyBillTrendUp } from "react-icons/fa6";

// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { ItemsTaxInvoicing } from "@/types/TaxBiling";
interface TaxBillingProps {
  billingByCompanyData: ItemsTaxInvoicing[];
}

export default function TaxBillingInfoCard({
  billingByCompanyData,
}: TaxBillingProps) {
  const totalRevenue = sumValuesByKey(billingByCompanyData, (item) =>
    item.value.toString()
  );
  const maximumRevenue = billingByCompanyData.reduce((prev, curr) =>
    curr.value > prev.value ? curr : prev
  );
  const minimumTurnover = billingByCompanyData.reduce((prev, curr) =>
    curr.value < prev.value ? curr : prev
  );

  const infoDetailCard = [
    {
      icon: <FaMoneyBillTrendUp className="w-5 h-5 text-white" />,
      title: "Total de faturamento",
      value: formatCurrency(totalRevenue),
    },
    {
      icon: <FaTrophy className="w-5 h-5 text-white" />,
      title: "Empresa que mais fatura",
      value: maximumRevenue.EMPRESA,
    },
    {
      icon: <FaArrowTrendDown className="w-5 h-5 text-white" />,
      title: "Empresa que menos fatura",
      value: minimumTurnover.EMPRESA,
    },
  ];

  return infoDetailCard;
}
