export const goalsQueries = () => {
  let goals = `select mtv.VALOR_MTA from metas_vendas mtv where mtv.ID_MTA = 5`;

  return goals;
};
