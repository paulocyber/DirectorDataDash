// Utils
import { billsToPayQueries } from "@/utils/queries/billstoPay/index";
import { fetchData } from "..";

// Dados
import InfoCardFromBillsToPay from "@/data/infoCard/billsToPay";

// React
import { ReactNode } from "react";

// Tipagem
import { BillsToPayItem } from "@/utils/types/billsToPay";
interface FetchBillsToPayProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  year: number;
  month: number;
  day: number;
  clear?: boolean;
  setLoading: (value: boolean) => void;
  setBillets: (value: BillsToPayItem[]) => void;
  setBilletInOpen: (value: BillsToPayItem[]) => void;
  setBilletPaid: (value: BillsToPayItem[]) => void;
  setLateBills: (value: BillsToPayItem[]) => void;
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
    billsToPayQueries({
      dateInit,
      dateEnd,
      year,
      month,
      day,
    });

  let allBillets: BillsToPayItem[] = [];
  let lateBills: any[] = [];

  const quries = [
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

  await Promise.all(quries);

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
