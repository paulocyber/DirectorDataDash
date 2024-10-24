// Tipagem
import { QueryProps } from "@/types/queires";

export const salesQueries = ({
  dateInit,
  dateEnd,
  emp,
  sellersSurname,
  idSellers,
}: QueryProps) => {
  //   let sales = `select SUM(sds.valor_liquido_sds - COALESCE(sds.valor_troca_sds, 0)) AS VALOR_LIQUIDO FROM saidas sds INNER JOIN pessoas pss ON pss.id_pss = sds.id_pss INNER JOIN pessoas fnc ON fnc.id_pss = sds.id_fnc
  // INNER JOIN empresas emp ON emp.id_emp = sds.id_emp WHERE sds.id_emp in (${emp}) AND sds.datahora_finalizacao_sds BETWEEN TIMESTAMP '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' AND sds.tipo_sds IN  ('4', '5', '9') AND
  // sds.status_sds IN ('2') and (fnc.id_pss = ${
  //     idSellers ? `'${idSellers}'` : "?"
  //   } or fnc.APELIDO_PSS LIKE ${sellersSurname ? `'%${sellersSurname}%'` : "?"} )`;

  const sellerFilter =
    idSellers || sellersSurname
      ? `AND (fnc.id_pss = ${idSellers ? `'${idSellers}'` : "?"} 
     OR fnc.apelido_pss LIKE ${sellersSurname ? `'%${sellersSurname}%'` : "?"})`
      : "";

  let sales = `select fnc.apelido_pss AS vendedor, SUM(sdi.valor_liquido_sdi) AS VALOR_LIQUIDO 
      FROM saidas_itens sdi 
      INNER JOIN produtos prd ON prd.id_prd = sdi.id_prd 
      INNER JOIN saidas sds ON sds.id_sds = sdi.id_sds
      INNER JOIN almoxarifados_estoque ale ON ale.id_prd = sdi.id_prd AND ale.id_alm = sdi.id_alm  
      INNER JOIN v_funcionarios_consulta fnc ON fnc.id_pss = COALESCE(sdi.id_pss, sds.id_fnc)  
      INNER JOIN empresas emp ON emp.id_emp = sds.id_emp 
      LEFT JOIN fornecedores_produtos frp ON frp.id_prd = prd.id_prd AND frp.nivel_frp = 'P' 
      WHERE sds.status_sds = '2'  
      AND sds.datahora_finalizacao_sds BETWEEN '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' 
      AND sds.id_emp IN (${emp}) 
      AND sds.tipo_sds = '4'  
      AND sdi.id_tbl IN (1, 2) 
      ${sellerFilter} 
      GROUP BY fnc.apelido_pss`;

  let commissionPerSalesPerson = `select sds.id_emp AS id_empresa, fnc.apelido_pss, COALESCE(sdi.id_pss, sds.id_fnc) as id_vendedor, fnc.apelido_pss as vendedor, CASE COALESCE(sdi.id_tbl, sds.id_tbl) WHEN 1 THEN 
  perc_comissao_ale WHEN 2 THEN perc_comissao2_ale WHEN 3 THEN perc_comissao3_ale ELSE 0.00 END AS perc_comissao, sdi.valor_liquido_sdi * CASE COALESCE(sdi.id_tbl, sds.id_tbl) WHEN 1 THEN perc_comissao_ale WHEN 2 
  THEN perc_comissao2_ale WHEN 3 THEN perc_comissao3_ale ELSE 0.00 END /100 as comissao from saidas_itens sdi inner join produtos prd on prd.id_prd = sdi.id_prd inner join saidas sds on sds.id_sds = sdi.id_sds inner 
  join almoxarifados_estoque ale on ale.id_prd = sdi.id_prd and ale.id_alm = sdi.id_alm inner join v_funcionarios_consulta fnc on fnc.id_pss = COALESCE(sdi.id_pss, sds.id_fnc) inner join empresas emp on emp.id_emp = 
  sds.id_emp left join fornecedores_produtos frp on frp.id_prd = prd.id_prd AND frp.nivel_frp = 'P' where sds.status_sds = '2' and sds.datahora_finalizacao_sds BETWEEN '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' 
  and sds.id_emp in (1, 2, 3) AND sds.tipo_sds = '4' and sdi.id_tbl in (1, 2) and fnc.apelido_pss like '%${sellersSurname}%'`;

  let topClientsPlusBuy = `select ${
    sellersSurname && idSellers ? "fnc.ID_PSS AS id_vendedor," : ""
  } pss.id_pss AS id_cliente, TRIM(pss.nome_pss) AS nome_cliente, SUM(sdi.valor_liquido_sdi) AS valor_liquido FROM saidas sds INNER JOIN saidas_itens sdi ON 
  sdi.id_sds = sds.id_sds INNER JOIN pessoas pss ON pss.id_pss = sds.id_pss INNER JOIN produtos prd ON prd.id_prd = sdi.id_prd INNER JOIN pessoas fnc ON fnc.id_pss = sds.id_fnc LEFT JOIN fornecedores_produtos frp ON
  (frp.id_prd = prd.id_prd AND frp.nivel_frp = 'P') LEFT JOIN pessoas frnc ON frnc.id_pss = frp.id_pss WHERE  sds.datahora_finalizacao_sds BETWEEN TIMESTAMP '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' AND 
  sds.TIPO_SDS IN ('4', '5', '9')  AND sds.status_sds IN ('2') AND sds.ID_EMP IN (${emp}) ${
    sellersSurname ? `AND fnc.APELIDO_PSS LIKE '%${sellersSurname}%'` : ""
  } ${idSellers ? `AND fnc.ID_PSS = '${idSellers}'` : ""} GROUP BY ${
    sellersSurname && idSellers ? "fnc.ID_PSS, " : ""
  } pss.id_pss, TRIM(pss.nome_pss) ORDER BY valor_liquido DESC rows 10`;

  let SalesByBrand = `select sdi.id_prd AS id_produto, prd.descricao_prd AS produto, mrc.id_mrc AS id_marca, 
            COALESCE(mrc.descricao_mrc, 'SEM MARCA') AS marcas, grp.id_grp AS id_grupo, 
            COALESCE(grp.nome_grp, 'SEM GRUPO') AS grupo, sdi.preco_custo_sdi, sdi.preco_sdi, 
            sdi.valor_bruto_sdi, ale.quantidade_atual_ale AS quantidade_almox, ale.preco_custo_ale AS preco_custo 
          FROM saidas sds 
          INNER JOIN saidas_itens sdi ON sdi.id_sds = sds.id_sds 
          INNER JOIN produtos prd ON prd.id_prd = sdi.id_prd 
          LEFT JOIN marcas mrc ON mrc.id_mrc = prd.id_mrc 
          LEFT JOIN grupos_produtos grp ON grp.id_grp = prd.id_grp 
          INNER JOIN almoxarifados_estoque ale ON ale.id_prd = prd.id_prd 
          WHERE sds.datahora_finalizacao_sds BETWEEN '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' 
          AND sds.status_sds = '2' 
          AND sds.tipo_sds IN ('4', '5', '9') 
          AND sdi.id_emp = ${emp} 
          AND ale.id_alm = ${emp} 
          AND prd.status_prd = 'A' 
          AND mrc.descricao_mrc IN ('KIMASTER', 'INOVA', 'B-MAX', 'PEINING', 'HREBOS', 'DEVIA', 'HREBOS') 
          ORDER BY sdi.id_prd, prd.descricao_prd`;

  let salesByGroup = `select sdi.id_prd AS id_produto, prd.descricao_prd AS produto, mrc.id_mrc AS id_marca, 
          COALESCE(mrc.descricao_mrc, 'SEM MARCA') AS marcas, grp.id_grp AS id_grupo, 
          COALESCE(grp.nome_grp, 'SEM GRUPO') AS grupo, sdi.preco_custo_sdi, sdi.preco_sdi, 
          sdi.valor_bruto_sdi, ale.quantidade_atual_ale AS quantidade_almox, ale.preco_custo_ale AS preco_custo 
        FROM saidas sds 
        INNER JOIN saidas_itens sdi ON sdi.id_sds = sds.id_sds 
        INNER JOIN produtos prd ON prd.id_prd = sdi.id_prd 
        LEFT JOIN marcas mrc ON mrc.id_mrc = prd.id_mrc 
        LEFT JOIN grupos_produtos grp ON grp.id_grp = prd.id_grp 
        INNER JOIN almoxarifados_estoque ale ON ale.id_prd = prd.id_prd 
        WHERE sds.datahora_finalizacao_sds BETWEEN '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' 
        AND sds.status_sds = '2' 
        AND sds.tipo_sds IN ('4', '5', '9') 
        AND sdi.id_emp in (1, 2, 3) 
        AND ale.id_alm in (1, 2, 3) 
        AND prd.status_prd = 'A' 
        AND (grp.nome_grp IN ('relogio', 'BATERIA PORTATIL', 'SMARTWATCH') OR (grp.nome_grp = 'FONE BLUETOOTH' AND prd.descricao_prd LIKE '%tws%')) 
        ORDER BY sdi.id_prd, prd.descricao_prd`;

  let topSellers = `select tbv.id, tbv.vendedor, tbv.valor_total_liquido as VALOR_LIQUIDO from ( select sds.id_fnc as id, fnc.apelido_pss as vendedor, sum(sdi.valor_liquido_sdi) as valor_total_liquido from saidas_itens sdi inner 
  join saidas sds on sds.id_sds = sdi.id_sds inner join pessoas pss on pss.id_pss = sds.id_pss inner join pessoas fnc on fnc.id_pss = sds.id_fnc inner join produtos prd on sdi.id_prd = prd.id_prd inner join empresas 
  emp on emp.id_emp = sds.id_emp left join fornecedores_produtos frp on (frp.id_prd = prd.id_prd and frp.nivel_frp = 'P') left join v_fornecedores frn on frn.id_pss = frp.id_pss where sdi.id_sdi is not null and 
  sds.status_sds = '2' and sds.datahora_finalizacao_sds between '${dateInit} 00:00:00' and '${dateEnd} 23:59:59' and sds.tipo_sds in ('4','5','9') and emp.id_emp = ${emp} group by 1, 2) tbv order by tbv.valor_total_liquido
  desc rows 10`;

  return {
    sales,
    commissionPerSalesPerson,
    topClientsPlusBuy,
    topSellers,
    SalesByBrand,
    salesByGroup,
  };
};
