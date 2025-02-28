// Utils
import { davsQueries } from "@/utils/queries/dav";
import { fetchData } from "@/utils/fetchData";
import { groupSumBy } from "@/utils/filters/groupSumBy";

// Tipagem
import { ItemsDavData } from "@/types/dav";
interface fetchDavsProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  formsOfPayments?: string[];
  setDavs: (value: ItemsDavData[]) => void;
  setPaymentMethods?: (data: { brand: string; value: number }[]) => void;
  setLoading: (value: boolean) => void;
}

export async function fetchDavs({
  token,
  dateInit,
  dateEnd,
  formsOfPayments,
  setDavs,
  setPaymentMethods,
  setLoading,
}: fetchDavsProps) {

  setLoading(true);

  const { davFinished } = davsQueries({ dateInit, dateEnd, formsOfPayments });

  let davsData: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: davFinished,
      setData: (data) => (davsData = data),
    }),
  ];

  await Promise.all(queries);

  const sortedPaymentMethods = groupSumBy(davsData, {
    key: "FORMAPAGAMENTO",
    valueKey: "VALOR_LIQUIDO_SDS",
  }).sort((a, b) => b.value - a.value);

  setDavs(davsData);
  setPaymentMethods && setPaymentMethods(sortedPaymentMethods);
  setLoading(false);
}
