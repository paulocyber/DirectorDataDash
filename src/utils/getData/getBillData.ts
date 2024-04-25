// Tipagem
import { apiDataProps } from "../../models/types";

// Dados
import { UseApiData } from "../../data/useApiData";

export const getUnpaidInvoices = ({ query }: apiDataProps) => {
  let ammountNotPaid = 0;

  const { data } = UseApiData({ query });
  const unpaidInvoices = data.length;

  data.forEach((billsToPay) => {
    ammountNotPaid += Number(billsToPay.VALOR_PGM.replace(",", "."));
  });

  return { ammountNotPaid, unpaidInvoices };
};

export const getPaidInvoices = ({ query }: apiDataProps) => {
  let amountPaid = 0;

  const { data } = UseApiData({ query });
  const invoicesPaid = data.length;

  data.forEach((billsToPay) => {
    amountPaid += Number(billsToPay.VALOR_PGM.replace(",", "."));
  });

  return { amountPaid, invoicesPaid };
};
