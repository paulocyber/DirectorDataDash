// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Data
import { redirectMap } from "@/data/rulesByUsers";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";
import getCurrentDateDetails from "@/utils/getDate";
import { billsToPayQueries } from "@/utils/querys/billsToPay";

// Tipagem
import { ItemsBillsToPay } from "@/types/billsToPay";
import LayoutBillsToPayTable from "@/components/pagesTemplates/billsToPay/table";

export default async function BillsToPayTable() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";

  if (!token) {
    redirect("/");
  }

  if (
    role !== "admin" &&
    role !== "diretoria" &&
    role !== "financeiro" &&
    Object.prototype.hasOwnProperty.call(redirectMap, role)
  ) {
    return redirect(redirectMap[role]);
  }

  const api = setupApiClient(token);

  const { year, month, today, yesterday } = getCurrentDateDetails();
  const { allBillet } = billsToPayQueries({
    dateInit: `${year}/${month}/01`,
    dateEnd: today,
  });
  const { expiredBillet } = billsToPayQueries({
    dateInit: `${year}/${month}/01`,
    dateEnd: yesterday,
  });

  const [allBilletsResponse, overdueBilletsResponse] = await Promise.all([
    api.post("/v1/find-db-query", { query: allBillet }),
    api.post("/v1/find-db-query", { query: expiredBillet }),
  ]);

  const openBillets = allBilletsResponse.data.returnObject.body.filter(
    (bill: ItemsBillsToPay) =>
      bill.STATUS_PGM === "1" || bill.STATUS_PGM === "4"
  );
  const paidBillets = allBilletsResponse.data.returnObject.body.filter(
    (bill: ItemsBillsToPay) =>
      bill.STATUS_PGM === "1" || bill.STATUS_PGM === "4"
  );

  return (
    <LayoutBillsToPayTable
      allBilletsData={allBilletsResponse.data.returnObject.body}
      openBilletsData={openBillets}
      paidBilletsData={paidBillets}
      overdueBilletsData={overdueBilletsResponse.data.returnObject.body}
      year={year}
      month={month}
    />
  );
}
