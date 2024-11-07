export type salesProgressData = {
  name: string;
  value: number;
};

export type topSalesData = {
  ID: string;
  VENDEDOR: string;
  VALOR_LIQUIDO: string | number;
};

export type topClientsPlusBuyData = {
  ID_VENDEDOR: string;
  ID_CLIENTE: string;
  NOME_CLIENTE: string;
  VALOR_LIQUIDO: string | number;
};

export type profitsFromSale = {
  ID_VENDEDOR: string;
  APELIDO_PSS: string;
  VALOR_LIQUIDO: string;
  VALOR_LUCRO: string;
  META_INDIVIDUAL: string;
  MARGEM_LUCRO: string;
};
