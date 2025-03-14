// Utils
import { fetchSales } from "@/utils/fetchData/sales";

// Tipagem
import { DateValue, RangeValue } from "@heroui/react";
import { ItemsGoalProgress, ItemsTopClientsPlusBuyData } from "@/types/sales";
import { parseDate } from "@internationalized/date";

interface SalesHandlersProps {
  date?: RangeValue<DateValue> | null;
  today?: string;
  year?: number;
  month?: number;
  sellerSurname: string;
  token: string;
  setDate?: (value: RangeValue<DateValue>) => void;
  setLoading: (value: boolean) => void;
  setComission: (value: number) => void;
  setGoalProgress: (value: ItemsGoalProgress[]) => void;
  setTopClients: (value: ItemsTopClientsPlusBuyData[]) => void;
}

export async function handleRefresh({
  date,
  sellerSurname,
  setComission,
  setGoalProgress,
  setLoading,
  setTopClients,
  token,
}: SalesHandlersProps) {
  if (!date) return;

  await fetchSales({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    year: date.start.year,
    month: date.start.month,
    sellerSurname,
    token,
    setComission,
    setLoading,
    setGoalProgress,
    setTopClients,
  });
}

export async function handleCleanFilter({
  today,
  year,
  month,
  sellerSurname,
  token,
  setDate,
  setLoading,
  setComission,
  setGoalProgress,
  setTopClients,
}: SalesHandlersProps) {
  if (!year || !month || !today) return;

  setDate &&
    setDate({
      start: parseDate(
        new Date(`${year}/${month}/01`).toISOString().split("T")[0]
      ),
      end: parseDate(new Date(today).toISOString().split("T")[0]),
    });

  await fetchSales({
    dateInit: `${year}/${month}/01`,
    dateEnd: today,
    year: year,
    month: month,
    sellerSurname,
    token,
    setLoading,
    setComission,
    setGoalProgress,
    setTopClients,
  });
}

export async function handleDateFilter({
  date,
  sellerSurname,
  token,
  setDate,
  setLoading,
  setComission,
  setGoalProgress,
  setTopClients,
}: SalesHandlersProps) {
  if (!date || !setDate) return;
  setDate(date);

  await fetchSales({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    year: date.start.year,
    month: date.start.month,
    sellerSurname,
    token,
    setLoading,
    setComission,
    setGoalProgress,
    setTopClients,
  });
}
