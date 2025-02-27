// Tipagem
import { QueryProps } from "@/types/queires";

export const billsToPayQueries = ({
  dateInit,
  dateEnd,
  year,
  brands,
}: QueryProps) => {
  const formattedBrands = Array.isArray(brands)
    ? brands.map((brand) => `'${brand}'`).join(", ")
    : "";

  // let allBillet = `select pgm.id_pgm AS ID_SDS, pgm.status_pgm, pgm.data_vencimento_pgm, pgm.valor_pgm, pgm.VALOR_PAGO_PGM, pgm.numero_documento_pgm, pgm.id_grc || ' - ' || pgm.descricao_grc AS
  // grupo_centro, pgm.nome_pss, pgm.id_cnt || ' - ' || pgm.descricao_cnt AS centro_custo, pgm.descricao_frm FROM v_pagamentos pgm WHERE ((CAST(pgm.data_vencimento_pgm AS DATE) BETWEEN
  // '${dateInit}' AND '${dateEnd}' AND CAST(pgm.datahora_lancamento_pgm AS DATE) BETWEEN '2022-12-01' AND CURRENT_DATE AND pgm.status_pgm IN (1, 4)) OR (pgm.datahora_pagamento_pgm BETWEEN
  // DATE '${dateInit}' AND DATE '${dateEnd}' AND pgm.status_pgm = 2)) AND pgm.id_emp in(1, 2, 3, 4, 5, 100 ) ORDER BY pgm.data_vencimento_pgm`;

  let allBillet = `select pgm.id_pgm AS ID_SDS, pgm.status_pgm, pgm.data_vencimento_pgm, pgm.valor_pgm, pgm.VALOR_PAGO_PGM, pgm.numero_documento_pgm, pgm.id_grc || ' - ' || pgm.descricao_grc AS grupo_centro, 
  pgm.nome_pss, pgm.id_cnt || ' - ' || pgm.descricao_cnt AS centro_custo, COALESCE(frm.descricao_frm, pgm.descricao_frm) AS descricao_frm FROM v_pagamentos pgm LEFT JOIN pagamentos_itens pgi ON pgi.id_pgm = 
  pgm.id_pgm LEFT JOIN formas_pagamentos frm ON frm.id_frm = pgi.ID_FRM WHERE ((CAST(pgm.data_vencimento_pgm AS DATE) BETWEEN '${dateInit}' AND '${dateEnd}' AND CAST(pgm.datahora_lancamento_pgm AS DATE) BETWEEN 
  '2022-12-01' AND CURRENT_DATE AND pgm.status_pgm IN (1))OR (pgm.datahora_pagamento_pgm BETWEEN DATE '${dateInit}' AND DATE '${dateEnd}' AND pgm.status_pgm IN (2, 4)) ) AND pgm.id_emp IN (1, 2, 3, 4, 5, 100) ORDER BY 
  pgm.data_vencimento_pgm`;

  let billetPaid = `select  pgm.id_pgm AS ID_SDS, pgm.status_pgm, pgm.data_vencimento_pgm, pgm.valor_pgm, pgm.VALOR_PAGO_PGM, pgm.numero_documento_pgm, pgm.id_grc || ' - ' || pgm.descricao_grc AS grupo_centro, 
  pgm.nome_pss, pgm.id_cnt || ' - ' || pgm.descricao_cnt AS centro_custo, LIST(DISTINCT COALESCE(frm.descricao_frm, pgm.descricao_frm)) AS descricao_frm, pgm.id_pss FROM v_pagamentos pgm LEFT JOIN pagamentos_itens 
  pgi ON pgi.id_pgm = pgm.id_pgm LEFT JOIN formas_pagamentos frm ON frm.id_frm = pgi.ID_FRM WHERE  (CAST(pgm.datahora_pagamento_pgm AS DATE) BETWEEN '${dateInit}' AND '${dateEnd}') AND 
  (CAST(pgm.datahora_lancamento_pgm AS DATE) BETWEEN '2022-12-01' AND CURRENT_DATE) AND (pgm.status_pgm = 2 OR pgm.status_pgm = 4) AND pgm.id_emp IN (1, 2, 3, 4, 5, 100) GROUP BY  pgm.id_pgm, pgm.status_pgm, 
  pgm.data_vencimento_pgm, pgm.valor_pgm, pgm.VALOR_PAGO_PGM, pgm.numero_documento_pgm, pgm.id_grc, pgm.descricao_grc, pgm.nome_pss, pgm.id_cnt, pgm.descricao_cnt, pgm.id_pss ORDER BY pgm.data_vencimento_pgm, 
  pgm.id_pss`;

  let expiredBillet = `select pgm.restante_pgm, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo from v_pagamentos pgm where (CAST(pgm.data_vencimento_pgm AS DATE) BETWEEN '${dateInit}' AND 
  '${dateEnd}' AND CAST(pgm.datahora_lancamento_pgm AS DATE) BETWEEN '2022-12-01' AND CURRENT_DATE) AND (pgm.status_pgm = 1 OR pgm.status_pgm = 4) AND pgm.id_emp in(1, 2, 3, 4, 5, 100 ) order by pgm.data_vencimento_pgm, pgm.id_pss`;

  let debtBySuppliers = `select CASE WHEN pgm.apelido_pss IN ('BASIC INOVA', 'INOVA HENRIQUE', 'INOVA COMPRA DE MERCADORIA', 'ITO INOVA', 'LEANDRO INOVA', 'MIA', 'TOMY INOVA')  THEN UPPER('inova') ELSE 
  pgm.apelido_pss  END AS apelido_pss, SUM(pgm.restante_pgm) AS valor_pgm  FROM v_pagamentos pgm WHERE  CAST(pgm.datahora_lancamento_pgm AS DATE) BETWEEN '2023-01-01' AND '${year}-12-31'  AND (pgm.status_pgm = 1 OR 
  pgm.status_pgm = 4)  AND pgm.apelido_pss IN (${formattedBrands}) 
  AND pgm.id_emp IN (1, 2, 3, 4, 5, 100)  GROUP BY  CASE WHEN pgm.apelido_pss IN ('BASIC INOVA', 'INOVA HENRIQUE', 'INOVA COMPRA DE MERCADORIA', 'ITO INOVA', 'LEANDRO INOVA', 'MIA', 'TOMY INOVA') THEN UPPER('inova') ELSE 
  pgm.apelido_pss END ORDER BY apelido_pss`;

  let buyBySuppliers = `select CASE WHEN pgm.apelido_pss IN ('BASIC INOVA', 'INOVA HENRIQUE', 'INOVA COMPRA DE MERCADORIA', 'ITO INOVA', 'LEANDRO INOVA', 'MIA', 'TOMY INOVA')  THEN UPPER('inova') ELSE pgm.apelido_pss
  END AS apelido_pss, SUM(pgm.valor_pgm) AS valor_pgm  FROM v_pagamentos pgm WHERE  CAST(pgm.datahora_lancamento_pgm AS DATE) BETWEEN '${dateInit}' AND '${dateEnd}'  AND (pgm.status_pgm = 2  OR pgm.status_pgm = 4)  
  AND pgm.apelido_pss IN (${formattedBrands}) AND pgm.id_emp IN (1, 2, 3, 4, 5, 100)  GROUP BY  CASE WHEN pgm.apelido_pss IN ('BASIC INOVA', 'INOVA HENRIQUE', 'INOVA COMPRA DE MERCADORIA', 'ITO INOVA', 'LEANDRO INOVA',
  'MIA', 'TOMY INOVA') THEN UPPER('inova') ELSE pgm.apelido_pss END ORDER BY apelido_pss`;

  return {
    allBillet,
    billetPaid,
    expiredBillet,
    debtBySuppliers,
    buyBySuppliers,
  };
};
