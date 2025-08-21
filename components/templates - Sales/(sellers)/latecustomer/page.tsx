// Next
import { cookies } from "next/headers";
import { Metadata } from "next";

// Bibliotecas
import { setupApiClient } from "@/utils/fetchs/api";

// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { billsToReceiveQueries } from "@/utils/querys/billsToReceive";

// Componentes
import LayoutLateCustomer from "@/components/pagesTemplates/billsToReceive/LateCustomer";

export const metadata: Metadata = {
  title: "Relatório de clientes atrasados",
  description: "Informações sobre clientes em atrasos",
};

export default async function LateCustomer() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;

  const api = setupApiClient(token);
  const user = await api.post("/v1/auth/validate", { token });

  const { today } = getCurrentDateDetails();

  const { billsToReceiveInOpen } = billsToReceiveQueries({
    dateInit: `2023/01/01`,
    dateEnd: today,
    sellers: [`${user.data.returnObject.body.username}`],
  });

  const [billetsInOpen] = await Promise.all([
    api.post("/v1/find-db-query", { query: billsToReceiveInOpen }),
  ]);

  return (
    <LayoutLateCustomer
      billetsInOpenData={billetsInOpen.data.returnObject.body}
      today={today}
    />
  );
}
