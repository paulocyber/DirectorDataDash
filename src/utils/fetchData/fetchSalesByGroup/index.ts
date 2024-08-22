// Serviço
import { setupApiClient } from "@/service/api/api";

// Utils
import { SalesByGroup } from "@/utils/queries/SalesByGroup";
import { Stock } from "@/utils/queries/stock";
import { groupSumByGroup } from "@/utils/filters/salesByGroup/groupSumByGroup";
import { groupSumByStock } from "@/utils/filters/stock/groupSumByStock";

// Tipagem
import { SalesByGroupType } from "@/utils/types/salesByGroup";
import { StockByGroup } from "@/utils/types/stock";
interface FetchSalesByBrandProps {
  setLoading: (value: boolean) => void;
  dateInit: string;
  dateEnd: string;
  setSalesByGroup: (sales: SalesByGroupType[]) => void;
  setStockByGroup: (sales: StockByGroup[]) => void;
}

export async function fetchSalesByGroup({
  dateInit,
  dateEnd,
  setLoading,
  setSalesByGroup,
  setStockByGroup,
}: FetchSalesByBrandProps) {
  const apiClient = setupApiClient();

  setLoading(true);

  const salesByGroup = SalesByGroup({ dateInit, dateEnd });
  let { stockByGroup } = Stock();

  const [respSalesByGroup, respStockByGroup] = await Promise.all([
    apiClient.post("/v1/find-db-query", { query: salesByGroup }),
    apiClient.post("/v1/find-db-query", { query: stockByGroup }),
  ]);

  const sumByGroup = groupSumByGroup(respSalesByGroup.data.returnObject.body);
  
  const sumOfStockByBrand = groupSumByStock(
    respStockByGroup.data.returnObject.body,
    "group",
  )

  setSalesByGroup(sumByGroup);
  setStockByGroup(sumOfStockByBrand);

  setLoading(false);
}
