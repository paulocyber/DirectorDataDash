// Utils
import { salesQueries } from "@/utils/queries/sales";
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

  const { buyHistory } = StockQueries({
    dateInit: dateInit,
    dateEnd: dateEnd,
    brands,
  });
  const { sellHistory } = salesQueries({
    dateInit: dateInit,
    dateEnd: dateEnd,
    brands,
  });

  let buyData: any[] = [];
  let sellData: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: buyHistory,
      setData: (data) => (buyData = data),
    }),
    fetchData({
      ctx: token,
      query: sellHistory,
      setData: (data) => (sellData = data),
    }),
  ];

  await Promise.all(queries);

  const entriesXSales = buyData.map((buyHistory: any) => {
    const matched = sellData.find(
      (sellHistory: any) => sellHistory.ID_PRD === buyHistory.ID_PRD
    );

    return {
      ...buyHistory,
      VALOR_LIQUIDO: matched?.VALOR_LIQUIDO || 0,
      VALOR_VENDA: matched?.VALOR_FINAL || "0",
    };
  });

  setEntriesSales(entriesXSales);
  setLoading(false);
}
