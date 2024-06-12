export const getDavs = () => {
  let queryDav = `select a.id_pss,a.id_frm,a.id_emp,a.id_rcb,a.sigla_emp,a.numero_documento_rcb,   a.id_origem,   a.datahora_lancamento_rcb,   a.datahora_pagamento_rcb,   a.data_vencimento_rcb,   a.atraso_rcb,   
  a.valor_rcb,   a.juros_rcb,   a.multa_rcb,   iif(a.restante_rcb < 0.00,0.00,a.restante_rcb) as restante_rcb,   a.restante_sem_juros_rcb,a.valor_pago_rcb,   a.nome_pss as nome_pss,   a.apelido_pss,  a.id_fnc,    
  a.nome_fnc as nome_fnc,   a.status_rcb, coalesce(a.conciliado_rcb,'N') as conciliado_rcb,  a.id_frm || ' - ' || a.descricao_frm as forma_pagamento,    a.valor_acrescimos_rci,    a.valor_desconto_rci, 
  a.descricao_rcb from v_recebimentos a  where  a.id_emp in(4,1,2,3,5,6,7,8,9,10,11) and a.status_rcb in('1','4') and a.status_pss = 'A' and coalesce(a.insolvente_rcb,'N') = 'N'
   and CAST(a.data_vencimento_rcb AS DATE) = CURRENT_DATE order by a.id_emp,a.data_vencimento_rcb,nome_pss`;

  return queryDav;
};

export const getDetailDavs = (numDav: string) => {
  let detailDav = `select a.id_pss, a.id_frm, a.id_emp, a.id_rcb, a.sigla_emp, a.numero_documento_rcb as n_dav, a.id_origem, a.datahora_lancamento_rcb, a.datahora_pagamento_rcb, a.data_vencimento_rcb, a.atraso_rcb, 
  a.valor_rcb, a.juros_rcb, a.multa_rcb, iif(a.restante_rcb < 0.00,0.00,a.restante_rcb) as restante_rcb, a.restante_sem_juros_rcb, a.valor_pago_rcb, a.nome_pss as nome_pss, a.apelido_pss, a.id_fnc, a.nome_fnc as 
  vendedor, a.status_rcb, a.descricao_frm as forma_pagamento,  a.valor_acrescimos_rci, a.valor_desconto_rci, a.descricao_rcb from v_recebimentos a where a.id_emp in(4,1,2,3,5,6,7,8,9,10,11) and a.status_rcb in('1','
  4') and a.status_pss = 'A' and coalesce(a.insolvente_rcb,'N') = 'N' and EXTRACT(YEAR FROM a.data_vencimento_rcb) = EXTRACT(YEAR FROM CURRENT_DATE) and a.ID_ORIGEM = '${numDav}' order by a.id_emp, 
  a.data_vencimento_rcb, nome_pss`;

  return detailDav;
};

export const getDavsProducts = (numDav: string) => {
  let productsContainsInDav = `select iif(prv.referencia_prv is null, prd.codigo_prd, prv.codigo_prv) as codigo_prd, prd.descricao_prd, prd.referencia_prd, sdi.qtde_sdi,  sdi.valor_bruto_sdi, sdi.valor_desconto_sdi, 
  sdi.valor_acrescimo_sdi, sdi.valor_liquido_sdi, sdi.perc_desconto_sdi, sdi.status_sdi, alm.descricao_alm, sdi.item_promocao_sdi, sdi.qtde_disponivel_sdi from saidas_itens sdi inner join produtos prd on 
  prd.id_prd = sdi.id_prd inner join empresas emp on emp.id_emp = sdi.id_emp inner join almoxarifados alm on alm.id_alm = sdi.id_alm left join v_funcionarios fnc on fnc.id_pss = sdi.id_pss left join cores crs on 
  crs.id_crs = prd.id_crs left join produtos_variacoes prv on (prv.id_prd = sdi.id_prd and prv.codigo_prv = sdi.codigo_prv and prv.id_prv = sdi.id_prv and sdi.id_gri = prv.id_gri) left join ambientes amb on 
  amb.id_amb = sdi.id_amb left join tabelas_precos tbp on tbp.id_tbp = sdi.id_tbp left join tipos_separacao tsp on tsp.id_tsp = sdi.id_tsp where sdi.id_sds = ${numDav} and prd.tipo_prd in('R', 'S', 'P') 
  and sdi.id_item_sdi > 0 and sdi.produtopai_kit_sdi is false order by id_item_sdi, id_prd_composto, id_sequenciainsumokit_sdi`;

  return productsContainsInDav;
};

export const accountsPayableOpenedDaily = () => {
  let billetInOpen = `select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, 
  pgm.valor_desconto_pgi, pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm 
  as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo,
  pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') as 
  contabil_pgm  from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) and pgm.data_vencimento_pgm = current_date order by pgm.data_vencimento_pgm, pgm.id_pss`;

  return billetInOpen;
};

export const accountsPaybleOpenedMonthly = (
  dateInit: string,
  dateEnd: string
) => {
  let billetInOpen = `select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, 
  pgm.valor_desconto_pgi, pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm 
  as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo,
  pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') as 
  contabil_pgm  from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND CAST(pgm.data_vencimento_pgm AS DATE) BETWEEN '${dateInit}' AND '${dateEnd}' order by pgm.data_vencimento_pgm, pgm.id_pss`;

  return billetInOpen;
};

export const accountsPayablePaidDaily = () => {
  let paidBills = `select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, 
  pgm.valor_desconto_pgi, pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm 
  as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo,
  pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') as 
  contabil_pgm  from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND CAST(pgm.datahora_pagamento_pgm AS DATE) = CURRENT_DATE  order by pgm.data_vencimento_pgm, pgm.id_pss`;

  return paidBills;
};

export const accountsPayablePaidMonthly = (
  dateInit: string,
  dateEnd: string
) => {
  let paidBills = `select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, 
  pgm.valor_desconto_pgi, pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm 
  as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo,
  pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') 
  as contabil_pgm  from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND CAST(pgm.datahora_pagamento_pgm AS DATE) BETWEEN '${dateInit}' AND 
  '${dateEnd}' order by pgm.data_vencimento_pgm, pgm.id_pss`;

  return paidBills;
};

export const accountsPayablePaidInOpenDaily = () => {
  let paidAndUnpaidBills = `select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, 
  pgm.valor_desconto_pgi, pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm 
  as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo, pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') as contabil_pgm  from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND (CAST(pgm.datahora_pagamento_pgm AS DATE) = CURRENT_DATE or CAST(pgm.data_vencimento_pgm AS DATE) = CURRENT_DATE) order by pgm.data_vencimento_pgm, pgm.id_pss`;

  return paidAndUnpaidBills;
};

export const accountsPayablePaidInOpenMonthly = (
  dateInit: string,
  dateEnd: string
) => {
  let paidAndUnpaidBills = `select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, 
  pgm.valor_desconto_pgi, pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm 
  as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||
  pgm.descricao_cnt as centro_custo, pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, 
  pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') as contabil_pgm from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) and 
  (pgm.data_vencimento_pgm between date '${dateInit}' and date '${dateEnd}' or pgm.datahora_pagamento_pgm between date '${dateInit}' and date '${dateEnd}') order by pgm.data_vencimento_pgm, pgm.id_pss`;

  return paidAndUnpaidBills;
};

export const getBillExpiredMonthly = (
  year: number,
  month: number,
  day: number,
  startIsToday: boolean,
  endIsToday: boolean,
  dateInit?: string,
  dateEnd?: string
) => {
  let expiredBills = "";

  if (!startIsToday || !endIsToday) {
    expiredBills = `select pgm.restante_pgm from v_pagamentos pgm where pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND CAST(pgm.data_vencimento_pgm AS DATE) BETWEEN 
    '${dateInit}' AND '${dateEnd}' AND CAST(pgm.datahora_lancamento_pgm AS DATE) BETWEEN '2022-12-01' AND 
    CURRENT_DATE and pgm.status_pgm = 1 order by pgm.data_vencimento_pgm, pgm.id_pss`;
  } else {
    expiredBills = `select pgm.restante_pgm from v_pagamentos pgm where pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND CAST(pgm.data_vencimento_pgm AS DATE) BETWEEN '${year}-01-01' 
  AND '${year}-${month}-${
      day - 1
    }' AND CAST(pgm.datahora_lancamento_pgm AS DATE) BETWEEN '2022-12-01' AND CURRENT_DATE and pgm.status_pgm = 1 or pgm.status_pgm = 4 order by pgm.data_vencimento_pgm, pgm.id_pss`;
  }

  return expiredBills;
};
// monthlyBillsPayable
