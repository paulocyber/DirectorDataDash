export const enterpriseQueries = () => {
  let enterprise = `select id_emp, sigla_emp from empresas where id_emp <> 4`;

  return enterprise;
};
