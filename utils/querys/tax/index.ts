// Tipagem
import { QueryProps } from "@/types/query";

export const TaxQueries = ({ dateInit, dateEnd }: QueryProps) => {
  let nfce = `select sds.id_sds, CAST(sds.datahora_emissao_sds AS DATE) datahora_emissao_sds, CAST(sds.datahora_sds AS DATE) datahora_sds, sds.numero_documento_sds, sds.valor_liquido_sds, CAST(sds.id_emp AS VARCHAR(10))
  || ' - ' || emp.sigla_emp AS EMPRESA, CAST(ftr2.formas_pagamento AS VARCHAR(400)) AS formas_pagamento FROM saidas sds INNER JOIN pessoas pss ON pss.id_pss = sds.id_pss INNER JOIN empresas emp ON emp.id_emp = 
  sds.id_emp INNER JOIN almoxarifados alm ON alm.id_alm = sds.id_alm LEFT JOIN regioes_tributarias rgt ON rgt.id_rgt = sds.id_rgt LEFT JOIN saidas vda ON vda.id_origem_sds = sds.id_sds LEFT JOIN( SELECT ftr.id_sds, 
  LIST(DISTINCT(ftr.id_frm || ' - ' || frm.descricao_frm), '; ') AS formas_pagamento FROM faturas ftr INNER JOIN formas_pagamentos frm ON frm.id_frm = ftr.id_frm GROUP BY 1 ) ftr2 ON ftr2.id_sds = sds.id_sds WHERE 
  sds.tipo_sds = '7' and sds.STATUS_SDS = '2' AND sds.id_emp IN (1,2,3,4,5,100) AND  sds.datahora_sds BETWEEN '${dateInit} 00:00:00' AND '${dateEnd} 23:59:59' ORDER BY sds.datahora_emissao_sds, sds.numero_documento_sds`;

  let nfe = `select CAST(sds.datahora_sds AS DATE) AS datahora_sds, CAST(sds.datahora_finalizacao_sds AS DATE) AS datahora_finalizacao_sds, sds.numero_documento_sds, sds.id_emp || ' - ' || emp.sigla_emp AS EMPRESA, 
  sds.valor_liquido_sds, CAST(ftr2.formas_pagamento AS VARCHAR(400)) AS formas_pagamento FROM saidas sds INNER JOIN pessoas pss ON pss.id_pss = sds.id_pss INNER JOIN empresas emp ON emp.id_emp = sds.id_emp INNER JOIN
   almoxarifados alm ON alm.id_alm = sds.id_alm LEFT JOIN regioes_tributarias rgt ON rgt.id_rgt = sds.id_rgt LEFT JOIN natureza_operacao nto ON nto.id_nto = sds.id_nto LEFT JOIN saidas vda ON vda.id_origem_sds = 
   sds.id_sds LEFT JOIN cidades cdd_dest ON cdd_dest.id_cdd = pss.id_cdd LEFT JOIN( SELECT ftr.id_sds, LIST(DISTINCT(ftr.id_frm || ' - ' || frm.descricao_frm), '; ') AS formas_pagamento FROM faturas ftr INNER JOIN 
   formas_pagamentos frm ON frm.id_frm = ftr.id_frm GROUP BY 1) ftr2 ON ftr2.id_sds = sds.id_sds WHERE sds.STATUS_SDS = 2 and sds.tipo_sds = '2' AND sds.id_emp IN (1,2,3,4,5,100)  AND sds.datahora_sds BETWEEN 
   '${dateInit}' AND '${dateEnd} 23:59:59' ORDER BY sds.datahora_sds, sds.numero_documento_sds ASC`;

  return { nfce, nfe };
};
