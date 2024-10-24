// Biblioteca
import { CiWarning } from "react-icons/ci";
import { GiPayMoney } from "react-icons/gi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { TbMoneybag } from "react-icons/tb";

// Utils
import { formatCurrency } from "@/utils/mask/money";
import { TotalSum } from "@/utils/functionSum";

// Tipagem
import { BillsToPayData } from "@/types/billsToPay";
import { SelectionDescription } from "@/types/filters/selectionDescription";

interface InfoCardFromBillsToPayProps {
    listBilletInOpen: BillsToPayData[];
    listBilletPaid: BillsToPayData[];
    listBilletExpired: BillsToPayData[];
    costCenterFilter?: SelectionDescription[];
    filterSearch?: BillsToPayData[];
}


export default function InfoCardFromBillsToPay({ listBilletInOpen, listBilletPaid, listBilletExpired, costCenterFilter, filterSearch }: InfoCardFromBillsToPayProps) {
    const filteredOpenBillets =
        costCenterFilter && costCenterFilter.length === 0
            ? listBilletInOpen
            : listBilletInOpen.filter((billet) =>
                costCenterFilter?.some(
                    (costCenter) => billet.CENTRO_CUSTO === costCenter.description
                )
            );

    const filteredPaidBillets =
        costCenterFilter && costCenterFilter.length === 0
            ? listBilletPaid
            : listBilletPaid.filter((billet) =>
                costCenterFilter?.some(
                    (costCenter) => billet.CENTRO_CUSTO === costCenter.description
                )
            );

    const filteredExpiredBillets =
        costCenterFilter && costCenterFilter.length === 0
            ? listBilletExpired
            : listBilletExpired.filter((billet) =>
                costCenterFilter?.some(
                    (costCenter) => billet.CENTRO_CUSTO === costCenter.description
                )
            );

    //Filtro de pesquisa
    const searchFilterOpenBillets = listBilletInOpen.filter((billet) =>
        filterSearch?.some(
            (costCenter) => billet.CENTRO_CUSTO === costCenter.CENTRO_CUSTO
        )
    );

    const searchFilterPastDueAmounts = listBilletExpired.filter((billet) =>
        filterSearch?.some(
            (costCenter) => billet.CENTRO_CUSTO === costCenter.CENTRO_CUSTO
        )
    );

    const searchFilterPaid = listBilletPaid.filter((billet) =>
        filterSearch?.some(
            (costCenter) => billet.CENTRO_CUSTO === costCenter.CENTRO_CUSTO
        )
    );

    const openValues = filterSearch
        ? TotalSum(searchFilterOpenBillets, "VALOR_PGM")
        : TotalSum(filteredOpenBillets, "VALOR_PGM");
    const pastDueAmounts = filterSearch
        ? TotalSum(searchFilterPastDueAmounts, "RESTANTE_PGM")
        : TotalSum(filteredExpiredBillets, "RESTANTE_PGM");
    const amountsPaid = filterSearch
        ? TotalSum(searchFilterPaid, "VALOR_PAGO_PGM")
        : TotalSum(filteredPaidBillets, "VALOR_PAGO_PGM");

    const totalInvoicesPaid = filterSearch
        ? searchFilterPaid.length.toString()
        : filteredPaidBillets.length.toString();

    const infoDetailCard = [
        {
            icon: <TbMoneybag className="w-5 h-5" />,
            title: "Valores em aberto",
            value: formatCurrency(openValues),
        },
        {
            icon: <CiWarning className="w-5 h-5" />,
            title: "Valores vencidos",
            value: formatCurrency(pastDueAmounts),
        },
        {
            icon: <GiPayMoney className="w-5 h-5" />,
            title: "Valores pagos",
            value: formatCurrency(amountsPaid),
        },
        {
            icon: <RiVerifiedBadgeFill className="w-5 h-5" />,
            title: "Total de boletos pagos",
            value: totalInvoicesPaid,
        },
    ]

    return {
        infoDetailCard,
        openValues,
        pastDueAmounts,
        amountsPaid,
        totalInvoicesPaid,
    };
}