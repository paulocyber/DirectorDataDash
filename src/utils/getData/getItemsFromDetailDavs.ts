// Icon
import { MdAttachMoney } from "react-icons/md";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";

// Utils
import { truncateString } from "../mask/stringMask";
import { formatCurrency } from "./../mask/moneyMask";

// Tipagem
interface itemDav {
  ID_SDS: string,
  ID_EMP: string,
  EMPRESA: string,
  DATAHORA_SDS: string,
  DATAHORA_FINALIZACAO_SDS: string,
  APELIDO_PSS: string,
  CLIENTE: string,
  VENDEDOR: string,
  ALMOXARIFADO: string,
  VALOR_BRUTO_SDS: string,
  VALOR_DESCONTO_SDS: string,
  VALOR_TROCA_SDS: string,
  VALOR_LIQUIDO_SDS: string,
  TIPO_VENDA_SDS: string,
  STATUS_SDS: string
}

export type GetItemFromDetailDavsProps = {
  listDavFinalized: itemDav[];
};

export default function getItemFromDetailDavs({ listDavFinalized }: GetItemFromDetailDavsProps) {
  let formOfPayment = 0;
  let netValue = 0;
  let personName = "";

  listDavFinalized.forEach((items) => {
    formOfPayment = Number(items.VALOR_BRUTO_SDS.replace(",", ";"));
    netValue += Number(items.VALOR_LIQUIDO_SDS.replace(",", "."));
    personName = items.CLIENTE;
  });

  const infoDetaildCard = [
    {
      icon: FaMoneyBillTrendUp,
      title: "Valor Bruto",
      value: formatCurrency(formOfPayment),
    },
    {
      icon: MdAttachMoney,
      title: "Valor liquido",
      value: formatCurrency(netValue),
    },
    {
      icon: IoIosPeople,
      title: "Nome da Pessoa",
      value: truncateString(personName, 20),
    },
  ];

  return {
    formOfPayment,
    netValue,
    personName,
    infoDetaildCard,
  };
}
