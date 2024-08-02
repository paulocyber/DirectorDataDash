import { QueryProps } from "../types/queries";

export const SalesByBrand = ({ dataInit, dataEnd, emp }: QueryProps) => {
  return `select sdi.id_prd AS id_produto, prd.descricao_prd AS produto, mrc.id_mrc AS id_marca, 
            COALESCE(mrc.descricao_mrc, 'SEM MARCA') AS marcas, grp.id_grp AS id_grupo, 
            COALESCE(grp.nome_grp, 'SEM GRUPO') AS grupo, sdi.preco_custo_sdi, sdi.preco_sdi, 
            sdi.valor_bruto_sdi, ale.quantidade_atual_ale AS quantidade_almox, ale.preco_custo_ale AS preco_custo 
          FROM saidas sds 
          INNER JOIN saidas_itens sdi ON sdi.id_sds = sds.id_sds 
          INNER JOIN produtos prd ON prd.id_prd = sdi.id_prd 
          LEFT JOIN marcas mrc ON mrc.id_mrc = prd.id_mrc 
          LEFT JOIN grupos_produtos grp ON grp.id_grp = prd.id_grp 
          INNER JOIN almoxarifados_estoque ale ON ale.id_prd = prd.id_prd 
          WHERE sds.datahora_finalizacao_sds BETWEEN '${dataInit} 00:00:00' AND '${dataEnd} 23:59:59' 
          AND sds.status_sds = '2' 
          AND sds.tipo_sds IN ('4', '5', '9') 
          AND sdi.id_emp = ${emp} 
          AND ale.id_alm = ${emp} 
          AND prd.status_prd = 'A' 
          AND mrc.descricao_mrc IN ('KIMASTER', 'INOVA', 'B-MAX', 'PEINING', 'HREBOS', 'DEVIA', 'HREBOS') 
          ORDER BY sdi.id_prd, prd.descricao_prd`;
};
