export const Stock = () => {
  let stock = `select mrc.id_mrc as id_marca, coalesce(mrc.descricao_mrc, 'SEM MARCA') as marca, ale.quantidade_atual_ale * ale.preco_compra_ale as total_valor_compra 
  from produtos prd inner join almoxarifados_estoque ale on ale.id_prd = prd.id_prd left join marcas mrc on mrc.id_mrc = prd.id_mrc where ale.id_alm in (1, 2, 3, 100) and 
  mrc.descricao_mrc in ('KIMASTER', 'INOVA', 'B-MAX', 'PEINING', 'HREBOS', 'DEVIA', 'HREBOS') and prd.status_prd = 'A' order by mrc.id_mrc, mrc.descricao_mrc`;

  return stock;
};
