// Utils
import getDate from "@/utils/date/currentDate";
import { salesQueries } from "@/utils/queries/sales";
import { goalsQueries } from "@/utils/queries/goals";
import { fetchData } from "..";
import { sumValues } from "../../sumValue";
import { TotalSum } from "@/utils/functionSum";
import {
  convertStringToNumber,
  convertToNumeric,
} from "@/utils/convertToNumeric";

// Bibliotecas
import { toast } from "react-toastify";

// Tipagem
import { salesProgressData, topClientsPlusBuyData } from "@/types/sales";

type CommissionData = {
  COMISSAO: string;
  VENDEDOR: string;
};

interface FetchSales {
  token: string;
  dateInit: string;
  dateEnd: string;
  year?: number | false;
  month?: number | false;
  sellersSurname?: string;
  idSeller?: string;
  emp?: string | false;
  setLoading: (value: boolean) => void;
  setCommissionValue?: (value: number) => void;
  setTopClients: (value: topClientsPlusBuyData[]) => void;
  setGoalProgress: (value: salesProgressData[]) => void;
}

export async function fetchSales({
  token,
  dateInit,
  dateEnd,
  year,
  month,
  sellersSurname,
  idSeller,
  emp,
  setLoading,
  setCommissionValue,
  setTopClients,
  setGoalProgress,
}: FetchSales) {
  setLoading(true);

  const { today } = getDate();

  const { sales: salesQuery } = salesQueries({
    dateInit,
    dateEnd,
    emp: emp ? emp : "1, 2, 3",
    sellersSurname,
    idSellers: idSeller,
  });
  const { individualGoals, storeGoals } = goalsQueries({
    dateInit,
    sellersSurname,
    idSellers: idSeller,
    year: year ? year : undefined ,
    month: month ? month : undefined,
    emp: emp ? emp : "1, 2, 3",
  });
  const { commissionPerSalesPerson } = salesQueries({
    dateInit,
    dateEnd,
    sellersSurname,
    idSellers: idSeller,
  });
  const { topClientsPlusBuy } = salesQueries({
    dateInit: today,
    dateEnd: today,
    sellersSurname,
    emp: "1, 2, 3",
    idSellers: idSeller
  });

  let sales: any[] = [];
  let topClients: any[] = [];
  let commissionValue: any[] = [];
  let goals: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: salesQuery,
      setData: (data) => (sales = data),
    }),
    fetchData({
      ctx: token,
      query: emp ? storeGoals : individualGoals,
      setData: (data) => (goals = data),
    }),
    fetchData({
      ctx: token,
      query: commissionPerSalesPerson,
      setData: (data) => (commissionValue = data),
    }),
    fetchData({
      ctx: token,
      query: topClientsPlusBuy,
      setData: (data) => (topClients = data),
    }),
  ];

  await Promise.all(queries);

  const goalProgress = [
    {
      name: "Vendas",
      value: TotalSum(sales, "VALOR_LIQUIDO") || 0,
    },
    {
      name: "Metas",
      value: convertStringToNumber(emp ? goals[0]?.VALOR_MTA : goals[0]?.VALOR_INDIVIDUAL_MTI) || 0,
    },
  ];

  if (goalProgress[1].value === 0) {
    toast.error("Não possui metas para esse mês 😞");
  }

  const comissionSum = sumValues<CommissionData>(
    commissionValue,
    (item) => item.COMISSAO
  );

  const topClient = convertToNumeric<topClientsPlusBuyData>(topClients, [
    "VALOR_LIQUIDO",
  ]);
  console.log("Query: ", salesQuery);
  setCommissionValue && setCommissionValue(comissionSum);
  setGoalProgress(goalProgress);
  setTopClients(topClient);
  setLoading(false);
} 
