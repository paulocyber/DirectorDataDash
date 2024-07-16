export type BillsToPayItem = {
  ID_SDS: string;
  VALOR_PGM: string;
  NOME_PSS: string;
  CENTRO_CUSTO: string;
  VALOR_PAGO_PGM: string;
  RESTANTE_PGM: string;
  STATUS_PGM: string;
  DATA_VENCIMENTO_PGM: string;
  NUMERO_DOCUMENTO_PGM: string;
  GRUPO_CENTRO: string;
  DESCRICAO_FRM: string;
};

export interface BillsToPayPageProps {
  listBilletInOpen: BillsToPayItem[];
  listBilletPaid: BillsToPayItem[];
  listBilletExpired: BillsToPayItem[];
  listBilletPaidAndOpen: BillsToPayItem[];
}
