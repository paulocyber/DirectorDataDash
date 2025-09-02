// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { billsToPayQueries } from "@/utils/querys/billsToPay";
import { fetchData } from "../fetchData";

// Tipagem
import { ItemsBillsToPay } from "@/types/billsToPay";

interface FetchBillsToPAyProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  clear?: boolean;
  costsCenters?: string[];
  setLoading: (value: boolean) => void;
  setAllBillets: (value: ItemsBillsToPay[]) => void;
  setOpenBillets: (value: ItemsBillsToPay[]) => void;
  setPaidBillets: (value: ItemsBillsToPay[]) => void;
  setOverdueBillets: (value: ItemsBillsToPay[]) => void;
}

export async function fetchBillsToPay({
  token,
  dateInit,
  dateEnd,
  clear,
  costsCenters,
  setLoading,
  setAllBillets,
  setOpenBillets,
  setPaidBillets,
  setOverdueBillets,
}: FetchBillsToPAyProps) {
  setLoading(true);

  const { year, yesterday } = getCurrentDateDetails();

  const { allBillet } = billsToPayQueries({
    dateInit,
    dateEnd,
    costsCenters,
  });

  const { expiredBillet } = billsToPayQueries({
    dateInit: `${year}/01/01`,
    dateEnd: clear ? `${yesterday}` : dateEnd,
  });

  let allBiletsData: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: allBillet,
      setData: (data) => (allBiletsData = data),
    }),
    fetchData({
      ctx: token,
      query: expiredBillet,
      setData: (data) => setOverdueBillets(data),
    }),
  ];

  await Promise.all(queries);

  const openBills = allBiletsData.filter(
    (bill: ItemsBillsToPay) =>
      bill.STATUS_PGM === "1" || bill.STATUS_PGM === "4"
  );

  const billetsInPaid = allBiletsData.filter(
    (billet: ItemsBillsToPay) =>
      billet.STATUS_PGM === "2" || billet.STATUS_PGM === "4"
  );

  setAllBillets(allBiletsData);
  setOpenBillets(openBills);
  setPaidBillets(billetsInPaid);

  setLoading(false);
}
