// Tipagem
import { QueryProps } from "@/utils/types/querys";

export const sellersQueries = ({ dateInit }: QueryProps) => {
 
  // let sellers = `select fnc.id_pss as ID_FNC, fnc.APELIDO_PSS FROM metas_vendas_itens mti left join metas_vendas mtv ON mti.ID_MTA = mtv.ID_MTA left join v_funcionarios fnc on fnc.id_pss= mti.id_fnc where mtv.DATA_INICIO_MTA = '${dateInit}'`;
  let sellers = `select fnc.id_pss as id_fnc, fnc.apelido_pss from v_funcionarios fnc where fnc.ID_GPS in (25, 1, 13, 14, 24)`;

  return sellers;
};
