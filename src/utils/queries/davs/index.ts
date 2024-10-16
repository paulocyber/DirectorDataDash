// Tipagem
import { QueryProps } from "@/utils/types/query";

export const davsQueries = ({ dateInit, dateEnd, id }: QueryProps) => {
  let davFinished = `select sds.id_sds, emp.sigla_emp as empresa, cast(sds.datahora_sds as date) as datahora_sds, cast(sds.datahora_finalizacao_sds as date) 
    as datahora_finalizacao_sds, pss.apelido_pss, pss.nome_pss as cliente, fnc.apelido_pss as vendedor, sds.id_alm || ' - ' || alm.descricao_alm as almoxarifado,
    sds.valor_bruto_sds, coalesce(sds.valor_troca_sds, 0) as valor_troca_sds, sds.valor_liquido_sds, sds.valor_liquido_sds - coalesce(sds.valor_troca_sds, 0.00)
    as valor_liquido_total, case when sds.tipo_venda_sds = 'B' then 'BALCAO' when sds.tipo_venda_sds = 'E' then 'EXTERNA' else ' ' end as tipo_venda_sds, 
    sds.status_sds from saidas sds inner join pessoas pss on pss.id_pss = sds.id_pss inner join empresas emp on emp.id_emp = sds.id_emp inner join almoxarifados
    alm on alm.id_alm = sds.id_alm left join pessoas fnc on fnc.id_pss = sds.id_fnc left join pessoas prf on prf.id_pss = sds.id_prf left join grupos_pessoas 
    gps on gps.id_gps = pss.id_gps left join grupos_pessoas gpf on gpf.id_gps = fnc.id_gps left join usuarios usr on usr.id_usr = sds.id_usr where 
    sds.tipo_sds = '4' and sds.id_emp in (4, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 13, 12) and sds.datahora_finalizacao_sds between timestamp '${dateInit} 00:00:00' 
    and '${dateEnd} 23:59:59' order by sds.datahora_sds,sds.id_sds`;

  let davFinalizationDetail = `select sds.id_sds, sds.valor_liquido_sds - coalesce(sds.valor_troca_sds, 0.00) as valor_liquido_total, emp.sigla_emp as empresa, cast(sds.datahora_sds as date) as datahora_sds, cast(sds.datahora_finalizacao_sds as date) as 
    datahora_finalizacao_sds, pss.apelido_pss, pss.nome_pss as cliente, sds.id_fnc || ' - ' || fnc.apelido_pss as vendedor, sds.id_alm || ' - ' || alm.descricao_alm 
    as almoxarifado, sds.valor_bruto_sds, sds.VALOR_DESCONTO_SDS, coalesce(sds.valor_troca_sds, 0) as valor_troca_sds, sds.valor_liquido_sds, case when sds.tipo_venda_sds = 'B' then 
    'BALCAO' when sds.tipo_venda_sds = 'E' then 'EXTERNA' else ' ' end as tipo_venda_sds, sds.status_sds from saidas sds inner join  pessoas pss on pss.id_pss = sds.id_pss inner join
     empresas emp on emp.id_emp = sds.id_emp inner join almoxarifados alm on alm.id_alm = sds.id_alm left join pessoas fnc on fnc.id_pss = sds.id_fnc left join pessoas prf on prf.id_pss = 
     sds.id_prf left join grupos_pessoas gps on gps.id_gps = pss.id_gps left join grupos_pessoas gpf on gpf.id_gps = fnc.id_gps left join usuarios usr on usr.id_usr = sds.id_usr where 
     sds.tipo_sds = '4' and sds.id_emp in (4, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 13, 12) and sds.id_sds = '${id}' order by sds.datahora_sds,sds.id_sds`;

  let obtainProductsContainedInDav = `select iif(prv.referencia_prv is null, prd.codigo_prd, prv.codigo_prv) as codigo_prd, sdi.id_sds, prd.descricao_prd, prd.referencia_prd, sdi.qtde_sdi,  sdi.valor_bruto_sdi, sdi.valor_desconto_sdi, 
  sdi.valor_acrescimo_sdi, sdi.valor_liquido_sdi, sdi.perc_desconto_sdi, sdi.status_sdi, alm.descricao_alm, sdi.item_promocao_sdi, sdi.qtde_disponivel_sdi from saidas_itens sdi inner join produtos prd on 
  prd.id_prd = sdi.id_prd inner join empresas emp on emp.id_emp = sdi.id_emp inner join almoxarifados alm on alm.id_alm = sdi.id_alm left join v_funcionarios fnc on fnc.id_pss = sdi.id_pss left join cores crs on 
  crs.id_crs = prd.id_crs left join produtos_variacoes prv on (prv.id_prd = sdi.id_prd and prv.codigo_prv = sdi.codigo_prv and prv.id_prv = sdi.id_prv and sdi.id_gri = prv.id_gri) left join ambientes amb on 
  amb.id_amb = sdi.id_amb left join tabelas_precos tbp on tbp.id_tbp = sdi.id_tbp left join tipos_separacao tsp on tsp.id_tsp = sdi.id_tsp where sdi.id_sds = ${id} and prd.tipo_prd in('R', 'S', 'P') 
  and sdi.id_item_sdi > 0 and sdi.produtopai_kit_sdi is false order by id_item_sdi, id_prd_composto, id_sequenciainsumokit_sdi`;

  return { davFinished, davFinalizationDetail, obtainProductsContainedInDav };
};
