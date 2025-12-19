// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { fetchBillsToReceive } from "@/utils/fetchs/billsToReceive";

// Tipagem
import { DateValue } from "@heroui/react";
import { RangeValue } from "@react-types/shared";
import { ItemsBillsToReceive } from "@/types/billsToReceive";
import { parseDate } from "@internationalized/date";

interface BillsToReceiveProps {
  token: string;
  date?: RangeValue<DateValue> | null;
  peoples?: string[];
  setPeoples?: (value: string[]) => void;
  setDate?: (value: RangeValue<DateValue>) => void;
  setLoading: (value: boolean) => void;
  setBillsToReceive: (value: ItemsBillsToReceive[]) => void;
  setOverdueClients?: (value: ItemsBillsToReceive[]) => void;
  setBilletsOpen?: (value: ItemsBillsToReceive[]) => void;
  setDetailDav?: (value: undefined) => void;
  setSummaryOfReceivableData?: (
    value: { name: string; value: number }[]
  ) => void;
}

export async function handleRefresh({
  date,
  token,
  peoples,
  setLoading,
  setBillsToReceive,
  setSummaryOfReceivableData,
  setOverdueClients,
}: BillsToReceiveProps) {
  if (!date) return;

  await fetchBillsToReceive({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    year: date.start.year,
    token,
    peoples,
    setLoading,
    setBillsToReceive,
    setSummaryOfReceivableData,
    setOverdueClients,
  });
}

export async function handleCleanFilter({
  token,
  setPeoples,
  setDate,
  setLoading,
  setBillsToReceive,
  setSummaryOfReceivableData,
  setDetailDav,
  setBilletsOpen,
  setOverdueClients,
}: BillsToReceiveProps) {
  if (!setDate || !setPeoples || !setDetailDav) return;

  const { today, year } = getCurrentDateDetails();

  setPeoples([]);
  setDetailDav(undefined);

  // setDate({
  //   start: parseDate(new Date(`2023/01/01`).toISOString().split("T")[0]),
  //   end: parseDate(new Date(today).toISOString().split("T")[0]),
  // });

  await fetchBillsToReceive({
    dateInit: `2023/01/01`,
    dateEnd: today,
    year,
    token,
    setLoading,
    setBillsToReceive,
    setSummaryOfReceivableData,
    setBilletsOpen,
    setOverdueClients,
  });
}

export async function handleDateFilter({
  date,
  token,
  peoples,
  setDate,
  setLoading,
  setBillsToReceive,
  setBilletsOpen,
  setSummaryOfReceivableData,
  setOverdueClients,
  setDetailDav,
}: BillsToReceiveProps) {
  if (!date || !setDate || !setDetailDav) return;

  setDate(date);
  setDetailDav(undefined);

  await fetchBillsToReceive({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    year: date.start.year,
    token,
    setLoading,
    peoples,
    setBillsToReceive,
    setSummaryOfReceivableData,
    setBilletsOpen,
    setOverdueClients,
  });
}
