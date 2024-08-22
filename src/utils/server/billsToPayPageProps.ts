// Framework - Servidor
import { setupApiClient } from "@/service/api/api";
import { canSSRAuth } from "../permissions/canSSRAuth";

// Utils
import getDate from "../date/currentDate";
import { billsToPayQueries } from "../queries/billstoPay";

// Tipagem
import { BillsToPayItem } from "../types/billsToPay";

export const getBillsToPayPageProps = canSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx);
  const { year, month, today, yesterday, monthExpired } = getDate();

  const dateInit = `${year}/${month}/01`;

  const { expiredBilletAll, billetPaidAndOpen } = billsToPayQueries({
    dateInit,
    dateEnd: today,
    year,
    month: monthExpired,
    day: yesterday,
  });

  const [respExpiredBillet, respBilletPaidAndOpen] = await Promise.all([
    apiClient.post("/v1/find-db-query", { query: expiredBilletAll }),
    apiClient.post("/v1/find-db-query", { query: billetPaidAndOpen }),
  ]);

  const allBillets: BillsToPayItem[] =
    respBilletPaidAndOpen.data.returnObject.body;

  const filterBilletInOpen = allBillets.filter(
    (billet) => billet.STATUS_PGM === "1" || billet.STATUS_PGM === "4"
  );

  const filterBilletPaid = allBillets.filter(
    (billet) => billet.STATUS_PGM === "2"
  );

  return {
    props: {
      listBilletInOpen: filterBilletInOpen,
      listBilletPaid: filterBilletPaid,
      listOfExpiredInvoices: respExpiredBillet.data.returnObject.body,
      listBilletPaidAndInOpen: respBilletPaidAndOpen.data.returnObject.body
    },
  };
});
