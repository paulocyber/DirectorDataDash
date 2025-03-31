// Utils
import { StockQueries } from "@/utils/queries/stock";
import { fetchData } from "..";

// Tipagem
import { EntriesXSales } from "@/types/entriesXSales";
interface FetchEntriesXSalesProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  brands: string[];
  setLoading: (value: boolean) => void;
  setEntriesSales: (value: EntriesXSales[]) => void;
}

export async function fetchEntriesXSales({
  token,
  dateInit,
  dateEnd,
  brands,
  setLoading,
  setEntriesSales,
}: FetchEntriesXSalesProps) {
  setLoading(true);

  const { entriesXExits, buyHistory } = StockQueries({
    dateInit: dateInit,
    dateEnd: dateEnd,
    brands,
  });

  let entriesXExitsData: any[] = [];
  let buyHistoryData: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: entriesXExits,
      setData: (data) => (entriesXExitsData = data),
    }),
    fetchData({
      ctx: token,
      query: buyHistory,
      setData: (data) => (buyHistoryData = data),
    }),
  ];

  await Promise.all(queries);

  const mergedData = entriesXExitsData.map((entry: EntriesXSales) => {
    const matchedBuy = buyHistoryData.find(
      (buy: any[]) => (buy as any).ID_PRD === (entry as any).ID_PRD
    );
    return matchedBuy
      ? { ...entry, PRECO_UNITARIO: matchedBuy.PRECO_VENDA }
      : entry;
  });

  setEntriesSales(mergedData);
  setLoading(false);
}
