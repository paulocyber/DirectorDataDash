export type ItemsSalesByBrand = {
  ID_PRODUTO: string;
  PRODUTO: string;
  ID_MARCA: string;
  MARCAS: string;
  ID_GRUPO: string;
  GRUPO: string;
  PRECO_CUSTO_SDI: string;
  PRECO_SDI: string;
  VALOR_BRUTO_SDI: string;
  QUANTIDADE_ALMOX: string;
  PRECO_CUSTO: string;
};

export type ItemsGroupBySumSales = {
  brand: string;
  value: number;
};


export type ItemsSalesByBuy = {
  brand: string;
  valueSales: number;
  buyValue: number;
};