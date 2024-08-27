// Tipagem
import { QueryProps } from "@/utils/types/querys";

export const salesQueries = ({
  dateInit,
  dateEnd,
  emp,
  sellers,
}: QueryProps) => {
  let sales = `select dvd.empresa, dvd.id_vendedor, dvd.vendedor, dvd.comissao, dvd.qtde_vendas, dvd.valor_bruto, dvd.valor_desconto, dvd.valor_troca, dvd.valor_cancelamento, dvd.valor_liquido, dvd.bc_comissao, 
  IIF(dvd.bc_comissao > 0, CAST(((CAST(bc_comissao AS NUMERIC(15,3)) * dvd.comissao) / 100) AS NUMERIC(15,2)), 0.00) AS valor_comissao from (select empresa, id_vendedor, vendedor, comissao, SUM(qtde_vendas) AS 
  qtde_vendas, SUM(valor_bruto) AS valor_bruto, SUM(valor_desconto) AS valor_desconto, SUM(valor_troca) AS valor_troca, SUM(valor_cancelamento) AS valor_cancelamento, SUM(valor_liquido - valor_troca) AS valor_liquido,
  SUM(valor_liquido - valor_troca - valor_cancelamento) AS bc_comissao from (select sds.id_emp || ' - ' || emp.sigla_emp AS empresa, sds.id_fnc AS id_vendedor, sds.id_fnc || ' - ' || COALESCE(fnc.apelido_pss, fnc.nome_pss)
  AS vendedor, COALESCE(fnc.comissao_pss, 0) AS comissao, COALESCE(count(sds.id_sds), 0) AS qtde_vendas, SUM(sds.valor_bruto_sds) AS valor_bruto, COALESCE(SUM(sds.valor_desconto_sds), 0) AS valor_desconto, 
  CAST(0 AS NUMERIC(15,6)) AS valor_troca, CAST(0 AS NUMERIC(15,6)) valor_cancelamento, SUM(sds.valor_liquido_sds) AS valor_liquido from saidas sds INNER JOIN v_funcionarios fnc ON fnc.id_pss = sds.id_fnc 
  INNER JOIN empresas emp ON emp.id_emp = sds.id_emp where sds.status_sds = '2' AND sds.datahora_finalizacao_sds BETWEEN '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' AND sds.id_emp = ${emp} AND COALESCE( 
  fnc.comissao_pss, 0) > 0 AND sds.tipo_sds = '4' GROUP BY 1, 2, 3, 4 UNION ALL select sds.id_emp || ' - ' || emp.sigla_emp AS empresa, sds.id_fnc AS id_vendedor, sds.id_fnc || ' - ' || COALESCE(fnc.apelido_pss, 
  fnc.nome_pss) AS vendedor, COALESCE(fnc.comissao_pss, 0) AS comissao, 0 qtde_vendas, CAST(0 AS NUMERIC(15,6)) AS valor_bruto, CAST(0 AS NUMERIC(15,6)) AS valor_desconto, CAST(0 AS NUMERIC(15,6)) AS valor_troca, 
  SUM(sds.valor_liquido_sds - COALESCE(sds.valor_troca_sds, 0)) AS valor_cancelamento, CAST(0 AS NUMERIC(15,6)) valor_liquido from saidas sds INNER JOIN v_funcionarios fnc ON fnc.id_pss = sds.id_fnc INNER JOIN 
  empresas emp ON emp.id_emp = sds.id_emp where sds.status_sds = '3' AND sds.datahora_cancelamento_sds between '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' AND sds.datahora_finalizacao_sds < '${dateInit} 00:00:00' 
  AND sds.id_emp = ${emp} AND COALESCE(fnc.comissao_pss, 0) > 0 AND sds.tipo_sds = '4' GROUP BY 1, 2, 3, 4 UNION ALL select trc.id_emp || ' - ' || emp.sigla_emp AS empresa, trc.id_fnc AS id_vendedor, 
  trc.id_fnc || ' - ' || COALESCE(fnc.apelido_pss, fnc.nome_pss) AS vendedor, COALESCE(fnc.comissao_pss, 0) AS comissao, 0 qtde_vendas, CAST(0 AS NUMERIC(15,6)) valor_bruto_, CAST(0 AS NUMERIC(15,6)) AS 
  valor_desconto, SUM(tri.total_liquido_tri) AS valor_troca, CAST(0 AS NUMERIC(15,6)) AS valor_cancelamento, CAST(0 AS NUMERIC(15,6)) valor_liquido from trocas_devolucoes_itens tri INNER JOIN trocas_devolucoes trc 
  ON trc.id_trc = tri.id_trc INNER JOIN empresas emp ON emp.id_emp = trc.id_emp INNER JOIN v_funcionarios fnc ON fnc.id_pss = trc.id_fnc where trc.status_trc = '2'  AND trc.datahora_finalizacao_trc between '${dateInit} 00:00:00'
  AND '${dateEnd} 23:59:59' AND trc.id_emp = ${emp} AND COALESCE(fnc.comissao_pss, 0) > 0 GROUP BY 1, 2, 3, 4) vda GROUP BY 1, 2, 3, 4) dvd ${
    sellers ? `where dvd.id_vendedor = ${sellers}` : ""
  } ORDER BY empresa, vendedor`;

  return sales;
};
