//  Framework - Servidor
import { setupApiClient } from "@/service/api/api";
import { canSSRAuth } from "../permissions/canSSRAuth";

// Utils
import { salesQueries } from "../queries/sales";
import getDate from "../date/currentDate";
import { goalsQueries } from "../queries/goals";
import { sellersQueries } from "../queries/sellers";

//Tipagem
import { topSalesData } from "../types/sales";

export const getSalesPageProps = canSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx);
  const { year, month, today } = getDate();
  const { sales, topTenSellers } = salesQueries({
    dateInit: `${year}/${month}/01`,
    dateEnd: today,
    emp: "1",
  });
  const { storeGoals } = goalsQueries({ month, year });
  const sellers = sellersQueries({ dateInit: `${year}/${month}/01` });

  const respSales = await apiClient.post("/v1/find-db-query", { query: sales });
  const respGoals = await apiClient.post("/v1/find-db-query", {
    query: storeGoals,
  });
  const respSellers = await apiClient.post("/v1/find-db-query", {
    query: sellers,
  });
  const respTopTenSellers = await apiClient.post("/v1/find-db-query", {
    query: topTenSellers,
  });

  const data = [
    { name: "Vendas", value: parseFloat(respSales.data.returnObject.body[0].VALOR_LIQUIDO) },
    {
      name: "Metas",
      value: parseFloat(respGoals.data.returnObject.body[0].VALOR_MTA),
    },
  ];

  const formattedTopSellerData = respTopTenSellers.data.returnObject.body.map(
    (item: topSalesData) => {
      const valueLiquid =
        typeof item.VALOR_TOTAL_LIQUIDO === "string"
          ? parseFloat(item.VALOR_TOTAL_LIQUIDO.replace(",", "."))
          : item.VALOR_TOTAL_LIQUIDO;

      return {
        ...item,
        VALOR_TOTAL_LIQUIDO: valueLiquid,
      };
    }
  );

  return {
    props: {
      salesData: data,
      sellersData: respSellers.data.returnObject.body,
      topTenSellerData: formattedTopSellerData,
    },
  };
});
