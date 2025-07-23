// next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Dados
import { redirectMap } from "@/data/rulesByUsers";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";

// Componentes
import LayoutComission from "@/components/pagesTemplates/comission";

export default async function ComissionPage() {
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

  const commissionRule = await api.get("/v1/commission-rules");

  return <LayoutComission data={commissionRule.data.returnObject.body} />;
}
