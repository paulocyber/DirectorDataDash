// Utils
import { TaxQueries } from "@/utils/querys/tax";
import { fetchData } from "../fetchData";
import { groupBySum } from "@/utils/filters/groupBySum";

// Tipagem
import { ItemsTaxInvoicing } from "@/types/TaxBiling";

interface FetchTaxBilingProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  setLoading: (value: boolean) => void;
  setBillingByCompany: (value: ItemsTaxInvoicing[]) => void;
}

export async function fetchTaxBiling({
  token,
  dateInit,
  dateEnd,
  setLoading,
  setBillingByCompany,
}: FetchTaxBilingProps) {
  setLoading(true);

  const { nfce, nfe } = TaxQueries({ dateInit, dateEnd });

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
  const billingByCompany = groupBySum(notesByCompany, {
    key: "EMPRESA",
    labelKey: "EMPRESA",
    valueKey: "VALOR_LIQUIDO_SDS",
  }).sort((a, b) => b.value - a.value);

  setBillingByCompany(billingByCompany);
  setLoading(false);
}
