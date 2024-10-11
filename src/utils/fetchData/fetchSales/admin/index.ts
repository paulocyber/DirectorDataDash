// Utils
import { goalsQueries } from "@/utils/queries/goals";
import { salesQueries } from "@/utils/queries/sales";
import { fetchData } from "../..";
import getDate from "@/utils/currentDate";

// Biblioteca
import { toast } from "react-toastify";

// Tipagem
import {
  salesData,
  topClientsPlusBuyData,
  topSalesData,
} from "@/utils/types/sales";
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
  setTopClients: (value: topClientsPlusBuyData[]) => void;
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
  setTopSaller,
  setTopClients,
}: fetchSalesProps) {
  const { today } = getDate();

  const { sales, topTenSellers } = salesQueries({
    dateInit,
    dateEnd,
    emp,
    sellers: surname,
  });

  const { topClientsPlusBuy } = salesQueries({
    dateInit: today,
    dateEnd: today,
    emp,
    id: surname,
  });

  const { storeGoals, individualGoals } = goalsQueries({
    dateInit,
    year,
    month,
    id: surname,
    emp,
  });

  let respSales: any[] = [];
  let respTopTenSellers: any[] = [];
  let respStoreGoals: any[] = [];
  let respTopClients: any[] = [];

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
      query: surname ? individualGoals : storeGoals,
      setData: (data) => {
        respStoreGoals = data;
      },
    }),
    fetchData({
      ctx: token,
      query: topClientsPlusBuy,
      setData: (data) => {
        respTopClients = data;
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

  const topClients = respTopClients.map(
    (client: topClientsPlusBuyData) => ({
      ID_VENDEDOR: client.ID_VENDEDOR,
      ID_CLIENTE: client.ID_CLIENTE,
      NOME_CLIENTE: client.NOME_CLIENTE,
      VALOR_LIQUIDO: parseFloat(client.VALOR_LIQUIDO as string),
    })
  );

  if (goalsValue === 0) {
    toast.error("Este vendedor não possui metas definidas.");
  }

  setSales(data);
  setTopSaller(formattedTopSeller);
  setTopClients(topClients)
}
