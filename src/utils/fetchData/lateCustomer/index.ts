// Utils
import { billsToReceiveQueries } from "@/utils/queries/billsToReceive";
import { fetchData } from "..";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive";
interface fetchLateCustomer {
  token: string;
  dateInit: string;
  dateEnd: string;
  sellerSurname: string | undefined;
  people?: string[];
  setLoading: (value: boolean) => void;
  setOpenBillsData: (value: ItemsBillsToReceiveData[]) => void;
  setOverdueBillsData: (value: ItemsBillsToReceiveData[]) => void;
}

export async function fetchLateCustomer({
  dateInit,
  dateEnd,
  sellerSurname,
  token,
  people,
  setLoading,
  setOpenBillsData,
  setOverdueBillsData,
}: fetchLateCustomer) {
  setLoading(true);

  const { yesterday, year } = getCurrentDateDetails();

  const { billsToReceiveInOpen } = billsToReceiveQueries({
    dateInit,
    dateEnd,
    sellerSurname,
    idSeller: people,
  });

  const { billsToReceiveInOpen: billsToReceiveLate } = billsToReceiveQueries({
    dateInit: dateInit,
    dateEnd: dateEnd,
    sellerSurname,
    idSeller: people,
  });

  const queries = [
    fetchData({
      ctx: token,
      query: billsToReceiveInOpen,
      setData: (data) => setOpenBillsData(data),
    }),
    fetchData({
      ctx: token,
      query: billsToReceiveLate,
      setData: (data) => setOverdueBillsData(data),
    }),
  ];
  
  await Promise.all(queries);

  setLoading(false);
}
