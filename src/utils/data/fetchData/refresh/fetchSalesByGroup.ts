// Utils
import { stockQueries } from "@/utils/queries/stock";

// Tipagem
import { TopProducts } from "@/types/stock";
interface FetchSalesByGroupProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  brands: string[];
  emp: string;
  setLoading: (value: boolean) => void;
  setTopProducts: (value: TopProducts[]) => void;
}

export async function fetchSalesByGroup({
  token,
  dateInit,
  dateEnd,
  emp,
  brands,
  setLoading,
  setTopProducts,
}: FetchSalesByGroupProps) {
  setLoading(true);

  const { topsProductsByBrand } = stockQueries({
    dateInit,
    dateEnd,
    emp,
    brands: brands,
  });

  
}
