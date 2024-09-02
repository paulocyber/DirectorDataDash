// Tipagem
import { QueryProps } from "@/utils/types/querys";

export const goalsQueries = ({ id }: QueryProps) => {
  let storeGoals = `select mtv.VALOR_MTA from metas_vendas mtv where mtv.ID_MTA = 5`;

  let individualGoals = `select mti.VALOR_INDIVIDUAL_MTI, fnc.APELIDO_PSS, mti.ID_FNC, mti.ID_MTA FROM metas_vendas_itens mti LEFT JOIN v_funcionarios fnc ON fnc.id_pss = mti.id_fnc where fnc.ID_EMP in (1, 2, 3, 4) 
  and mti.ID_MTA = 5 and mti.ID_FNC = ${id}`;

  return { storeGoals, individualGoals };
};
