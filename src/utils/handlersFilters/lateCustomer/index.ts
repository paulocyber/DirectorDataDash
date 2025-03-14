// Utils
import { fetchLateCustomer } from "@/utils/fetchData/lateCustomer";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";
import { DateValue, RangeValue } from "@heroui/react";
import { parseDate } from "@internationalized/date";

interface salesHandlersProps {
  date?: RangeValue<DateValue> | null;
  sellerSurname: string | undefined;
  token: string;
  people?: string[];
  setPeople?: (value: string[]) => void;
  setDate?: (value: RangeValue<DateValue>) => void;
  setLoading: (value: boolean) => void;
  setOpenBillsData: (value: ItemsBillsToReceiveData[]) => void;
  setOverdueBillsData: (vakue: ItemsBillsToReceiveData[]) => void;
}

export async function handleRefresh({
  date,
  sellerSurname,
  token,
  people,
  setLoading,
  setOpenBillsData,
  setOverdueBillsData,
}: salesHandlersProps) {
  if (!date) return;

  await fetchLateCustomer({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    sellerSurname,
    token,
    people: people?.length === 0 ? undefined : people,
    setLoading,
    setOpenBillsData,
    setOverdueBillsData,
  });
}

export async function handleCleanFilter({
  sellerSurname,
  token,
  setPeople,
  setLoading,
  setOpenBillsData,
  setOverdueBillsData,
  setDate,
}: salesHandlersProps) {
  if (!setDate || !setPeople) return;
  const { yesterday, year, month } = getCurrentDateDetails();

  setPeople([]);
  setDate({
    start: parseDate(new Date(`2023/01/01`).toISOString().split("T")[0]),
    end: parseDate(new Date(yesterday).toISOString().split("T")[0]),
  });

  await fetchLateCustomer({
    dateInit: `2023/01/01`,
    dateEnd: `${yesterday}`,
    sellerSurname,
    token,
    setLoading,
    setOpenBillsData,
    setOverdueBillsData,
  });
}

export async function handleDateFilter({
  date,
  sellerSurname,
  people,
  token,
  setLoading,
  setOpenBillsData,
  setOverdueBillsData,
  setDate,
}: salesHandlersProps) {
  if (!date || !setDate) return;
  setDate(date);

  await fetchLateCustomer({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    sellerSurname,
    people: people?.length === 0 ? undefined : people,
    token,
    setLoading,
    setOpenBillsData,
    setOverdueBillsData,
  });
}
