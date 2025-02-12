// Utils
import { fetchEntriesXSales } from "@/utils/fetchData/entriesXSales";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import { EntriesXSales } from "@/types/entriesXSales";
import { RangeValue, DateValue } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
interface EntriesXSalesProps {
  date?: RangeValue<DateValue> | null;
  token: string;
  brands: string[];
  setLoading: (value: boolean) => void;
  setBrands?: (value: string[]) => void;
  setDate?: (value: RangeValue<DateValue>) => void;
  setEntriesSales: (value: EntriesXSales[]) => void;
}

export async function handleRefresh({
  date,
  token,
  brands,
  setLoading,
  setEntriesSales,
}: EntriesXSalesProps) {
  if (!date) return;

  await fetchEntriesXSales({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    brands,
    setLoading,
    setEntriesSales,
  });
}

export async function handleCleanFilter({
  token,
  brands,
  setBrands,
  setDate,
  setLoading,
  setEntriesSales,
}: EntriesXSalesProps) {
  if (!setDate || !setBrands) return;

  const { year, month } = getCurrentDateDetails();

  setDate({
    start: parseDate(new Date(`${year}/01/01`).toISOString().split("T")[0]),
    end: parseDate(new Date(`${year}/${month}/01`).toISOString().split("T")[0]),
  });

  setBrands([
    "BASIC INOVA",
    "INOVA HENRIQUE",
    "INOVA COMPRA DE MERCADORIA",
    "ITO INOVA",
    "LEANDRO INOVA",
    "MIA",
    "TOMY INOVA",
    "KIMASTER",
    "PEINING",
    "DEVIA",
    "B-MAX",
    "INOVA",
    "HREBOS",
  ]);

  await fetchEntriesXSales({
    dateInit: `${year}/01/01`,
    dateEnd: `${year}/${month}/01`,
    token,
    brands: [
      "BASIC INOVA",
      "INOVA HENRIQUE",
      "INOVA COMPRA DE MERCADORIA",
      "ITO INOVA",
      "LEANDRO INOVA",
      "MIA",
      "TOMY INOVA",
      "KIMASTER",
      "PEINING",
      "DEVIA",
      "B-MAX",
      "INOVA",
      "HREBOS",
    ],
    setLoading,
    setEntriesSales,
  });
}

export async function handleDateFilter({
  date,
  token,
  brands,
  setLoading,
  setDate,
  setEntriesSales,
}: EntriesXSalesProps) {
  if (!date || !setDate) return;

  setDate(date);

  await fetchEntriesXSales({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    brands,
    setLoading,
    setEntriesSales,
  });
}
