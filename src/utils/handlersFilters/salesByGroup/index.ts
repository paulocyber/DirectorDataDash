// Utils
import { fetchSalesByGroup } from "@/utils/fetchData/salesByGroup";

// Tipagem
import { RangeValue, DateValue } from "@nextui-org/react";
interface SalesByGroupProps {
  token: string;
  setLoading: (value: boolean) => void;
  setCurrentSalesData: (value: { brand: string; value: number }[]) => void;
  setLastSalesData: (value: { brand: string; value: number }[]) => void;
}

export async function handleRefresh({
  token,
  setLoading,
  setCurrentSalesData,
  setLastSalesData,
}: SalesByGroupProps) {
  await fetchSalesByGroup({
    token,
    setLoading,
    setCurrentSalesData,
    setLastSalesData,
  });
}
