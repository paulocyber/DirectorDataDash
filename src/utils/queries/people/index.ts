export const PeopleQueries = () => {
  let people = `select pss.ID_PSS, pss.NOME_PSS, pss.APELIDO_PSS from pessoas pss where pss.STATUS_PSS = 'A' and pss.TIPO_PSS = 'c'`;

  return people
};
