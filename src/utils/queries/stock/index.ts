// Tipagem
import { QueryProps } from "@/utils/types/query";

export const Stock = ({ dateInit, dateEnd, emp }: QueryProps) => {
  let stockByBrand = `select mrc.id_mrc as id_marca, coalesce(mrc.descricao_mrc, 'SEM MARCA') as marca, ale.quantidade_atual_ale * ale.preco_compra_ale as total_valor_compra 
      from produtos prd inner join almoxarifados_estoque ale on ale.id_prd = prd.id_prd left join marcas mrc on mrc.id_mrc = prd.id_mrc where ale.id_alm in (1, 2, 3, 100) and 
      mrc.descricao_mrc in ('KIMASTER', 'INOVA', 'B-MAX', 'PEINING', 'HREBOS', 'DEVIA', 'HREBOS') and prd.status_prd = 'A' order by mrc.id_mrc, mrc.descricao_mrc`;

  let stockByGroup = `select  grp.id_grp as id_grupo, grp.nome_grp as grupo, ale.quantidade_atual_ale * ale.preco_compra_ale as total_valor_compra 
      from produtos prd  inner join almoxarifados_estoque ale on ale.id_prd = prd.id_prd  left join marcas mrc on 
      mrc.id_mrc = prd.id_mrc  left join grupos_produtos grp on grp.id_grp = prd.id_grp  left join cores crs on prd.id_crs = crs.id_crs  
      left join secoes_produtos sec on prd.id_sec = sec.id_sec  left join situacoes_tributarias_icms stc on ale.id_stc = stc.id_stc 
      left join linhas_produtos lnp on lnp.id_lnp = prd.id_lnp  left join fornecedores_produtos frp on (frp.id_prd = prd.id_prd and frp.nivel_frp = 'P')  
      left join v_fornecedores_consulta frn on frn.id_pss = frp.id_pss  where ale.id_alm in (1, 2, 3, 100) and prd.status_prd = 'A' 
      AND (grp.nome_grp IN ('relogio', 'BATERIA PORTATIL', 'SMARTWATCH') OR (grp.nome_grp = 'FONE BLUETOOTH' AND 
      prd.descricao_prd LIKE '%tws%')) order by prd.id_prd, prd.descricao_prd`;

  let topsProductsByBrand = `select sdi.id_prd AS id_produto, sdi.id_prd || ' - ' || prd.descricao_prd AS produto, COALESCE(prd.id_mrc || ' - ' || mrc.descricao_mrc, 'SEM MARCA') AS marca_produto, 
  CAST(SUM(sdi.qtde_sdi * COALESCE(sdi.preco_custo_sdi, 0.00)) AS NUMERIC(15,3)) AS valor_custototal_item, SUM(sdi.valor_liquido_sdi) AS valor_liquidototal_item, ale.quantidade_minima_ale, ale.quantidade_atual_ale 
  FROM saidas_itens sdi INNER JOIN saidas sds ON sds.id_sds = sdi.id_sds INNER JOIN produtos prd ON prd.id_prd = sdi.id_prd INNER JOIN almoxarifados_estoque ale ON ale.id_prd = prd.id_prd INNER JOIN v_clientes pss 
  ON pss.id_pss = sds.id_pss LEFT JOIN secoes_produtos sec ON sec.id_sec = prd.id_sec LEFT JOIN grupos_produtos grp ON grp.id_grp = prd.id_grp LEFT JOIN marcas mrc ON mrc.id_mrc = prd.id_mrc LEFT JOIN linhas_produtos
   lnp ON lnp.id_lnp = prd.id_lnp LEFT JOIN fornecedores_produtos frp ON (frp.id_prd = prd.id_prd AND frp.nivel_frp = 'P') WHERE sdi.id_sdi > 0 AND sds.datahora_finalizacao_sds BETWEEN '${dateInit} 00:00:00' AND 
  '${dateEnd} 23:59:59' AND sds.tipo_sds IN ('4', '5', '9') AND sds.status_sds = '2' AND sdi.valor_liquido_sdi > 0 AND sdi.id_item_sdi > 0 AND sdi.produtopai_kit_sdi IS FALSE AND COALESCE(prd.id_mrc || ' - ' || 
  mrc.descricao_mrc, 'SEM MARCA') = '36 - PEINING' and ale.id_alm = ${emp} GROUP BY sdi.id_prd, prd.codigo_prd, prd.descricao_prd, prd.referencia_prd, prd.unidade_compra_prd, prd.unidade_venda_prd, sdi.id_prd || ' - ' || 
  prd.descricao_prd, prd.id_sec, sec.descricao_sec, prd.id_grp, grp.nome_grp, prd.id_mrc, mrc.descricao_mrc, prd.id_lnp, lnp.descricao_lnp, ale.quantidade_minima_ale, ale.quantidade_atual_ale ORDER BY SUM(
  sdi.qtde_sdi) DESC rows 10`;

  return { stockByBrand, stockByGroup, topsProductsByBrand };
};
