// Utils
import { fetchLateCustomer } from "@/utils/fetchData/lateCustomer";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";
import { DateValue, RangeValue } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";

interface salesHandlersProps {
  date?: RangeValue<DateValue> | null;
  sellerSurname: string | undefined;
  token: string;
  setDate?: (value: RangeValue<DateValue>) => void;
  setLoading: (value: boolean) => void;
  setOpenBillsData: (value: ItemsBillsToReceiveData[]) => void;
  setOverdueBillsData: (vakue: ItemsBillsToReceiveData[]) => void;
}

export async function handleRefresh({
  date,
  sellerSurname,
  token,
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
    setLoading,
    setOpenBillsData,
    setOverdueBillsData,
  });
}

export async function handleCleanFilter({
  sellerSurname,
  token,
  setLoading,
  setOpenBillsData,
  setOverdueBillsData,
  setDate,
}: salesHandlersProps) {
  if (!setDate) return;
  const { yesterday, year, month } = getCurrentDateDetails();

  setDate({
    start: parseDate(
      new Date(`2023/01/01`).toISOString().split("T")[0]
    ),
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
    token,
    setLoading,
    setOpenBillsData,
    setOverdueBillsData,
  });
}
