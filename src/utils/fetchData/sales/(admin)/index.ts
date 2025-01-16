// Utils
import { goalsQueries } from "@/utils/queries/goals";
import { salesQueries } from "@/utils/queries/sales";
import { fetchData } from "../..";
import { calculateTotalByKey } from "@/utils/functions/sumValues";
import { convertFieldsToNumber } from "@/utils/convertStringToNumber";

// Tipagem
import {
  ItemsGoalProgress,
  ItemsProfitsFromSale,
  ItemsTopSellers,
} from "@/types/sales";
interface FetchSalesProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  month: number;
  year: number;
  company: string[];
  sellers?: string;
  setLoading: (loading: boolean) => void;
  setSalesProgress: (value: ItemsGoalProgress[]) => void;
  setProfitSales: (value: ItemsProfitsFromSale[]) => void;
  setTopSellers: (value: ItemsTopSellers[]) => void;
}

export async function fetchSales({
  token,
  dateInit,
  dateEnd,
  month,
  year,
  company,
  sellers,
  setLoading,
  setSalesProgress,
  setProfitSales,
  setTopSellers,
}: FetchSalesProps) {
  setLoading(true);

  const { sales, topSellers, profitsFromSale } = salesQueries({
    dateInit,
    dateEnd,
    company,
    idSeller: sellers,
    year,
    month
  });
  const { storeGoals, individualGoals } = goalsQueries({
    month,
    year,
    company,
    idSeller: sellers,
  });

  let salesData: any[] = [];
  let topSellersData: any[] = [];
  let goalsData: any[] = [];
  let profitSalesData: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: sales,
      setData: (data) => (salesData = data),
    }),
    fetchData({
      ctx: token,
      query: topSellers,
      setData: (data) => (topSellersData = data),
    }),
    fetchData({
      ctx: token,
      query: sellers ? individualGoals : storeGoals,
      setData: (data) => (goalsData = data),
    }),
    fetchData({
      ctx: token,
      query: profitsFromSale,
      setData: (data) => (profitSalesData = data),
    }),
  ];

  await Promise.all(queries);

  const totalSalesValue = calculateTotalByKey(
    salesData,
    (item) => (item as any).VALOR_LIQUIDO
  );
  const totalGoalsValue = calculateTotalByKey(goalsData, (item) =>
    sellers ? (item as any).VALOR_INDIVIDUAL_MTI : (item as any).VALOR_MTA
  );
  const totalProfitValue = calculateTotalByKey(profitSalesData, (item) =>
    sellers ? (item as any).VALOR_INDIVIDUAL_MTI : (item as any).VALOR_LUCRO
  );

  const salesProgressData = [
    { name: "Sales", value: totalSalesValue || 0 },
    { name: "Lucro", value: totalProfitValue || 0 },
    { name: "Goals", value: totalGoalsValue || 0 },
  ];

  const convertedTopSellers = convertFieldsToNumber<ItemsTopSellers>(
    topSellersData,
    ["VALOR_LIQUIDO"]
  );

  setLoading(false);
  setSalesProgress(salesProgressData);
  setTopSellers(convertedTopSellers);
  setProfitSales(profitSalesData)
}
