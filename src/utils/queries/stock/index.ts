// Tipagem
import { QueryProps } from "@/types/queires";

export const StockQueries = ({
  dateInit,
  dateEnd,
  company,
  brands,
}: QueryProps) => {
  const formattedBrands = Array.isArray(brands)
    ? brands.map((brand) => `'${brand}'`).join(", ")
    : "";

  let stockByBrand = `select mrc.id_mrc AS id_marca, COALESCE(mrc.descricao_mrc, 'SEM MARCA') AS marca, 
    ale.quantidade_atual_ale * ale.preco_compra_ale AS total_valor_compra 
    FROM produtos prd 
    INNER JOIN almoxarifados_estoque ale ON ale.id_prd = prd.id_prd 
    LEFT JOIN marcas mrc ON mrc.id_mrc = prd.id_mrc 
    WHERE ale.id_alm IN (1, 2, 3, 100) 
    AND mrc.descricao_mrc IN (${formattedBrands}) 
    AND prd.status_prd = 'A' 
    ORDER BY mrc.id_mrc, mrc.descricao_mrc`;

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

  return { stockByBrand, topsProductsByBrand };
};
