// Bibliotecas
import { DateValue, RangeValue } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";

// Utils
import { fetchBillsToReceiveTable } from "@/utils/fetchData/billsToReceive/table";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";
interface BillsToReceiveHandlersProps {
  date?: RangeValue<DateValue> | null;
  token: string;
  setDate?: (value: RangeValue<DateValue>) => void;
  setLoading: (value: boolean) => void;
  setBillsToReceive: (value: ItemsBillsToReceiveData[]) => void;
  setOpenBills: (value: ItemsBillsToReceiveData[]) => void;
}

export async function handleRefresh({
  date,
  token,
  setLoading,
  setBillsToReceive,
  setOpenBills,
}: BillsToReceiveHandlersProps) {
  if (!date) return;

  await fetchBillsToReceiveTable({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    setLoading,
    setBillsToReceive,
    setOpenBills,
  });
}

export async function handleCleanFilter({
  token,
  setDate,
  setLoading,
  setBillsToReceive,
  setOpenBills,
}: BillsToReceiveHandlersProps) {
  if (!setDate) return;

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
  setDate,
  setLoading,
  setBillsToReceive,
  setOpenBills,
}: BillsToReceiveHandlersProps) {
  if (!date || !setDate) return;

  setDate(date);

  await fetchBillsToReceiveTable({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    setLoading,
    setBillsToReceive,
    setOpenBills,
  });
}
