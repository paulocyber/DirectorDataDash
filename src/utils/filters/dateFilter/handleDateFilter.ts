// Tipagem
import { DateValue, RangeValue } from "@nextui-org/react";

export async function handleDateFilter(
  date: RangeValue<DateValue>,
  setDate: (date: RangeValue<DateValue>) => void,
  fetchItems: (dataInit?: string, dataEnd?: string, clear?: boolean) => Promise<void>,
  setFilter?: (filter: any[]) => void
) {
  setDate(date);

  const dataInit = `${date.start.year}/${date.start.month}/${date.start.day}`;
  const dataEnd = `${date.end.year}/${date.end.month}/${date.end.day}`;
  setFilter && setFilter([]);

  await fetchItems(dataInit, dataEnd, false); 
}
