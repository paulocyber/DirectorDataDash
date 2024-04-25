// Dados
import { getDavsData } from "../utils/getData/getDavsData";

// Biblioteca
import {
  faCalendar,
  faCashRegister,
  faCoins,
  faMoneyBillWaveAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";

// Utils
import { formatCurrency, truncateString } from "../utils/mask/applyMask";

export const davDetailsCard = () => {
  let query = `select a.id_pss, a.id_frm, a.id_emp, a.id_rcb, a.sigla_emp, a.numero_documento_rcb as n_dav, a.id_origem, a.datahora_lancamento_rcb, a.datahora_pagamento_rcb, a.data_vencimento_rcb, a.atraso_rcb, a.valor_rcb, a.juros_rcb, a.multa_rcb, iif(a.restante_rcb < 0.00,0.00,a.restante_rcb)as restante_rcb, a.restante_sem_juros_rcb, a.valor_pago_rcb, a.nome_pss as nome_pss, a.apelido_pss, a.id_fnc, a.nome_fnc as vendedor, a.status_rcb, a.descricao_frm as forma_pagamento,  a.valor_acrescimos_rci, a.valor_desconto_rci, a.descricao_rcb from v_recebimentos a where a.id_emp in(4,1,2,3,5,6,7,8,9,10,11) and a.status_rcb in('1','4') and a.status_pss = 'A' and coalesce(a.insolvente_rcb,'N') = 'N' and (EXTRACT(YEAR FROM a.data_vencimento_rcb) = EXTRACT(YEAR FROM CURRENT_DATE) and EXTRACT(MONTH FROM a.data_vencimento_rcb) = EXTRACT(MONTH FROM CURRENT_DATE) and EXTRACT(DAY FROM a.data_vencimento_rcb) = EXTRACT(DAY FROM CURRENT_DATE) or EXTRACT(YEAR FROM a.datahora_lancamento_rcb) = EXTRACT(YEAR FROM CURRENT_DATE) and EXTRACT(MONTH FROM a.datahora_lancamento_rcb) = EXTRACT(MONTH FROM CURRENT_DATE) and EXTRACT(DAY FROM a.datahora_lancamento_rcb) = EXTRACT(DAY FROM CURRENT_DATE)) order by a.id_emp, a.data_vencimento_rcb, nome_pss`;

  const { valueDav, salesValue, customerServed } = getDavsData({ query });

  const infoDetaildCard = [
    {
      icon: faCoins,
      title: "Valor das Dav's",
      value: formatCurrency(valueDav),
    },
    {
      icon: faCashRegister,
      title: "Total de vendas",
      value: formatCurrency(salesValue),
    },
    {
      icon: faUser,
      title: "Total de clientes atendidos",
      value: customerServed.toString(),
    },
  ];

  return { infoDetaildCard };
};

export const GetDavDetailsById = () => {
  const { id } = useParams();

  let query = `select a.id_pss, a.id_frm, a.id_emp, a.id_rcb, a.sigla_emp, a.numero_documento_rcb as n_dav, a.id_origem, a.datahora_lancamento_rcb, a.datahora_pagamento_rcb, 
  a.data_vencimento_rcb, a.atraso_rcb, a.valor_rcb, a.juros_rcb, a.multa_rcb, iif(a.restante_rcb < 0.00,0.00,a.restante_rcb) as restante_rcb, a.restante_sem_juros_rcb, 
  a.valor_pago_rcb, a.nome_pss as nome_pss, a.apelido_pss, a.id_fnc, a.nome_fnc as vendedor, a.status_rcb, a.descricao_frm as forma_pagamento,  a.valor_acrescimos_rci,
   a.valor_desconto_rci, a.descricao_rcb from v_recebimentos a where a.id_emp in(4,1,2,3,5,6,7,8,9,10,11) and a.status_rcb in('1','4') and a.status_pss = 'A' and 
   coalesce(a.insolvente_rcb,'N') = 'N' and EXTRACT(YEAR FROM a.data_vencimento_rcb) = EXTRACT(YEAR FROM CURRENT_DATE) and a.
  ID_ORIGEM = '${id}' order by a.id_emp, a.data_vencimento_rcb, nome_pss`;

  const { formOfPayment, overdueStatus, personName } = getDavsData({
    query,
  });

  const wasPaid =
    parseInt(overdueStatus) < 0
      ? `${overdueStatus} dias em atraso`
      : "Foi pago";

  const infoDetaildCard = [
    {
      icon: faMoneyBillWaveAlt,
      title: "Forma de Pagamento",
      value: formOfPayment,
    },
    {
      icon: faCalendar,
      title: "Status do pagamento",
      value: wasPaid,
    },
    {
      icon: faUser,
      title: "Nome da Pessoa",
      value: truncateString(personName, 20),
    }
  ];

  return { infoDetaildCard };
};
