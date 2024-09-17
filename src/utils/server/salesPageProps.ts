//  Framework - Servidor
import { setupApiClient } from "@/service/api/api";
import { canSSRAuth } from "../permissions/canSSRAuth";

// Utils
import { salesQueries } from "../queries/sales";
import getDate from "../date/currentDate";
import { goalsQueries } from "../queries/goals";
import { sellersQueries } from "../queries/sellers";

// React
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Biblioteca
import { parseCookies, destroyCookie } from "nookies";

//Tipagem
import { topSalesData } from "../types/sales";

export const getSalesPageProps = canSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx);
  const cookies = parseCookies(ctx);

  const { "@nextauth.role": role, "@nextauth.token": token } = cookies;

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(escape(atob(base64)));
  const user = JSON.parse(jsonPayload);

  const { year, month, today } = getDate();
  const { sales, topTenSellers, commissionPerSalesPerson } = salesQueries({
    dateInit: `${year}/${month}/01`,
    dateEnd: today,
    emp: "1",
    surname: role === "vendedor" ? user.username : "",
  });
  const { storeGoals, individualGoals } = goalsQueries({
    month,
    year,
    surname: role === "vendedor" ? user.username : "",
    dateInit: `${year}/${month}/01`,
  });
  const sellers = sellersQueries({ dateInit: `${year}/${month}/01` });

  const respSales = await apiClient.post("/v1/find-db-query", { query: sales });
  const respGoals = await apiClient.post("/v1/find-db-query", {
    query: role === "vendedor" ? individualGoals : storeGoals,
  });
  const respSellers = await apiClient.post("/v1/find-db-query", {
    query: sellers,
  });
  const respTopTenSellers = await apiClient.post("/v1/find-db-query", {
    query: topTenSellers,
  });
  const respCommision = await apiClient.post("/v1/find-db-query", {
    query: commissionPerSalesPerson,
  });

  const data = [
    {
      name: "Vendas",
      value: parseFloat(respSales.data.returnObject.body[0].VALOR_LIQUIDO),
    },
    {
      name: "Metas",
      value:
        role === "vendedor"
          ? parseFloat(respGoals.data.returnObject.body[0].VALOR_INDIVIDUAL_MTI)
          : parseFloat(respGoals.data.returnObject.body[0].VALOR_MTA),
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

  const commision = role === "vendedor" ? parseFloat(respCommision.data.returnObject.body[0].VALOR_COMISSAO) : 0
  
  return {
    props: {
      salesData: data,
      sellersData:
        role === "vendedor" ? [] : respSellers.data.returnObject.body,
      topTenSellerData: role === "vendedor" ? [] : formattedTopSellerData,
    commision: commision
    },
  };
});
