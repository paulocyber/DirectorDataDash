// Utils
import { billsToReceiveQueries } from "@/utils/querys/billsToReceive";
import { sumValuesByKey } from "@/utils/functions/sumValues";
import { convertFieldsToNumber } from "@/utils/stringToNumber";
import { fetchData } from "../fetchData";

// Tipagem
import { ItemsBillsToReceive } from "@/types/billsToReceive";
interface FetchBillsToReceiveProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  year: number;
  peoples?: string[];
  setLoading: (value: boolean) => void;
  setBillsToReceive: (value: ItemsBillsToReceive[]) => void;
  setBilletsOpen?: (value: ItemsBillsToReceive[]) => void;
  setOverdueClients?: (value: ItemsBillsToReceive[]) => void;
  setSummaryOfReceivableData?: (
    value: { name: string; value: number }[]
  ) => void;
}

export async function fetchBillsToReceive({
  token,
  dateInit,
  dateEnd,
  year,
  peoples,
  setLoading,
  setBillsToReceive,
  setBilletsOpen,
  setSummaryOfReceivableData,
  setOverdueClients,
}: FetchBillsToReceiveProps) {
  setLoading(true);

  const { billsToReceiveAll, topClientLate } = billsToReceiveQueries({
    dateInit,
    dateEnd,
    year,
    peoples,
  });

  let allBiletsToReceive: any[] = [];
  let overdueClients: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: billsToReceiveAll,
      setData: (data) => (allBiletsToReceive = data || []),
    }),
    fetchData({
      ctx: token,
      query: topClientLate,
      setData: (data) => (overdueClients = data || []),
    }),
  ];

  await Promise.all(queries);

  const overdueBills = allBiletsToReceive.filter(
    (bill) => bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4"
  );

  const openBills = allBiletsToReceive.filter(
    (bill) => bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4"
  );
  console.log("Dados: ", openBills);
  const paidBills = allBiletsToReceive.filter(
    (bill) => bill.STATUS_RCB === "2" || bill.STATUS_RCB === "4"
  );

  const totalOverdueAmount = sumValuesByKey(
    overdueBills,
    (bill: ItemsBillsToReceive) => bill.RESTANTE_RCB
  );
  const totalOpenAmount = sumValuesByKey(
    openBills,
    (bill: ItemsBillsToReceive) => bill.RESTANTE_RCB
  );
  const totalReceivedAmount = sumValuesByKey(
    paidBills,
    (bill: ItemsBillsToReceive) => bill.VALOR_PAGO_RCB
  );

  const receivableSummary = [
    { name: "Valor em atraso", value: totalOverdueAmount },
    { name: "Valor em aberto", value: totalOpenAmount },
    { name: "Valor recebido", value: totalReceivedAmount },
  ];

  const topClientsLate = convertFieldsToNumber<ItemsBillsToReceive>(
    overdueClients,
    ["RESTANTE_RCB"]
  ).sort((a, b) => parseInt(b.RESTANTE_RCB) - parseInt(a.RESTANTE_RCB));

  setLoading(false);
  setBillsToReceive(allBiletsToReceive);
  setBilletsOpen && setBilletsOpen(openBills);
  setSummaryOfReceivableData && setSummaryOfReceivableData(receivableSummary);
  setOverdueClients && setOverdueClients(topClientsLate);
}
