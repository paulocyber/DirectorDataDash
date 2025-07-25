// Utils
import { davsQueries } from "@/utils/querys/dav";
import { groupBySum } from "@/utils/filters/groupBySum";
import { convertFieldsToNumber } from "@/utils/stringToNumber";
import { fetchData } from "../fetchData";
import { SalesQueries } from "@/utils/querys/sales";

// Tipagem
import { ItemsDavData } from "@/types/davs";
import { ItemsSalesPerMonth } from "@/types/sales";
import getCurrentDateDetails from "@/utils/getDate";

interface FetchDavsProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  formsOfPayments?: string[];
  setDavs: (value: ItemsDavData[]) => void;
  setSalesByPaymentMethod?: (
    data: { FORMA_PGMT: string; value: number }[]
  ) => void;
  setSalesPerMonth?: (value: ItemsSalesPerMonth[]) => void;
  setLoading: (value: boolean) => void;
}

export async function fetchDavs({
  token,
  dateInit,
  dateEnd,
  formsOfPayments,
  setDavs,
  setSalesByPaymentMethod,
  setSalesPerMonth,
  setLoading,
}: FetchDavsProps) {
  setLoading(true);

  const { year, today } = getCurrentDateDetails();

  const { davFinished } = davsQueries({
    dateInit,
    dateEnd,
    formsOfPayments,
  });

  const { salesPerMonth } = SalesQueries({
    dateInit: `${year}/01/01`,
    dateEnd: today,
  });

  let davsData: any[] = [];
  let salesPerMonthData: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: davFinished,
      setData: (data) => (davsData = data),
    }),
    fetchData({
      ctx: token,
      query: salesPerMonth,
      setData: (data) => (salesPerMonthData = data),
    }),
  ];

  await Promise.all(queries);

  const paymentMethods = groupBySum(davsData, {
    key: "FORMAPAGAMENTO",
    valueKey: "VALOR_LIQUIDO_SDS",
    labelKey: "FORMA_PGMT",
  }).sort((a, b) => b.value - a.value);

  const convertedTopDebitPixSellers = convertFieldsToNumber<ItemsSalesPerMonth>(
    salesPerMonthData,
    ["VALOR_LIQUIDO_SDS"]
  ).sort((a, b) => (b as any).MES_ANO - (a as any).MES_ANO);

  setDavs(davsData);
  setSalesByPaymentMethod && setSalesByPaymentMethod(paymentMethods);
  setSalesPerMonth && setSalesPerMonth(convertedTopDebitPixSellers);

  setLoading(false);
}
