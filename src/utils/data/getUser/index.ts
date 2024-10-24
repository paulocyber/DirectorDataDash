// Biblioteca
import { setupApiClient } from "@/services/api";

export default async function getUserName(ctx: string) {
  let user;

  const api = setupApiClient();

  const resp = await api.post("/v1/auth/validate", { token: ctx });

  user = resp.data.returnObject.body.username as string;

  return user;
}
