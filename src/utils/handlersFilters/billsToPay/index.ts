// Utils
import { fetchBillsToPay } from "@/utils/fetchData/billsToPay";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import { ItemsBillsToPay } from "@/types/billsToPay";
import { DateValue, RangeValue } from "@heroui/react";
import { parseDate } from "@internationalized/date";
interface BillsToPayHandlersProps {
  date?: RangeValue<DateValue> | null;
  clear?: boolean;
  token: string;
  setLoading: (value: boolean) => void;
  setDate?: (value: RangeValue<DateValue>) => void;
  setClear?: (value: boolean) => void;
  setFilters?: (value: SelectionDescription[]) => void;
  setAllBillets: (value: ItemsBillsToPay[]) => void;
  setOpenBills: (value: ItemsBillsToPay[]) => void;
  setPaidBills: (value: ItemsBillsToPay[]) => void;
  setOverdueBills: (value: ItemsBillsToPay[]) => void;
}

type SelectionDescription = {
  description: string;
  color: string;
  id: number;
};

export async function handleRefresh({
  date,
  clear,
  token,
  setLoading,
  setAllBillets,
  setOpenBills,
  setOverdueBills,
  setPaidBills,
}: BillsToPayHandlersProps) {
  if (!date || clear === null) return;

  await fetchBillsToPay({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    clear,
    setLoading,
    setAllBillets,
    setOpenBills,
    setOverdueBills,
    setPaidBills,
  });
}

export async function handleCleanFilter({
  date,
  token,
  setClear,
  setDate,
  setLoading,
  setFilters,
  setAllBillets,
  setOpenBills,
  setOverdueBills,
  setPaidBills,
}: BillsToPayHandlersProps) {
  if (!date || !setDate || !setClear) return;

  const { today, year, month } = getCurrentDateDetails();

  setDate({
    start: parseDate(
      new Date(`${year}/${month}/01`).toISOString().split("T")[0]
    ),
    end: parseDate(new Date().toISOString().split("T")[0]),
  });
  setClear(true);
  setFilters && setFilters([]);

  await fetchBillsToPay({
    dateInit: `${year}/${month}/01`,
    dateEnd: today,
    token,
    clear: true,
    setLoading,
    setAllBillets,
    setOpenBills,
    setOverdueBills,
    setPaidBills,
  });
}

export async function handleDateFilter({
  date,
  token,
  setDate,
  setClear,
  setLoading,
  setFilters,
  setAllBillets,
  setOpenBills,
  setOverdueBills,
  setPaidBills,
}: BillsToPayHandlersProps) {
  if (!date || !setDate || !setClear ) return;

  setDate(date);
  setClear(false);
  setFilters && setFilters([]);

  await fetchBillsToPay({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    clear: false,
    setLoading,
    setAllBillets,
    setOpenBills,
    setOverdueBills,
    setPaidBills,
  });
}
