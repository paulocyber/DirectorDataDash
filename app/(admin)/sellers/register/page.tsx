// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Dados
import { redirectMap } from "@/data/rulesByUsers";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";
import { employeesQueries } from "./../../../../utils/querys/employees/index";

// Componentes
import RegisterSeller from "@/components/forms/registerSeller";

export default async function RegisterSellerPage() {
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

  const employees = employeesQueries();

  const [employeesResponse, sellersResponse] = await Promise.all([
    api.post("/v1/find-db-query", { query: employees }),
    api.get("/v1/users"),
  ]);

  return (
    <RegisterSeller
      employeesData={employeesResponse.data.returnObject.body}
      sellersData={sellersResponse.data.returnObject.body.filter(
        (seller: any) =>
          seller.role === "vendedor" || seller.role === "Vendedora"
      )}
    />
  );
}
