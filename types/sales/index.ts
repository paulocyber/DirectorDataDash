export type ItemsTopSellers = {
  ID_PSS: string;
  VENDEDOR: string;
  VALOR_LIQUIDO: string | number;
};

export type ItemsCustomerBuyMore = {
  ID_CLIENTE: string;
  NOME_CLIENTE: string;
  VALOR_LIQUIDO: number;
};

export type ItemsSalesProgress = {
  name: string;
  value: number;
};

export type ItemsProfitsFromSales = {
  ID_VENDEDOR: string;
  APELIDO_PSS: string;
  VALOR_LIQUIDO: string;
  VALOR_LUCRO: string;
  META_INDIVIDUAL: string;
  MARGEM_LUCRO: string;
};

export type ItemsSalesPerMonth = {
  MES_ANO: string;
  VALOR_LIQUIDO_SDS: number;
};

export type ItemsSalesAndBuy = {
  MARCAS: string;
  VALOR_ESTOQUE: number;
  VALOR_DEBITO: number;
};

export type ItemsdebtAndStock = {
  MARCAS: string;
  VALOR_ESTOQUE: number;
  VALOR_DIVIDA: number;
};
