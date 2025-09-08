// Utils
import { fetchData } from "../fetchData";
import { groupBySum } from "@/utils/filters/groupBySum";

// Tipagem
import { ItemsDavData } from "@/types/davs";
import { ItemsCoverReportData } from "@/types/coverReport";
import { davsQueries } from "@/utils/querys/dav";
interface CoverReportProps {
  dateInit: string;
  dateEnd: string;
  token: string;
  setLoading: (value: boolean) => void;
  setCoverSales: (value: ItemsDavData[]) => void;
  setSalesSummary: (value: ItemsCoverReportData[]) => void;
}

export async function FetchCoverReport({
  dateInit,
  dateEnd,
  token,
  setLoading,
  setCoverSales,
  setSalesSummary,
}: CoverReportProps) {
  setLoading(true);

  const { davFinished } = davsQueries({
    dateInit,
    dateEnd,
    companys: ["4"],
  });
  let sales: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: davFinished,
      setData: (data) => (sales = data),
    }),
  ];

  await Promise.all(queries);

  const groupedSales = groupBySum(sales, {
    key: "NOME_CLIENTE_SDS",
    labelKey: "cover_seller",
    valueKey: "VALOR_LIQUIDO_SDS",
  });

  const salesSummary = groupedSales.map((item) => {
    const seller = item.cover_seller || "";

    const hyphenIndex = seller.indexOf("-");
    const saleType =
      hyphenIndex > -1
        ? seller.slice(0, hyphenIndex)
        : seller === ""
          ? null
          : seller;
    const servedBy = hyphenIndex > -1 ? seller.slice(hyphenIndex + 1) : null;

    return {
      tipo_da_venda: saleType,
      atendido_por: servedBy,
      total: item.value,
    };
  });

  setLoading(false);

  setCoverSales(
    sales.sort((a, b) => b.VALOR_LIQUIDO_SDS - a.VALOR_LIQUIDO_SDS)
  );
  setSalesSummary(salesSummary.sort((a, b) => b.total - a.total));
}
