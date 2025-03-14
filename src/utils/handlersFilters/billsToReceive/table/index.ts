// Bibliotecas
import { DateValue, RangeValue } from "@heroui/react";
import { parseDate } from "@internationalized/date";

// Utils
import { fetchBillsToReceiveTable } from "@/utils/fetchData/billsToReceive/table";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";
interface BillsToReceiveHandlersProps {
  date?: RangeValue<DateValue> | null;
  token: string;
  people?: string[];
  setPeople?: (value: string[]) => void;
  setDate?: (value: RangeValue<DateValue>) => void;
  setLoading: (value: boolean) => void;
  setBillsToReceive: (value: ItemsBillsToReceiveData[]) => void;
  setOpenBills: (value: ItemsBillsToReceiveData[]) => void;
  setDetailDav?: (value: undefined) => void;
}

export async function handleRefresh({
  date,
  token,
  people,
  setLoading,
  setBillsToReceive,
  setOpenBills,
}: BillsToReceiveHandlersProps) {
  if (!date) return;

  await fetchBillsToReceiveTable({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    people: people?.length === 0 ? undefined : people,
    setLoading,
    setBillsToReceive,
    setOpenBills,
  });
}

export async function handleCleanFilter({
  token,
  setPeople,
  setDate,
  setLoading,
  setBillsToReceive,
  setOpenBills,
  setDetailDav,
}: BillsToReceiveHandlersProps) {
  if (!setDate || !setPeople || !setDetailDav) return;

  setPeople([]);
  setDetailDav(undefined);

  const { today, year } = getCurrentDateDetails();

  setDate({
    start: parseDate(new Date(`2023/01/01`).toISOString().split("T")[0]),
    end: parseDate(new Date(today).toISOString().split("T")[0]),
  });

  await fetchBillsToReceiveTable({
    dateInit: `2023/01/01`,
    dateEnd: today,
    token,
    setLoading,
    setBillsToReceive,
    setOpenBills,
  });
}

export async function handleDateFilter({
  date,
  token,
  people,
  setPeople,
  setDate,
  setLoading,
  setBillsToReceive,
  setOpenBills,
  setDetailDav
}: BillsToReceiveHandlersProps) {
  if (!date || !setDate || !setDetailDav) return;

  setDetailDav(undefined)
  setDate(date);

  await fetchBillsToReceiveTable({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    people: people?.length === 0 ? undefined : people,
    setLoading,
    setBillsToReceive,
    setOpenBills,
  });
}
