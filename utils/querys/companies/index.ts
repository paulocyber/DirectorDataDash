export const companiesQueries = () => {
  let companies = `select id_emp, sigla_emp from empresas emp where emp.STATUS_EMP in ('A')`;

  return companies;
};
