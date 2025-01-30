// Utils
import { fetchSalesByBrand } from "@/utils/fetchData/salesByBrand";
import getCurrentDateDetails from "@/utils/getDate";

// Bilioteca
import { DateValue, RangeValue } from "@nextui-org/react";

// Tipagem
import { ItemsSalesByBuy } from "@/types/salesByBrand";
import { ItemsStockByBrand } from "@/types/stock";
interface SalesByBrandHandlersProps {
  date?: RangeValue<DateValue> | null;
  selectedPeriod?: string;
  token: string;
  brands: string[];
  setDate?: (value: RangeValue<DateValue>) => void;
  setSelectedPeriod?: (value: string) => void;
  setLoading: (value: boolean) => void;
  setBrandSales: (value: ItemsSalesByBuy[]) => void;
  setBrandStockAndDebt: (value: ItemsStockByBrand[]) => void;
}

export async function handleRefresh({
  selectedPeriod,
  token,
  brands,
  setLoading,
  setBrandSales,
  setBrandStockAndDebt,
}: SalesByBrandHandlersProps) {
  const { today, year, month, day, startOfWeek, endOfWeek } =
    getCurrentDateDetails();

  if (selectedPeriod === "Dia") {
    await fetchSalesByBrand({
      token,
      dateInit: today,
      dateEnd: today,
      brands,
      setLoading,
      setBrandSales,
      setBrandStockAndDebt,
      year: year,
    });
  } else if (selectedPeriod === "Semana") {
    await fetchSalesByBrand({
      token,
      dateInit: startOfWeek,
      dateEnd: endOfWeek,
      brands,
      setLoading,
      setBrandSales,
      setBrandStockAndDebt,
      year: year,
    });
  } else if (selectedPeriod === "Mês") {
    await fetchSalesByBrand({
      token,
      dateInit: startOfWeek,
      dateEnd: endOfWeek,
      brands,
      setLoading,
      setBrandSales,
      setBrandStockAndDebt,
      year: year,
    });
  } else if (selectedPeriod === "Mês") {
    await fetchSalesByBrand({
      token,
      dateInit: `${year}/${month}/01`,
      dateEnd: today,
      brands,
      setLoading,
      setBrandSales,
      setBrandStockAndDebt,
      year: year,
    });
  } else if (selectedPeriod === "Ano") {
    await fetchSalesByBrand({
      token,
      dateInit: `${year}/01/01`,
      dateEnd: today,
      brands,
      setLoading,
      setBrandSales,
      setBrandStockAndDebt,
      year: year,
    });
  } else {
    return;
  }
}

export async function handleDateFilter({
  date,
  token,
  brands,
  setDate,
  setLoading,
  setBrandSales,
  setBrandStockAndDebt,
}: SalesByBrandHandlersProps) {
  if (!date || !setDate) return;

  setDate(date);

  await fetchSalesByBrand({
    token,
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    brands,
    setLoading,
    setBrandSales,
    setBrandStockAndDebt,
    year: date.end.year,
  });
}

export async function handleCleanFilter({
  token,
  brands,
  setSelectedPeriod,
  setLoading,
  setBrandSales,
  setBrandStockAndDebt,
}: SalesByBrandHandlersProps) {
  if (!setSelectedPeriod) return;

  setSelectedPeriod("Dia");
  const { year, today } = getCurrentDateDetails();

  await fetchSalesByBrand({
    token,
    dateInit: today,
    dateEnd: today,
    brands,
    setLoading,
    setBrandSales,
    setBrandStockAndDebt,
    year: year,
  });
}
