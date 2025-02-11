// Bibliotecas
import { CgShoppingCart } from "react-icons/cg";
import { FaDollarSign } from "react-icons/fa";
import { BiTrendingUp } from "react-icons/bi";

// Utils
import { formatCurrency } from "@/utils/mask/money";;
import { calculateTotalByKey } from "@/utils/functions/sumValues";

// Tipagem
import { EntriesXSales } from "@/types/entriesXSales";
interface InfoCardFromEntriesXSalesProps {
    entriesSalesData: EntriesXSales[];
}

export default function InfoCardFromEntriesXSales({ entriesSalesData }: InfoCardFromEntriesXSalesProps) {
    const infoCardData = [
        {
            icon: <CgShoppingCart className="w-5 h-5" />,
            title: "Total Compra",
            value: formatCurrency(calculateTotalByKey(entriesSalesData, (data) => data.VALOR_FINAL)),
        },
        {
            icon: <FaDollarSign className="w-5 h-5" />,
            title: "Total Venda",
            value: formatCurrency(calculateTotalByKey(entriesSalesData, (data) => data.VALOR_VENDA)),
        },
        {
            icon: <BiTrendingUp className="w-5 h-5" />,
            title: "Total Custo",
            value: formatCurrency(calculateTotalByKey(entriesSalesData, (data) => data.TOTAL_CUSTO)),
        },
    ];

    return infoCardData
}