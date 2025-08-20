// Utils
import { fetchDavs } from "@/utils/fetchs/davs";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import { RangeValue } from "@react-types/shared";
import { parseDate, type DateValue } from "@internationalized/date";
import { ItemsDavData } from "@/types/davs";
import { ItemsSalesPerMonth } from "@/types/sales";
interface DavsProps {
  date?: RangeValue<DateValue> | null;
  formsOfPayments?: string[];
  idSellers?: string[];
  selectTheCompany?: string[];
  selectPeoples?: string[];
  token: string;
  setDate?: (value: RangeValue<DateValue>) => void;
  setDavs: (value: ItemsDavData[]) => void;
  setSalesByPaymentMethod?: (
    data: { FORMA_PGMT: string; value: number }[]
  ) => void;
  setSalesPerMonth?: (value: ItemsSalesPerMonth[]) => void;
  setIdSellers?: (value: string[]) => void;
  setSelectTheCompany?: (value: string[]) => void;
  setSelectPeoples?: (value: string[]) => void;
  setLoading: (value: boolean) => void;
}

export async function handleRefresh({
  date,
  token,
  formsOfPayments,
  idSellers,
  selectTheCompany,
  selectPeoples,
  setDavs,
  setSalesByPaymentMethod,
  setSalesPerMonth,
  setLoading,
}: DavsProps) {
  if (!date) return;

  await fetchDavs({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    formsOfPayments,
    idSellers,
    companys: selectTheCompany,
    peoples: selectPeoples,
    setDavs,
    setSalesByPaymentMethod,
    setSalesPerMonth,
    setLoading,
  });
}

export async function handleDateFilter({
  date,
  token,
  formsOfPayments,
  idSellers,
  selectTheCompany,
  selectPeoples,
  setDate,
  setDavs,
  setSalesByPaymentMethod,
  setSalesPerMonth,
  setLoading,
}: DavsProps) {
  if (!date || !setDate) return;

  setDate(date);

  await fetchDavs({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    formsOfPayments,
    idSellers,
    companys: selectTheCompany,
    peoples: selectPeoples,
    setDavs,
    setSalesByPaymentMethod,
    setSalesPerMonth,
    setLoading,
  });
}

export async function handleCleanFilter({
  token,
  setDate,
  setDavs,
  setSalesByPaymentMethod,
  setSalesPerMonth,
  setIdSellers,
  setSelectTheCompany,
  setSelectPeoples,
  setLoading,
}: DavsProps) {
  if (!setDate || !setIdSellers || !setSelectTheCompany || !setSelectPeoples)
    return;

  const { today } = getCurrentDateDetails();

  setIdSellers([]);
  setSelectTheCompany([]);
  setSelectPeoples([]);
  setDate({
    start: parseDate(new Date(today).toISOString().split("T")[0]),
    end: parseDate(new Date(today).toISOString().split("T")[0]),
  });

  await fetchDavs({
    dateInit: today,
    dateEnd: today,
    token,
    setDavs,
    setSalesByPaymentMethod,
    setSalesPerMonth,
    setLoading,
  });
}
