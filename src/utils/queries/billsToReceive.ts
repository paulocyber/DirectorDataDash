// Tipagem
import { QueryProps } from "../types/queries";

export const billsToReceive = ({ dataInit, dataEnd, year, month, day }: QueryProps) => {
  let billsToReceivePaid = `select tbv.id_rcb as nosso_numero, tbv.id_cliente, tbv.apelido_fantasia_cliente, tbv.apelido_vendedor, tbv.valor_ja_pago from ( select rcb.id_rcb, rcb.id_pss as id_cliente, 
  pss.apelido_pss as apelido_fantasia_cliente, fnc.apelido_pss as apelido_vendedor, sum(rci.valor_recebido_rci) as valor_ja_pago from recebimentos rcb inner join recebimentos_itens rci on rci.id_rcb = rcb.id_rcb 
  inner join pessoas pss on pss.id_pss = rcb.id_pss left join pessoas fnc on fnc.id_pss = rcb.id_fnc where rci.datahora_rci between '${dataInit} 00:00:00' and '${dataEnd} 23:59:59' and fnc.apelido_pss != 'PLAYCELL SAO PAULO' 
  group by rcb.id_rcb, rcb.id_pss, pss.apelido_pss, fnc.apelido_pss ) tbv`;

  let billsToReceiveOpen = `select a.id_rcb as ID_SDS, a.id_pss as ID_CLIENTE, a.id_origem as n_dav, a.valor_rcb as VALOR_ORIGINAL, a.apelido_pss as APELIDO_FANTASIA_CLIENTE, a.nome_fnc 
  as APELIDO_VENDEDOR  from v_recebimentos a where a.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) and a.nome_fnc != 'PLAYCELL SAO PAULO' and a.data_vencimento_rcb between date '${dataInit}' and '${dataEnd}' and a.status_rcb in(1, 4) 
  and coalesce(a.insolvente_rcb,'N') = 'N' order by a.id_emp,a.data_vencimento_rcb,nome_pss`;

  let billsToReceiveLateBills = `select a.id_rcb as ID_SDS, a.id_pss as ID_CLIENTE, a.id_origem as n_dav, a.restante_rcb as valores_restante, a.apelido_pss as APELIDO_FANTASIA_CLIENTE, a.nome_fnc as APELIDO_VENDEDOR
  , a.ATRASO_RCB, a.NOME_PSS as cliente from v_recebimentos a  where  a.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) and a.nome_fnc != 'PLAYCELL SAO PAULO' and a.data_vencimento_rcb between date '${year}/01/01' and '${year}/${month}/${day}' and a.status_rcb in(1, 4) and coalesce(a.insolvente_rcb,'N') = 'N' 
  order by a.id_emp,a.data_vencimento_rcb,nome_pss`;
  
  return { billsToReceivePaid, billsToReceiveOpen, billsToReceiveLateBills };
};
