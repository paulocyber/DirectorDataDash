interface filterQuery {
  year?: number;
  month?: number;
  day?: number;
  todayDateStarted?: boolean;
  todayDateEnd?: boolean;
  dateInit?: string;
  dateEnd?: string;
}

export const billsToPayQueries = ({
  year,
  day,
  month,
  todayDateStarted,
  todayDateEnd,
  dateInit,
  dateEnd,
}: filterQuery) => {
  // Boletos abertos
  let billetInOpenDaily = `select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, 
  pgm.valor_desconto_pgi, pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm 
  as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo, 
  pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') as 
  contabil_pgm from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) and pgm.data_vencimento_pgm = current_date and pgm.status_pgm = 1 AND EXTRACT(YEAR FROM pgm.DATA_COMPETENCIA_PGM) = ${year} 
  order by pgm.data_vencimento_pgm, pgm.id_pss`;

  let billetInOpenMonthly = `select pgm.valor_pgm, pgm.nome_pss, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo from v_pagamentos pgm where pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND 
  (CAST(pgm.data_vencimento_pgm AS DATE) BETWEEN '${dateInit}' AND '${dateEnd}' AND CAST(pgm.datahora_lancamento_pgm AS DATE) BETWEEN '2022-12-01' AND CURRENT_DATE) AND (pgm.status_pgm = 1 OR pgm.status_pgm = 4) 
  order by pgm.data_vencimento_pgm, pgm.id_pss`;

  // Boletos pagos
  let billetPaidDaily = `select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, 
  pgm.valor_desconto_pgi, pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm 
  as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo,
  pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') as 
  contabil_pgm  from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND CAST(pgm.datahora_pagamento_pgm AS DATE) = CURRENT_DATE AND PGM.STATUS_PGM = 2 order by pgm.data_vencimento_pgm, pgm.id_pss`;

  let billetPaidMonthly = `select pgm.VALOR_PAGO_PGM, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND CAST(pgm.datahora_pagamento_pgm AS DATE) BETWEEN '${dateInit}' AND '${dateEnd}' AND PGM.STATUS_PGM = 2 order by 
  pgm.data_vencimento_pgm, pgm.id_pss`;

  // Boletos pagos e vencidos
  let billetPaidAndOpenDaily = `select pgm.valor_pgm, pgm.status_pgm, pgm.descricao_frm, pgm.data_vencimento_pgm, pgm.numero_documento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, 
  pgm.nome_pss, pgm.id_cnt||' - '|| pgm.descricao_cnt as centro_custo, pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.id_emp, pgm.descricao_pgm from 
  v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND (CAST(pgm.datahora_pagamento_pgm AS DATE) = CURRENT_DATE or CAST(pgm.data_vencimento_pgm AS DATE) = CURRENT_DATE)
   order by pgm.data_vencimento_pgm, pgm.id_pss`;

  let billetPaidAndOpenMonthly = `select  pgm.status_pgm, pgm.data_vencimento_pgm, pgm.valor_pgm, pgm.numero_documento_pgm, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.nome_pss, 
  pgm.id_cnt||' - '|| pgm.descricao_cnt as centro_custo, pgm.descricao_frm from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) and (pgm.data_vencimento_pgm between date '${dateInit}' and date 
  '${dateEnd}' or pgm.datahora_pagamento_pgm between date '${dateInit}' and date '${dateEnd}') order by pgm.data_vencimento_pgm, pgm.id_pss`;

  // Boletos vencidos
  let expiredBillet = `select pgm.restante_pgm, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo from v_pagamentos pgm where pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND (CAST(pgm.data_vencimento_pgm AS DATE) BETWEEN '${year}-01-01' AND
    '${year}-${month}-${
    day ? day - 1 : 0
  }' AND CAST(pgm.datahora_lancamento_pgm AS DATE) BETWEEN '2022-12-01' AND CURRENT_DATE) AND (pgm.status_pgm = 1 OR pgm.status_pgm = 4) order by pgm.data_vencimento_pgm, 
    pgm.id_pss`;

  let expiredBilletMonthly = `select pgm.restante_pgm, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo from v_pagamentos pgm where pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND (CAST(pgm.data_vencimento_pgm AS DATE) 
    BETWEEN '${dateInit}' AND '${dateEnd}' AND CAST(pgm.datahora_lancamento_pgm AS DATE) BETWEEN '2022-12-01' AND CURRENT_DATE) AND (pgm.status_pgm = 1 OR pgm.status_pgm = 4) order by pgm.data_vencimento_pgm, 
    pgm.id_pss`;

  return {
    billetInOpenDaily,
    billetInOpenMonthly,
    billetPaidDaily,
    billetPaidMonthly,
    billetPaidAndOpenDaily,
    billetPaidAndOpenMonthly,
    expiredBillet,
    expiredBilletMonthly,
  };
};
