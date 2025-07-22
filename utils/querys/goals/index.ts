// Tipagem
import { QueryProps } from "@/types/query";

export const goalsQueries = ({
  id,
  year,
  month,
  companys,
  sellers,
}: QueryProps) => {
  let goals = `select mtv.VALOR_MTA from metas_vendas mtv WHERE mtv.DATA_INICIO_MTA = '${year}/${month}/01' and mtv.ID_EMP in (${companys})`;

  let individualGoals = `select mti.ID_FNC, mti.VALOR_INDIVIDUAL_MTI as VALOR_MTA, fnc.APELIDO_PSS FROM metas_vendas mtv LEFT JOIN metas_vendas_itens mti ON mtv.ID_MTA = mti.ID_MTA LEFT JOIN v_funcionarios fnc ON fnc.id_pss = 
  mti.ID_FNC WHERE fnc.ID_EMP IN (1, 2, 3, 4) and (fnc.APELIDO_PSS like ${
    sellers ? `'%${sellers}%'` : "'%?%'"
  } or mti.ID_FNC = ${
    id ? `'${id}'` : "?"
  }) and mtv.DATA_INICIO_MTA = '${year}-${month}-01'`;

  return { goals, individualGoals };
};
