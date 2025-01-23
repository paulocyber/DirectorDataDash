export const PeopleQueries = () => {
  let people = `select pss.ID_PSS, pss.NOME_PSS, pss.APELIDO_PSS from pessoas pss where pss.STATUS_PSS = 'A' and pss.TIPO_PSS = 'c'`;

  return people
};


export const employeesQueries = () => {
  let employees = `select fnc.ID_PSS, fnc.NOME_PSS, fnc.APELIDO_PSS from v_funcionarios fnc` 

  return employees
}