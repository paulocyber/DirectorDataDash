// Biblioteca
import { TbMoneybag } from "react-icons/tb";
import { CiWarning } from "react-icons/ci";
import { GiPayMoney } from "react-icons/gi";

// Utils
import { formatCurrency } from "../mask/moneyMask";

// Tipagem
import { BillsToPayProps } from "@/pages/billstopay";

export interface costCenterSummary {
  description: string;
  value: number;
  suppliers: string[];
}

export default function getListOfAccountsPayable({
  listOfAccountsPayable,
  listOfUnpaidBills,
  listPaidAndUnpaidBills,
}: BillsToPayProps) {
  let ammountNotPaid = 0;
  let unpaidInvoices = 0;
  let payedInvoices = 0;
  let amountPaid = 0;

  listOfAccountsPayable.forEach((items) => {
    amountPaid += Number(items.VALOR_PGM.replace(",", "."));
  });

  listOfUnpaidBills.forEach((items) => {
    ammountNotPaid += Number(items.VALOR_PGM.replace(",", "."));
  });

  unpaidInvoices = listOfUnpaidBills.length;
  payedInvoices = listOfAccountsPayable.length;

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
      icon: GiPayMoney,
      title: "Total de boletos em dias",
      value: payedInvoices.toString(),
    },
  ];

  const costCenterSummaries: costCenterSummary[] = [];

  listPaidAndUnpaidBills.forEach((data) => {
    const existingSummary = costCenterSummaries.find(
      (item) => item.description === data.CENTRO_CUSTO
    );

    if (existingSummary) {
      existingSummary.value += Number(data.VALOR_PGM.replace(",", "."));

      if (!existingSummary.suppliers.includes(data.NOME_PSS)) {
        existingSummary.suppliers.push(data.NOME_PSS);
      }
    } else {
      costCenterSummaries.push({
        description: data.CENTRO_CUSTO,
        value: Number(data.VALOR_PGM.replace(",", ".")),
        suppliers: [data.NOME_PSS],
      });
    }
  });

  const topCostCenter = costCenterSummaries
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return { infoDetailCard, topCostCenter };
}
