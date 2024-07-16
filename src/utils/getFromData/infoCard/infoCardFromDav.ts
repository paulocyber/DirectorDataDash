// Biblioteca
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { MdAttachMoney } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";

// Utils
import { TotalSum } from "@/utils/totalSum";
import { formatCurrency } from "@/utils/masks/formatCurrency";

// Tipagem
import { ItemsDav } from "@/utils/types/listDav";
import { truncateString } from "@/utils/masks/stringMask";

export function InfoCardFromDav({
  listDav,
  detail,
}: {
  listDav: ItemsDav[];
  detail?: boolean;
}) {
  const grossValue = TotalSum(listDav, "VALOR_BRUTO_SDS");
  const netValue = TotalSum(listDav, "VALOR_LIQUIDO_TOTAL");
  let client = "";

  listDav.forEach((items) => {
    client = items.CLIENTE;
  });

  const infoDetailCard = [
    {
      icon: FaMoneyBillTrendUp,
      title: "Total de vendas bruto",
      value: formatCurrency(grossValue),
    },
    {
      icon: MdAttachMoney,
      title: "Total de vendas liquido",
      value: formatCurrency(netValue),
    },
    {
      icon: IoIosPeople,
      title: detail ? "Nome da pessoa" : "Total de clientes atendidos",
      value: detail ? truncateString(client, 20) :  String(listDav.length),
    },
  ];

  return infoDetailCard;
}
