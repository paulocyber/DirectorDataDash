// Utils
import { SalesQueries } from "@/utils/querys/sales";
import { StockQueries } from "@/utils/querys/stocks";
import { billsToPayQueries } from "@/utils/querys/billsToPay";

// Tipagem
import { ItemsdebtAndStock, ItemsSalesAndBuy } from "@/types/sales";
import { fetchData } from "../fetchData";
import { groupBySum } from "@/utils/filters/groupBySum";
interface FetchSalesByBrandProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  year: number;
  brands: string[];
  setLoading: (value: boolean) => void;
  setSalesAndBuy: (value: ItemsSalesAndBuy[]) => void;
  setDebtAndStock: (value: ItemsdebtAndStock[]) => void;
}

export async function fetchSalesByBrand({
  token,
  dateInit,
  dateEnd,
  year,
  brands,
  setLoading,
  setSalesAndBuy,
  setDebtAndStock,
}: FetchSalesByBrandProps) {
  setLoading(true);

  const { SalesByBrand: playcell } = SalesQueries({
    dateInit,
    dateEnd,
    companys: ["1"],
    brands,
  });
  const { SalesByBrand: playCustom } = SalesQueries({
    dateInit,
    dateEnd,
    companys: ["2"],
    brands,
  });
  const { SalesByBrand: playUp } = SalesQueries({
    dateInit,
    dateEnd,
    companys: ["3"],
    brands,
  });
  const { SalesByBrand: playCovers } = SalesQueries({
    dateInit,
    dateEnd,
    companys: ["4"],
    brands,
  });
  const { stockByBrand } = StockQueries({
    dateInit,
    dateEnd,
    brands,
  });
  const { debtBySuppliers } = billsToPayQueries({
    year,
    brands,
  });
  const { buyBySuppliers } = billsToPayQueries({
    dateInit,
    dateEnd,
    brands,
  });

  let playCellSales: any[] = [];
  let playCustomSales: any[] = [];
  let playUpSales: any[] = [];
  let playCoversSales: any[] = [];
  let stock: any[] = [];
  let deby: any[] = [];
  let buy: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: playcell,
      setData: (data) => (playCellSales = data),
    }),
    fetchData({
      ctx: token,
      query: playCustom,
      setData: (data) => (playCustomSales = data),
    }),
    fetchData({
      ctx: token,
      query: playUp,
      setData: (data) => (playUpSales = data),
    }),
    fetchData({
      ctx: token,
      query: playCovers,
      setData: (data) => (playCoversSales = data),
    }),
    fetchData({
      ctx: token,
      query: stockByBrand,
      setData: (data) => (stock = data),
    }),
    fetchData({
      ctx: token,
      query: debtBySuppliers,
      setData: (data) => (deby = data),
    }),
    fetchData({
      ctx: token,
      query: buyBySuppliers,
      setData: (data) => (buy = data),
    }),
  ];

  await Promise.all(queries);

  const salesData = [
    ...playCellSales,
    ...playCustomSales,
    ...playUpSales,
    ...playCoversSales,
  ];

  const aggregatedSalesByBrand = groupBySum(salesData, {
    key: "MARCAS",
    labelKey: "MARCAS",
    valueKey: "VALOR_BRUTO_SDI",
  }).sort((a, b) => b.value - a.value);

  const aggregatedStockByBrand = groupBySum(stock, {
    key: "MARCA",
    labelKey: "MARCAS",
    valueKey: "TOTAL_VALOR_COMPRA",
  }).sort((a, b) => b.value - a.value);

  const salesAndBuy = aggregatedSalesByBrand
    .map((sales) => {
      const match = buy.find((buy: any) => buy.APELIDO_PSS === sales.MARCAS);

      return {
        MARCAS: sales.MARCAS,
        VALOR_ESTOQUE: sales.value,
        VALOR_DEBITO: match ? parseFloat(match.VALOR_PGM.replace(",", ".")) : 0,
      };
    })
    .sort((a, b) => b.VALOR_ESTOQUE - a.VALOR_ESTOQUE);

  const debtAndStock = aggregatedStockByBrand.map((stock) => {
    const match = deby.find((debt: any) => debt.APELIDO_PSS === stock.MARCAS);

    return {
      MARCAS: stock.MARCAS,
      VALOR_ESTOQUE: stock.value,
      VALOR_DIVIDA: match ? parseFloat(match.VALOR_PGM.replace(",", ".")) : 0,
    };
  });

  setLoading(false);
  setSalesAndBuy(salesAndBuy);
  setDebtAndStock(debtAndStock);
}
