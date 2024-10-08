export const suppliersQuery = () => {
  let suppliers = `select fnc.ID_PSS, CASE WHEN fnc.NOME_PSS IS NOT NULL AND fnc.NOME_PSS <> '' THEN fnc.NOME_PSS ELSE fnc.APELIDO_PSS  END AS apelido_ou_nome from v_fornecedores fnc where COALESCE(fnc.APELIDO_PSS, fnc.NOME_PSS) <> '' and COALESCE(fnc.APELIDO_PSS, 
    fnc.NOME_PSS) not like '%FORNECEDOR%' and COALESCE(fnc.APELIDO_PSS, fnc.NOME_PSS) not like '%SÃO PAULO%' and COALESCE(fnc.APELIDO_PSS, fnc.NOME_PSS) not like '%PG FUNC.%' and COALESCE(fnc.APELIDO_PSS, 
    fnc.NOME_PSS) not like '%********%' and COALESCE(fnc.APELIDO_PSS, fnc.NOME_PSS) not like '%FUNCIONARIOS%' and COALESCE(fnc.APELIDO_PSS, fnc.NOME_PSS) not like '%EXTRA (FUNCIONARIO)%'`;

  return suppliers;
};
