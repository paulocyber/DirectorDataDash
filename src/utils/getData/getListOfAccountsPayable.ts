// Biblioteca
import { TbMoneybag } from "react-icons/tb";
import { CiWarning } from "react-icons/ci";
import { GiPayMoney } from "react-icons/gi";
import { useRecoilValue } from "recoil";
import { RiVerifiedBadgeFill } from "react-icons/ri";

// Utils
import { formatCurrency } from "../mask/moneyMask";

// Tipagem
import { BillsToPayProps } from "@/pages/billstopay";

// Atom
import { itemDescription, filterDescription } from "@/atom/FilterDescription";

export interface costCenterSummary {
  description: string;
  value: number;
  suppliers: string[];
  color: string;
}

export default function getListOfAccountsPayable({
  listOfAccountsPayable,
  listOfUnpaidBills,
  listPaidAndUnpaidBills,
}: BillsToPayProps) {
  const filter: itemDescription[] = useRecoilValue(filterDescription);

  const costCenterMap: Record<string, costCenterSummary> = {};

  listPaidAndUnpaidBills.forEach((data) => {
    const key = data.CENTRO_CUSTO;
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
          filter.some(
            (filterItem) => filterItem.description === summary.description
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

  const unpaidInvoices = listOfUnpaidBills.filter((item) =>
    filtered.some((filterItem) => filterItem.description === item.CENTRO_CUSTO)
  ).length;

  const amountPaid = listOfAccountsPayable
    .filter((item) =>
      filtered.some(
        (filterItem) => filterItem.description === item.CENTRO_CUSTO
      )
    )
    .reduce((acc, item) => acc + Number(item.VALOR_PGM.replace(",", ".")), 0);

  const payedInvoices = listOfAccountsPayable.filter((item) =>
    filtered.some((filterItem) => filterItem.description === item.CENTRO_CUSTO)
  ).length;

  const infoDetailCard = [
    {
      icon: TbMoneybag,
      title: "Valor total em aberto",
      value: formatCurrency(ammountNotPaid),
    },
    {
      icon: CiWarning,
      title: "Total de boletos atrasados",
      value: unpaidInvoices.toString(),
    },
    {
      icon: GiPayMoney,
      title: "Total de boletos pagos",
      value: formatCurrency(amountPaid),
    },
    {
      icon: RiVerifiedBadgeFill,
      title: "Total de boletos em dias",
      value: payedInvoices.toString(),
    },
  ];

  return { infoDetailCard, topCostCenter, topNameCostCenter };
}
