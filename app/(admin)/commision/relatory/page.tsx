// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";

// Dados
import { redirectMap } from "@/data/rulesByUsers";

// Componentes
import LayoutCommitteeReport from "@/components/pagesTemplates/comission/relatory";

export default async function CommitteeReport() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";
  const api = setupApiClient(token as string);

  if (
    role !== "admin" &&
    role !== "diretoria" &&
    role !== "financeiro" &&
    role !== "rh" &&
    Object.prototype.hasOwnProperty.call(redirectMap, role)
  ) {
    return redirect(redirectMap[role]);
  }

  const data = await api.get("/v1/commissions");

  return <h1>Teste</h1>;
  // return <LayoutCommitteeReport data={data.data.returnObject.body} />;
}
