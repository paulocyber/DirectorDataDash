export const employeesQueries = () => {
  let employees = `select pss.id_pss, pss.apelido_pss from pessoas pss LEFT JOIN funcoes fcs ON fcs.id_fcs = pss.id_fcs where tipo_pss in('D') and STATUS_PSS in ('A') and fcs.DESCRICAO_FCS in ('VENDEDOR')`;

  return employees;
};
