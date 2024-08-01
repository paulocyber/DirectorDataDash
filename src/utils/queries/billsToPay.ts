// Tipagem
import { QueryProps } from "../types/queries";

export const billsToPayQueries = ({
  dataInit,
  dataEnd,
  year,
  month,
  day,
}: QueryProps) => {
  let billetInOpenMonthly = `select pgm.valor_pgm, pgm.nome_pss, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo from v_pagamentos pgm where (CAST(pgm.data_vencimento_pgm AS DATE) BETWEEN '${dataInit}' AND 
  '${dataEnd}' AND CAST(pgm.datahora_lancamento_pgm AS DATE) BETWEEN '2022-12-01' AND CURRENT_DATE) AND (pgm.status_pgm = 1 OR pgm.status_pgm = 4) order by pgm.data_vencimento_pgm, pgm.id_pss`;

  // let billetPaidMonthly = `select pgm.VALOR_PAGO_PGM, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND CAST(pgm.datahora_pagamento_pgm AS DATE)
  // BETWEEN '${dataInit}' AND '${dataEnd}' AND PGM.STATUS_PGM = 2 order by pgm.data_vencimento_pgm, pgm.id_pss`;

  let billetPaidMonthly = `select pgm.VALOR_PAGO_PGM, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo from v_pagamentos pgm where pgm.status_pgm = 2 and (CAST(pgm.datahora_pagamento_pgm AS DATE) between '${dataInit}' and '${dataEnd}') 
  order by pgm.data_vencimento_pgm, pgm.id_pss`;

  let expiredBillet = `select pgm.restante_pgm, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo from v_pagamentos pgm where (CAST(pgm.data_vencimento_pgm AS DATE) BETWEEN '${year}-01-01' AND 
  '${year}/${month}/${day}' AND CAST(pgm.datahora_lancamento_pgm AS DATE) BETWEEN '2022-12-01' AND CURRENT_DATE) AND (pgm.status_pgm = 1 OR pgm.status_pgm = 4) order by pgm.data_vencimento_pgm, pgm.id_pss`;

  let expiredBilletMonthly = `select pgm.restante_pgm, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo from v_pagamentos pgm where (CAST(pgm.data_vencimento_pgm AS DATE) BETWEEN '${dataInit}' AND 
  '${year}/${month}/${day}' AND CAST(pgm.datahora_lancamento_pgm AS DATE) BETWEEN '2022-12-01' AND CURRENT_DATE) AND (pgm.status_pgm = 1 OR pgm.status_pgm = 4) order by pgm.data_vencimento_pgm, pgm.id_pss`;

  // let billetPaidAndOpenMonthly = `select pgm.id_pgm as ID_SDS, pgm.status_pgm, pgm.data_vencimento_pgm, pgm.valor_pgm, pgm.numero_documento_pgm, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.nome_pss, pgm.id_cnt||' - '|| pgm.descricao_cnt as centro_custo,
  // pgm.descricao_frm from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) and (pgm.data_vencimento_pgm between date '${dataInit}' and date '${dataEnd}' or pgm.datahora_pagamento_pgm between date
  // '${dataInit}' and date '${dataEnd}') and pgm.status_pgm in (1, 2) order by pgm.data_vencimento_pgm, pgm.id_pss`;

  let billetPaidAndOpenMonthly = `select pgm.id_pgm as ID_SDS, pgm.status_pgm, pgm.data_vencimento_pgm, pgm.valor_pgm, pgm.numero_documento_pgm, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.nome_pss, 
  pgm.id_cnt||' - '|| pgm.descricao_cnt as centro_custo, pgm.descricao_frm from v_pagamentos pgm where (CAST(pgm.data_vencimento_pgm AS DATE) BETWEEN '${dataInit}' AND '${dataEnd}' AND CAST(pgm.datahora_lancamento_pgm 
  AS DATE) BETWEEN '2022-12-01' AND CURRENT_DATE) or pgm.datahora_pagamento_pgm between date '${dataInit}' and date '${dataEnd}' AND pgm.status_pgm in (1, 4, 2) order by pgm.data_vencimento_pgm, pgm.id_pss`;

  return {
    billetInOpenMonthly,
    billetPaidMonthly,
    expiredBillet,
    expiredBilletMonthly,
    billetPaidAndOpenMonthly,
  };
};
