// Next
import { Metadata } from "next";
import { cookies } from "next/headers";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";
import { davsQueries } from "@/utils/querys/dav";
import { convertFieldsToNumber } from "@/utils/stringToNumber";
import { groupBySum } from "@/utils/filters/groupBySum";
import getCurrentDateDetails from "@/utils/getDate";

// Componentes
import LayoutDav from "@/components/pagesTemplates/davs";

// Dados
import { redirectMap } from "@/data/rulesByUsers";

// Utils
import { SalesQueries } from "@/utils/querys/sales";

// Tipagem
import { redirect } from "next/navigation";
import { ItemsSalesPerMonth } from "@/types/sales";

export const metadata: Metadata = {
  title: "Relatório das Dav's",
  description: "Informação sobre documentos de vendas",
};

export const revalidate = 60;

export default async function DavsPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";

  if (!token) {
    redirect("/");
  }

  if (
    role !== "admin" &&
    role !== "diretoria" &&
    role !== "financeiro" &&
    Object.prototype.hasOwnProperty.call(redirectMap, role)
  ) {
    return redirect(redirectMap[role]);
  }

  const api = setupApiClient(token);
  const { today, year } = getCurrentDateDetails();

  const { davFinished } = davsQueries({
    dateInit: today,
    dateEnd: today,
  });
  const { salesPerMonth } = SalesQueries({
    dateInit: `${year}/01/01`,
    dateEnd: today,
  });

  const [davResponse, salesPerMonthResponse] = await Promise.all([
    api.post("/v1/find-db-query", { query: davFinished }),
    api.post("/v1/find-db-query", { query: salesPerMonth }),
  ]);

  const convertedSalesPerMonth = convertFieldsToNumber<ItemsSalesPerMonth>(
    salesPerMonthResponse.data.returnObject.body,
    ["VALOR_LIQUIDO_SDS"]
  ).sort((a, b) => (b as any).MES_ANO - (a as any).MES_ANO);

  const paymentMethods = groupBySum(davResponse.data.returnObject.body, {
    key: "FORMAPAGAMENTO",
    valueKey: "VALOR_LIQUIDO_SDS",
    labelKey: "FORMA_PGMT",
  }).sort((a, b) => b.value - a.value);

  return (
    <LayoutDav
      davsData={davResponse.data.returnObject.body}
      paymentMethodsData={paymentMethods}
      salesPerMonthData={convertedSalesPerMonth}
      today={today}
    />
  );
}
