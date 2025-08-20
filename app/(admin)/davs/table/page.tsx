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
  const { davFinished } = davsQueries({
    dateInit: today,
    dateEnd: today,
    formsOfPayments: paymentMethod,
  });
  const paymentMethodQueries = formOfPaymentsQueries();

  const [davResponse, paymentMethodResponse] = await Promise.all([
    api.post("/v1/find-db-query", { query: davFinished }),
    api.post("/v1/find-db-query", { query: paymentMethodQueries }),
  ]);

  return (
    <LayoutDavTable
      davsData={davResponse.data.returnObject.body}
      serachParams={paymentMethod}
      paymentMethodData={paymentMethodResponse.data.returnObject.body}
      today={today}
    />
  );
}
