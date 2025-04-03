// Bibliotecas
import { DateValue, RangeValue } from "@heroui/react";

// Utils
import { fetchSales } from "@/utils/fetchData/sales/(admin)";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import {
  ItemsGoalProgress,
  ItemsProfitsFromSale,
  ItemsTopSellers,
} from "@/types/sales";
import { parseDate } from "@internationalized/date";
interface SalesHandlersProps {
  token: string;
  date?: RangeValue<DateValue> | null;
  company: string[];
  tables?: string[];
  sellers?: string;
  setDate?: (value: RangeValue<DateValue>) => void;
  setFilterSellers?: (value: string) => void;
  setLoading: (value: boolean) => void;
  setSalesProgress: (value: ItemsGoalProgress[]) => void;
  setTopSellers: (value: ItemsTopSellers[]) => void;
  setProfitSales: (value: ItemsProfitsFromSale[]) => void;
  setCompany?: (value: string[]) => void;
}

export async function handleRefresh({
  token,
  date,
  company,
  tables,
  sellers,
  setLoading,
  setSalesProgress,
  setTopSellers,
  setProfitSales,
}: SalesHandlersProps) {
  if (!date) return;

  await fetchSales({
    token,
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    year: date.start.year,
    month: date.start.month,
    company,
    sellers,
    tables,
    setLoading,
    setSalesProgress,
    setTopSellers,
    setProfitSales,
  });
}

export async function handleCleanFilter({
  token,
  company,
  sellers,
  setDate,
  setFilterSellers,
  setLoading,
  setSalesProgress,
  setTopSellers,
  setProfitSales,
  setCompany,
}: SalesHandlersProps) {
  if (!setDate || !setFilterSellers || !setCompany) return;

  setFilterSellers("");
  setCompany(["1", "2", "3", "4", "5"]);

  const { year, month, today } = getCurrentDateDetails();

  setDate({
    start: parseDate(
      new Date(`${year}/${month}/01`).toISOString().split("T")[0]
    ),
    end: parseDate(new Date(today).toISOString().split("T")[0]),
  });

  await fetchSales({
    token,
    dateInit: `${year}/${month}/01`,
    dateEnd: today,
    year: year,
    month: month,
    company: ["1", "2", "3", "4", "5"],
    sellers,
    setLoading,
    setSalesProgress,
    setProfitSales,
    setTopSellers,
  });
}

export async function handleDateFilter({
  token,
  date,
  company,
  tables,
  setFilterSellers,
  setDate,
  setLoading,
  setSalesProgress,
  setTopSellers,
  setProfitSales,
}: SalesHandlersProps) {
  if (!date || !setDate) return;
  setDate(date);

  await fetchSales({
    token,
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    year: date.start.year,
    month: date.start.month,
    company,
    tables,
    setLoading,
    setSalesProgress,
    setTopSellers,
    setProfitSales,
  });
}
