// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";

// Dados
import { redirectMap } from "@/data/rulesByUsers";

// Componentes
import LayoutDavTable from "@/components/pagesTemplates/davs/tables";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";
import getCurrentDateDetails from "@/utils/getDate";
import { davsQueries } from "@/utils/querys/dav";
import { formOfPaymentsQueries } from "@/utils/querys/paymentMethod";
import { PeopleQueries } from "@/utils/querys/peoples";
import { companiesQueries } from "@/utils/querys/companies";
import { employeesQueries } from "@/utils/querys/employees";

export const metadata: Metadata = {
  title: "Relatório das Dav's",
  description: "Informação sobre documentos de vendas",
};

export default async function TableDavPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";
  const paymentMethod = Object.keys(await searchParams);
  console.log("Methodo de pagamento: ", paymentMethod);
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

  const { today } = getCurrentDateDetails();
  const { davFinished, profitOnSales } = davsQueries({
    dateInit: today,
    dateEnd: today,
    formsOfPayments: paymentMethod,
    companys: ["1", "2", "3", "4"],
  });
  const paymentMethodQueries = formOfPaymentsQueries();
  const peoples = PeopleQueries();
  const companies = companiesQueries();
  const sellers = employeesQueries();

  const [
    davResponse,
    paymentMethodResponse,
    peoplesResponse,
    companiesResponse,
    sellersResponse,
    profitOnSalesResponse,
  ] = await Promise.all([
    api.post("/v1/find-db-query", { query: davFinished }),
    api.post("/v1/find-db-query", { query: paymentMethodQueries }),
    api.post("/v1/find-db-query", { query: peoples }),
    api.post("/v1/find-db-query", { query: companies }),
    api.post("/v1/find-db-query", { query: sellers }),
    api.post("/v1/find-db-query", { query: profitOnSales }),
  ]);

  return (
    <LayoutDavTable
      davsData={davResponse.data.returnObject.body}
      today={today}
      serachParams={paymentMethod}
      paymentMethodData={paymentMethodResponse.data.returnObject.body}
      companiesData={companiesResponse.data.returnObject.body}
      peoplesData={peoplesResponse.data.returnObject.body}
      sellersData={sellersResponse.data.returnObject.body}
      profitData={
        profitOnSalesResponse.data.returnObject.body[0].VALOR_LUCRO_TOTAL
      }
    />
  );
}
