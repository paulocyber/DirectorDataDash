// Tipagem
import { QueryProps } from "@/utils/types/querys";

export const salesQueries = ({
  dateInit,
  dateEnd,
  emp,
  sellers,
  surname,
}: QueryProps) => {
  let commissionPerSalesPerson = `select IIF(dvd.bc_comissao > 0, CAST(((CAST(bc_comissao AS NUMERIC(15,3)) * dvd.comissao) / 100) AS NUMERIC(15,2)), 0.00) AS valor_comissao from (select empresa, id_vendedor, vendedor, comissao,
   SUM(qtde_vendas) AS qtde_vendas, SUM(valor_bruto) AS valor_bruto, SUM(valor_desconto) AS valor_desconto, SUM(valor_troca) AS valor_troca, SUM(valor_cancelamento) AS valor_cancelamento, SUM(valor_liquido - valor_troca) 
   AS valor_liquido, SUM(valor_liquido - valor_troca - valor_cancelamento) AS bc_comissao from (select sds.id_emp || ' - ' || emp.sigla_emp AS empresa, sds.id_fnc AS id_vendedor, COALESCE(fnc.apelido_pss, fnc.nome_pss) 
   AS vendedor, COALESCE(fnc.comissao_pss, 0) AS comissao, COALESCE(count(sds.id_sds), 0) AS qtde_vendas, SUM(sds.valor_bruto_sds) AS valor_bruto, COALESCE(SUM(sds.valor_desconto_sds), 0) AS valor_desconto, 
   CAST(0 AS NUMERIC(15,6)) AS valor_troca, CAST(0 AS NUMERIC(15,6)) AS valor_cancelamento, SUM(sds.valor_liquido_sds) AS valor_liquido from saidas sds INNER JOIN v_funcionarios fnc ON fnc.id_pss = sds.id_fnc 
   INNER JOIN empresas emp ON emp.id_emp = sds.id_emp where sds.status_sds = '2' AND sds.datahora_finalizacao_sds BETWEEN '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' AND sds.id_emp = 1 AND 
   COALESCE(fnc.comissao_pss, 0) > 0 AND sds.tipo_sds = '4' GROUP BY 1, 2, 3, 4 UNION ALL select sds.id_emp || ' - ' || emp.sigla_emp AS empresa, sds.id_fnc AS id_vendedor, sds.id_fnc || ' - ' || 
   COALESCE(fnc.apelido_pss, fnc.nome_pss) AS vendedor, COALESCE(fnc.comissao_pss, 0) AS comissao, 0 AS qtde_vendas, CAST(0 AS NUMERIC(15,6)) AS valor_bruto, CAST(0 AS NUMERIC(15,6)) AS valor_desconto, 
   CAST(0 AS NUMERIC(15,6)) AS valor_troca, SUM(sds.valor_liquido_sds - COALESCE(sds.valor_troca_sds, 0)) AS valor_cancelamento, CAST(0 AS NUMERIC(15,6)) AS valor_liquido from saidas sds INNER JOIN v_funcionarios 
   fnc ON fnc.id_pss = sds.id_fnc INNER JOIN empresas emp ON emp.id_emp = sds.id_emp where sds.status_sds = '3' AND sds.datahora_cancelamento_sds between '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' AND 
   sds.datahora_finalizacao_sds < '${dateInit} 00:00:00' AND sds.id_emp = 1 AND COALESCE(fnc.comissao_pss, 0) > 0 AND sds.tipo_sds = '4' GROUP BY 1, 2, 3, 4 UNION ALL select trc.id_emp || ' - ' || emp.sigla_emp AS 
   empresa, trc.id_fnc AS id_vendedor, trc.id_fnc || ' - ' || COALESCE(fnc.apelido_pss, fnc.nome_pss) AS vendedor, COALESCE(fnc.comissao_pss, 0) AS comissao, 0 AS qtde_vendas, CAST(0 AS NUMERIC(15,6)) AS valor_bruto,
    CAST(0 AS NUMERIC(15,6)) AS valor_desconto, SUM(tri.total_liquido_tri) AS valor_troca, CAST(0 AS NUMERIC(15,6)) AS valor_cancelamento, CAST(0 AS NUMERIC(15,6)) AS valor_liquido from trocas_devolucoes_itens tri 
    INNER JOIN trocas_devolucoes trc ON trc.id_trc = tri.id_trc INNER JOIN empresas emp ON emp.id_emp = trc.id_emp INNER JOIN v_funcionarios fnc ON fnc.id_pss = trc.id_fnc where trc.status_trc = '2' AND 
    trc.datahora_finalizacao_trc between '${dateInit} 00:00:00' AND '${dateInit} 23:59:59' AND trc.id_emp = ${emp} AND COALESCE(fnc.comissao_pss, 0) > 0 GROUP BY 1, 2, 3, 4) vda GROUP BY 1, 2, 3, 4) dvd where 
    dvd.vendedor = '${surname}' ORDER BY empresa, vendedor`;

  let sales = `select SUM(sds.valor_liquido_sds - COALESCE(sds.valor_troca_sds, 0)) AS VALOR_LIQUIDO FROM saidas sds INNER JOIN pessoas pss ON pss.id_pss = sds.id_pss INNER JOIN pessoas fnc ON fnc.id_pss = 
sds.id_fnc INNER JOIN empresas emp ON emp.id_emp = sds.id_emp WHERE sds.id_emp = ${emp} AND sds.datahora_finalizacao_sds BETWEEN TIMESTAMP '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' AND sds.tipo_sds IN 
('4', '5', '9') AND sds.status_sds IN ('2') ${
    sellers ? `and fnc.id_pss = ${sellers}` : ""
  } ${surname ? `and fnc.apelido_pss = '${surname}'` : ""}`;

  let topTenSellers = `select tbv.id, tbv.vendedor, tbv.valor_total_liquido from ( select sds.id_fnc as id, fnc.apelido_pss as vendedor, sum(sdi.valor_liquido_sdi) as valor_total_liquido from saidas_itens sdi inner 
  join saidas sds on sds.id_sds = sdi.id_sds inner join pessoas pss on pss.id_pss = sds.id_pss inner join pessoas fnc on fnc.id_pss = sds.id_fnc inner join produtos prd on sdi.id_prd = prd.id_prd inner join empresas 
  emp on emp.id_emp = sds.id_emp left join fornecedores_produtos frp on (frp.id_prd = prd.id_prd and frp.nivel_frp = 'P') left join v_fornecedores frn on frn.id_pss = frp.id_pss where sdi.id_sdi is not null and 
  sds.status_sds = '2' and sds.datahora_finalizacao_sds between '${dateInit} 00:00:00' and '${dateEnd} 23:59:59' and sds.tipo_sds in ('4','5','9') and emp.id_emp = ${emp} group by 1, 2) tbv order by tbv.valor_total_liquido
  desc rows 10`;

  return { sales, topTenSellers, commissionPerSalesPerson };
};
