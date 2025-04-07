// Utils
import { TaxQueries } from "@/utils/queries/tax";
import { fetchData } from "..";

// Tipagem
import { ItemsTaxInvoicing } from "@/types/tax";
import { groupSumBy } from "@/utils/filters/groupSumBy";
interface fetchTaxBilingProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  setLoading: (value: boolean) => void;
  setTaxInvoicing: (value: ItemsTaxInvoicing[]) => void;
}

export async function fetchTaxBiling({
  token,
  dateInit,
  dateEnd,
  setLoading,
  setTaxInvoicing,
}: fetchTaxBilingProps) {
  setLoading(true);

  const { nfce, nfe } = TaxQueries({
    dateInit,
    dateEnd,
  });

  let nfceData: any[] = [];
  let nfeData: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: nfce,
      setData: (data) => (nfceData = data),
    }),
    fetchData({
      ctx: token,
      query: nfe,
      setData: (data) => (nfeData = data),
    }),
  ];

  await Promise.all(queries);

  const notesByCompany = [...nfceData, ...nfeData];
  const billingByCompany = groupSumBy(notesByCompany, {
    key: "EMPRESA",
    valueKey: "VALOR_LIQUIDO_SDS",
  }).sort((a, b) => b.value - a.value);
  setTaxInvoicing(billingByCompany);
  setLoading(false);
}
