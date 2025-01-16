// Bibliotecas
import { RangeValue, DateValue } from "@nextui-org/react";

// Utils
import { fetchBillsToReceive } from "@/utils/fetchData/billsToReceive";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";
import { parseDate } from "@internationalized/date";
interface BillsToReceiveHandlersProps {
  date?: RangeValue<DateValue> | null;
  token: string;
  setDate?: (value: RangeValue<DateValue>) => void;
  setLoading: (value: boolean) => void;
  setBillsToReceive: (value: ItemsBillsToReceiveData[]) => void;
  setSummaryOfReceivableData: (
    value: { name: string; value: number }[]
  ) => void;
  setOverdueClients: (value: ItemsBillsToReceiveData[]) => void;
}

export async function handleRefresh({
  date,
  token,
  setLoading,
  setBillsToReceive,
  setSummaryOfReceivableData,
  setOverdueClients,
}: BillsToReceiveHandlersProps) {
  if (!date) return;

  await fetchBillsToReceive({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    year: date.start.year,
    token,
    setLoading,
    setBillsToReceive,
    setSummaryOfReceivableData,
    setOverdueClients,
  });
}

export async function handleCleanFilter({
  token,
  setDate,
  setLoading,
  setBillsToReceive,
  setSummaryOfReceivableData,
  setOverdueClients,
}: BillsToReceiveHandlersProps) {
  if (!setDate) return;

  const { today, year } = getCurrentDateDetails();

  setDate({
    start: parseDate(new Date(`2023/01/01`).toISOString().split("T")[0]),
    end: parseDate(new Date(today).toISOString().split("T")[0]),
  });

  await fetchBillsToReceive({
    dateInit: `2023/01/01`,
    dateEnd: today,
    year,
    token,
    setLoading,
    setBillsToReceive,
    setSummaryOfReceivableData,
    setOverdueClients,
  });
}

export async function handleDateFilter({
  date,
  token,
  setDate,
  setLoading,
  setBillsToReceive,
  setSummaryOfReceivableData,
  setOverdueClients,
}: BillsToReceiveHandlersProps) {
  if (!date || !setDate) return;

  setDate(date);

  await fetchBillsToReceive({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    year: date.start.year,
    token,
    setLoading,
    setBillsToReceive,
    setSummaryOfReceivableData,
    setOverdueClients,
  });
}
