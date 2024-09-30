// Tipagem
import { QueryProps } from "@/utils/types/query";

export const goalsQueries = ({ id, surname, dateInit, month, year }: QueryProps) => {
  let storeGoals = `select mtv.VALOR_MTA from metas_vendas mtv WHERE mtv.DATA_INICIO_MTA = '${year}/${month}/01'`;

  let individualGoals = `select mti.ID_FNC, mti.VALOR_INDIVIDUAL_MTI, fnc.APELIDO_PSS FROM metas_vendas mtv LEFT JOIN metas_vendas_itens mti ON mtv.ID_MTA = mti.ID_MTA LEFT JOIN 
  v_funcionarios fnc ON fnc.id_pss = mti.ID_FNC WHERE fnc.ID_EMP IN (1, 2, 3, 4) ${surname ? `AND fnc.APELIDO_PSS like '%${surname}%'` : `and mti.ID_FNC = ${id}`} AND mtv.DATA_INICIO_MTA = 
  '${dateInit}'`;

  return { storeGoals, individualGoals };
};
