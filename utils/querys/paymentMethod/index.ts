export const formOfPaymentsQueries = () => {
  let formOfPayments = `select frm.ID_FRM, frm.DESCRICAO_FRM from formas_pagamentos frm where frm.STATUS_FRM IN ('A')`;

  return formOfPayments;
};
