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
import { sellersQueries } from "@/utils/queries/employees/sellers";

// Bibliotecas
import { toast } from "react-toastify";

// Tipagem
import {
  profitsFromSale,
  salesProgressData,
  topClientsPlusBuyData,
} from "@/types/sales";
import { SellersType } from "@/types/Employees";

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
  setSellers?: (value: SellersType[]) => void;
  setSellersAndGoals?: (value: profitsFromSale[]) => void;
  setProgressSalesRelatory?: (value: salesProgressData[]) => void;
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
  setSellers,
  setSellersAndGoals,
  setProgressSalesRelatory,
}: FetchSales) {
  setLoading(true);

  const { today } = getDate();

  const { sales: salesQuery, profitsFromSale } = salesQueries({
    dateInit,
    dateEnd,
    emp: emp ? emp : "1, 2, 3",
    sellersSurname,
    idSeller: idSeller,
    month: month ? month : undefined,
    year: year ? year : undefined,
  });
  const { sales: relatorySales } = salesQueries({
    dateInit,
    dateEnd,
    emp: emp ? emp : "1, 2, 3",
    sellersSurname,
    idSeller: idSeller,
    month: month ? month : undefined,
    year: year ? year : undefined,
  });
  const { individualGoals, storeGoals } = goalsQueries({
    dateInit,
    sellersSurname,
    idSeller: idSeller,
    year: year ? year : undefined,
    month: month ? month : undefined,
    emp: emp ? emp : "1, 2, 3",
  });
  const { storeGoals: relatoryStoreGoals } = goalsQueries({
    dateInit,
    sellersSurname,
    idSeller: idSeller,
    year: year ? year : undefined,
    month: month ? month : undefined,
    emp:  "1, 2, 3",
  });
  const { commissionPerSalesPerson } = salesQueries({
    dateInit,
    dateEnd,
    sellersSurname,
    idSeller: idSeller,
  });
  const { topClientsPlusBuy } = salesQueries({
    dateInit: today,
    dateEnd: today,
    sellersSurname,
    emp: "1, 2, 3",
    idSeller: idSeller,
  });
  const sellers = sellersQueries({ dateInit });

  let sales: any[] = [];
  let topClients: any[] = [];
  let commissionValue: any[] = [];
  let relatorySalesData: any[] = [];
  let relatoryStoreGoalsData: any[] = [];
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
    fetchData({
      ctx: token,
      query: sellers,
      setData: (data) => setSellers?.(data),
    }),
    fetchData({
      ctx: token,
      query: profitsFromSale,
      setData: (data) => setSellersAndGoals?.(data),
    }),
    fetchData({
      ctx: token,
      query: relatorySales,
      setData: (data) => (relatorySalesData = data),
    }),
    fetchData({
      ctx: token,
      query: relatoryStoreGoals,
      setData: (data) => (relatoryStoreGoalsData = data),
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
      value:
        convertStringToNumber(
          emp ? goals[0]?.VALOR_MTA : goals[0]?.VALOR_INDIVIDUAL_MTI
        ) || 0,
    },
  ];

  const progressSalesRelatory = [
    { name: "Vendas", value: TotalSum(relatorySalesData, "VALOR_LIQUIDO") },
    { name: "Lucro", value: TotalSum(relatorySalesData, "VALOR_LUCRO") },
    {
      name: "Meta grupo play",
      value: TotalSum(relatoryStoreGoalsData, "VALOR_MTA"),
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

  setCommissionValue && setCommissionValue(comissionSum);
  setProgressSalesRelatory && setProgressSalesRelatory(progressSalesRelatory);
  setGoalProgress(goalProgress);
  setTopClients(topClient);
  setLoading(false);
}
