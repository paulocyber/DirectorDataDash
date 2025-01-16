export type ItemsDavData = {
  ID_SDS: string;
  EMPRESA: string;
  DATAHORA_SDS: string;
  DATAHORA_FINALIZACAO_SDS: string;
  APELIDO_PSS: string;
  CLIENTE: string;
  VENDEDOR: string;
  ALMOXARIFADO: string;
  VALOR_BRUTO_SDS: string;
  VALOR_TROCA_SDS: string;
  VALOR_LIQUIDO_SDS: string;
  VALOR_LIQUIDO_TOTAL: string;
  TIPO_VENDA_SDS: string;
  STATUS_SDS: string;
  VALOR_DESCONTO_SDS: string;
  PRECO_CUSTO_ALE: string;
  LUCRO: string;
};

export type ItemsDavProductsResponse = {
  CODIGO_PRD: string;
  ID_SDS: string;
  DESCRICAO_PRD: string;
  REFERENCIA_PRD: string;
  QTDE_SDI: string;
  VALOR_BRUTO_SDI: string;
  VALOR_DESCONTO_SDI: string;
  VALOR_ACRESCIMO_SDI: string;
  VALOR_LIQUIDO_SDI: string;
  PERC_DESCONTO_SDI: string;
  STATUS_SDI: string;
  DESCRICAO_ALM: string;
  ITEM_PROMOCAO_SDI: string;
  QTDE_DISPONIVEL_SDI: string;
};
