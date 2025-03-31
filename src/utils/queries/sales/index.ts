// Tipagem
import { QueryProps } from "@/types/queires";

export const salesQueries = ({
  dateInit,
  dateEnd,
  year,
  month,
  company,
  sellerSurname,
  idSeller,
  brands,
  groups,
}: QueryProps) => {
  const sellerFilter =
    idSeller || sellerSurname
      ? `AND (fnc.id_pss = ${idSeller ? `'${idSeller}'` : "?"} 
     OR fnc.apelido_pss LIKE ${
       sellerSurname
         ? `'%${
             sellerSurname === "mikaele"
               ? "MIKAELE SANTANA"
               : sellerSurname === "ana_carolina"
               ? "CAROLINA"
               : sellerSurname === "LUCAS V"
               ? "RODRIGUES"
               : sellerSurname
           }%'`
         : "?"
     })`
      : "";

  const formattedBrands = Array.isArray(brands)
    ? brands.map((brand) => `'${brand}'`).join(", ")
    : "";
  const formattedCompanys = Array.isArray(company)
    ? company.map((brand) => `${brand}`).join(", ")
    : "";

  const formattedGroups = Array.isArray(groups)
    ? groups.map((group) => `'${group}'`).join(", ")
    : "";

  let sales = `select fnc.apelido_pss AS vendedor, SUM(sdi.valor_liquido_sdi) AS VALOR_LIQUIDO , sum(ale.preco_custo_ale * sdi.qtde_sdi) as valor_custo,
  SUM(sdi.valor_liquido_sdi) - sum(ale.preco_custo_ale * sdi.qtde_sdi) as valor_lucro
      FROM saidas_itens sdi 
      INNER JOIN produtos prd ON prd.id_prd = sdi.id_prd 
      INNER JOIN saidas sds ON sds.id_sds = sdi.id_sds
      INNER JOIN almoxarifados_estoque ale ON ale.id_prd = sdi.id_prd AND ale.id_alm = sdi.id_alm  
      INNER JOIN v_funcionarios_consulta fnc ON fnc.id_pss = COALESCE(sdi.id_pss, sds.id_fnc)  
      INNER JOIN empresas emp ON emp.id_emp = sds.id_emp 
      LEFT JOIN fornecedores_produtos frp ON frp.id_prd = prd.id_prd AND frp.nivel_frp = 'P' 
      WHERE sds.status_sds = '2'  
      AND sds.datahora_finalizacao_sds BETWEEN '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' 
      AND sds.id_emp IN (${formattedCompanys}) 
      AND sds.tipo_sds = '4'  
      AND sdi.id_tbl IN (1, 2) 
      ${sellerFilter} 
      GROUP BY fnc.apelido_pss`;

  let commissionPerSalesPerson = `select sds.id_emp AS id_empresa, fnc.apelido_pss, COALESCE(sdi.id_pss, sds.id_fnc) as id_vendedor, fnc.apelido_pss as vendedor, CASE COALESCE(sdi.id_tbl, sds.id_tbl) WHEN 1 THEN 
  perc_comissao_ale WHEN 2 THEN perc_comissao2_ale WHEN 3 THEN perc_comissao3_ale ELSE 0.00 END AS perc_comissao, sdi.valor_liquido_sdi * CASE COALESCE(sdi.id_tbl, sds.id_tbl) WHEN 1 THEN perc_comissao_ale WHEN 2 
  THEN perc_comissao2_ale WHEN 3 THEN perc_comissao3_ale ELSE 0.00 END /100 as comissao from saidas_itens sdi inner join produtos prd on prd.id_prd = sdi.id_prd inner join saidas sds on sds.id_sds = sdi.id_sds inner 
  join almoxarifados_estoque ale on ale.id_prd = sdi.id_prd and ale.id_alm = sdi.id_alm inner join v_funcionarios_consulta fnc on fnc.id_pss = COALESCE(sdi.id_pss, sds.id_fnc) inner join empresas emp on emp.id_emp = 
  sds.id_emp left join fornecedores_produtos frp on frp.id_prd = prd.id_prd AND frp.nivel_frp = 'P' where sds.status_sds = '2' and sds.datahora_finalizacao_sds BETWEEN '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' 
  and sds.id_emp in (1, 2, 3, 4) AND sds.tipo_sds = '4' and sdi.id_tbl in (1, 2) ${sellerFilter}`;

  let topClientsPlusBuy = `select ${
    sellerSurname && idSeller ? "fnc.ID_PSS AS id_vendedor," : ""
  } pss.id_pss AS id_cliente, TRIM(pss.nome_pss) AS nome_cliente, SUM(sdi.valor_liquido_sdi) AS valor_liquido FROM saidas sds INNER JOIN saidas_itens sdi ON 
  sdi.id_sds = sds.id_sds INNER JOIN pessoas pss ON pss.id_pss = sds.id_pss INNER JOIN produtos prd ON prd.id_prd = sdi.id_prd INNER JOIN pessoas fnc ON fnc.id_pss = sds.id_fnc LEFT JOIN fornecedores_produtos frp ON
  (frp.id_prd = prd.id_prd AND frp.nivel_frp = 'P') LEFT JOIN pessoas frnc ON frnc.id_pss = frp.id_pss WHERE  sds.datahora_finalizacao_sds BETWEEN TIMESTAMP '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' AND 
  sds.TIPO_SDS IN ('4', '5', '9')  AND sds.status_sds IN ('2') AND sds.ID_EMP IN (${company}) ${sellerFilter} GROUP BY ${
    sellerSurname && idSeller ? "fnc.ID_PSS, " : ""
  } pss.id_pss, 
  TRIM(pss.nome_pss) ORDER BY valor_liquido DESC rows 10`;

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
          AND sdi.id_emp = ${company} 
          AND ale.id_alm = ${company} 
          AND prd.status_prd = 'A' 
          AND mrc.descricao_mrc in (${formattedBrands})
          ORDER BY sdi.id_prd, prd.descricao_prd`;

  let salesByGroup = `select grp.id_grp AS id_grupo, COALESCE(CASE WHEN grp.nome_grp IN ('SUA CAPA', 'CAPA ORIGINAL', 'CAPA RIGIDA LISA', 'CAPA SOFT', 'CAPA TRANSPARANTE', 'CAPAS DIVERSAS', 'CAPA RIGIDA FOSCA', 
  'CAPA REVESTIDA', 'CAPA REVESTIDA MAGSAFE', 'CAPA AVELUDADO', 'CAPA SPACE 2', 'CAPA SAPECE ACRILICA') THEN 'CAPAS'WHEN grp.nome_grp IN ('pelicula', 'fosca 3D pelicula', 'pelicula de camera', 
  'pelicula cerâmica fosca', 'pelicula ceramica fosca priv', 'pelicula 3d grossa', 'pelicula 3d privacidade', 'pelicula 3d fina', 'pelicula play up' ) THEN 'PELICULA' ELSE grp.nome_grp END, 'SEM GRUPO') AS grupo, 
  SUM(sdi.VALOR_LIQUIDO_SDI) AS valor_liquido,  SUM(sdi.valor_bruto_sdi) AS valor_bruto,  SUM(sdi.preco_custo_sdi) AS preco_custo,  SUM(ale.quantidade_atual_ale * ale.preco_compra_ale) AS total_valor_compra FROM 
  saidas sds INNER JOIN saidas_itens sdi ON sdi.id_sds = sds.id_sds INNER JOIN produtos prd ON prd.id_prd = sdi.id_prd  INNER JOIN grupos_produtos grp ON grp.id_grp = prd.id_grp INNER JOIN almoxarifados_estoque ale 
  ON ale.id_prd = prd.id_prd WHERE sds.datahora_finalizacao_sds BETWEEN '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' AND sds.status_sds = '2' AND sds.tipo_sds IN ('4', '5', '9') AND sdi.id_emp = ale.id_alm AND 
  prd.status_prd = 'A' AND grp.nome_grp IN (${formattedGroups}) GROUP BY grp.id_grp, grupo ORDER BY grp.id_grp`;

  // Querys observação possivelmente errada
  // let topSellers = `select tbv.id, tbv.vendedor, tbv.valor_total_liquido AS VALOR_LIQUIDO FROM ( SELECT sds.id_fnc AS id, fnc.apelido_pss AS vendedor, SUM(sdi.valor_liquido_sdi) AS valor_total_liquido FROM
  // saidas_itens sdi INNER JOIN saidas sds ON sds.id_sds = sdi.id_sds INNER JOIN pessoas pss ON pss.id_pss = sds.id_pss INNER JOIN pessoas fnc ON fnc.id_pss = sds.id_fnc INNER JOIN metas_vendas_itens mti ON
  // mti.id_fnc = sds.id_fnc INNER JOIN produtos prd ON sdi.id_prd = prd.id_prd INNER JOIN empresas emp ON emp.id_emp = sds.id_emp LEFT JOIN fornecedores_produtos frp ON frp.id_prd = prd.id_prd AND frp.nivel_frp = 'P'
  // LEFT JOIN v_fornecedores frn ON frn.id_pss = frp.id_pss WHERE  sdi.id_sdi IS NOT NULL  AND sds.status_sds = '2' AND sds.datahora_finalizacao_sds BETWEEN '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' AND
  // sds.tipo_sds IN ('4','5','9') AND emp.id_emp IN (1, 2, 3, 4, 5) GROUP BY sds.id_fnc, fnc.apelido_pss) tbv ORDER BY tbv.valor_total_liquido DESC`;

  let topSellers = `select fnc.id_pss, fnc.apelido_pss AS vendedor, SUM(sdi.valor_liquido_sdi) AS VALOR_LIQUIDO, SUM(ale.preco_custo_ale * sdi.qtde_sdi) AS valor_custo, SUM(sdi.valor_liquido_sdi) - SUM(ale.preco_custo_ale * 
  sdi.qtde_sdi) AS valor_lucro FROM saidas_itens sdi INNER JOIN produtos prd ON prd.id_prd = sdi.id_prd INNER JOIN saidas sds ON sds.id_sds = sdi.id_sds INNER JOIN almoxarifados_estoque ale ON ale.id_prd = sdi.id_prd
  AND ale.id_alm = sdi.id_alm INNER JOIN v_funcionarios_consulta fnc ON fnc.id_pss = COALESCE(sdi.id_pss, sds.id_fnc) LEFT JOIN ( SELECT DISTINCT ID_FNC FROM metas_vendas_itens ) mti ON mti.ID_FNC = fnc.id_pss INNER 
  JOIN empresas emp ON emp.id_emp = sds.id_emp LEFT JOIN fornecedores_produtos frp ON frp.id_prd = prd.id_prd AND frp.nivel_frp = 'P' WHERE sds.status_sds = '2' and fnc.id_pss = mti.ID_FNC  AND 
  sds.datahora_finalizacao_sds BETWEEN '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' AND sds.id_emp IN (${formattedCompanys})  AND sds.tipo_sds = '4'  AND sdi.id_tbl IN (1, 2) GROUP BY fnc.id_pss, fnc.apelido_pss ORDER BY VALOR_LIQUIDO DESC`;

  let profitsFromSale = `select lucro.id_vendedor, lucro.apelido_pss, lucro.valor_liquido, lucro.valor_lucro, COALESCE(metas.VALOR_INDIVIDUAL_MTI, '') AS meta_individual, case WHEN valor_liquido <> 0 then valor_lucro
  / valor_liquido else 0 end as margem_lucro FROM (SELECT sdi.ID_pss AS id_vendedor, fnc.apelido_pss, SUM(sdi.valor_liquido_sdi) AS valor_liquido, SUM(sdi.QTDE_SDI * sdi.preco_custo_sdi) AS valor_custo, 
  SUM(sdi.valor_liquido_sdi) - SUM(sdi.QTDE_SDI * sdi.preco_custo_sdi) AS valor_lucro FROM saidas sds INNER JOIN saidas_itens sdi ON sdi.id_sds = sds.id_sds INNER JOIN almoxarifados_estoque ale ON ale.id_alm = 
  sdi.id_emp AND ale.id_prd = sdi.id_prd INNER JOIN v_funcionarios fnc ON fnc.id_pss = sdi.id_pss WHERE sds.tipo_sds = '4' AND sdi.id_emp IN (${formattedCompanys}) AND sds.datahora_finalizacao_sds BETWEEN '${dateInit} 00:00:00'
  AND '${dateEnd} 23:59:59' AND sdi.id_emp = ale.ID_ALM GROUP BY sdi.ID_pss, fnc.apelido_pss) AS lucro INNER JOIN (SELECT mti.ID_FNC, mti.VALOR_INDIVIDUAL_MTI FROM metas_vendas mtv INNER JOIN metas_vendas_itens mti ON
  mtv.ID_MTA = mti.ID_MTA WHERE CAST(mtv.DATA_INICIO_MTA AS DATE) = '${year}/${month}/01') AS metas ON lucro.id_vendedor = metas.ID_FNC ORDER BY lucro.id_vendedor`;

  // let sellHistory = `select vhisProd.DATA, vhisProd.id_prd, prd.DESCRICAO_PRD, mrc.descricao_mrc AS marcas, SUM(vhisProd.QUANTIDADE) AS QUANTIDADE, AVG(vhisProd.VALOR_UNITARIO) AS VALOR_BRUTO,
  // AVG(vhisProd.VALOR_UNITARIO_LIQUIDO) AS VALOR_LIQUIDO, SUM(vhisProd.VALOR_UNITARIO_LIQUIDO * vhisProd.QUANTIDADE) AS VALOR_FINAL FROM v_historico_venda_produto vhisProd INNER JOIN produtos prd ON prd.id_prd =
  // vhisProd.id_prd LEFT JOIN marcas mrc ON mrc.id_mrc = prd.id_mrc WHERE vhisProd.data BETWEEN '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' AND mrc.descricao_mrc IN (${formattedBrands}) AND vhisProd.id_emp IN
  // (1, 2, 3, 4, 5, 100) GROUP BY vhisProd.DATA, vhisProd.id_prd, prd.DESCRICAO_PRD, mrc.descricao_mrc`;

  let sellHistory = `select (CASE EXTRACT(MONTH FROM sds.DATAHORA_FINALIZACAO_SDS) WHEN 1 THEN 'JAN' WHEN 2 THEN 'FEV' WHEN 3 THEN 'MAR' WHEN 4 THEN 'ABR' WHEN 5 THEN 'MAI' WHEN 6 THEN 'JUN' WHEN 7 THEN 'JUL' WHEN 8 
  THEN 'AGO' WHEN 9 THEN 'SET' WHEN 10 THEN 'OUT' WHEN 11 THEN 'NOV' WHEN 12 THEN 'DEZ' END || '/' || EXTRACT(YEAR FROM sds.DATAHORA_FINALIZACAO_SDS)) AS data, prd.id_prd, prd.DESCRICAO_PRD, mrc.descricao_mrc, 
  SUM(sdi.VALOR_LIQUIDO_SDI) AS saidas FROM saidas sds INNER JOIN saidas_itens sdi ON sdi.id_sds = sds.id_sds INNER JOIN produtos prd ON prd.id_prd = sdi.id_prd LEFT JOIN marcas mrc ON mrc.id_mrc = prd.id_mrc INNER 
  JOIN almoxarifados alm ON alm.id_alm = sds.id_alm WHERE CAST(sds.DATAHORA_FINALIZACAO_SDS AS DATE) BETWEEN '${dateInit}' AND '${dateEnd}' AND sds.tipo_sds IN ('4', '5', '9') AND sds.status_sds = '2' AND 
  alm.tipo_alm = '1' GROUP BY (CASE EXTRACT(MONTH FROM sds.DATAHORA_FINALIZACAO_SDS) WHEN 1 THEN 'JAN' WHEN 2 THEN 'FEV' WHEN 3 THEN 'MAR' WHEN 4 THEN 'ABR' WHEN 5 THEN 'MAI' WHEN 6 THEN 'JUN' WHEN 7 THEN 'JUL' WHEN 
  8 THEN 'AGO' WHEN 9 THEN 'SET' WHEN 10 THEN 'OUT' WHEN 11 THEN 'NOV' WHEN 12 THEN 'DEZ' END || '/' || EXTRACT(YEAR FROM sds.DATAHORA_FINALIZACAO_SDS)), prd.id_prd, prd.DESCRICAO_PRD, mrc.descricao_mrc rows 10`;

  return {
    sales,
    commissionPerSalesPerson,
    topClientsPlusBuy,
    SalesByBrand,
    salesByGroup,
    topSellers,
    profitsFromSale,
    sellHistory,
  };
};
