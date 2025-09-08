// tipagem
import { QueryProps } from "@/types/query";

export const billsToReceiveQueries = ({
  id,
  dateInit,
  dateEnd,
  year,
  peoples,
  sellers,
}: QueryProps) => {
  const peopleFilter =
    peoples && peoples?.length > 0 ? `and a.id_pss in (${peoples})` : "";

  const formattedSellers =
    id || (Array.isArray(sellers) && sellers.length > 0)
      ? `AND (a.id_fnc = ${id ? `'${id}'` : "?"} 
     OR a.apelido_fnc LIKE ${
       Array.isArray(sellers) && sellers.includes("mikaele")
         ? `'%MIKAELE SANTANA%'`
         : sellers?.includes("ana_carolina")
           ? `'%CAROLINA%'`
           : sellers?.includes("LUCAS V")
             ? `'%RODRIGUES%'`
             : `'%${sellers?.join("%' OR fnc.apelido_pss LIKE '%")}%'`
     })`
      : "";

  let billsToReceiveAll = `select a.id_rcb, a.id_origem AS ID_SDS, a.data_vencimento_rcb, (SELECT MAX(rci2.DATA_RECEBIMENTO_RCI) FROM recebimentos_itens rci2 WHERE rci2.id_rcb = a.id_rcb) AS DATA_RECEBIMENTO_RCI, 
  a.valor_rcb, a.restante_rcb, a.VALOR_PAGO_RCB, a.id_pss || ' - ' || a.apelido_pss AS apelido_pss, a.id_fnc || ' - ' || a.apelido_fnc  AS vendedor, a.status_rcb, a.atraso_rcb FROM v_recebimentos a WHERE a.id_emp IN 
  (1, 2, 3, 4, 100) AND a.DATA_VENCIMENTO_RCB BETWEEN DATE '${dateInit}' AND DATE '${dateEnd}' ${peopleFilter} AND a.STATUS_PSS = 'A' AND a.status_rcb IN (1, 2, 4) AND COALESCE(a.insolvente_rcb, 'N') = 'N' 
  ORDER BY a.id_emp, a.data_vencimento_rcb, nome_pss`;

  let billsToReceiveInOpen = `select a.id_pss, a.id_rcb as ID_SDS, a.id_origem, a.data_vencimento_rcb, a.valor_rcb, a.restante_rcb, a.VALOR_PAGO_RCB, a.id_pss || ' - ' || a.apelido_pss as apelido_pss, a.id_rcb, a.id_fnc || ' - ' || a.apelido_fnc as vendedor, a.id_frm || ' - ' || 
  a.descricao_frm as forma_pagamento, a.atraso_rcb from v_recebimentos a  where  a.id_emp in(1, 2, 3, 4, 5, 100) and a.STATUS_PSS = 'A' and a.DATA_VENCIMENTO_RCB between date '${dateInit}' and '${dateEnd}' and a.status_rcb in (1 ,4) and coalesce(
  a.insolvente_rcb,'N') = 'N' ${formattedSellers} ${peopleFilter} order by a.id_emp,a.data_vencimento_rcb,nome_pss`;

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
    billsToReceiveAll,
    topClientLate,
    summaryReceive,
    summaryReceiveRelease,
    billsToReceiveInOpen,
  };
};
