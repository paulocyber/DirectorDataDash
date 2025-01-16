export type ItemsStockByBrand = {
  brand: string;
  debtValue: number;
  valueInStock: number;
};

export type ItemsTopProducts = {
  ID_PRODUTO: string;
  PRODUTO: string;
  MARCA: string;
  VALOR_CUSTO: string;
  VALOR_LIQUIDO: string;
  QUANTIDADE_MINIMA_ALE: string;
  QUANTIDADE_ATUAL_ALE: string;
};
