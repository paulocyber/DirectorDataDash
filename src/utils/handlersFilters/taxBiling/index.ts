// Utils
import { fetchTaxBiling } from "@/utils/fetchData/taxBiling";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import { ItemsTaxInvoicing } from "@/types/tax";
import { RangeValue, DateValue } from "@heroui/react";
import { parseDate } from "@internationalized/date";
interface TaxHandlersProps {
  date?: RangeValue<DateValue> | null;
  token: string;
  setLoading: (value: boolean) => void;
  setDate?: (value: RangeValue<DateValue>) => void;
  setTaxInvoicing: (value: ItemsTaxInvoicing[]) => void;
}

export async function handleRefresh({
  date,
  token,
  setLoading,
  setTaxInvoicing,
}: TaxHandlersProps) {
  if (!date) return;

  await fetchTaxBiling({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    setLoading,
    setTaxInvoicing,
  });
}

export async function handleDateFilter({
  date,
  token,
  setLoading,
  setDate,
  setTaxInvoicing,
}: TaxHandlersProps) {
  if (!date || !setDate) return;

  setDate(date);

  await fetchTaxBiling({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    setLoading,
    setTaxInvoicing,
  });
}

export async function handleCleanFilter({
  token,
  setLoading,
  setDate,
  setTaxInvoicing,
}: TaxHandlersProps) {
  if (!setDate) return;

  const { today, year, month } = getCurrentDateDetails();

  setDate({
    start: parseDate(
      new Date(`${year}/${month}/01`).toISOString().split("T")[0]
    ),
    end: parseDate(new Date().toISOString().split("T")[0]),
  });

  await fetchTaxBiling({
    dateInit: `${year}/${month}/01`,
    dateEnd: today,
    token,
    setLoading,
    setTaxInvoicing,
  });
}
