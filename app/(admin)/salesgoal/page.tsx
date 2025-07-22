// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Data
import { redirectMap } from "@/data/rulesByUsers";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";
import getCurrentDateDetails from "@/utils/getDate";
import { SalesQueries } from "@/utils/querys/sales";
import { sumValuesByKey } from "@/utils/functions/sumValues";
import { goalsQueries } from "@/utils/querys/goals";
import { convertFieldsToNumber } from "@/utils/stringToNumber";

// Componentes
import { LayoutSalesGoals } from "@/components/pagesTemplates/salesGoal";

// Utils
import { companiesQueries } from "@/utils/querys/companies";

// Tipagem
import { ItemsTopSellers } from "@/types/sales";

export default async function SalesGoalPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";

  if (!token) {
    redirect("/");
  }

  if (
    role !== "admin" &&
    role !== "rh" &&
    role !== "diretoria" &&
    role !== "financeiro" &&
    Object.prototype.hasOwnProperty.call(redirectMap, role)
  ) {
    return redirect(redirectMap[role]);
  }

  const api = setupApiClient(token);

  const { year, month, today } = getCurrentDateDetails();
  const { sales, topSales, profitsFromSale } = SalesQueries({
    dateInit: `${year}/${month}/01`,
    tables: ["1", "2"],
    dateEnd: today,
    companys: ["1", "2", "3", "4"],
    year,
    month,
  });
  const { goals } = goalsQueries({ month, year, companys: ["1, 2, 3, 4"] });
  const companies = companiesQueries();

  const [
    salesResponse,
    topSalesResponse,
    goalsResponse,
    profitsFromSaleResponse,
    companiesResponse,
  ] = await Promise.all([
    api.post("/v1/find-db-query", { query: sales }),
    api.post("/v1/find-db-query", { query: topSales }),
    api.post("/v1/find-db-query", { query: goals }),
    api.post("/v1/find-db-query", { query: profitsFromSale }),
    api.post("/v1/find-db-query", { query: companies }),
  ]);

  const totalSales = sumValuesByKey(
    salesResponse.data.returnObject.body,
    (item) => (item as any).VALOR_LIQUIDO
  );
  const totalGoalsValue = sumValuesByKey(
    goalsResponse.data.returnObject.body,
    (item) => (item as any).VALOR_MTA
  );
  const totalProfit = sumValuesByKey(
    profitsFromSaleResponse.data.returnObject.body,
    (item) => (item as any).VALOR_LUCRO
  );

  const salesProgressData = [
    { name: "sales", value: totalSales },
    { name: "goals", value: totalGoalsValue },
    { name: "profit", value: totalProfit },
  ];

  const topSellers = convertFieldsToNumber<ItemsTopSellers>(
    topSalesResponse.data.returnObject.body,
    ["VALOR_LIQUIDO"]
  );

  return (
    <LayoutSalesGoals
      salesProgressData={salesProgressData}
      topSellersData={topSellers}
      profitsFromSaleData={profitsFromSaleResponse.data.returnObject.body}
      companiesData={companiesResponse.data.returnObject.body}
      today={today}
      year={year}
      month={month}
    />
  );
}
