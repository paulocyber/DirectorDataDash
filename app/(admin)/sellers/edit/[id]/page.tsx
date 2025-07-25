// Dados
import { redirectMap } from "@/data/rulesByUsers";

// Componentes
import RegisterSeller from "@/components/forms/registerSeller";

// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Utils
import { employeesQueries } from "@/utils/querys/employees";
import { setupApiClient } from "@/utils/fetchs/api";

export default async function EditSellersPage({
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

  const employees = employeesQueries();

  const [employeesResponse, sellersResponse, commissionSalespeople] =
    await Promise.all([
      api.post("/v1/find-db-query", { query: employees }),
      api.get("/v1/users"),
      api.get(`/v1/sellers/${id}`),
    ]);

  return (
    <RegisterSeller
      employeesData={employeesResponse.data.returnObject.body}
      sellersData={sellersResponse.data.returnObject.body.filter(
        (seller: any) =>
          seller.role === "vendedor" || seller.role === "Vendedora"
      )}
      commissionSalespeopleData={commissionSalespeople.data.returnObject.body}
    />
  );
}
