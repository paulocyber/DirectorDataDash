// Utils
import { billsToPayQueries } from "@/utils/queries/billstoPay";
import { fetchData } from "..";

// Tipagem
import { BillsToPayData } from "@/types/billsToPay";
interface FetchBillsToPayProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  year: number;
  month: number;
  day: number;
  clear?: boolean;
  setLoading: (value: boolean) => void;
  setBillets: (value: BillsToPayData[]) => void;
  setBilletInOpen: (value: BillsToPayData[]) => void;
  setBilletPaid: (value: BillsToPayData[]) => void;
  setLateBills: (value: BillsToPayData[]) => void;
}

export async function fetchBillsToPay({
  token,
  dateInit,
  dateEnd,
  year,
  month,
  day,
  clear,
  setLoading,
  setBillets,
  setBilletInOpen,
  setBilletPaid,
  setLateBills,
}: FetchBillsToPayProps) {
  setLoading(true);

  const { expiredBilletAll, expiredBillet, billetPaidAndOpen } =
    billsToPayQueries({ dateInit, dateEnd, year, month, day });

  let allBillets: any[] = [];
  let lateBills: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: billetPaidAndOpen,
      setData: (data) => (allBillets = data),
    }),
    fetchData({
      ctx: token,
      query: clear ? expiredBillet : expiredBilletAll,
      setData: (data) => (lateBills = data),
    }),
  ];

  await Promise.all(queries);

  const filterBilletInOpen = allBillets.filter(
    (billet) => billet.STATUS_PGM === "1" || billet.STATUS_PGM === "4"
  );
  const filterBilletPaid = allBillets.filter(
    (billet) => billet.STATUS_PGM === "2"
  );

  setLoading(false);
  setBillets(allBillets)
  setBilletInOpen(filterBilletInOpen)
  setBilletPaid(filterBilletPaid)
  setLateBills(lateBills)
}
