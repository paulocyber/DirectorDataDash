// Utils
import { calculateTotalByKey } from "@/utils/functions/sumValues";

// Bibliotecas
import { FaArrowTrendDown, FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaTrophy } from "react-icons/fa";

// Utils
import { formatCurrency } from "@/utils/mask/money"

// Tipagem
import { ItemsTaxInvoicing } from "@/types/tax";;
interface InfoCardFromTaxProps {
    taxInvoicing: ItemsTaxInvoicing[]
}

export default function InfoCardFromTax({ taxInvoicing }: InfoCardFromTaxProps) {
    const totalRevenue = calculateTotalByKey(taxInvoicing, (item) => item.value.toString())
    const maximumRevenue = taxInvoicing.reduce((prev, curr) => curr.value > prev.value ? curr : prev)
    const minimumTurnover = taxInvoicing.reduce((prev, curr) => curr.value < prev.value ? curr : prev)

    const infoDetailCard = [
        {
            icon: <FaMoneyBillTrendUp className="w-5 h-5 text-white" />,
            title: "Total de faturamento",
            value: formatCurrency(totalRevenue),
        },
        {
            icon: <FaTrophy className="w-5 h-5 text-white" />,
            title: "Empresa que mais fatura",
            value: maximumRevenue.brand,
        },
        {
            icon: <FaArrowTrendDown className="w-5 h-5 text-white" />,
            title: "Empresa que menos fatura",
            value: minimumTurnover.brand,
        }
    ]

    return infoDetailCard
}