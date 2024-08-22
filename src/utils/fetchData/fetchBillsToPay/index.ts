// Utils
import getDate from "@/utils/date/currentDate";
import { billsToPayQueries } from "@/utils/queries/billstoPay";
import { fetchData } from "../fetchData";

// React

// Tipagem
import { BillsToPayItem } from "@/utils/types/billsToPay";
interface fetchBillsToPayProps {
  setLoading: (value: boolean) => void;
  setBilletInOpen: (billets: BillsToPayItem[]) => void;
  setBilletPaid: (billets: BillsToPayItem[]) => void;
  setLateBills: (billets: BillsToPayItem[]) => void;
  setAllBillets: (billets: BillsToPayItem[]) => void;
  dateInit: string;
  dateEnd: string;
  expiredByDate?: boolean;
}

export async function fetchBillsToPay({
  setLoading,
  setBilletInOpen,
  setBilletPaid,
  setLateBills,
  setAllBillets,
  dateInit,
  dateEnd,
  expiredByDate,
}: fetchBillsToPayProps) {
  setLoading(true);

  const { year, month, today, yesterday, monthExpired } = getDate();

  const { expiredBilletAll, expiredBillet, billetPaidAndOpen } =
    billsToPayQueries({
      dateInit,
      dateEnd,
      year,
      month: monthExpired,
      day: yesterday,
    });

  let allBillets: any[] = [];
  let lateBills: any[] = [];

  const queries = [
    fetchData({
      query: billetPaidAndOpen,
      setData: (data) => (allBillets = data),
    }),
    fetchData({
      query: expiredByDate ? expiredBillet : expiredBilletAll,
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

  setBilletInOpen(filterBilletInOpen);
  setBilletPaid(filterBilletPaid);
  setLateBills(lateBills);
  setAllBillets(allBillets);
  setLoading(false);
}
