// Next
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";
import getCurrentDateDetails from "@/utils/getDate";
import { PeopleQueries } from "@/utils/querys/peoples";

// Dados
import { redirectMap } from "@/data/rulesByUsers";
import { billsToReceiveQueries } from "@/utils/querys/billsToReceive";

// Componentes
import LayoutBillsToReceiveTable from "@/components/pagesTemplates/billsToReceive/table";

// Tipagem
import { ItemsBillsToReceive } from "@/types/billsToReceive";

export const metadata: Metadata = {
  title: "Relatório dos Contas a receber",
  description: "Informações o que tem a receber",
};

export default async function BillsToReceiveTablePage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";

  if (!token) redirect("/");
  if (
    role !== "admin" &&
    role !== "diretoria" &&
    role !== "financeiro" &&
    Object.prototype.hasOwnProperty.call(redirectMap, role)
  ) {
    return redirect(redirectMap[role]);
  }

  const { today } = getCurrentDateDetails();

  const api = setupApiClient(token);

  const peoples = PeopleQueries();
  const { billsToReceiveAll } = billsToReceiveQueries({
    dateInit: "2023/01/01",
    dateEnd: today,
  });

  const [allBilletsResponse, peoplesResponse] = await Promise.all([
    api.post("/v1/find-db-query", { query: billsToReceiveAll }),
    api.post("/v1/find-db-query", { query: peoples }),
  ]);

  const openBills = allBilletsResponse.data.returnObject.body.filter(
    (bill: ItemsBillsToReceive) =>
      bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4"
  );

  return (
    <LayoutBillsToReceiveTable
      allbilletsData={allBilletsResponse.data.returnObject.body}
      billetsOpenData={openBills}
      peopleData={peoplesResponse.data.returnObject.body}
      today={today}
    />
  );
}
