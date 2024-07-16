// Utils
import currentDate from "@/utils/CurrentDate";

// Biblioteca
import { DateValue, RangeValue } from "@nextui-org/react";

// Tipagem
import { parseDate } from "@internationalized/date";

export async function handleCleanFilter(
  setDate: (date: RangeValue<DateValue>) => void,
  fetchItems: (dataInit?: string, dataEnd?: string, clear?: boolean) => Promise<void>,
  setFilter: (filter: any[]) => void
) {
  const { year, month, day } = currentDate();

  setDate({
    start: parseDate(
      new Date(`${year}/${month}/01`).toISOString().split("T")[0]
    ),
    end: parseDate(new Date().toISOString().split("T")[0]),
  });

  const dataInit = `${year}/${month}/01`;
  const dataEnd = `${year}/${month}/${day}`;
  setFilter([]);

  await fetchItems(dataInit, dataEnd, true); 
}

