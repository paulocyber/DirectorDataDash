// Utils
import { fetchBillsToPay } from "@/utils/fetchs/billsToPay";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import { DateValue, RangeValue } from "@heroui/react";
import { ItemsBillsToPay } from "@/types/billsToPay";
import { parseDate } from "@internationalized/date";
import { ItemsFilterSelecting } from "@/types/filters/selecting";
interface BillsToPayProps {
  token: string;
  date?: RangeValue<DateValue> | null;
  clear?: boolean;
  costsCenters?: string[];
  setLoading: (value: boolean) => void;
  setClear?: (value: boolean) => void;
  setCostsCenters?: (value: ItemsFilterSelecting[]) => void;
  setDate?: (value: RangeValue<DateValue>) => void;
  setAllBillets: (value: ItemsBillsToPay[]) => void;
  setOpenBillets: (value: ItemsBillsToPay[]) => void;
  setOverdueBillets: (value: ItemsBillsToPay[]) => void;
  setPaidBillets: (value: ItemsBillsToPay[]) => void;
}

export async function handleRefresh({
  token,
  date,
  clear,
  costsCenters,
  setLoading,
  setAllBillets,
  setOpenBillets,
  setOverdueBillets,
  setPaidBillets,
}: BillsToPayProps) {
  if (!date) return;
  
  await fetchBillsToPay({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    clear,
    costsCenters,
    setLoading,
    setAllBillets,
    setOpenBillets,
    setOverdueBillets,
    setPaidBillets,
  });
}

export async function handleDateFilter({
  token,
  date,
  costsCenters,
  setLoading,
  setDate,
  setAllBillets,
  setOpenBillets,
  setPaidBillets,
  setOverdueBillets,
}: BillsToPayProps) {
  if (!date || !setDate) return;

  setDate(date);

  await fetchBillsToPay({
    token,
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    clear: false,
    costsCenters,
    setLoading,
    setAllBillets,
    setOpenBillets,
    setOverdueBillets,
    setPaidBillets,
  });
}

export async function handleCleanFilter({
  token,
  date,
  setLoading,
  setCostsCenters,
  setClear,
  setDate,
  setAllBillets,
  setOpenBillets,
  setOverdueBillets,
  setPaidBillets,
}: BillsToPayProps) {
  if (!date || !setDate || !setClear || !setCostsCenters) return;

  const { today, year, month } = getCurrentDateDetails();

  setDate({
    start: parseDate(
      new Date(`${year}/${month}/01`).toISOString().split("T")[0]
    ),
    end: parseDate(new Date().toISOString().split("T")[0]),
  });
  setClear(true);
  setCostsCenters([]);

  await fetchBillsToPay({
    dateInit: `${year}/${month}/01`,
    dateEnd: today,
    token,
    clear: true,
    setLoading,
    setAllBillets,
    setOpenBillets,
    setOverdueBillets,
    setPaidBillets,
  });
}
