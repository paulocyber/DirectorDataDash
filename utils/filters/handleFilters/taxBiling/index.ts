// Utils
import { fetchTaxBiling } from "@/utils/fetchs/taxBiling";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import { ItemsTaxInvoicing } from "@/types/TaxBiling";
import { DateValue } from "@heroui/react";
import { RangeValue } from "@react-types/shared";
import { parseDate } from "@internationalized/date";
interface TaxBilingProps {
  token: string;
  date: RangeValue<DateValue> | null;
  setDate?: (value: RangeValue<DateValue>) => void;
  setLoading: (value: boolean) => void;
  setBillingByCompany: (value: ItemsTaxInvoicing[]) => void;
}

export async function handleRefresh({
  token,
  date,
  setLoading,
  setBillingByCompany,
}: TaxBilingProps) {
  if (!date) return;

  await fetchTaxBiling({
    token,
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    setLoading,
    setBillingByCompany,
  });
}

export async function handleDateFilter({
  token,
  date,
  setLoading,
  setDate,
  setBillingByCompany,
}: TaxBilingProps) {
  if (!date || !setDate) return;

  setDate(date);

  await fetchTaxBiling({
    token,
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    setLoading,
    setBillingByCompany,
  });
}

export async function handleCleanFilter({
  token,
  setLoading,
  setDate,
  setBillingByCompany,
}: TaxBilingProps) {
  if (!setDate) return;

  const { today, year, month } = getCurrentDateDetails();

  setDate({
    start: parseDate(
      new Date(`${year}/${month}/01`).toISOString().split("T")[0]
    ),
    end: parseDate(new Date().toISOString().split("T")[0]),
  });

  await fetchTaxBiling({
    token,
    dateInit: `${year}/${month}/01`,
    dateEnd: today,
    setLoading,
    setBillingByCompany,
  });
}
