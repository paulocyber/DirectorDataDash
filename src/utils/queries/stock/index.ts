// Tipagem
import { QueryProps } from "@/types/queires";

export const StockQueries = ({
  dateInit,
  dateEnd,
  company,
  brands,
  groups,
}: QueryProps) => {
  const formattedBrands = Array.isArray(brands)
    ? brands.map((brand) => `'${brand}'`).join(", ")
    : "";
  const formattedGroups = Array.isArray(groups)
    ? groups.map((group) => `'${group}'`).join(", ")
    : "";

  // let stockByBrand = `select mrc.id_mrc AS id_marca, ale.id_prd, IIF(ale.quantidade_atual_ale < 0, 0, ale.quantidade_atual_ale) AS quantidade_atual_ale, ale.PRECO_CUSTO_ALE, COALESCE(mrc.descricao_mrc, 'SEM MARCA')
  // AS marca, IIF(ale.quantidade_atual_ale < 0, 0, ale.quantidade_atual_ale) * ale.PRECO_CUSTO_ALE AS total_valor_compra FROM produtos prd INNER JOIN almoxarifados_estoque ale ON ale.id_prd = prd.id_prd LEFT JOIN
  // marcas mrc ON mrc.id_mrc = prd.id_mrc WHERE ale.id_alm IN (1) AND mrc.descricao_mrc IN (${formattedBrands}) AND prd.status_prd = 'A' ORDER BY mrc.id_mrc, mrc.descricao_mrc`;

  let stockByBrand = `select mrc.id_mrc AS id_marca, prd.id_prd, COALESCE(mrc.descricao_mrc, 'SEM MARCA') AS MARCA, ale.quantidade_atual_ale, ale.preco_custo_ale, ale.PRECO_CUSTO_ALE * ale.quantidade_atual_ale
  as total_valor_compra FROM produtos prd INNER JOIN almoxarifados_estoque ale ON ale.id_prd = prd.id_prd LEFT JOIN marcas mrc ON mrc.id_mrc = prd.id_mrc WHERE ale.id_alm in (1, 2, 3, 4, 100) AND prd.status_prd = 'A'
   AND mrc.descricao_mrc in(${formattedBrands}) ORDER BY prd.id_prd`;

  let stockByGroup = `select grp.id_grp, grp.nome_grp, SUM(ale.quantidade_atual_ale * ale.preco_compra_ale) AS total_valor_compra FROM produtos prd INNER JOIN almoxarifados_estoque ale ON ale.id_prd = prd.id_prd 
  INNER JOIN grupos_produtos grp ON grp.id_grp = prd.id_grp LEFT JOIN marcas mrc ON mrc.id_mrc = prd.id_mrc WHERE  ale.id_alm IN (1, 2, 3, 4, 5, 100) AND grp.nome_grp IN (${formattedGroups}) AND prd.status_prd = 'A' 
  GROUP BY grp.id_grp, grp.nome_grp`;

  let topsProductsByBrand = `select sdi.id_prd AS id_produto, prd.descricao_prd AS produto, 
      mrc.descricao_mrc as marca, 
      CAST(SUM(sdi.qtde_sdi * COALESCE(sdi.preco_custo_sdi, 0.00)) AS NUMERIC(15,3)) AS valor_custo, 
      SUM(sdi.valor_liquido_sdi) AS valor_liquido, 
      ale.quantidade_minima_ale, ale.quantidade_atual_ale 
      FROM saidas_itens sdi 
      INNER JOIN saidas sds ON sds.id_sds = sdi.id_sds 
      INNER JOIN produtos prd ON prd.id_prd = sdi.id_prd 
      INNER JOIN almoxarifados_estoque ale ON ale.id_prd = prd.id_prd 
      INNER JOIN v_clientes pss ON pss.id_pss = sds.id_pss 
      LEFT JOIN secoes_produtos sec ON sec.id_sec = prd.id_sec 
      LEFT JOIN grupos_produtos grp ON grp.id_grp = prd.id_grp 
      LEFT JOIN marcas mrc ON mrc.id_mrc = prd.id_mrc 
      LEFT JOIN linhas_produtos lnp ON lnp.id_lnp = prd.id_lnp 
      LEFT JOIN fornecedores_produtos frp ON (frp.id_prd = prd.id_prd AND frp.nivel_frp = 'P') 
      WHERE sdi.id_sdi > 0 
      AND sds.datahora_finalizacao_sds BETWEEN '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' 
      AND sds.tipo_sds IN ('4', '5', '9') 
      AND sds.status_sds = '2' 
      AND sdi.valor_liquido_sdi > 0 
      AND sdi.id_item_sdi > 0 
      AND sdi.produtopai_kit_sdi IS FALSE 
      AND mrc.id_mrc IN (${formattedBrands}) 
      AND ale.id_alm = sds.id_emp
      AND ale.id_alm = ${company} 
      GROUP BY sdi.id_prd, prd.codigo_prd, prd.descricao_prd, prd.referencia_prd, 
      prd.unidade_compra_prd, prd.unidade_venda_prd, sdi.id_prd || ' - ' || prd.descricao_prd, 
      prd.id_sec, sec.descricao_sec, prd.id_grp, grp.nome_grp, prd.id_mrc, mrc.descricao_mrc, 
      prd.id_lnp, lnp.descricao_lnp, ale.quantidade_minima_ale, ale.quantidade_atual_ale 
      ORDER BY SUM(sdi.qtde_sdi) DESC 
      rows 10`;

  let stockPurchases = `select prd.id_prd, prd.DESCRICAO_PRD, mrc.descricao_mrc AS marcas, SUM(vcomp.QUANTIDADE) AS QUANTIDADE, AVG(vcomp.VALOR_UNITARIO) AS VALOR_UNITARIO, SUM(vcomp.VALOR_UNITARIO * vcomp.QUANTIDADE)
  AS VALOR_FINAL FROM V_HISTORICO_COMPRA_PRODUTO vcomp INNER JOIN produtos prd ON prd.id_prd = vcomp.ID_PRD LEFT JOIN marcas mrc ON mrc.id_mrc = prd.id_mrc WHERE vcomp.ID_EMP = ${company} AND vcomp.DATA BETWEEN 
  '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' GROUP BY prd.id_prd, prd.DESCRICAO_PRD, mrc.descricao_mrc`;

  let buyHistory = `select (CASE EXTRACT(MONTH FROM vcomp.DATA) WHEN 1 THEN 'JAN' WHEN 2 THEN 'FEV' WHEN 3 THEN 'MAR' WHEN 4 THEN 'ABR' WHEN 5 THEN 'MAI' WHEN 6 THEN 'JUN' WHEN 7 THEN 'JUL' WHEN 8 THEN 'AGO' WHEN 9 
  THEN 'SET' WHEN 10 THEN 'OUT' WHEN 11 THEN 'NOV' WHEN 12 THEN 'DEZ' END || '/' || EXTRACT(YEAR FROM vcomp.DATA)) AS data, vcomp.id_prd, SUM(vcomp.quantidade * vcomp.VALOR_UNITARIO) AS entradas, AVG(
  ALE.PRECO_VENDA_ALE) AS preco_venda FROM V_HISTORICO_COMPRA_PRODUTO vcomp INNER JOIN almoxarifados_estoque ale ON ale.id_prd = vcomp.id_prd INNER JOIN almoxarifados alm ON alm.id_alm = ale.id_alm LEFT JOIN produtos
  p ON p.id_prd = vcomp.id_prd LEFT JOIN marcas mrc ON mrc.id_mrc = p.id_mrc WHERE vcomp.DATA BETWEEN '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' AND alm.tipo_alm = '1' AND mrc.descricao_mrc IN (${formattedBrands}) GROUP BY (CASE EXTRACT(MONTH FROM vcomp.DATA) WHEN 1 THEN 'JAN' WHEN 2 THEN 'FEV' WHEN 3 THEN 'MAR' WHEN 4 THEN 'ABR' WHEN 5 THEN 'MAI' WHEN 6 THEN 'JUN' WHEN 7 
  THEN 'JUL' WHEN 8 THEN 'AGO' WHEN 9 THEN 'SET' WHEN 10 THEN 'OUT' WHEN 11 THEN 'NOV' WHEN 12 THEN 'DEZ' END || '/' || EXTRACT(YEAR FROM vcomp.DATA)), vcomp.id_prd`;

  // let entriesXExits = `select data, id_prd, descricao_prd, marca, entrada, saida, custo FROM ( SELECT (CASE EXTRACT(MONTH FROM vcomp.DATA) WHEN 1 THEN 'JAN' WHEN 2 THEN 'FEV' WHEN 3 THEN 'MAR' WHEN 4 THEN 'ABR' WHEN 5
  // THEN 'MAI' WHEN 6 THEN 'JUN' WHEN 7 THEN 'JUL' WHEN 8 THEN 'AGO' WHEN 9 THEN 'SET' WHEN 10 THEN 'OUT' WHEN 11 THEN 'NOV' WHEN 12 THEN 'DEZ' END || '/' || CAST(EXTRACT(YEAR FROM vcomp.DATA) AS VARCHAR(4))) AS data,
  // vcomp.id_prd,   MAX(p.DESCRICAO_PRD) AS descricao_prd,   COALESCE(MAX(mrc.descricao_mrc), 'SEM MARCA') AS marca,  SUM(vcomp.quantidade * vcomp.VALOR_UNITARIO) AS entrada,   0 AS saida,  CAST(NULL AS NUMERIC(15,3))
  // AS CUSTO, EXTRACT(YEAR FROM vcomp.DATA) AS ano, EXTRACT(MONTH FROM vcomp.DATA) AS mes FROM V_HISTORICO_COMPRA_PRODUTO vcomp  INNER JOIN almoxarifados_estoque ale ON ale.id_prd = vcomp.id_prd  INNER JOIN almoxarifados
  // alm ON alm.id_alm = ale.id_alm  LEFT JOIN produtos p ON p.id_prd = vcomp.id_prd  LEFT JOIN marcas mrc ON mrc.id_mrc = p.id_mrc  WHERE vcomp.DATA BETWEEN DATE '${dateInit}' AND DATE '${dateEnd}' AND alm.tipo_alm = '1'
  // AND mrc.descricao_mrc IN (${formattedBrands}) GROUP BY  (CASE EXTRACT(MONTH FROM vcomp.DATA) WHEN 1 THEN 'JAN' WHEN 2 THEN 'FEV' WHEN 3 THEN 'MAR' WHEN 4 THEN 'ABR' WHEN 5
  // THEN 'MAI' WHEN 6 THEN 'JUN' WHEN 7 THEN 'JUL' WHEN 8 THEN 'AGO' WHEN 9 THEN 'SET' WHEN 10 THEN 'OUT' WHEN 11 THEN 'NOV' WHEN 12 THEN 'DEZ' END || '/' || CAST(EXTRACT(YEAR FROM vcomp.DATA) AS VARCHAR(4))),
  // vcomp.id_prd, EXTRACT(YEAR FROM vcomp.DATA), EXTRACT(MONTH FROM vcomp.DATA) UNION ALL  SELECT (CASE EXTRACT(MONTH FROM sds.DATAHORA_FINALIZACAO_SDS) WHEN 1 THEN 'JAN' WHEN 2 THEN 'FEV' WHEN 3 THEN 'MAR' WHEN 4
  // THEN 'ABR' WHEN 5 THEN 'MAI' WHEN 6 THEN 'JUN' WHEN 7 THEN 'JUL' WHEN 8 THEN 'AGO' WHEN 9 THEN 'SET' WHEN 10 THEN 'OUT' WHEN 11 THEN 'NOV' WHEN 12 THEN 'DEZ' END || '/' || CAST(EXTRACT(YEAR FROM sds.DATAHORA_FINALIZACAO_SDS)
  // AS VARCHAR(4))) AS data,  prd.id_prd,   MAX(prd.DESCRICAO_PRD) AS descricao_prd,  COALESCE(MAX(mrc.descricao_mrc), 'SEM MARCA') AS marca,  0 AS entrada,  SUM(sdi.VALOR_LIQUIDO_SDI) AS saida,
  // CAST(SUM(sdi.qtde_sdi * COALESCE(sdi.preco_custo_sdi, 0.00)) AS NUMERIC(15,3)) AS CUSTO, EXTRACT(YEAR FROM sds.DATAHORA_FINALIZACAO_SDS) AS ano, EXTRACT(MONTH FROM sds.DATAHORA_FINALIZACAO_SDS) AS mes FROM saidas
  // sds  INNER JOIN saidas_itens sdi ON sdi.id_sds = sds.id_sds  INNER JOIN produtos prd ON prd.id_prd = sdi.id_prd  INNER JOIN almoxarifados alm ON alm.id_alm = sds.id_alm  LEFT JOIN marcas mrc ON mrc.id_mrc =
  // prd.id_mrc  WHERE CAST(sds.DATAHORA_FINALIZACAO_SDS AS DATE) BETWEEN DATE '${dateInit}' AND DATE '${dateEnd}' AND sds.tipo_sds IN ('4','5','9') AND sds.status_sds = '2' AND alm.tipo_alm = '1' AND mrc.descricao_mrc
  // IN (${formattedBrands}) GROUP BY  (CASE EXTRACT(MONTH FROM sds.DATAHORA_FINALIZACAO_SDS) WHEN 1 THEN 'JAN' WHEN 2 THEN 'FEV' WHEN 3 THEN 'MAR' WHEN 4 THEN 'ABR' WHEN 5 THEN
  // 'MAI' WHEN 6 THEN 'JUN' WHEN 7 THEN 'JUL' WHEN 8 THEN 'AGO' WHEN 9 THEN 'SET' WHEN 10 THEN 'OUT' WHEN 11 THEN 'NOV' WHEN 12 THEN 'DEZ' END || '/' || CAST(EXTRACT(YEAR FROM sds.DATAHORA_FINALIZACAO_SDS) AS VARCHAR(4))),
  // prd.id_prd, EXTRACT(YEAR FROM sds.DATAHORA_FINALIZACAO_SDS), EXTRACT(MONTH FROM sds.DATAHORA_FINALIZACAO_SDS) ) final  ORDER BY ano, mes, id_prd`;

  let entriesXExits = `select CAST(mes AS VARCHAR(2)) || '/' || CAST(ano AS VARCHAR(4)) AS data, id_prd, descricao_prd, marca, entrada, saida, custo FROM ( SELECT EXTRACT(YEAR FROM vcomp.DATA) AS ano, EXTRACT(MONTH 
  FROM vcomp.DATA) AS mes, vcomp.id_prd, MAX(p.DESCRICAO_PRD) AS descricao_prd, COALESCE(MAX(mrc.descricao_mrc), 'SEM MARCA') AS marca, SUM(vcomp.quantidade * vcomp.VALOR_UNITARIO) AS entrada, 0 AS saida, NULL AS 
  custo FROM V_HISTORICO_COMPRA_PRODUTO vcomp INNER JOIN almoxarifados_estoque ale ON ale.id_prd = vcomp.id_prd INNER JOIN almoxarifados alm ON alm.id_alm = ale.id_alm LEFT JOIN produtos p ON p.id_prd = vcomp.id_prd 
  LEFT JOIN marcas mrc ON mrc.id_mrc = p.id_mrc WHERE vcomp.DATA BETWEEN DATE '${dateInit}' AND DATE '${dateEnd}' AND alm.tipo_alm = '1' AND mrc.descricao_mrc IN (${formattedBrands}) GROUP BY EXTRACT(YEAR FROM vcomp.DATA), EXTRACT(MONTH FROM vcomp.DATA), vcomp.id_prd UNION ALL SELECT EXTRACT(YEAR FROM sds.DATAHORA_FINALIZACAO_SDS) AS ano, EXTRACT(MONTH FROM sds.DATAHORA_FINALIZACAO_SDS)
  AS mes, prd.id_prd, MAX(prd.DESCRICAO_PRD) AS descricao_prd, COALESCE(MAX(mrc.descricao_mrc), 'SEM MARCA') AS marca, 0 AS entrada, SUM(sdi.VALOR_LIQUIDO_SDI) AS saida, SUM(sdi.qtde_sdi * COALESCE(
  sdi.preco_custo_sdi, 0.00)) AS custo FROM saidas sds INNER JOIN saidas_itens sdi ON sdi.id_sds = sds.id_sds INNER JOIN produtos prd ON prd.id_prd = sdi.id_prd INNER JOIN almoxarifados alm ON alm.id_alm = sds.id_alm
  LEFT JOIN marcas mrc ON mrc.id_mrc = prd.id_mrc WHERE CAST(sds.DATAHORA_FINALIZACAO_SDS AS DATE) BETWEEN DATE '${dateInit}' AND DATE '${dateEnd}' AND sds.tipo_sds IN ('4','5','9') AND sds.status_sds = '2' AND 
  alm.tipo_alm = '1' AND mrc.descricao_mrc IN (${formattedBrands}) GROUP BY EXTRACT(YEAR FROM sds.DATAHORA_FINALIZACAO_SDS), EXTRACT(MONTH FROM sds.DATAHORA_FINALIZACAO_SDS), 
  prd.id_prd ) AS final ORDER BY ano, mes, id_prd`;

  return {
    stockByBrand,
    stockByGroup,
    topsProductsByBrand,
    stockPurchases,
    buyHistory,
    entriesXExits,
  };
};
