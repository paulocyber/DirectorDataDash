// Tipagem
import { QueryProps } from "@/types/queires";

export const goalsQueries = ({
  idSeller,
  sellerSurname,
  month,
  year,
  company,
}: QueryProps) => {
  let storeGoals = `select mtv.VALOR_MTA from metas_vendas mtv WHERE mtv.DATA_INICIO_MTA = '${year}/${month}/01' and mtv.ID_EMP in (${company})`;

  let individualGoals = `select mti.ID_FNC, mti.VALOR_INDIVIDUAL_MTI, fnc.APELIDO_PSS FROM metas_vendas mtv LEFT JOIN metas_vendas_itens mti ON mtv.ID_MTA = mti.ID_MTA LEFT JOIN v_funcionarios fnc ON fnc.id_pss = 
  mti.ID_FNC WHERE fnc.ID_EMP IN (1, 2, 3, 4) and (fnc.APELIDO_PSS like ${
    sellerSurname ? `'%${sellerSurname}%'` : "'%?%'"
  } or mti.ID_FNC = ${
    idSeller ? `'${idSeller}'` : "?"
  }) and mtv.DATA_INICIO_MTA = '${year}-${month}-01'`;

  return { storeGoals, individualGoals };
};
