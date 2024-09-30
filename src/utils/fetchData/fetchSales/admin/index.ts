// Utils
import { goalsQueries } from "@/utils/queries/goals";
import { salesQueries } from "@/utils/queries/sales";
import { fetchData } from "../..";

// Biblioteca
import { toast } from "react-toastify";

// Tipagem
import { salesData, topSalesData } from "@/utils/types/sales";
interface fetchSalesProps {
  token: string;
  dateInit: string;
  dateEnd: string;
  year: number;
  month: number;
  emp: string;
  surname?: string;
  setSales: (value: salesData[]) => void;
  setTopSaller: (value: topSalesData[]) => void;
}

export async function fetchSales({
  token,
  dateInit,
  dateEnd,
  year,
  month,
  emp,
  surname,
  setSales,
  setTopSaller
}: fetchSalesProps) {
  const { sales, topTenSellers } = salesQueries({ dateInit, dateEnd, emp, sellers: surname });

  const { storeGoals, individualGoals } = goalsQueries({ dateInit, year, month, id: surname });

  let respSales: any[] = [];
  let respTopTenSellers: any[] = [];
  let respStoreGoals: any[] = [];

  const quries = [
    fetchData({
      ctx: token,
      query: sales,
      setData: (data) => {
        respSales = data;
      },
    }),
    fetchData({
      ctx: token,
      query: topTenSellers,
      setData: (data) => {
        respTopTenSellers = data;
      },
    }),
    fetchData({
      ctx: token,
      query:  surname ? individualGoals : storeGoals,
      setData: (data) => {
        respStoreGoals = data;
      },
    }),
  ];

  await Promise.all(quries);

  const salesValue = respSales[0]?.VALOR_LIQUIDO
    ? parseFloat(respSales[0].VALOR_LIQUIDO)
    : 0;

    const goalsValue = surname 
    ? parseFloat(respStoreGoals[0]?.VALOR_INDIVIDUAL_MTI) || 0
    : parseFloat(respStoreGoals[0]?.VALOR_MTA) || 0;
    

  const data = [
    { name: "Vendas", value: salesValue },
    { name: "Metas", value: goalsValue },
  ];

  const formattedTopSeller = respTopTenSellers.map((item) => {
    const valueLiquid =
      typeof item.VALOR_TOTAL_LIQUIDO === "string"
        ? parseFloat(item.VALOR_TOTAL_LIQUIDO.replace(",", "."))
        : item.VALOR_TOTAL_LIQUIDO;

    return {
      ...item,
      VALOR_TOTAL_LIQUIDO: valueLiquid,
    };
  });

  if(goalsValue === 0) {
    toast.error("Este vendedor não possui metas definidas.");
  }

  setSales(data)
  setTopSaller(formattedTopSeller)
}
