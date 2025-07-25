// Next
import { cookies } from "next/headers";

// Dados
import { redirectMap } from "@/data/rulesByUsers";

// Next
import { redirect } from "next/navigation";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";

export default async function SellersPage() {
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

  const sellers = await api.get("/v1/sellers");

  return <h1>a</h1>;
}
