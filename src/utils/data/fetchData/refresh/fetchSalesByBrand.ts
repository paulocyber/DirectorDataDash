// Utils
import getDate from "@/utils/date/currentDate";
import { billsToPayQueries } from "@/utils/queries/billstoPay";
import { salesQueries } from "@/utils/queries/sales";
import { stockQueries } from "@/utils/queries/stock";
import { fetchData } from "..";
import { groupSumBy } from "@/utils/filters/sumsByGroup";

// Tipagem
import { SalesByBrandType } from "@/types/salesByBrand";
import { StockByBrand } from "@/types/stock";

interface FetchSalesByBrandProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  brands: string[];
  setLoading: (value: boolean) => void;
  setSalesByBrand: (value: SalesByBrandType[]) => void;
  setStockByBrand: (value: StockByBrand[]) => void;
}

export async function fetchSalesByBrand({
  token,
  dateInit,
  dateEnd,
  brands,
  setLoading,
  setSalesByBrand,
  setStockByBrand,
}: FetchSalesByBrandProps) {
  setLoading(true);

  const { year } = getDate();

  const { SalesByBrand: playCell } = salesQueries({
    dateInit,
    dateEnd,
    emp: "1",
    brands,
  });
  const { SalesByBrand: playCustom } = salesQueries({
    dateInit,
    dateEnd,
    emp: "2",
    brands,
  });
  const { SalesByBrand: playUp } = salesQueries({
    dateInit,
    dateEnd,
    emp: "3",
    brands,
  });
  const { SalesByBrand: playCovers } = salesQueries({
    dateInit,
    dateEnd,
    emp: "4",
    brands,
  });
  const { stockByBrand } = stockQueries({ dateInit: "", dateEnd: "", brands });
  const { openBillFromSuppliers } = billsToPayQueries({ year, brands });

  let salesPlayCell: any[] = [];
  let salesPlayCustom: any[] = [];
  let salesPlayUp: any[] = [];
  let salesPlayCovers: any[] = [];
  let stock: any[] = [];
  let debt: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: playCell,
      setData: (data) => (salesPlayCell = data),
    }),
    fetchData({
      ctx: token,
      query: playCustom,
      setData: (data) => (salesPlayCustom = data),
    }),
    fetchData({
      ctx: token,
      query: playUp,
      setData: (data) => (salesPlayUp = data),
    }),
    fetchData({
      ctx: token,
      query: playCovers,
      setData: (data) => (salesPlayCovers = data),
    }),
    fetchData({
      ctx: token,
      query: stockByBrand,
      setData: (data) => (stock = data),
    }),
    fetchData({
      ctx: token,
      query: openBillFromSuppliers,
      setData: (data) => (debt = data),
    }),
  ];

  await Promise.all(queries);

  const salesData = [...salesPlayCell, ...salesPlayCustom, ...salesPlayUp, ...salesPlayCovers];
  const sumByBrand = groupSumBy(salesData, {
    key: "MARCAS",
    valueKey: "VALOR_BRUTO_SDI",
  }).sort((a, b) => b.value - a.value);

  const sumOfStockByBrand = groupSumBy(stock, {
    key: "MARCA",
    valueKey: "TOTAL_VALOR_COMPRA",
  });

  const listStockByBrand = sumOfStockByBrand
    .map((stock) => {
      const groupedData = debt.find(
        (debt: any) => debt.APELIDO_PSS === stock.brand
      );

      return {
        brand: stock.brand,
        valueInStock: stock.value,
        debtValue: groupedData
          ? parseFloat(groupedData.VALOR_PGM.replace(",", "."))
          : 0,
      };
    })
    .sort((a, b) => b.valueInStock - a.valueInStock);

  setSalesByBrand(sumByBrand);
  setStockByBrand(listStockByBrand);
  setLoading(false);
}
