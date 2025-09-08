export const CostCentersQueries = () => {
  let costCenters = `select cnt.ID_CNT, cnt.DESCRICAO_CNT from centros_custos cnt  where cnt.STATUS_CNT in ('A')`;

  return costCenters;
};
