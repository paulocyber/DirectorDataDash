export type BillsToReceiveItem = {
  ID_SDS: string;
  ID_CLIENTE: string;
  N_DAV: string;
  NOME_RAZAO_CLIENTE: string;
  APELIDO_FANTASIA_CLIENTE: string;
  DATA_VENCIMENTO_RCB: string;
  STATUS_RCB: string;
  APELIDO_VENDEDOR: string;
  DESCRICAO_FORMA_PAGAMENTO: string;
  VALOR_ORIGINAL: string;
  VALOR_JA_PAGO: string;
  VALORES_RESTANTE: string;
  ATRASO_RCB: string;
  CLIENTE: string;
};

export interface BillsToReceiveProps {
  listBillsToReceivePaid: BillsToReceiveItem[];
  listBillsToReciveOpen: BillsToReceiveItem[];
  listBillsToReciveOverdue: BillsToReceiveItem[];
}
