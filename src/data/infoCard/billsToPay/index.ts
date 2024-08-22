// Utils
import { TotalSum } from "@/utils/functionSum";
import { formatCurrency } from "@/utils/mask/formatCurrency";

// Bibliotecas
import { TbMoneybag } from "react-icons/tb";
import { CiWarning } from "react-icons/ci";
import { GiPayMoney } from "react-icons/gi";
import { RiVerifiedBadgeFill } from "react-icons/ri";

// Tipagem
import { BillsToPayItem } from "@/utils/types/billsToPay";
import { SelectionDescription } from "@/utils/types/selectionDescription";
interface InfoCardFromBillsToPayProps {
  listBilletInOpen: BillsToPayItem[];
  listBilletPaid: BillsToPayItem[];
  listBilletExpired: BillsToPayItem[];
  costCenterFilter?: SelectionDescription[];
  filterSearch?: BillsToPayItem[];
}

export function InfoCardFromBillsToPay({
  listBilletInOpen,
  listBilletExpired,
  listBilletPaid,
  costCenterFilter,
  filterSearch,
}: InfoCardFromBillsToPayProps) {
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
      icon: TbMoneybag,
      title: "Valores em aberto",
      value: formatCurrency(openValues),
    },
    {
      icon: CiWarning,
      title: "Valores vencidos",
      value: formatCurrency(pastDueAmounts),
    },
    {
      icon: GiPayMoney,
      title: "Valores pagos",
      value: formatCurrency(amountsPaid),
    },
    {
      icon: RiVerifiedBadgeFill,
      title: "Total de boletos pagos",
      value: totalInvoicesPaid,
    },
  ];

  return {
    infoDetailCard,
    openValues,
    pastDueAmounts,
    amountsPaid,
    totalInvoicesPaid,
  };
}
