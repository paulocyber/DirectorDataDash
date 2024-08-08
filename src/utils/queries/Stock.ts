export const Stock = () => {
  let stockByBrand = `select mrc.id_mrc as id_marca, coalesce(mrc.descricao_mrc, 'SEM MARCA') as marca, ale.quantidade_atual_ale * ale.preco_compra_ale as total_valor_compra 
  from produtos prd inner join almoxarifados_estoque ale on ale.id_prd = prd.id_prd left join marcas mrc on mrc.id_mrc = prd.id_mrc where ale.id_alm in (1, 2, 3, 100) and 
  mrc.descricao_mrc in ('KIMASTER', 'INOVA', 'B-MAX', 'PEINING', 'HREBOS', 'DEVIA', 'HREBOS') and prd.status_prd = 'A' order by mrc.id_mrc, mrc.descricao_mrc`;

  let stockByGroup = `select  grp.id_grp as id_grupo, grp.nome_grp as grupo, ale.quantidade_atual_ale * ale.preco_compra_ale as total_valor_compra 
  from produtos prd  inner join almoxarifados_estoque ale on ale.id_prd = prd.id_prd  left join marcas mrc on 
  mrc.id_mrc = prd.id_mrc  left join grupos_produtos grp on grp.id_grp = prd.id_grp  left join cores crs on prd.id_crs = crs.id_crs  
  left join secoes_produtos sec on prd.id_sec = sec.id_sec  left join situacoes_tributarias_icms stc on ale.id_stc = stc.id_stc 
  left join linhas_produtos lnp on lnp.id_lnp = prd.id_lnp  left join fornecedores_produtos frp on (frp.id_prd = prd.id_prd and frp.nivel_frp = 'P')  
  left join v_fornecedores_consulta frn on frn.id_pss = frp.id_pss  where ale.id_alm =  1 and prd.status_prd = 'A' 
  AND (grp.nome_grp IN ('relogio', 'BATERIA PORTATIL', 'SMARTWATCH') OR (grp.nome_grp = 'FONE BLUETOOTH' AND 
  prd.descricao_prd LIKE '%tws%')) order by prd.id_prd, prd.descricao_prd`;

  return { stockByBrand, stockByGroup };
};
