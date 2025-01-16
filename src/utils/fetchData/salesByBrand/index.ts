// Utils
import { salesQueries } from "@/utils/queries/sales";
import { StockQueries } from "@/utils/queries/stock";
import { billsToPayQueries } from "@/utils/queries/billsToPay";
import { fetchData } from "..";
import { groupSumBy } from "@/utils/filters/groupSumBy";

// Tipagem
import { ItemsGroupBySumSales } from "@/types/salesByBrand";
import { ItemsStockByBrand } from "@/types/stock";
interface FetchSalesByBrandProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  year: number;
  brands: string[];
  setLoading: (value: boolean) => void;
  setBrandSales: (value: ItemsGroupBySumSales[]) => void;
  setBrandStockAndDebt: (value: ItemsStockByBrand[]) => void;
}

export async function fetchSalesByBrand({
  token,
  dateInit,
  dateEnd,
  year,
  brands,
  setLoading,
  setBrandSales,
  setBrandStockAndDebt,
}: FetchSalesByBrandProps) {
  setLoading(true);

  const { SalesByBrand: playCell } = salesQueries({
    dateInit,
    dateEnd,
    company: ["1"],
    brands,
  });
  const { SalesByBrand: playCustom } = salesQueries({
    dateInit,
    dateEnd,
    company: ["2"],
    brands,
  });
  const { SalesByBrand: playUp } = salesQueries({
    dateInit,
    dateEnd,
    company: ["3"],
    brands,
  });
  const { SalesByBrand: playCovers } = salesQueries({
    dateInit,
    dateEnd,
    company: ["4"],
    brands,
  });
  const { stockByBrand } = StockQueries({
    brands,
  });
  const { debtBySuppliers } = billsToPayQueries({
    year,
    brands,
  });

  let playCellSales: any[] = [];
  let playCustomSales: any[] = [];
  let playUpSales: any[] = [];
  let playCoversSales: any[] = [];
  let stock: any[] = [];
  let deby: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: playCell,
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
  ];

  await Promise.all(queries);

  const salesData = [
    ...playCellSales,
    ...playCustomSales,
    ...playUpSales,
    ...playCoversSales,
  ];

  const aggregatedSalesByBrand = groupSumBy(salesData, {
    key: "MARCAS",
    valueKey: "VALOR_BRUTO_SDI",
  }).sort((a, b) => b.value - a.value);
  const aggregatedStockByBrand = groupSumBy(stock, {
    key: "MARCA",
    valueKey: "TOTAL_VALOR_COMPRA",
  }).sort((a, b) => b.value - a.value);

  const stockByBrandList = aggregatedStockByBrand
    .map((stock) => {
      const matchedDebt = deby.find(
        (debt: any) => debt.APELIDO_PSS === stock.brand
      );

      return {
        brand: stock.brand,
        valueInStock: stock.value,
        debtValue: matchedDebt
          ? parseFloat(matchedDebt.VALOR_PGM.replace(",", "."))
          : 0,
      };
    })
    .sort((a, b) => b.valueInStock - a.valueInStock);

  setLoading(false);
  setBrandSales(aggregatedSalesByBrand);
  setBrandStockAndDebt(stockByBrandList);
}
