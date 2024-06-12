// Biblioteca
import { TbMoneybag } from "react-icons/tb";
import { CiWarning } from "react-icons/ci";
import { GiPayMoney } from "react-icons/gi";
import { RiVerifiedBadgeFill } from "react-icons/ri";

// Utils
import { formatCurrency } from "../mask/moneyMask";

// Tipagem
import { BillsToPayProps } from "@/pages/billstopay";

// Atom
import { itemDescription, filterDescription } from "@/atom/FilterDescription";

// Recoil
import { useRecoilValue } from "recoil";

// Tipagem
export interface costCenterSummary {
  description: string;
  value: number;
  suppliers: string[];
  color: string;
}

export default function getListOfAccountsPayable({
  listBilletPaid,
  listBilletInOpen,
  listBilletPaidAndInOpen,
  listBilletExpired,
}: BillsToPayProps) {
  const filter: itemDescription[] = useRecoilValue(filterDescription);

  const costCenterMap: Record<string, costCenterSummary> = {};

  listBilletPaidAndInOpen.forEach((data) => {
    const key = `${data.GRUPO_CENTRO} - ${data.CENTRO_CUSTO}`;
    const value = Number(data.VALOR_PGM.replace(",", "."));

    if (!costCenterMap[key]) {
      costCenterMap[key] = {
        description: key,
        value: 0,
        suppliers: [],
        color:
          filter.find((filterItem) => filterItem.description === key)?.color ||
          "",
      };
    }

    costCenterMap[key].value += value;
    if (!costCenterMap[key].suppliers.includes(data.NOME_PSS)) {
      costCenterMap[key].suppliers.push(data.NOME_PSS);
    }
  });

  const costCenterSummaries = Object.values(costCenterMap);

  // Filtro
  const filtered =
    filter.length > 0
      ? costCenterSummaries.filter((summary) =>
          filter.some((filterItem) =>
            summary.description
              .toLowerCase()
              .includes(filterItem.description.toLowerCase())
          )
        )
      : costCenterSummaries;

  // Ordenar e selecionar os top 10 filtrados
  const sortedFiltered = filtered
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  const topCostCenter = sortedFiltered.map(
    ({ description, value, suppliers, color }) => ({
      description,
      value,
      suppliers,
      color,
    })
  );

  // Ordenar e selecionar os top 10 sem filtro para topNameCostCenter
  const topNameCostCenter = costCenterSummaries
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
    .map(({ description, value }) => ({
      description,
      value,
    }));

  // Cálculos de totais
  const ammountNotPaid = filtered.reduce((acc, item) => acc + item.value, 0);
  // const totalPaidAndInOpen = filtered.reduce((acc, data) => acc + data.value, 0);
  const unpaidInvoices = listBilletInOpen.filter((item) =>
    filtered.some((filterItem) => filterItem.description === item.CENTRO_CUSTO)
  ).length;
  // listBilletPaid
  const ammountPaid = listBilletPaid.reduce((total, bill) => {
    return total + Number(bill.VALOR_PAGO_PGM.replace(",", "."));
  }, 0);

  console.log("Boletos pagos: ", ammountPaid);

  const payedInvoices = listBilletPaid.length

  const totalExpiredBills = listBilletExpired?.reduce((total, bill) => {
    return total + Number(bill.RESTANTE_PGM.replace(",", "."));
  }, 0);

  const infoDetailCard = [
    {
      icon: TbMoneybag,
      title: "Valor total em aberto",
      value: formatCurrency(ammountNotPaid),
    },
    {
      icon: CiWarning,
      title: "Valor Total de Boletos Vencidos",
      value: formatCurrency(totalExpiredBills || 0),
    },
    {
      icon: GiPayMoney,
      title: "Total de boletos pagos",
      value: formatCurrency(ammountPaid),
    },
    {
      icon: RiVerifiedBadgeFill,
      title: "Total de boletos pagos",
      value: payedInvoices.toString(),
    },
  ];

  return { infoDetailCard, topCostCenter, topNameCostCenter };
}
