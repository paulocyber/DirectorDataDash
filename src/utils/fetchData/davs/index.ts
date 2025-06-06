// Utils
import { davsQueries } from "@/utils/queries/dav";
import { fetchData } from "@/utils/fetchData";
import { groupSumBy } from "@/utils/filters/groupSumBy";
import { salesQueries } from "@/utils/queries/sales";

// Tipagem
import { ItemsDavData } from "@/types/dav";
import getCurrentDateDetails from "@/utils/getDate";
import { convertFieldsToNumber } from "@/utils/convertStringToNumber";
import { ItemsSalesPerMonth } from "@/types/sales";
interface fetchDavsProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  year: number;
  formsOfPayments?: string[];
  setDavs: (value: ItemsDavData[]) => void;
  setPaymentMethods?: (data: { brand: string; value: number }[]) => void;
  setSalesPerMonth?: (data: ItemsSalesPerMonth[]) => void;
  setLoading: (value: boolean) => void;
}

export async function fetchDavs({
  token,
  dateInit,
  dateEnd,
  year,
  formsOfPayments,
  setDavs,
  setPaymentMethods,
  setSalesPerMonth,
  setLoading,
}: fetchDavsProps) {
  setLoading(true);

  const { today } = getCurrentDateDetails();
  const { davFinished } = davsQueries({ dateInit, dateEnd, formsOfPayments });
  const { salesPerMonth } = salesQueries({
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
    setSalesPerMonth &&
      fetchData({
        ctx: token,
        query: salesPerMonth,
        setData: (data) => (salesPerMonthData = data),
      }),
  ];

  await Promise.all(queries);

  const sortedPaymentMethods = groupSumBy(davsData, {
    key: "FORMAPAGAMENTO",
    valueKey: "VALOR_LIQUIDO_SDS",
  }).sort((a, b) => b.value - a.value);

  const convertedSalesPerMonth = convertFieldsToNumber<ItemsSalesPerMonth>(
    salesPerMonthData,
    ["VALOR_LIQUIDO_SDS"]
  ).sort((a, b) => (b as any).TOTAL_VENDAS - (a as any).TOTAL_VENDAS);

  setDavs(davsData);
  setPaymentMethods && setPaymentMethods(sortedPaymentMethods);
  setSalesPerMonth && setSalesPerMonth(convertedSalesPerMonth);
  setLoading(false);
}
