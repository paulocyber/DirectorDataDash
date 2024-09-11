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
  emp?: string;
  sellers?: string;
}

export async function fetchSales({
  setLoading,
  setSales,
  setTopSeller,
  dateInit,
  dateEnd,
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
  const { year, month, today } = getDate();
  const { storeGoals, individualGoals } = goalsQueries({ id: sellers, dateInit: `${year}/${month}/01` });

  const queries = [
    fetchData({ query: sales, setData: (data) => (salesData = data) }),
    fetchData({
      query: sellers ? individualGoals : storeGoals,
      setData: (data) => (goalsData = data),
    }),
    fetchData({ query: topTenSellers, setData: (data) => (topSeller = data) }),
  ];

  await Promise.all(queries);

  const totalSalesValue = salesData.reduce((acc: number, sale: any) => {
    return acc + parseFloat(sale.VALOR_LIQUIDO);
  }, 0);

  const data = [
    { name: "Vendas", value: totalSalesValue },
    {
      name: "Metas",
      value: sellers
        ? parseFloat(goalsData[0].VALOR_INDIVIDUAL_MTI)
        : parseFloat(goalsData[0].VALOR_MTA),
    },
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

  setSales(data);
  setTopSeller(formattedTopSellerData);
  setLoading(false);
}
