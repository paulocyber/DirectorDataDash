// Utils
import { salesQueries } from "@/utils/queries/sales";
import { fetchData } from "../fetchData";
import { goalsQueries } from "@/utils/queries/goals";

// Tipagem
import { salesData, topSalesData } from "@/utils/types/sales";
import getDate from "@/utils/date/currentDate";
interface FetchSales {
  setLoading: (value: boolean) => void;
  setSales: (value: salesData[]) => void;
  setTopSeller: (value: topSalesData[]) => void;
  dateInit: string;
  dateEnd: string;
  month: number;
  emp?: string;
  sellers?: string;
}

export async function fetchSales({
  setLoading,
  setSales,
  setTopSeller,
  dateInit,
  dateEnd,
  month,
  emp,
  sellers,
}: FetchSales) {
  setLoading(true);

  let goalsData: any[] = [];
  let salesData: any[] = [];
  let topSeller: any[] = [];

  const { sales, topTenSellers } = salesQueries({
    dateInit,
    dateEnd,
    emp,
    sellers,
  });
  const { year } = getDate();
  const { storeGoals, individualGoals } = goalsQueries({
    id: sellers,
    dateInit,
    month,
    year
  });

  const queries = [
    fetchData({ query: sales, setData: (data) => (salesData = data) }),
    fetchData({
      query: sellers ? individualGoals : storeGoals,
      setData: (data) => (goalsData = data),
    }),
    fetchData({ query: topTenSellers, setData: (data) => (topSeller = data) }),
  ];

  await Promise.all(queries);

  const individualGoalValue = sellers
    ? parseFloat(goalsData[0]?.VALOR_INDIVIDUAL_MTI) || 0
    : parseFloat(goalsData[0]?.VALOR_MTA) || 0;

  const data = [
    {
      name: "Vendas",
      value: parseFloat(String(salesData[0].VALOR_LIQUIDO).replace(",", ".")),
    },
    { name: "Metas", value: individualGoalValue },
  ];
  
  const formattedTopSellerData = topSeller.map((item: topSalesData) => {
    const valueLiquid =
      typeof item.VALOR_TOTAL_LIQUIDO === "string"
        ? parseFloat(item.VALOR_TOTAL_LIQUIDO.replace(",", "."))
        : item.VALOR_TOTAL_LIQUIDO;

    return {
      ...item,
      VALOR_TOTAL_LIQUIDO: valueLiquid,
    };
  });
  // console.log("Dados: ", data);
  setSales(data);
  setTopSeller(formattedTopSellerData);
  setLoading(false);
}
