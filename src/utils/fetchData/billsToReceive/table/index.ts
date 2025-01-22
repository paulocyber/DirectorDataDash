// Bibliotecas
import { RangeValue, DateValue } from "@nextui-org/react";

// Utils
import { billsToReceiveQueries } from "@/utils/queries/billsToReceive";
import { fetchData } from "../..";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";
interface fetchBillsToReceiveTableProps {
  dateInit: string;
  dateEnd: string;
  token: string;
  people?: string[];
  setLoading: (value: boolean) => void;
  setBillsToReceive: (value: ItemsBillsToReceiveData[]) => void;
  setOpenBills: (value: ItemsBillsToReceiveData[]) => void;
}

export async function fetchBillsToReceiveTable({
  dateInit,
  dateEnd,
  token,
  people,
  setLoading,
  setBillsToReceive,
  setOpenBills,
}: fetchBillsToReceiveTableProps) {
  setLoading(true);

  const { billsToReceiveAll } = billsToReceiveQueries({
    dateInit,
    dateEnd,
    idPeople: people,
  });

  let allBillsToReceive: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: billsToReceiveAll,
      setData: (data) => (allBillsToReceive = data || []),
    }),
  ];

  await Promise.all(queries);

  const openBills = allBillsToReceive.filter(
    (bill: ItemsBillsToReceiveData) =>
      bill.STATUS_RCB === "1" || bill.STATUS_RCB === "4"
  );

  setLoading(false);
  setBillsToReceive(allBillsToReceive);
  setOpenBills(openBills);
}
