// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Dados
import { redirectMap } from "@/data/rulesByUsers";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";
import { PeopleQueries } from "@/utils/querys/peoples";
import { formOfPaymentsQueries } from "@/utils/querys/paymentMethod";

// Componentes
import NotFoundUI from "@/components/ui/notfound";
import RegisterRule from "@/components/forms/registerRule";

export default async function EditComissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";
  const { id } = await params;

  if (
    role !== "admin" &&
    role !== "diretoria" &&
    Object.prototype.hasOwnProperty.call(redirectMap, role)
  ) {
    return redirect(redirectMap[role]);
  }

  const api = setupApiClient(token);

  const commission = await api.get(`/v1/commission-rules/${id}`);

  if (!commission) return <NotFoundUI hrfe="/commision" />;

  const formOfPayments = formOfPaymentsQueries();
  const people = PeopleQueries();

  const [paymentMethodResponse, peopleResponse, commissionRegisteredSellers] =
    await Promise.all([
      api.post("/v1/find-db-query", { query: formOfPayments }),
      api.post("/v1/find-db-query", { query: people }),
      api.get("/v1/sellers"),
    ]);

  return (
    <RegisterRule
      paymentMethodData={paymentMethodResponse.data.returnObject.body}
      peopleData={peopleResponse.data.returnObject.body}
      commissionRegisteredSellersData={
        commissionRegisteredSellers.data.returnObject.body
      }
      commissionRule={commission.data.returnObject.body}
    />
  );
}
