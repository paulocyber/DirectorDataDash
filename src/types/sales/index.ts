export type ItemsTopClientsPlusBuyData = {
  ID_VENDEDOR: string;
  ID_CLIENTE: string;
  NOME_CLIENTE: string;
  VALOR_LIQUIDO: string | number;
};

export type ItemsTopSellers = {
  ID_PSS: string;
  VENDEDOR: string;
  VALOR_LIQUIDO: string | number;
};

export type ItemsGoalProgress = {
  name: string;
  value: number;
};

export type ItemsProfitsFromSale = {
  ID_VENDEDOR: string;
  APELIDO_PSS: string;
  VALOR_LIQUIDO: string;
  VALOR_LUCRO: string;
  META_INDIVIDUAL: string;
  MARGEM_LUCRO: string;
};
