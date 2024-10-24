// Utls
import { billsToReceiveQueries } from "@/utils/queries/billsToReceive";
import { fetchData } from "..";

// Dados
import InFoCardFromLateCustomer from "@/data/infoCard/lateCustomer";

// Tipagem
import { BillsToReceiveData } from "@/types/billsToReceive";
interface fetchLateCustomerProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  seller: string;
  setReceiveInOpen: (value: BillsToReceiveData[]) => void;
  setLoading: (value: boolean) => void;
}

export async function fetchLateCustomer({
  token,
  dateInit,
  dateEnd,
  seller,
  setReceiveInOpen,
  setLoading,
}: fetchLateCustomerProps) {
  setLoading(true);

  const { billsToReceiveInOpen } = billsToReceiveQueries({
    dateInit: dateInit,
    dateEnd: dateEnd,
    sellersSurname: seller,
  });

  let receiveInOpen: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: billsToReceiveInOpen,
      setData: (data) => (receiveInOpen = data),
    }),
  ];

  await Promise.all(queries);

  setReceiveInOpen(receiveInOpen);
  setLoading(false);
}
