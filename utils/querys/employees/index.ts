export const employeesQueries = () => {
  let employees = `select id_pss, apelido_pss from pessoas where tipo_pss in('D') and STATUS_PSS in ('A')`;

  return employees;
};
