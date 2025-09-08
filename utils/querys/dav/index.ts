// Tipagem
import { QueryProps } from "@/types/query";

export const davsQueries = ({
  id,
  companys,
  dateInit,
  dateEnd,
  formsOfPayments,
  idSellers,
  peoples,
}: QueryProps) => {
  const formsOfPaymentsFilter =
    formsOfPayments && formsOfPayments?.length > 0
      ? formsOfPayments.map((payment) => `'${payment}'`).join(", ")
      : "";

  const idSellersFilter =
    idSellers && idSellers.length > 0
      ? idSellers.map((seller) => `'${seller}'`).join(", ")
      : "";

  const idCompaniesFilter =
    companys && companys.length > 0
      ? companys.map((company) => `'${company}'`).join(", ")
      : "";

  const idPeoplesFilter =
    peoples && peoples.length > 0
      ? peoples.map((people) => `'${people}'`).join(", ")
      : "";

  let davFinished = `select sds.id_sds, CAST(sds.datahora_finalizacao_sds AS DATE) AS
  datahora_finalizacao_sds, pss.apelido_pss, pss.nome_pss AS cliente, sds.NOME_CLIENTE_SDS, 
  fnc.apelido_pss AS vendedor, MAX(sds.valor_bruto_sds) AS  valor_bruto_sds,
  MAX(COALESCE(sds.valor_troca_sds, 0)) AS valor_troca_sds, MAX(sds.valor_liquido_sds) 
  AS valor_liquido_sds, LIST(DISTINCT frm.descricao_frm) AS formapagamento FROM saidas 
  sds INNER JOIN pessoas pss ON pss.id_pss = sds.id_pss INNER JOIN empresas emp ON 
  emp.id_emp = sds.id_emp INNER JOIN almoxarifados alm ON alm.id_alm = sds.id_alm 
  LEFT JOIN pessoas fnc ON fnc.id_pss = sds.id_fnc LEFT JOIN pessoas prf ON  prf.id_pss
  = sds.id_prf INNER JOIN faturas ftr ON ftr.id_sds = sds.id_sds INNER JOIN 
  formas_pagamentos frm ON frm.id_frm = ftr.id_frm WHERE sds.tipo_sds IN 
  ('4', '5', '9') AND sds.status_sds IN ('2')  AND 
  sds.datahora_finalizacao_sds BETWEEN TIMESTAMP 
  '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' ${
    formsOfPayments && formsOfPayments?.length > 0
      ? `and frm.descricao_frm in (${formsOfPaymentsFilter})`
      : ""
  } ${
    idSellersFilter && idSellersFilter.length > 0
      ? ` and fnc.id_pss in (${idSellersFilter})`
      : ""
  }
  ${
    idCompaniesFilter && idCompaniesFilter.length > 0
      ? `and emp.id_emp in 
    (${idCompaniesFilter})`
      : ""
  } ${
    idPeoplesFilter && idPeoplesFilter.length > 0
      ? `and pss.ID_PSS in (${idPeoplesFilter})`
      : ""
  }
  GROUP BY sds.id_sds, sds.NOME_CLIENTE_SDS, emp.sigla_emp,emp.id_emp,pss.apelido_pss,fnc.id_fnc,sds.datahora_sds,
  sds.datahora_finalizacao_sds, pss.apelido_pss, pss.nome_pss,fnc.apelido_pss,
  sds.id_alm,alm.descricao_alm, sds.tipo_venda_sds,sds.status_sds ORDER BY 
  sds.datahora_sds,sds.id_sds`;

  // let profitOnSales = `select SUM(sdi.valor_liquido_sdi) - SUM(ale.preco_custo_ale *
  // sdi.qtde_sdi) AS valor_lucro_total FROM saidas_itens sdi INNER JOIN produtos prd ON
  // prd.id_prd = sdi.id_prd INNER JOIN saidas sds ON sds.id_sds = sdi.id_sds INNER JOIN
  // almoxarifados_estoque ale ON ale.id_prd = sdi.id_prd AND ale.id_alm = sdi.id_alm
  // INNER JOIN v_funcionarios_consulta fnc ON fnc.id_pss = COALESCE(sdi.id_pss,
  // sds.id_fnc) INNER JOIN empresas emp ON emp.id_emp = sds.id_emp LEFT JOIN
  // fornecedores_produtos frp ON frp.id_prd = prd.id_prd AND frp.nivel_frp = 'P'
  // WHERE sds.status_sds = '2' AND sdi.id_tbl IN ('1', '2') AND EXISTS ( SELECT 1
  // FROM metas_vendas_itens mti WHERE mti.ID_FNC = fnc.id_pss) AND
  // sds.datahora_finalizacao_sds BETWEEN '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59'
  // ${
  //   idCompaniesFilter && idCompaniesFilter.length > 0
  //     ? `and emp.id_emp in
  //   (${idCompaniesFilter})`
  //     : ""
  // }`;

  let profitOnSales = `select SUM(sdi.valor_liquido_sdi) - 
  SUM(ale.preco_custo_ale * sdi.qtde_sdi) AS VALOR_LUCRO_TOTAL from 
  saidas_itens sdi INNER JOIN saidas sds ON sds.id_sds = sdi.id_sds 
  INNER JOIN produtos prd ON prd.id_prd = sdi.id_prd INNER JOIN 
  almoxarifados_estoque ale ON ale.id_prd = sdi.id_prd AND 
  ale.id_alm = sdi.id_alm where sds.datahora_finalizacao_sds 
  BETWEEN TIMESTAMP '${dateInit} 00:00:00' AND TIMESTAMP 
  '${dateEnd} 23:59:59' AND sds.status_sds IN ('2') ${
    idCompaniesFilter && idCompaniesFilter.length > 0
      ? `and sds.id_emp in 
    (${idCompaniesFilter})`
      : ""
  } ${
    idPeoplesFilter && idPeoplesFilter.length > 0
      ? `and pss.ID_PSS in (${idPeoplesFilter})`
      : ""
  }`;

  let topVendorsByPaymentType = `select  fnc.apelido_pss AS vendedor, COUNT(sds.id_sds) AS total_vendas, SUM(sds.valor_liquido_sds) AS valor_total_vendas FROM saidas sds INNER JOIN pessoas pss ON pss.id_pss = sds.id_pss 
  INNER JOIN saidas_itens sdi ON sdi.id_sds = sds.id_sds LEFT JOIN pessoas fnc ON fnc.id_pss = sds.id_fnc INNER JOIN faturas ftr ON ftr.id_sds = sds.id_sds INNER JOIN formas_pagamentos frm ON frm.id_frm = ftr.id_frm 
  WHERE  sds.tipo_sds = '4' AND sds.id_emp IN (1, 2, 3, 4, 5, 100) AND sds.datahora_finalizacao_sds BETWEEN TIMESTAMP '${dateInit} 00:00:00' AND TIMESTAMP '${dateEnd} 23:59:59' AND frm.descricao_frm IN ('PIX/TED', 
  'PIX MAQUINETA', 'POS DEBITO', 'MASTER DÉBITO - REDE', 'ELO DÉBITO - REDE', 'VISA DÉBITO-GETNET', 'ELO DÉBITO-GETNET', 'VISA DÉBITO - CIELO', 'ELO DÉBITO - CIELO', 'MASTER DÉBITO - CIELO', 'VISA DÉBITO- REDE', 
  'MASTER DÉBITO-REDE', 'ELO DÉBITO-REDE', 'VISA DÉBITO - STONE', 'ELO DÉBITO - STONE', 'MASTERCARD DÉBITO - STONE') GROUP BY fnc.apelido_pss ORDER BY valor_total_vendas DESC rows 3`;

  let davFinalizationDetail = `select sds.id_sds, sds.valor_liquido_sds - coalesce(sds.valor_troca_sds, 
  0.00) as valor_liquido_total, emp.sigla_emp as empresa, cast(sds.datahora_sds as date) as datahora_sds,
  cast(sds.datahora_finalizacao_sds as date) as datahora_finalizacao_sds, pss.apelido_pss, pss.nome_pss as
  cliente, sds.id_fnc || ' - ' || fnc.apelido_pss as vendedor, sds.id_alm || ' - ' || alm.descricao_alm as
  almoxarifado, sds.valor_bruto_sds, sds.VALOR_DESCONTO_SDS, coalesce(sds.valor_troca_sds, 0) as 
  valor_troca_sds, sds.valor_liquido_sds, case when sds.tipo_venda_sds = 'B' then 'BALCAO' when 
  sds.tipo_venda_sds = 'E' then 'EXTERNA' else ' ' end as tipo_venda_sds, sds.status_sds, 
  frm.descricao_frm as FORMAPAGAMENTO from saidas sds inner join  pessoas pss on pss.id_pss = 
  sds.id_pss inner join empresas emp on emp.id_emp = sds.id_emp inner join almoxarifados alm on 
  alm.id_alm = sds.id_alm left join pessoas fnc on fnc.id_pss = sds.id_fnc left join pessoas prf on 
  prf.id_pss = sds.id_prf left join grupos_pessoas gps on gps.id_gps = pss.id_gps 
  left join grupos_pessoas gpf on gpf.id_gps = fnc.id_gps left join usuarios usr on 
  usr.id_usr = sds.id_usr INNER JOIN faturas ftr ON ftr.id_sds = sds.id_sds INNER JOIN formas_pagamentos
  frm ON frm.id_frm = ftr.id_frm where sds.tipo_sds = '4' and sds.id_emp in 
  (4, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 13, 12) and sds.id_sds = ${id} order by sds.datahora_sds,
  sds.id_sds`;

  let obtainProductsContainedInDav = `select iif(prv.referencia_prv is null, 
  prd.codigo_prd, prv.codigo_prv) as codigo_prd, sdi.id_sds, prd.descricao_prd, 
  prd.referencia_prd, sdi.qtde_sdi,  sdi.valor_bruto_sdi, sdi.valor_desconto_sdi, 
  sdi.valor_acrescimo_sdi, sdi.valor_liquido_sdi, sdi.PRECO_SDI, sdi.perc_desconto_sdi,
  sdi.status_sdi, alm.descricao_alm, sdi.item_promocao_sdi, sdi.qtde_disponivel_sdi, 
  sdi.PRECO_CUSTO_SDI from saidas_itens sdi inner join produtos prd on 
  prd.id_prd = sdi.id_prd inner join empresas emp on emp.id_emp = sdi.id_emp inner join almoxarifados alm on alm.id_alm = sdi.id_alm left join v_funcionarios fnc on fnc.id_pss = sdi.id_pss left join cores crs on 
  crs.id_crs = prd.id_crs left join produtos_variacoes prv on (prv.id_prd = sdi.id_prd and prv.codigo_prv = sdi.codigo_prv and prv.id_prv = sdi.id_prv and sdi.id_gri = prv.id_gri) left join ambientes amb on 
  amb.id_amb = sdi.id_amb left join tabelas_precos tbp on tbp.id_tbp = sdi.id_tbp left join tipos_separacao tsp on tsp.id_tsp = sdi.id_tsp where sdi.id_sds = ${id} and prd.tipo_prd in('R', 'S', 'P') 
  and sdi.id_item_sdi > 0 and sdi.produtopai_kit_sdi is false order by id_item_sdi, id_prd_composto, id_sequenciainsumokit_sdi`;

  return {
    davFinished,
    profitOnSales,
    davFinalizationDetail,
    obtainProductsContainedInDav,
    topVendorsByPaymentType,
  };
};
