// Utils
import { fetchDavs } from "@/utils/fetchData/davs";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import { ItemsDavData } from "@/types/dav";
import { parseDate } from "@internationalized/date";

// Tipagem
import { DateValue, RangeValue } from "@heroui/react";
interface salesHandlersProps {
  date?: RangeValue<DateValue> | null;
  formsOfPayments?: string[];
  token: string;
  setDate?: (value: RangeValue<DateValue>) => void;
  setDavs: (data: ItemsDavData[]) => void;
  setFormsOfPayments?: (data: string[]) => void;
  setPaymentMethods?: (data: { brand: string; value: number }[]) => void;
  setSalesPerMonth?: (
    data: { MES_ANO: string; VALOR_LIQUIDO_SDS: number }[]
  ) => void;
  setLoading: (value: boolean) => void;
}

export async function handleRefresh({
  date,
  formsOfPayments,
  token,
  setDavs,
  setPaymentMethods,
  setSalesPerMonth,
  setLoading,
}: salesHandlersProps) {
  if (!date) return;

  await fetchDavs({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    year: date.start.year,
    formsOfPayments,
    token,
    setDavs,
    setPaymentMethods,
    setSalesPerMonth,
    setLoading,
  });
}

export async function handleCleanFilter({
  formsOfPayments,
  token,
  setDate,
  setFormsOfPayments,
  setDavs,
  setPaymentMethods,
  setSalesPerMonth,
  setLoading,
}: salesHandlersProps) {
  if (!setDate || !setFormsOfPayments) return;
  const { today, year } = getCurrentDateDetails();

  setDate({
    start: parseDate(new Date(today).toISOString().split("T")[0]),
    end: parseDate(new Date(today).toISOString().split("T")[0]),
  });

  setFormsOfPayments([]);

  await fetchDavs({
    dateInit: today,
    dateEnd: today,
    year,
    formsOfPayments: [],
    token,
    setDavs,
    setPaymentMethods,
    setSalesPerMonth,
    setLoading,
  });
}

export async function handleDateFilter({
  date,
  formsOfPayments,
  token,
  setDate,
  setDavs,
  setPaymentMethods,
  setSalesPerMonth,
  setLoading,
}: salesHandlersProps) {
  if (!date || !setDate) return;
  setDate(date);

  await fetchDavs({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    formsOfPayments,
    year: date.start.year,
    token,
    setDavs,
    setSalesPerMonth,
    setPaymentMethods,
    setLoading,
  });
}
