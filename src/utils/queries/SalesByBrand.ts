import { QueryProps } from "../types/queries";

export const SalesByBrand = ({ dataInit, dataEnd }: QueryProps) => {
  let salesByBrand = `select  sdi.id_prd AS id_produto, prd.descricao_prd AS produto, mrc.id_mrc as id_marca, COALESCE(mrc.descricao_mrc, 'SEM MARCA') AS marcas, grp.id_grp as id_grupo, COALESCE(grp.nome_grp, 
    'SEM GRUPO') AS grupo, sdi.preco_custo_sdi, sdi.preco_sdi, sdi.valor_bruto_sdi, ale.quantidade_atual_ale as quantidade_almox, ale.preco_custo_ale as preco_custo FROM  saidas sds INNER JOIN saidas_itens sdi ON sdi.id_sds = sds.id_sds INNER JOIN pessoas pss ON pss.id_pss = sds.id_pss INNER JOIN
    v_funcionarios_consulta fnc ON fnc.id_pss = sds.id_fnc INNER JOIN empresas emp ON emp.id_emp = sds.id_emp INNER JOIN  produtos prd ON prd.id_prd = sdi.id_prd INNER JOIN almoxarifados_estoque ale ON ale.id_prd = 
    prd.id_prd LEFT JOIN marcas mrc ON mrc.id_mrc = prd.id_mrc LEFT JOIN grupos_produtos grp ON grp.id_grp = prd.id_grp WHERE sds.datahora_finalizacao_sds BETWEEN '${dataInit} 00:00:00' AND '${dataEnd} 23:59:59' AND 
    sds.status_sds = '2' AND sds.tipo_sds IN ('4', '5', '9') and sdi.id_emp = 1 AND ale.id_alm in(1) AND prd.status_prd = 'A' and mrc.descricao_mrc in ('KIMASTER', 'INOVA', 'B-MAX', 'PEINING', 'HREBOS', 'DEVIA', 'HREBOS') ORDER BY 
    sdi.id_prd, prd.descricao_prd`;

  return salesByBrand;
};
