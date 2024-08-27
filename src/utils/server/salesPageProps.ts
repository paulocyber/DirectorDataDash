//  Framework - Servidor
import { setupApiClient } from "@/service/api/api";
import { canSSRAuth } from "../permissions/canSSRAuth";

// Utils
import { salesQueries } from "../queries/sales";
import getDate from "../date/currentDate";
import { goalsQueries } from "../queries/goals";
import { sellersQueries } from "../queries/sellers";

export const getSalesPageProps = canSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx);
  const { year, month, day, today } = getDate();
  const sales = salesQueries({
    dateInit: `${year}/${month}/01`,
    dateEnd: today,
    emp: "1",
  });
  const goals = goalsQueries();
  const sellers = sellersQueries();

  const respSales = await apiClient.post("/v1/find-db-query", { query: sales });
  const respGoals = await apiClient.post("/v1/find-db-query", { query: goals });
  const respSellers = await apiClient.post("/v1/find-db-query", {
    query: sellers,
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

  return {
    props: {
      salesData: data,
      sellersData: respSellers.data.returnObject.body,
    },
  };
});
