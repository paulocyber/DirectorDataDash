// Bibliotecas
import { DateValue, RangeValue } from "@heroui/react";

// Utils
import { fetchSalesProgress } from "@/utils/fetchs/salesProgress";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import {
  ItemsProfitsFromSales,
  ItemsSalesProgress,
  ItemsTopSellers,
} from "@/types/sales";
import { parseDate } from "@internationalized/date";
interface SalesGoalsProps {
  id?: string;
  date?: RangeValue<DateValue> | null;
  token: string;
  companys: string[];
  tables: string[];
  seller?: string;
  role?: string;
  setDate?: (value: RangeValue<DateValue>) => void;
  setSelectTheCompany?: (value: string[]) => void;
  setSelectTables?: (value: string[]) => void;
  setProfitSales?: (value: ItemsProfitsFromSales[]) => void;
  setSalesProgress: (value: ItemsSalesProgress[]) => void;
  setValueComission?: (value: number) => void;
  setTopSellers?: (value: ItemsTopSellers[]) => void;
  setId?: (value: string) => void;
  setLoading: (value: boolean) => void;
}

export async function handleRefresh({
  id,
  date,
  token,
  companys,
  tables,
  seller,
  setSalesProgress,
  setProfitSales,
  setValueComission,
  setTopSellers,
  setLoading,
}: SalesGoalsProps) {
  await fetchSalesProgress({
    id,
    dateInit: `${date?.start.year}/${date?.start.month}/${date?.start.day}`,
    dateEnd: `${date?.end.year}/${date?.end.month}/${date?.end.day}`,
    token,
    companys,
    tables,
    sellers: seller,
    year: Number(date?.start.year),
    month: Number(date?.start.month),
    setSalesProgress,
    setProfitSales,
    setValueComission,
    setTopSellers,
    setLoading,
  });
}

export async function handleDateFilter({
  id,
  date,
  token,
  companys,
  tables,
  seller,
  setLoading,
  setDate,
  setSalesProgress,
  setProfitSales,
  setTopSellers,
  setValueComission,
}: SalesGoalsProps) {
  if (!date || !setDate) return;

  setDate(date);

  await fetchSalesProgress({
    id,
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    companys,
    tables,
    sellers: seller,
    year: Number(date?.start.year),
    month: Number(date?.start.month),
    setLoading,
    setSalesProgress,
    setProfitSales,
    setTopSellers,
    setValueComission,
  });
}

export async function handleCleanFilter({
  token,
  seller,
  role,
  setSelectTables,
  setValueComission,
  setSelectTheCompany,
  setSalesProgress,
  setProfitSales,
  setTopSellers,
  setLoading,
  setDate,
  setId,
}: SalesGoalsProps) {
  if (!setDate || !setSelectTables || !setSelectTheCompany || !setId) return;

  const { today, year, month } = getCurrentDateDetails();

  // setDate({
  //   start: parseDate(
  //     new Date(`${year}/${month}/01`).toISOString().split("T")[0]
  //   ),
  //   end: parseDate(new Date(today).toISOString().split("T")[0]),
  // });
  setSelectTables(["1", "2", "3"]);
  setSelectTheCompany(["1", "2", "3", "4"]);
  setId("");

  await fetchSalesProgress({
    dateInit: `${year}/${month}/01`,
    dateEnd: today,
    token,
    companys: ["1", "2", "3", "4"],
    tables: role === "lider de vendas" ? ["2"] : ["1", "2", "3"],
    sellers: [],
    year,
    month,
    setSalesProgress,
    setValueComission,
    setProfitSales,
    setTopSellers,
    setLoading,
  });
}
