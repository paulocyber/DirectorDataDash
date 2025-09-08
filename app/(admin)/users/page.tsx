// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Dados
import { redirectMap } from "@/data/rulesByUsers";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";

// Componentes
import LayoutUsers from "@/components/pagesTemplates/users";

export default async function UsersPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";

  if (!token) {
    redirect("/");
  }

  if (
    role !== "admin" &&
    Object.prototype.hasOwnProperty.call(redirectMap, role)
  ) {
    return redirect(redirectMap[role]);
  }

  const api = setupApiClient(token);

  const users = await api.get("/v1/users");

  return <LayoutUsers data={users.data.returnObject.body} />;
}
