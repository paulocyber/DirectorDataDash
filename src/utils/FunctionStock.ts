// Dados
import DataStock from "../data/DataStock.json";

// Atom
import { useRecoilState, useRecoilValue } from "recoil";
import { FilterStateBtnAtom, TypeFilter } from "../atoms/FilterStateAtom";

export const TotalProductsinStock = () => {
  const stocks = DataStock.estoque.map((stocks) => stocks.quantidade);
  let quantityInStocks = 0;
  for (let contador = 0; contador < stocks.length; contador++) {
    quantityInStocks += stocks[contador];
  }

  return quantityInStocks;
};

export const ValueStock = () => {
  const valueTotalSotck = DataStock.estoque.map(
    (stocks) => stocks.valor_recompra
  );
  let valueStockTotal = 0;
  for (let contador = 0; contador < valueTotalSotck.length; contador++) {
    valueStockTotal += valueTotalSotck[contador];
  }

  return valueStockTotal;
};

type Product = {
  id: number;
  produto: string;
  quantidade: number;
  dia_recompra: string;
  quantidade_recompra: number;
  itens_abaixo_minimo: number;
};

type OrderingOptions = {
  [key: string]: (a: Product, b: Product) => number;
};

export const FilterLowStocks = (): { productsFilters: Product[] } => {
  const filterStateBtn = useRecoilValue(FilterStateBtnAtom);
  const filterType = useRecoilValue(TypeFilter);

  const orderingOptions: OrderingOptions = {
    ShortByAscProducts: (a, b) => a.produto.localeCompare(b.produto),
    ShortByDescProducts: (a, b) => b.produto.localeCompare(a.produto),
    ShortByAscStock: (a, b) => a.quantidade - b.quantidade,
    ShortByDescStock: (a, b) => b.quantidade - a.quantidade,
    ShortByAscDayOfRempurchase: (a, b) =>
      new Date(a.dia_recompra).getTime() - new Date(b.dia_recompra).getTime(),
    ShortByDescDayOfRempurchase: (a, b) =>
      new Date(b.dia_recompra).getTime() - new Date(a.dia_recompra).getTime(),
    ShortByAscQuantitySold: (a, b) =>
      a.quantidade_recompra - b.quantidade_recompra,
    ShortByDescQuantitySold: (a, b) =>
      b.quantidade_recompra - a.quantidade_recompra,
    ShortByAscItemsBelow: (a, b) =>
      a.itens_abaixo_minimo - b.itens_abaixo_minimo,
    ShortByDescItemsBelow: (a, b) =>
      b.itens_abaixo_minimo - a.itens_abaixo_minimo,
  };

  const applySort = (data: Product[], type: string): Product[] => {
    if (orderingOptions[type]) {
      return [...data].sort(orderingOptions[type]);
    } else {
      return data.filter(
        (product) => product.quantidade < product.itens_abaixo_minimo
      );
    }
  };

  const productsFilters: Product[] = applySort(DataStock.estoque, filterType);
  return { productsFilters };
};
