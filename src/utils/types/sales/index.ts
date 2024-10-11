export type salesData = {
  name: string;
  value: number;
};

export type topSalesData = {
  ID: string;
  VENDEDOR: string;
  VALOR_TOTAL_LIQUIDO: string | number;
};

export type topClientsPlusBuyData = {
  ID_VENDEDOR: string;
  ID_CLIENTE: string;
  NOME_CLIENTE: string;
  VALOR_LIQUIDO: string | number;
};
