export const sellersQueries = () => {
  let sellers =
    "select mti.VALOR_INDIVIDUAL_MTI, fnc.APELIDO_PSS, mti.ID_FNC, mti.ID_MTA FROM metas_vendas_itens mti LEFT JOIN v_funcionarios fnc ON fnc.id_pss = mti.id_fnc where fnc.ID_EMP in (1, 2, 3, 4) and mti.ID_MTA = 5";

    return sellers
};
