// Utils
import { setupApiClient } from "@/utils/fetchs/api";

// Next
import { cookies } from "next/headers";

export default async function SalesByGroup() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";

  const api = setupApiClient(token);

  return <h1>ts</h1>;
}
