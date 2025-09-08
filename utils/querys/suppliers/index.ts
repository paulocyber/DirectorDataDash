export const suppliersQueries = () => {
  let suppliers = `select * FROM marcas mrc WHERE DESCRICAO_MRC NOT LIKE '%DISPONIVEL%'`;

  return suppliers;
};
