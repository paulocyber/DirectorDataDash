// Framework - servidor
import { setupApiClient } from "@/service/api/api";
import { canSSRAuth } from "@/utils/permissions/canSSRAuth";

// Utils
import getDate from "../date/currentDate";
import { davsQueries } from "../queries/dav";

export const getDavReportPageProps = canSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx);
  const { today } = getDate();

  const { davFinished } = davsQueries({ dateInit: today, dateEnd: today });

  const resp = await apiClient.post("/v1/find-db-query", {
    query: davFinished,
  });

  return {
    props: { listDav: resp.data.returnObject.body },
  };
});
