// Utils
import { davsQueries } from "@/utils/queries/dav";
import { fetchData } from "@/utils/fetchData";

// Tipagem
import { ItemsDavData } from "@/types/dav";
interface fetchDavsProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  setDavs: (value: ItemsDavData[]) => void;
  setLoading: (value: boolean) => void;
}

export async function fetchDavs({
  token,
  dateInit,
  dateEnd,
  setDavs,
  setLoading,
}: fetchDavsProps) {
  setLoading(true);

  const { davFinished } = davsQueries({ dateInit, dateEnd });

  const queries = [
    fetchData({
      ctx: token,
      query: davFinished,
      setData: (data) => setDavs(data),
    }),
  ];

  await Promise.all(queries);
  setLoading(false);
}
