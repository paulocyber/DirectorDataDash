// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";
import getCurrentDateDetails from "@/utils/getDate";
import { TaxQueries } from "@/utils/querys/tax";
import { groupBySum } from "@/utils/filters/groupBySum";

// Componentes
import LayoutTaxBiling from "@/components/pagesTemplates/TaxBiling";

// Dados
import { redirectMap } from "@/data/rulesByUsers";

export default async function TaxBiling() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";
  const api = setupApiClient(token as string);

  if (
    role !== "admin" &&
    role !== "diretoria" &&
    role !== "financeiro" &&
    role !== "Fiscal" &&
    Object.prototype.hasOwnProperty.call(redirectMap, role)
  ) {
    return redirect(redirectMap[role]);
  }

  const { today, year, month } = getCurrentDateDetails();
  const { nfce, nfe } = TaxQueries({
    dateInit: `${year}/${month}/01`,
    dateEnd: today,
  });

  const [responseNfce, responseNfe] = await Promise.all([
    api.post("/v1/find-db-query", { query: nfce }),
    api.post("/v1/find-db-query", { query: nfe }),
  ]);

  const notesByCompany = [
    ...responseNfce.data.returnObject.body,
    ...responseNfe.data.returnObject.body,
  ];

  const billingByCompany = groupBySum(notesByCompany, {
    key: "EMPRESA",
    labelKey: "EMPRESA",
    valueKey: "VALOR_LIQUIDO_SDS",
  }).sort((a, b) => b.value - a.value);

  return (
    <LayoutTaxBiling
      billingByCompanyData={billingByCompany}
      dateInit={`${year}/${month}/01`}
    />
  );
}
