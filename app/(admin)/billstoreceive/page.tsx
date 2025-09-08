// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Dados
import { redirectMap } from "@/data/rulesByUsers";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";
import getCurrentDateDetails from "@/utils/getDate";
import { billsToReceiveQueries } from "@/utils/querys/billsToReceive";
import { sumValuesByKey } from "@/utils/functions/sumValues";
import { convertFieldsToNumber } from "@/utils/stringToNumber";

// Componentes
import LayoutBillsToReceive from "@/components/pagesTemplates/billsToReceive";

// Tipagem
import { ItemsBillsToReceive } from "@/types/billsToReceive";

export default async function BillsToReceive() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";

  if (
    role !== "admin" &&
    role !== "diretoria" &&
    role !== "financeiro" &&
    Object.prototype.hasOwnProperty.call(redirectMap, role)
  ) {
    return redirect(redirectMap[role]);
  }

  const api = setupApiClient(token);

  const { year, today } = getCurrentDateDetails();

  const {
    billsToReceiveAll,
    topClientLate,
    summaryReceive,
    summaryReceiveRelease,
  } = billsToReceiveQueries({
    dateInit: `2023/01/01`,
    dateEnd: `${today}`,
    year,
  });

  const [
    allBilletsResponse,
    lateClientsResponse,
    summaryBilletResponse,
    summaryReceiveReleaseResponse,
  ] = await Promise.all([
    api.post("/v1/find-db-query", { query: billsToReceiveAll }),
    api.post("/v1/find-db-query", { query: topClientLate }),
    api.post("/v1/find-db-query", { query: summaryReceive }),
    api.post("/v1/find-db-query", { query: summaryReceiveRelease }),
  ]);

  const overdueBills = allBilletsResponse.data.returnObject.body.filter(
    (bill: ItemsBillsToReceive) =>
      (bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4") &&
      parseInt(bill.ATRASO_RCB) > 0
  );
  const openBills = allBilletsResponse.data.returnObject.body.filter(
    (bill: ItemsBillsToReceive) =>
      (bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4") &&
      parseInt(bill.ATRASO_RCB) === 0
  );
  const paidBills = allBilletsResponse.data.returnObject.body.filter(
    (bill: ItemsBillsToReceive) =>
      bill.STATUS_RCB === "2" || bill.STATUS_RCB === "4"
  );

  const totalOverdueAmount = sumValuesByKey(
    overdueBills,
    (item) => (item as any).RESTANTE_RCB
  );
  const totalOpenAmount = sumValuesByKey(
    openBills,
    (item) => (item as any).RESTANTE_RCB
  );
  const totalReceivedAmount = sumValuesByKey(
    paidBills,
    (item) => (item as any).VALOR_PAGO_RCB
  );

  const receivableSummary = [
    { name: "Valor em atraso", value: totalOverdueAmount },
    { name: "Valor em aberto", value: totalOpenAmount },
    { name: "Valor recebido", value: totalReceivedAmount },
  ];

  const topClientsLate = convertFieldsToNumber<ItemsBillsToReceive>(
    lateClientsResponse.data.returnObject.body,
    ["RESTANTE_RCB"]
  ).sort((a, b) => parseInt(b.RESTANTE_RCB) - parseInt(a.RESTANTE_RCB));

  return (
    <LayoutBillsToReceive
      allBilletsData={allBilletsResponse.data.returnObject.body}
      topClientsLateData={topClientsLate}
      summaryBilletData={summaryBilletResponse.data.returnObject.body}
      summaryOfReceivableData={receivableSummary}
      summaryReceiveReleaseData={
        summaryReceiveReleaseResponse.data.returnObject.body
      }
      today={today}
    />
  );
}
