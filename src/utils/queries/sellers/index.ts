// Tipagem
import { QueryProps } from "@/utils/types/querys";

export const sellersQueries = ({ dateInit }: QueryProps) => {
  // let sellers =
  //   "select mti.VALOR_INDIVIDUAL_MTI, fnc.APELIDO_PSS, mti.ID_FNC, mti.ID_MTA FROM metas_vendas_itens mti LEFT JOIN v_funcionarios fnc ON fnc.id_pss = mti.id_fnc where fnc.ID_EMP in (1, 2, 3, 4) and mti.ID_MTA = 5";
  let sellers = `select fnc.id_pss as ID_FNC, fnc.APELIDO_PSS FROM metas_vendas_itens mti left join metas_vendas mtv ON mti.ID_MTA = mtv.ID_MTA left join v_funcionarios fnc on fnc.id_pss= mti.id_fnc where mtv.DATA_INICIO_MTA = '${dateInit}'`;

  return sellers;
};
