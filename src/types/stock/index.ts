export type Stock = {
  ID_MARCA: string;
  ID_GRUPO: string;
  GRUPO: string;
  MARCA: string;
  TOTAL_VALOR_COMPRA: string;
};

export type StockByBrand = {
  brand: string;
  debtValue: number;
  valueInStock: number;
};

export type StockByGroup = {
  brand: string;
  value: number;
};

export type TopProducts = {
  ID_PRODUTO: string;
  PRODUTO: string;
  MARCA: string;
  VALOR_CUSTO: string;
  VALOR_LIQUIDO: string;
  QUANTIDADE_MINIMA_ALE: string;
  QUANTIDADE_ATUAL_ALE: string;
};
