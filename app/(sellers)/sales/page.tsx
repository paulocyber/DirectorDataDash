// Componentes
import { LayoutSalesGoals } from "@/components/pagesTemplates/salesGoal";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";
import { sumValuesByKey } from "@/utils/functions/sumValues";
import getCurrentDateDetails from "@/utils/getDate";
import { parseNumericString } from "@/utils/mask/convertStringToNumber";
import { goalsQueries } from "@/utils/querys/goals";
import { SalesQueries } from "@/utils/querys/sales";
import { convertFieldsToNumber } from "@/utils/stringToNumber";

// Tipagem
import { ItemsCustomerBuyMore } from "@/types/sales";

// Next
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Relatório de vendas e metas",
  description: "Informações sobre vendas",
};

export default async function SellerPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;

  const api = setupApiClient(token);
  const { year, month, today } = getCurrentDateDetails();

  const user = await api.post("/v1/auth/validate", { token });

  const { sales, commissionPerSalesPerson } = SalesQueries({
    dateInit: `${year}/${month}/01`,
    dateEnd: today,
    sellers: [`${user.data.returnObject.body.username}`],
    companys: ["1", "2", "3", "4", "5"],
    tables: ["1", "2"],
    year,
    month,
  });
  const { individualGoals } = goalsQueries({
    sellers: [`${user.data.returnObject.body.username}`],
    tables: ["1", "2"],
    companys: ["1, 2, 3, 4, 5"],
    year,
    month,
  });
  const { topClientsPlusBuy } = SalesQueries({
    dateInit: `${year}/${month}/01`,
    dateEnd: today,
    sellers: [`${user.data.returnObject.body.username}`],
    companys: ["1, 2, 3, 4, 5"],
    year,
    month,
  });

  const [
    salesResponse,
    commissionPerSellerResponse,
    goalsResponse,
    topClientsPlusBuyResponse,
  ] = await Promise.all([
    api.post("/v1/find-db-query", { query: sales }),
    api.post("/v1/find-db-query", { query: commissionPerSalesPerson }),
    api.post("/v1/find-db-query", { query: individualGoals }),
    api.post("/v1/find-db-query", { query: topClientsPlusBuy }),
  ]);

  const valueCommission = sumValuesByKey(
    commissionPerSellerResponse.data.returnObject.body,
    (item: any) => item.COMISSAO
  );

  const salesProgression = [
    {
      name: "Vendas",
      value: salesResponse
        ? parseNumericString(
            salesResponse.data.returnObject.body[0].VALOR_LIQUIDO
          )
        : 0,
    },
    {
      name: "Metas",
      value:
        goalsResponse.data.returnObject.body.lenght > 0
          ? parseNumericString(
              goalsResponse.data.returnObject.body[0].VALOR_MTA
            )
          : 0,
    },
  ];

  const customerBuyMore = convertFieldsToNumber<ItemsCustomerBuyMore>(
    topClientsPlusBuyResponse.data.returnObject.body,
    ["VALOR_LIQUIDO"]
  );

  return (
    <LayoutSalesGoals
      salesProgressData={salesProgression}
      customerBuyMoreData={customerBuyMore}
      valueCommissionData={valueCommission}
      seller={user.data.returnObject.body.username}
      today={today}
      month={month}
      year={year}
    />
  );
}
