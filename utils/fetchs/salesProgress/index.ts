// Utils
import { SalesQueries } from "@/utils/querys/sales";
import { fetchData } from "../fetchData";
import { sumValuesByKey } from "@/utils/functions/sumValues";
import { goalsQueries } from "@/utils/querys/goals";
import { convertFieldsToNumber } from "@/utils/stringToNumber";

// Tipagem
import {
  ItemsProfitsFromSales,
  ItemsSalesProgress,
  ItemsTopSellers,
} from "@/types/sales";
interface FetchSalesProgressProps {
  id?: string;
  token: string;
  dateInit: string;
  dateEnd: string;
  year: number;
  month: number;
  companys?: string[];
  tables?: string[];
  sellers?: string[] | string;
  setSalesProgress: (value: ItemsSalesProgress[]) => void;
  setProfitSales?: (value: ItemsProfitsFromSales[]) => void;
  setValueComission?: (value: number) => void;
  setTopSellers?: (value: ItemsTopSellers[]) => void;
  setLoading: (value: boolean) => void;
}

export async function fetchSalesProgress({
  id,
  token,
  dateInit,
  dateEnd,
  year,
  month,
  companys,
  tables,
  sellers,
  setSalesProgress,
  setProfitSales,
  setValueComission,
  setTopSellers,
  setLoading,
}: FetchSalesProgressProps) {
  setLoading(true);

  const { sales, topSales, profitsFromSale, commissionPerSalesPerson } =
    SalesQueries({
      dateInit,
      dateEnd,
      companys,
      year,
      month,
      tables,
      sellers: [`${sellers}`],
      id,
    });
  const { goals, individualGoals } = goalsQueries({
    id,
    year,
    month,
    companys,
    tables,
    sellers: [`${sellers}`],
  });

  let salesData: any[] = [];
  let goalsData: any[] = [];
  let topSalesData: any[] = [];
  let profitsFromSaleData: any[] = [];
  let valueComissionData: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: sales,
      setData: (data) => (salesData = data),
    }),
    fetchData({
      ctx: token,
      query: topSales,
      setData: (data) => (topSalesData = data),
    }),
    fetchData({
      ctx: token,
      query: profitsFromSale,
      setData: (data) => (profitsFromSaleData = data),
    }),
    fetchData({
      ctx: token,
      query: id ? individualGoals : goals,
      setData: (data) => (goalsData = data),
    }),
    fetchData({
      ctx: token,
      query: commissionPerSalesPerson,
      setData: (data) => (valueComissionData = data),
    }),
  ];

  await Promise.all(queries);

  const totalSales = sumValuesByKey(
    salesData,
    (item) => (item as any).VALOR_LIQUIDO
  );
  const totalProfit = sumValuesByKey(
    profitsFromSaleData,
    (item) => (item as any).VALOR_LUCRO
  );
  const totalGoals = sumValuesByKey(
    goalsData,
    (item) => (item as any).VALOR_MTA
  );
  const valueCommission = sumValuesByKey(
    valueComissionData,
    (item: any) => item.COMISSAO
  );

  const salesProgress = [
    { name: "sales", value: totalSales },
    { name: "goals", value: totalGoals },
    { name: "profit", value: totalProfit },
  ];

  const topSellers = convertFieldsToNumber<ItemsTopSellers>(topSalesData, [
    "VALOR_LIQUIDO",
  ]);

  setProfitSales && setProfitSales(profitsFromSaleData);
  setSalesProgress(salesProgress);
  setTopSellers && setTopSellers(topSellers);
  setValueComission && setValueComission(valueCommission);
  setLoading(false);
}
