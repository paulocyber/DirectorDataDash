// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { salesQueries } from "@/utils/queries/sales";
import { fetchData } from "..";
import { groupSumBy } from "@/utils/filters/groupSumBy";

// TIpagem
interface FetchSalesByGroup {
  token: string;
  setLoading: (value: boolean) => void;
  setCurrentSalesData: (value: { brand: string; value: number }[]) => void;
  setLastSalesData: (value: { brand: string; value: number }[]) => void;
}

export async function fetchSalesByGroup({
  token,
  setLoading,
  setCurrentSalesData,
  setLastSalesData,
}: FetchSalesByGroup) {
  setLoading(true);

  const { firstDayPrevMonth, lastDayPrevMonth, year, month, today } =
    getCurrentDateDetails();

  const { salesByGroup: currentMonthSales } = salesQueries({
    dateInit: `${year}/${month}/01`,
    dateEnd: today,
    groups: [
      "CAPAS",
      "SUA CAPA",
      "CAPA ORIGINAL",
      "CAPA RIGIDA LISA",
      "CAPA SOFT",
      "CAPA TRANSPARANTE",
      "CAPAS DIVERSAS",
      "CAPA RIGIDA FOSCA",
      "CAPA REVESTIDA",
      "CAPA REVESTIDA MAGSAFE",
      "CAPA AVELUDADO",
      "CAPA SPACE 2",
      "CAPA SAPECE ACRILICA",
      "pelicula",
      "fosca 3D pelicula",
      "película de camera",
      "pelicula cerâmica fosca",
      "pelicula ceramica fosca priv",
      "pelicula 3d grossa",
      "pelicula 3d privacidade",
      "pelicula 3d fina",
      "pelicula play up",
    ],
  });

  const { salesByGroup: lastMonthSales } = salesQueries({
    dateInit: firstDayPrevMonth,
    dateEnd: lastDayPrevMonth,
    groups: [
      "CAPAS",
      "SUA CAPA",
      "CAPA ORIGINAL",
      "CAPA RIGIDA LISA",
      "CAPA SOFT",
      "CAPA TRANSPARANTE",
      "CAPAS DIVERSAS",
      "CAPA RIGIDA FOSCA",
      "CAPA REVESTIDA",
      "CAPA REVESTIDA MAGSAFE",
      "CAPA AVELUDADO",
      "CAPA SPACE 2",
      "CAPA SAPECE ACRILICA",
      "pelicula",
      "fosca 3D pelicula",
      "película de camera",
      "pelicula cerâmica fosca",
      "pelicula ceramica fosca priv",
      "pelicula 3d grossa",
      "pelicula 3d privacidade",
      "pelicula 3d fina",
      "pelicula play up",
    ],
  });

  let currentMonthSalesData: any[] = [];
  let lastMonthSalesData: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: currentMonthSales,
      setData: (data) => (currentMonthSalesData = data),
    }),
    fetchData({
      ctx: token,
      query: lastMonthSales,
      setData: (data) => (lastMonthSalesData = data),
    }),
  ];

  await Promise.all(queries);

  const currentMonthAggregatedSales = groupSumBy(currentMonthSalesData, {
    key: "GRUPO",
    valueKey: "TOTAL_VALOR_COMPRA",
  });
  const lastMonthAggregatedSales = groupSumBy(lastMonthSalesData, {
    key: "GRUPO",
    valueKey: "TOTAL_VALOR_COMPRA",
  });

  setCurrentSalesData(currentMonthAggregatedSales);
  setLastSalesData(lastMonthAggregatedSales);
  setLoading(false);
}
