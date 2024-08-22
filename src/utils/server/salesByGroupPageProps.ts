// Service
import { setupApiClient } from "@/service/api/api";

// Next - Servidor
import { canSSRAuth } from "../permissions/canSSRAuth";

// Utils
import getDate from "../date/currentDate";
import { SalesByGroup } from "../queries/SalesByGroup";
import { Stock } from "../queries/stock";
import { groupSumByGroup } from "../filters/salesByGroup/groupSumByGroup";
import { groupSumByStock } from "../filters/stock/groupSumByStock";

export const getSalesByGroupPageProps = canSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx);
  const { today } = getDate();

  const salesByGroup = SalesByGroup({ dateInit: today, dateEnd: today });
  let { stockByGroup } = Stock();

  const [respSalesByGroup, respStockByGroup] = await Promise.all([
    apiClient.post("/v1/find-db-query", { query: salesByGroup }),
    apiClient.post("/v1/find-db-query", { query: stockByGroup }),
  ]);

  const valuePerGroupSale = groupSumByGroup(
    respSalesByGroup.data.returnObject.body
  );
  const sumOfStockByBrand = groupSumByStock(
    respStockByGroup.data.returnObject.body,
    "group"
  );
  
  return {
    props: {
      listSalesByGroup: valuePerGroupSale,
      listStockByGroup: sumOfStockByBrand,
    },
  };
});
