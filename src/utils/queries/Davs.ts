interface davQuery {
  dataInit: string;
  dataEnd: string;
  id?: string;
}

export const davsQueries = ({ dataInit, dataEnd, id }: davQuery) => {
  let davFinished = `select sds.id_sds, emp.sigla_emp as empresa, cast(sds.datahora_sds as date) as datahora_sds, cast(sds.datahora_finalizacao_sds as date) 
  as datahora_finalizacao_sds, pss.apelido_pss, pss.nome_pss as cliente, fnc.apelido_pss as vendedor, sds.id_alm || ' - ' || alm.descricao_alm as almoxarifado,
  sds.valor_bruto_sds, coalesce(sds.valor_troca_sds, 0) as valor_troca_sds, sds.valor_liquido_sds, sds.valor_liquido_sds - coalesce(sds.valor_troca_sds, 0.00)
  as valor_liquido_total, case when sds.tipo_venda_sds = 'B' then 'BALCAO' when sds.tipo_venda_sds = 'E' then 'EXTERNA' else ' ' end as tipo_venda_sds, 
  sds.status_sds from saidas sds inner join pessoas pss on pss.id_pss = sds.id_pss inner join empresas emp on emp.id_emp = sds.id_emp inner join almoxarifados
  alm on alm.id_alm = sds.id_alm left join pessoas fnc on fnc.id_pss = sds.id_fnc left join pessoas prf on prf.id_pss = sds.id_prf left join grupos_pessoas 
  gps on gps.id_gps = pss.id_gps left join grupos_pessoas gpf on gpf.id_gps = fnc.id_gps left join usuarios usr on usr.id_usr = sds.id_usr where 
  sds.tipo_sds = '4' and sds.id_emp in (4, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 13, 12) and sds.datahora_finalizacao_sds between timestamp '${dataInit} 00:00:00' 
  and '${dataEnd} 23:59:59' order by sds.datahora_sds,sds.id_sds`;

  let davFinalizationDetail = `select sds.id_sds, emp.sigla_emp as empresa, cast(sds.datahora_sds as date) as datahora_sds, cast(sds.datahora_finalizacao_sds as date) as 
  datahora_finalizacao_sds, pss.apelido_pss, pss.nome_pss as cliente, sds.id_fnc || ' - ' || fnc.apelido_pss as vendedor, sds.id_alm || ' - ' || alm.descricao_alm 
  as almoxarifado, sds.valor_bruto_sds, sds.VALOR_DESCONTO_SDS, coalesce(sds.valor_troca_sds, 0) as valor_troca_sds, sds.valor_liquido_sds, case when sds.tipo_venda_sds = 'B' then 
  'BALCAO' when sds.tipo_venda_sds = 'E' then 'EXTERNA' else ' ' end as tipo_venda_sds, sds.status_sds from saidas sds inner join  pessoas pss on pss.id_pss = sds.id_pss inner join
   empresas emp on emp.id_emp = sds.id_emp inner join almoxarifados alm on alm.id_alm = sds.id_alm left join pessoas fnc on fnc.id_pss = sds.id_fnc left join pessoas prf on prf.id_pss = 
   sds.id_prf left join grupos_pessoas gps on gps.id_gps = pss.id_gps left join grupos_pessoas gpf on gpf.id_gps = fnc.id_gps left join usuarios usr on usr.id_usr = sds.id_usr where 
   sds.tipo_sds = '4' and sds.id_emp in (4, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 13, 12) and sds.id_sds = '${id}' order by sds.datahora_sds,sds.id_sds`;

  return { davFinished, davFinalizationDetail };
};
