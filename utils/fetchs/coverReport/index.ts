// Utils
import { fetchData } from "../fetchData";

// Tipagem
import { ItemsDavData } from "@/types/davs";
import { davsQueries } from "@/utils/querys/dav";
interface CoverReportProps {
  dateInit: string;
  dateEnd: string;
  token: string;
  setLoading: (value: boolean) => void;
  setCoverSales: (value: ItemsDavData[]) => void;
}

export async function FetchCoverReport({
  dateInit,
  dateEnd,
  token,
  setLoading,
  setCoverSales,
}: CoverReportProps) {
  setLoading(true);

  const { davFinished } = davsQueries({
    dateInit,
    dateEnd,
    companys: ["4"],
  });

  const queries = [
    fetchData({
      ctx: token,
      query: davFinished,
      setData: (data) => setCoverSales(data),
    }),
  ];

  await Promise.all(queries);

  setLoading(false);
}
