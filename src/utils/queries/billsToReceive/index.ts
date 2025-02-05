// Tipagem
import { QueryProps } from "@/types/queires";

// Utils
import getCurrentDateDetails from "@/utils/getDate";

export const billsToReceiveQueries = ({
  id,
  dateInit,
  dateEnd,
  year,
  sellerSurname,
  idSeller,
  idPeople,
}: QueryProps) => {
  const sellerFilter =
    idSeller || sellerSurname
      ? `AND (a.id_fnc = ${idSeller ? `'${idSeller}'` : "?"} 
     OR a.apelido_fnc LIKE ${
       sellerSurname
         ? `'%${
             sellerSurname === "mikaele"
               ? "MIKAELE SANTANA"
               : sellerSurname === "ana_carolina"
               ? "CAROLINA"
               : sellerSurname === "LUCAS V"
               ? "RODRIGUES"
               : sellerSurname
           }%'`
         : "?"
     })`
      : "";

  const peopleFilter = idPeople ? `and a.id_pss in (${idPeople})` : "";

  let billsToReceiveInOpen = `select a.id_pss, a.id_rcb as ID_SDS, a.id_origem, a.data_vencimento_rcb, a.valor_rcb, a.restante_rcb, a.VALOR_PAGO_RCB, a.id_pss || ' - ' || a.apelido_pss as apelido_pss, a.id_rcb, a.id_fnc || ' - ' || a.apelido_fnc as vendedor, a.id_frm || ' - ' || 
  a.descricao_frm as forma_pagamento, a.atraso_rcb from v_recebimentos a  where  a.id_emp in(1, 2, 3, 4, 5, 100) and a.STATUS_PSS = 'A' and a.DATA_VENCIMENTO_RCB between date '${dateInit}' and '${dateEnd}' and a.status_rcb in (1 ,4) and coalesce(
  a.insolvente_rcb,'N') = 'N' ${sellerFilter} ${peopleFilter} order by a.id_emp,a.data_vencimento_rcb,nome_pss`;

  let billsToReceiveAll = `select a.id_rcb as ID_SDS, a.id_origem, a.data_vencimento_rcb, a.DATAHORA_PAGAMENTO_RCB, a.valor_rcb, a.restante_rcb, a.VALOR_PAGO_RCB, a.id_pss, a.id_pss || ' - ' || a.apelido_pss as apelido_pss,  a.id_fnc  || ' - ' || a.apelido_fnc as vendedor,a.status_rcb, a.atraso_rcb 
  from v_recebimentos a where a.id_emp in(1, 2, 3, 4, 5, 100) and a.DATA_VENCIMENTO_RCB between date '${dateInit}' and '${dateEnd}' and a.STATUS_PSS = 'A' and a.status_rcb in (1, 2, 4) ${peopleFilter} and coalesce(a.insolvente_rcb,'N') = 'N' order by a.id_emp,
  a.data_vencimento_rcb,nome_pss`;

  let receipts = `select rs.ID_RCB, rs.VALOR_RCB, rs.VALOR_PAGO_RCB from v_recebimentos_sintetico rs where rs.ID_PSS = '${id}' ORDER BY rs.data_vencimento_rcb DESC`;

  let topClientLate = `select a.id_pss, a.id_origem, a.data_vencimento_rcb, a.restante_rcb, a.VALOR_PAGO_RCB, a.apelido_pss, a.apelido_fnc as vendedor,a.status_rcb, a.atraso_rcb from v_recebimentos a 
  where a.id_emp in(1, 2, 3, 4, 5, 100) AND (a.status_rcb = 1 OR a.status_rcb = 4) and a.DATA_VENCIMENTO_RCB between date '2023/01/01' and '${year}/12/31' and a.status_rcb in (1, 2, 4) and coalesce
  (a.insolvente_rcb,'N') = 'N' and a.atraso_rcb > 0 order by a.id_emp, a.data_vencimento_rcb,nome_pss, a.atraso_rcb rows 5`;

  let summaryReceive = `select EXTRACT(MONTH FROM a.data_vencimento_rcb) || '/' || EXTRACT(YEAR FROM a.data_vencimento_rcb) AS mes_ano, SUM(a.valor_pago_rcb) AS VALOR_PAGO_RCB, (SUM(a.valor_pago_rcb) / (SELECT SUM(
    valor_pago_rcb) FROM v_recebimentos WHERE id_emp IN (1, 2, 3, 100) AND data_vencimento_rcb BETWEEN DATE '${year}-01-01' AND DATE '${year}-12-31' AND status_rcb IN (2, 4) AND COALESCE(insolvente_rcb, 'N') = 'N') * 100) AS
    porcentagem FROM v_recebimentos a WHERE a.id_emp IN (1, 2, 3, 100) AND a.data_vencimento_rcb BETWEEN DATE '${year}-01-01' AND DATE '${year}-12-31' AND a.status_rcb IN (2, 4) AND COALESCE(a.insolvente_rcb, 'N') = 'N' 
    GROUP BY EXTRACT(YEAR FROM a.data_vencimento_rcb), EXTRACT(MONTH FROM a.data_vencimento_rcb) ORDER BY EXTRACT(YEAR FROM a.data_vencimento_rcb), EXTRACT(MONTH FROM a.data_vencimento_rcb)`;

  let summaryReceiveRelease = `select  CAST(EXTRACT(YEAR FROM a.DATAHORA_LANCAMENTO_RCB) AS VARCHAR(4)) || '/' ||  LPAD(CAST(EXTRACT(MONTH FROM a.DATAHORA_LANCAMENTO_RCB) AS VARCHAR(2)), 2, '0') AS data_lancamento, 
  SUM(a.valor_rcb) AS VALOR_RCB, SUM(a.restante_rcb) AS RESTANTE_RCB FROM v_recebimentos a WHERE  a.id_emp IN (1, 2, 3, 4, 5, 100) AND a.DATAHORA_LANCAMENTO_RCB BETWEEN DATE '${dateInit}' AND DATE '${dateEnd}' AND 
  a.status_rcb IN (1, 4) AND COALESCE(a.insolvente_rcb, 'N') = 'N' GROUP BY  EXTRACT(YEAR FROM a.DATAHORA_LANCAMENTO_RCB),  EXTRACT(MONTH FROM a.DATAHORA_LANCAMENTO_RCB) ORDER BY data_lancamento`;

  return {
    billsToReceiveInOpen,
    billsToReceiveAll,
    receipts,
    topClientLate,
    summaryReceive,
    summaryReceiveRelease,
  };
};
