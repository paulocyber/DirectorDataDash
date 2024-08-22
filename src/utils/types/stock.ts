export type Stock = {
  ID_MARCA: string;
  ID_GRUPO: string;
  GRUPO: string;
  MARCA: string;
  TOTAL_VALOR_COMPRA: string;
};

export type StockByBrand = { 
  brand:  string;
  debtValue: number;
  valueInStock: number;
}

export type StockByGroup = {
  key: string;
  value: number;
};

