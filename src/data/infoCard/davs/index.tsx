// Utils
import { TotalSum } from "@/utils/functionSum";
import { formatCurrency } from "@/utils/mask/money";
import { truncateString } from "@/utils/mask/truncateString";

// Tipagem
import { ItemsDav } from "@/utils/types/davs";

// Biblioteca
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";

export default function InfoCardFromDav({ listDav, detail }: { listDav: ItemsDav[], detail?: boolean }) {
  const grossValue = TotalSum(listDav, "VALOR_BRUTO_SDS");
  const netValue = TotalSum(listDav, "VALOR_LIQUIDO_TOTAL");
  let client = "";

  listDav.forEach((items) => {
    client = items.CLIENTE;
  });

  const infoDetailCard = [
    {
      icon: <FaMoneyBillTrendUp className="w-5 h-5"/>,
      title: "Total de vendas bruto",
      value: formatCurrency(grossValue),
    },
    {
      icon: <MdAttachMoney className="w-5 h-5"/>,
      title: "Total de vendas liquido",
      value: formatCurrency(netValue),
    },
    {
      icon: detail ? <IoIosPeople className="w-5 h-5"/> : <MdAttachMoney className="w-5 h-5"/>,
      title: detail ? "Nome da pessoa" :  "Total de clientes atendidos",
      value: detail ? truncateString(client, 20) : String(listDav.length),
    },
  ];

  return infoDetailCard;
}
