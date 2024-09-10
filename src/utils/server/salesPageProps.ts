//  Framework - Servidor
import { setupApiClient } from "@/service/api/api";
import { canSSRAuth } from "../permissions/canSSRAuth";

// Utils
import { salesQueries } from "../queries/sales";
import getDate from "../date/currentDate";
import { goalsQueries } from "../queries/goals";
import { sellersQueries } from "../queries/sellers";
import { topSalesData } from "../types/sales";

//Tipagem

export const getSalesPageProps = canSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx);
  const { year, month, day, today } = getDate();
  const { sales, topTenSellers } = salesQueries({
    dateInit: `${year}/${month}/01`,
    dateEnd: today,
    emp: "1",
  });
  const { storeGoals } = goalsQueries({});
  const sellers = sellersQueries();

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

  const totalSalesValue = respSales.data.returnObject.body.reduce(
    (acc: number, sale: any) => {
      return acc + parseFloat(sale.VALOR_LIQUIDO);
    },
    0
  );

  const data = [
    { name: "Vendas", value: totalSalesValue },
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
