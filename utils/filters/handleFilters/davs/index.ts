// Utils
import { fetchDavs } from "@/utils/fetchs/davs";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import { RangeValue } from "@react-types/shared";
import { parseDate, type DateValue } from "@internationalized/date";
import { ItemsDavData } from "@/types/davs";
import { ItemsSalesPerMonth } from "@/types/sales";
interface DavsProps {
  date?: RangeValue<DateValue> | null;
  formsOfPayments?: string[];
  token: string;
  setDate?: (value: RangeValue<DateValue>) => void;
  setDavs: (value: ItemsDavData[]) => void;
  setSalesByPaymentMethod?: (
    data: { FORMA_PGMT: string; value: number }[]
  ) => void;
  setSalesPerMonth?: (value: ItemsSalesPerMonth[]) => void;
  setLoading: (value: boolean) => void;
}

export async function handleRefresh({
  date,
  token,
  formsOfPayments,
  setDavs,
  setSalesByPaymentMethod,
  setSalesPerMonth,
  setLoading,
}: DavsProps) {
  if (!date) return;

  await fetchDavs({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    formsOfPayments,
    setDavs,
    setSalesByPaymentMethod,
    setSalesPerMonth,
    setLoading,
  });
}

export async function handleDateFilter({
  date,
  token,
  formsOfPayments,
  setDate,
  setDavs,
  setSalesByPaymentMethod,
  setSalesPerMonth,
  setLoading,
}: DavsProps) {
  if (!date || !setDate) return;

  setDate(date);

  await fetchDavs({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    formsOfPayments,
    setDavs,
    setSalesByPaymentMethod,
    setSalesPerMonth,
    setLoading,
  });
}

export async function handleCleanFilter({
  token,
  setDate,
  setDavs,
  setSalesByPaymentMethod,
  setSalesPerMonth,
  setLoading,
}: DavsProps) {
  if (!setDate) return;

  const { today } = getCurrentDateDetails();

  setDate({
    start: parseDate(new Date(today).toISOString().split("T")[0]),
    end: parseDate(new Date(today).toISOString().split("T")[0]),
  });

  await fetchDavs({
    dateInit: today,
    dateEnd: today,
    token,
    setDavs,
    setSalesByPaymentMethod,
    setSalesPerMonth,
    setLoading,
  });
}
