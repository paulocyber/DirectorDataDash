// Bibiblioteca
import {
  faCheck,
  faCheckCircle,
  faMoneyBill1Wave,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { useRecoilValue } from "recoil";

// Dados
import {
  getPaidInvoices,
  getUnpaidInvoices,
} from "../utils/getData/getBillData";

// Utils
import { formatCurrency } from "../utils/mask/applyMask";

// Atom
import { filterDescription } from "../atom/filterAtom";

export const BillysToPayCard = () => {
  const description = useRecoilValue(filterDescription);

  let descriptionCondition = "";

  if (description && description.length > 0) {
    const descriptionList = description.map(
      (costCenter) => `'${costCenter.description}'`
    );
    descriptionCondition = `AND pgm.id_cnt || ' - ' || pgm.descricao_cnt IN (${descriptionList.join(
      ", "
    )})`;
  }

  let queryNotPaid = `select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, pgm.valor_desconto_pgi,  pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo, pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') as contabil_pgm  from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11) and (pgm.status_pgm = 1 or pgm.status_pgm = 3) and pgm.data_vencimento_pgm = '2024-03-01' ${descriptionCondition} order by pgm.data_vencimento_pgm, pgm.id_pss;`;
  let queryPaid = `select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, pgm.valor_desconto_pgi,  pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo, pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') as contabil_pgm  from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11) and pgm.status_pgm = 2 and pgm.data_vencimento_pgm = '2024-03-01' ${descriptionCondition} order by pgm.data_vencimento_pgm, pgm.id_pss`;

  const { ammountNotPaid, unpaidInvoices } = getUnpaidInvoices({
    query: queryNotPaid,
  });
  
  const { amountPaid, invoicesPaid } = getPaidInvoices({ query: queryPaid });

  const infoBillyToPay = [
    {
      icon: faMoneyBill1Wave,
      title: "Valor total em aberto",
      value: formatCurrency(ammountNotPaid),
    },
    {
      icon: faWarning,
      title: "Total de boletos atrasados",
      value: unpaidInvoices.toString(),
    },
    {
      icon: faCheck,
      title: "Valor total de boletos pagos",
      value: formatCurrency(amountPaid),
    },
    {
      icon: faCheckCircle,
      title: "Total de boletos em dias",
      value: invoicesPaid.toString(),
    },
  ];

  return { infoBillyToPay };
};
