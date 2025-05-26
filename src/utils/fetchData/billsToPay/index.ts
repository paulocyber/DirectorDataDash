// Utils
import { billsToPayQueries } from "@/utils/queries/billstoPay";
import { fetchData } from "..";
import getCurrentDateDetails from "@/utils/getDate";

// Tipagem
import { ItemsBillsToPay } from "@/types/billsToPay";
interface FetchBillsToPayProps {
  token: string;
  clear?: boolean;
  dateInit: string;
  dateEnd: string;
  costsCenters?: string[];
  setLoading: (value: boolean) => void;
  setAllBillets: (value: ItemsBillsToPay[]) => void;
  setOpenBills: (value: ItemsBillsToPay[]) => void;
  setPaidBills: (value: ItemsBillsToPay[]) => void;
  setOverdueBills: (value: ItemsBillsToPay[]) => void;
}

export async function fetchBillsToPay({
  token,
  clear,
  dateInit,
  dateEnd,
  costsCenters,
  setLoading,
  setAllBillets,
  setOpenBills,
  setPaidBills,
  setOverdueBills,
}: FetchBillsToPayProps) {
  setLoading(true);

  const { year, yesterday } = getCurrentDateDetails();

  const { allBillet } = billsToPayQueries({
    dateInit: dateInit,
    dateEnd: dateEnd,
    costsCenters,
  });

  const { expiredBillet } = billsToPayQueries({
    dateInit: `${year}/01/01`,
    dateEnd: clear ? `${yesterday}` : dateEnd,
  });

  let allBilletData: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: allBillet,
      setData: (data) => (allBilletData = data),
    }),
    fetchData({
      ctx: token,
      query: expiredBillet,
      setData: (data) => setOverdueBills(data),
    }),
  ];

  await Promise.all(queries);

  const openBills = allBilletData.filter((bill: ItemsBillsToPay) => {
    const billDateParts = bill.DATA_VENCIMENTO_PGM.split(" ")[0].split("/");
    const billDate = new Date(
      Number(billDateParts[2]),
      Number(billDateParts[1]) - 1,
      Number(billDateParts[0])
    );

    const dateInitObj = new Date(dateInit);
    const dateEndObj = new Date(dateEnd);

    const isStatusValid = bill.STATUS_PGM === "1" || bill.STATUS_PGM === "4";
    const isDateInRange = billDate >= dateInitObj && billDate <= dateEndObj;

    return isStatusValid && isDateInRange;
  });

  const paidBills = allBilletData.filter(
    (bill: ItemsBillsToPay) =>
      bill.STATUS_PGM === "2" || bill.STATUS_PGM === "4"
  );

  setAllBillets(allBilletData);
  setOpenBills(openBills);
  setPaidBills(paidBills);

  setLoading(false);
}
