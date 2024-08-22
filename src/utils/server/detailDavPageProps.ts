// Framework - servidor
import { setupApiClient } from "@/service/api/api";
import { canSSRAuth } from "../permissions/canSSRAuth";

// Utils
import { davsQueries } from "../queries/dav";

export const getDetailDavPageProps = canSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx);
  const id = ctx.query.id as string;

  const { davFinalizationDetail, obtainProductsContainedInDav } = davsQueries({
    id,
  });

  const [respListDav, respProductsContainDav] = await Promise.all([
    apiClient.post("/v1/find-db-query", { query: davFinalizationDetail }),
    apiClient.post("/v1/find-db-query", {
      query: obtainProductsContainedInDav,
    }),
  ]);

  return {
    props: {
      listDavDetail: respListDav.data.returnObject.body,
      listProductsDav: respProductsContainDav.data.returnObject.body,
    },
  };
});
