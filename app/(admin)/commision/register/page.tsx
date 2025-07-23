// Componentes
import RegisterComission from "@/components/pagesTemplates/comission/register";

// Dados
import { redirectMap } from "@/data/rulesByUsers";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";
import { employeesQueries } from "@/utils/querys/employees";
import { formOfPaymentsQueries } from "@/utils/querys/paymentMethod";

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
  const employees = employeesQueries();

  const [paymentMethodResponse, employeesResponse, sellersResponse] =
    await Promise.all([
      api.post("/v1/find-db-query", { query: formOfPayments }),
      api.post("/v1/find-db-query", { query: employees }),
      api.get("/v1/users"),
    ]);

  return (
    <RegisterComission
      paymentMethodData={paymentMethodResponse.data.returnObject.body}
      employeesData={employeesResponse.data.returnObject.body}
      sellersData={sellersResponse.data.returnObject.body.filter(
        (user: any) => user.role === "vendedor"
      )}
    />
  );
}
