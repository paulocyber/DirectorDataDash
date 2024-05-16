import { MdAttachMoney } from "react-icons/md";
import { truncateString } from "../mask/stringMask";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";
import { formatCurrency } from "./../mask/moneyMask";

interface itemDav {
  ID_PSS: string;
  ID_FRM: string;
  ID_EMP: string;
  ID_RCB: string;
  SIGLA_EMP: string;
  N_DAV: string;
  ID_ORIGEM: string;
  DATAHORA_LANCAMENTO_RCB: string;
  DATAHORA_PAGAMENTO_RCB: string;
  DATA_VENCIMENTO_RCB: string;
  ATRASO_RCB: string;
  VALOR_RCB: string;
  JUROS_RCB: string;
  MULTA_RCB: string;
  RESTANTE_RCB: string;
  RESTANTE_SEM_JUROS_RCB: string;
  VALOR_PAGO_RCB: string;
  NOME_PSS: string;
  APELIDO_PSS: string;
  ID_FNC: string;
  VENDEDOR: string;
  STATUS_RCB: string;
  FORMA_PAGAMENTO: string;
  VALOR_ACRESCIMOS_RCI: string;
  VALOR_DESCONTO_RCI: string;
  DESCRICAO_RCB: string;
}

export type listPorp = {
  listDav: itemDav[];
};

export default function getItemFromDetailDavs({ listDav }: listPorp) {
  let formOfPayment = "";
  let netValue = 0;
  let personName = "";

  listDav.forEach((items) => {
    formOfPayment = items.FORMA_PAGAMENTO;
    netValue += Number(items.VALOR_RCB.replace(",", "."));
    personName = items.NOME_PSS;
  });

  const infoDetaildCard = [
    {
      icon: FaMoneyBillTrendUp,
      title: "Forma de Pagamento",
      value: formOfPayment,
    },
    {
      icon: MdAttachMoney,
      title: "Valor liquid",
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
