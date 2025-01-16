// Utils
import { billsToReceiveQueries } from "@/utils/queries/billsToReceive";
import { fetchData } from "..";
import { calculateTotalByKey } from "@/utils/functions/sumValues";
import { convertFieldsToNumber } from "@/utils/convertStringToNumber";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";
interface fetchBillsToReceiveProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  year: number;
  setLoading: (value: boolean) => void;
  setBillsToReceive: (value: ItemsBillsToReceiveData[]) => void;
  setSummaryOfReceivableData: (
    value: { name: string; value: number }[]
  ) => void;
  setOverdueClients: (value: ItemsBillsToReceiveData[]) => void;
}

export async function fetchBillsToReceive({
  token,
  dateInit,
  dateEnd,
  year,
  setLoading,
  setBillsToReceive,
  setSummaryOfReceivableData,
  setOverdueClients,
}: fetchBillsToReceiveProps) {
  setLoading(true);

  const { billsToReceiveAll, topClientLate } = billsToReceiveQueries({
    dateInit,
    dateEnd,
    year,
  });

  let allBillsToReceive: any[] = [];
  let overdueClients: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: billsToReceiveAll,
      setData: (data) => (allBillsToReceive = data || []),
    }),
    fetchData({
      ctx: token,
      query: topClientLate,
      setData: (data) => (overdueClients = data || []),
    }),
  ];

  await Promise.all(queries);

  const overdueBills = allBillsToReceive.filter(
    (bill) =>
      (bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4") &&
      parseInt(bill.ATRASO_RCB) > 0
  );

  const openBills = allBillsToReceive.filter(
    (bill) =>
      (bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4") &&
      parseInt(bill.ATRASO_RCB) === 0
  );

  const paidBills = allBillsToReceive.filter(
    (bill) => bill.STATUS_RCB === "2" || bill.STATUS_RCB === "4"
  );

  const totalOverdueAmount = calculateTotalByKey(
    overdueBills,
    (bill: ItemsBillsToReceiveData) => bill.RESTANTE_RCB
  );
  const totalOpenAmount = calculateTotalByKey(
    openBills,
    (bill: ItemsBillsToReceiveData) => bill.RESTANTE_RCB
  );
  const totalReceivedAmount = calculateTotalByKey(
    paidBills,
    (bill: ItemsBillsToReceiveData) => bill.VALOR_PAGO_RCB
  );

  const receivableSummary = [
    { name: "Valor em atraso", value: totalOverdueAmount },
    { name: "Valor em aberto", value: totalOpenAmount },
    { name: "Valor recebido", value: totalReceivedAmount },
  ];

  const topClientsLate = convertFieldsToNumber<ItemsBillsToReceiveData>(
    overdueClients,
    ["RESTANTE_RCB"]
  ).sort((a, b) => parseInt(b.RESTANTE_RCB) - parseInt(a.RESTANTE_RCB));

  setLoading(false);
  setBillsToReceive(allBillsToReceive);
  setSummaryOfReceivableData(receivableSummary);
  setOverdueClients(topClientsLate);
}
