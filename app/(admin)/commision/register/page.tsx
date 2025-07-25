// Componentes
import RegisterComission from "@/components/pagesTemplates/comission/register";

// Dados
import { redirectMap } from "@/data/rulesByUsers";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";
import { formOfPaymentsQueries } from "@/utils/querys/paymentMethod";
import { PeopleQueries } from "@/utils/querys/peoples";

// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";

  if (
    role !== "admin" &&
    role !== "diretoria" &&
    Object.prototype.hasOwnProperty.call(redirectMap, role)
  ) {
    return redirect(redirectMap[role]);
  }

  const api = setupApiClient(token);

  const formOfPayments = formOfPaymentsQueries();
  const people = PeopleQueries();

  const [paymentMethodResponse, peopleResponse, commissionRegisteredSellers] =
    await Promise.all([
      api.post("/v1/find-db-query", { query: formOfPayments }),
      api.post("/v1/find-db-query", { query: people }),
      api.get("/v1/sellers"),
    ]);

  return (
    <RegisterComission
      paymentMethodData={paymentMethodResponse.data.returnObject.body}
      peopleData={peopleResponse.data.returnObject.body}
      commissionRegisteredSellersData={
        commissionRegisteredSellers.data.returnObject.body
      }
    />
  );
}
