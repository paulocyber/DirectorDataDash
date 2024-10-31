// Tipagem
import { QueryProps } from "@/types/queires";

export const billsToReceiveQueries = ({
  dateInit,
  dateEnd,
  year,
  idSellers,
  sellersSurname,
}: QueryProps) => {
  let billsToReceiveInOpen = `select a.id_pss, a.id_rcb as ID_SDS, a.id_origem, a.data_vencimento_rcb, a.valor_rcb, a.restante_rcb, a.VALOR_PAGO_RCB, a.apelido_pss, a.apelido_fnc as vendedor, 
  a.id_frm || ' - ' || a.descricao_frm as forma_pagamento, a.atraso_rcb from v_recebimentos a  where  a.id_emp in(1, 2, 3, 100) and a.DATA_VENCIMENTO_RCB between date '${dateInit}' and '${dateEnd}' and a.status_rcb in (1 ,4) and 
  coalesce(a.insolvente_rcb,'N') = 'N' 
 ${
   idSellers || sellersSurname
     ? `and (a.id_fnc = ${idSellers ? idSellers : "?"} or a.apelido_fnc = ${
         sellersSurname ? `'${sellersSurname}'` : "?"
       })`
     : ""
 } order by a.id_emp,a.data_vencimento_rcb,nome_pss`;

  let topClientLate = `select a.id_pss, a.id_origem, a.data_vencimento_rcb, a.restante_rcb, a.VALOR_PAGO_RCB, a.apelido_pss, a.apelido_fnc as vendedor,a.status_rcb, a.atraso_rcb from v_recebimentos a where a.id_emp 
 in(1, 2, 3, 100) AND (a.status_rcb = 1 OR a.status_rcb = 4) and a.DATA_VENCIMENTO_RCB between date '2023/01/01' and '${year}/12/31' and a.status_rcb in (1, 2, 4) and coalesce(a.insolvente_rcb,'N') = 'N' and a.atraso_rcb
 > 0 order by a.id_emp, a.data_vencimento_rcb,nome_pss, a.atraso_rcb rows 5`;

  let billsToReceiveAll = `select a.id_pss, a.id_rcb as ID_SDS, a.id_origem, a.data_vencimento_rcb, a.valor_rcb, a.restante_rcb, a.VALOR_PAGO_RCB, a.apelido_pss, a.apelido_fnc as vendedor,a.status_rcb, a.atraso_rcb 
  from v_recebimentos a  where  a.id_emp in(1, 2, 3, 100) and a.DATA_VENCIMENTO_RCB between date '${dateInit}' and '${dateEnd}' and a.status_rcb in (1, 2, 4) and coalesce(a.insolvente_rcb,'N') = 'N' order by a.id_emp,
  a.data_vencimento_rcb,nome_pss`;

  return { billsToReceiveInOpen, billsToReceiveAll, topClientLate };
};
