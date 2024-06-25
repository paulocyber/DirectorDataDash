// Biblioteca
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { MdAttachMoney } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";

// Tipagem
import { listPorp } from "@/pages/davsummaryreport";

// Utils
import { formatCurrency } from "../mask/moneyMask";

export default function getItemsFromDavs({ listDav }: listPorp) {
  let value = 0;
  let saleValue = 0;
  let customerServed = listDav.length;

  listDav.forEach((items) => {
    value += Number(items.VALOR_BRUTO_SDS.replace(",", "."));
    saleValue += Number(items.VALOR_LIQUIDO_SDS.replace(",", "."));
  });

  const infoDetaildCard = [
    {
      icon: FaMoneyBillTrendUp,
      title: "Total de vendas bruto",
      value: formatCurrency(value),
    },
    {
      icon: MdAttachMoney,
      title: "Total de vendas liquido",
      value: formatCurrency(saleValue),
    },
    {
      icon: IoIosPeople,
      title: "Total de clientes atendidos",
      value: String(customerServed),
    },
  ];

  return { value, saleValue, customerServed, infoDetaildCard };
}
