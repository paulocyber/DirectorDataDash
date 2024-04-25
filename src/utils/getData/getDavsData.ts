import React from "react";

// Tipagem
import { apiDataProps } from "../../models/types";

// Dados
import { UseApiData } from "../../data/useApiData";

export const getDavsData = ({ query }: apiDataProps) => {
  let valueDav = 0;
  let salesValue = 0;
  let customerServed = 0;
  let formOfPayment = "";
  let overdueStatus = "";
  let personName = "";

  const { data } = UseApiData({ query });

  data.forEach((dataDav) => {
    valueDav += Number(dataDav.VALOR_RCB.replace(",", "."));
    salesValue += Number(dataDav.RESTANTE_SEM_JUROS_RCB.replace(",", "."));
    customerServed = data.length;
    formOfPayment = dataDav.FORMA_PAGAMENTO;
    overdueStatus = dataDav.ATRASO_RCB;
    personName = dataDav.NOME_PSS;
  });

  return {
    valueDav,
    salesValue,
    customerServed,
    formOfPayment,
    overdueStatus,
    personName,
  };
};
