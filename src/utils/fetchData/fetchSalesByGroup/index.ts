// Utils
import { salesQueries } from "@/utils/queries/sales";
import { Stock } from "@/utils/queries/stock";
import { fetchData } from "..";
import { groupSumBy } from "@/utils/filters/sumsByGroup";

// Tipagem
import { SalesByGroupType } from "@/utils/types/salesByGroup";
import { StockByGroup } from "@/utils/types/stock";
interface FetchSalesByGroup {
  token: string;
  dateInit: string;
  dateEnd: string;
  setLoading: (value: boolean) => void;
  setSalesByGroup: (value: SalesByGroupType[]) => void;
  setStockByGroup: (value: StockByGroup[]) => void;
}

export async function fetchSalesByGroup({
  token,
  dateInit,
  dateEnd,
  setLoading,
  setSalesByGroup,
  setStockByGroup
}: FetchSalesByGroup) {
  setLoading(true);

  const { salesByGroup } = salesQueries({ dateInit, dateEnd });
  const { stockByGroup } = Stock();

  let sales: any[] = [];
  let stock: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: salesByGroup,
      setData: (data) => (sales = data),
    }),
    fetchData({
      ctx: token,
      query: stockByGroup,
      setData: (data) => (stock = data),
    }),
  ];

  await Promise.all(queries);

  const sumByGroup = groupSumBy(sales, {
    key: "GRUPO",
    valueKey: "VALOR_BRUTO_SDI",
  });
  const sumByStock = groupSumBy(stock, {
    key: "GRUPO",
    valueKey: "TOTAL_VALOR_COMPRA",
  });

  setSalesByGroup(sumByGroup)
  setStockByGroup(sumByStock)
  setLoading(false)
}
