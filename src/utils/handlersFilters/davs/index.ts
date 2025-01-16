// Utils
import { ItemsDavData } from "@/types/dav";
import { fetchDavs } from "@/utils/fetchData/davs";
import getCurrentDateDetails from "@/utils/getDate";
import { parseDate } from "@internationalized/date";

// Tipagem
import { DateValue, RangeValue } from "@nextui-org/react";
interface salesHandlersProps {
  date?: RangeValue<DateValue> | null;
  token: string;
  setDate?: (value: RangeValue<DateValue>) => void;
  setDavs: (data: ItemsDavData[]) => void;
  setLoading: (value: boolean) => void;
}

export async function handleRefresh({
  date,
  token,
  setDavs,
  setLoading,
}: salesHandlersProps) {
  if (!date) return;

  await fetchDavs({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    setDavs,
    setLoading,
  });
}

export async function handleCleanFilter({
  date,
  token,
  setDate,
  setDavs,
  setLoading,
}: salesHandlersProps) {
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
    setLoading,
  });
}

export async function handleDateFilter({
  date,
  token,
  setDate,
  setDavs,
  setLoading,
}: salesHandlersProps) {
  if (!date || !setDate) return;
  setDate(date);

  await fetchDavs({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    setDavs,
    setLoading,
  });
}
