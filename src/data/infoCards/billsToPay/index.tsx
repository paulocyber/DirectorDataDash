// Biblioteca
import { TbMoneybag } from "react-icons/tb";
import { GiPayMoney } from "react-icons/gi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { MdOutlineWarningAmber } from "react-icons/md";

// Utils
import { formatCurrency } from "@/utils/mask/money";
import { calculateTotalByKey } from "@/utils/functions/sumValues";

// Tipagem
import { ItemsBillsToPay } from "@/types/billsToPay";
type SelectionDescription = {
    description: string;
    color: string;
    id: number;
};


interface InfoCardFromBillsToPayProps {
    openBills: ItemsBillsToPay[];
    paidBills: ItemsBillsToPay[];
    overdueBills: ItemsBillsToPay[];
    costCenterFilter?: SelectionDescription[];
}

export default function InfoCardFromBillsToPay({ openBills, paidBills, overdueBills, costCenterFilter }: InfoCardFromBillsToPayProps) {
    const filteredOpenBills = costCenterFilter && costCenterFilter.length > 0
        ? openBills.filter((billet) =>
            costCenterFilter.some(
                (costCenter) => billet.CENTRO_CUSTO === costCenter.description
            )
        )
        : openBills;

    const totalOpenValue = calculateTotalByKey(filteredOpenBills, (item) => item.VALOR_PGM);
    const totalOverdueValue = calculateTotalByKey(overdueBills, (item) => item.RESTANTE_PGM);
    const totalPaidValue = calculateTotalByKey(paidBills, (item) => item.VALOR_PAGO_PGM);
    const totalPaidInvoices = paidBills.length.toString();

    const infoDetailCard = [
        {
            icon: <TbMoneybag className="w-5 h-5" />,
            title: "Valores em aberto",
            value: formatCurrency(totalOpenValue),
        },
        {
            icon: <MdOutlineWarningAmber className="w-5 h-5" />,
            title: "Valores vencidos",
            value: formatCurrency(totalOverdueValue),
        },
        {
            icon: <GiPayMoney className="w-5 h-5" />,
            title: "Valores pagos",
            value: formatCurrency(totalPaidValue),
        },
        {
            icon: <RiVerifiedBadgeFill className="w-5 h-5" />,
            title: "Total de boletos pagos",
            value: totalPaidInvoices,
        },
    ]

    return infoDetailCard
}