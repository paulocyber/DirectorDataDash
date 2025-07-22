// Tipagem
import { QueryProps } from "@/types/query";

export const StockQueries = ({
  dateInit,
  dateEnd,
  companys,
  brands,
}: QueryProps) => {
  const formattedBrands = Array.isArray(brands)
    ? brands.map((brand) => `'${brand}'`).join(", ")
    : "";

  let stockByBrand = `select mrc.id_mrc AS id_marca, prd.id_prd, COALESCE(mrc.descricao_mrc, 'SEM MARCA') AS MARCA, ale.quantidade_atual_ale, ale.preco_custo_ale, ale.PRECO_CUSTO_ALE * ale.quantidade_atual_ale
  as total_valor_compra FROM produtos prd INNER JOIN almoxarifados_estoque ale ON ale.id_prd = prd.id_prd LEFT JOIN marcas mrc ON mrc.id_mrc = prd.id_mrc WHERE ale.id_alm in (1, 2, 3, 4, 100) AND prd.status_prd = 'A'
   AND mrc.descricao_mrc in(${formattedBrands}) ORDER BY prd.id_prd`;

  return { stockByBrand };
};
