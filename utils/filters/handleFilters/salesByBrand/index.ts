// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { fetchSalesByBrand } from "@/utils/fetchs/salesByBrand";

// Tipagem
import { ItemsdebtAndStock, ItemsSalesAndBuy } from "@/types/sales";
import { DateValue } from "@heroui/react";
import { RangeValue } from "@react-types/shared";

interface SalesByBrandProps {
  token: string;
  date?: RangeValue<DateValue> | null;
  selectedPeriod?: string;
  brands: string[];
  setDate?: (value: RangeValue<DateValue> | null) => void;
  setLoading: (value: boolean) => void;
  setSelectedPeriod?: (value: string) => void;
  setSalesAndBuy: (value: ItemsSalesAndBuy[]) => void;
  setDebtAndStock: (value: ItemsdebtAndStock[]) => void;
}

export async function handleRefresh({
  token,
  selectedPeriod,
  brands,
  setLoading,
  setSalesAndBuy,
  setDebtAndStock,
}: SalesByBrandProps) {
  const { today, year, month, startOfWeek, endOfWeek } =
    getCurrentDateDetails();

  if (selectedPeriod === "Dia") {
    await fetchSalesByBrand({
      token,
      dateInit: today,
      dateEnd: today,
      year,
      brands,
      setLoading,
      setDebtAndStock,
      setSalesAndBuy,
    });
  } else if (selectedPeriod === "Semana") {
    await fetchSalesByBrand({
      token,
      dateInit: startOfWeek,
      dateEnd: endOfWeek,
      year: year,
      brands,
      setLoading,
      setDebtAndStock,
      setSalesAndBuy,
    });
  } else if (selectedPeriod === "Mês") {
    await fetchSalesByBrand({
      token,
      dateInit: `${year}/${month}/01`,
      dateEnd: today,
      year,
      brands,
      setLoading,
      setDebtAndStock,
      setSalesAndBuy,
    });
  } else if (selectedPeriod === "Ano") {
    await fetchSalesByBrand({
      token,
      dateInit: `${year}/01/01`,
      dateEnd: today,
      year,
      brands,
      setLoading,
      setDebtAndStock,
      setSalesAndBuy,
    });
  } else {
    return;
  }
}

export async function handleDateFilter({
  token,
  brands,
  date,
  setDate,
  setLoading,
  setSalesAndBuy,
  setDebtAndStock,
}: SalesByBrandProps) {
  if (!date) return;

  setDate && setDate(date ? date : null);

  await fetchSalesByBrand({
    token,
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    brands,
    setLoading,
    setDebtAndStock,
    setSalesAndBuy,
    year: date.end.year,
  });
}

export async function handleCleanFilter({
  token,
  brands,
  setSelectedPeriod,
  setDate,
  setLoading,
  setDebtAndStock,
  setSalesAndBuy,
}: SalesByBrandProps) {
  setSelectedPeriod && setSelectedPeriod("Dia");
  setDate && setDate(null);
  const { year, today } = getCurrentDateDetails();

  await fetchSalesByBrand({
    token,
    dateInit: today,
    dateEnd: today,
    year,
    brands,
    setLoading,
    setSalesAndBuy,
    setDebtAndStock,
  });
}
