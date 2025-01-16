// Utils
import { goalsQueries } from "@/utils/queries/goals";
import { salesQueries } from "@/utils/queries/sales";
import { calculateTotalByKey } from "@/utils/functions/sumValues";
import {
  convertFieldsToNumber,
  parseNumericString,
} from "@/utils/convertStringToNumber";

// Biblioteca
import { fetchData } from "..";

// Tipagem
import { ItemsGoalProgress, ItemsTopClientsPlusBuyData } from "@/types/sales";
interface FetchSalesProps {
  token: string;
  dateInit: string;
  year: number;
  month: number;
  dateEnd: string;
  sellerSurname: string;
  setLoading: (value: boolean) => void;
  setComission?: (value: number) => void;
  setGoalProgress: (value: ItemsGoalProgress[]) => void;
  setTopClients: (value: ItemsTopClientsPlusBuyData[]) => void;
}

export async function fetchSales({
  token,
  dateInit,
  dateEnd,
  year,
  month,
  sellerSurname,
  setLoading,
  setComission,
  setGoalProgress,
  setTopClients,
}: FetchSalesProps) {
  setLoading(true);

  const { sales, commissionPerSalesPerson } = salesQueries({
    dateInit,
    dateEnd,
    sellerSurname,
    company: ["1, 2, 3, 4"],
  });
  const { individualGoals } = goalsQueries({
    month,
    year,
    sellerSurname,
    company: ["1, 2, 3, 4"],
  });
  const { topClientsPlusBuy } = salesQueries({
    dateInit,
    dateEnd,
    sellerSurname,
    company: ["1, 2, 3, 4"],
  });

  let salesReportData: any[] = [];
  let commissionReportData: any[] = [];
  let goalsReportData: any[] = [];
  let topClientsPurchaseData: any[] = [];

  try {
    const queries = [
      fetchData({
        ctx: token,
        query: sales,
        setData: (data) => (salesReportData = data || []),
      }),
      fetchData({
        ctx: token,
        query: commissionPerSalesPerson,
        setData: (data) => (commissionReportData = data || []),
      }),
      fetchData({
        ctx: token,
        query: individualGoals,
        setData: (data) => (goalsReportData = data || []),
      }),
      fetchData({
        ctx: token,
        query: topClientsPlusBuy,
        setData: (data) => (topClientsPurchaseData = data || []),
      }),
    ];

    await Promise.all(queries);

    const totalComissionValue = calculateTotalByKey(
      commissionReportData,
      (item) => item?.COMISSAO || 0
    );

    const topClient = topClientsPurchaseData.length
      ? convertFieldsToNumber(topClientsPurchaseData, ["VALOR_LIQUIDO"])
      : [];

    const goalProgressData = [
      {
        name: "Vendas",
        value: salesReportData.length
          ? parseNumericString(salesReportData[0]?.VALOR_LIQUIDO || "0")
          : 0,
      },
      {
        name: "Lucro",
        value: goalsReportData.length
          ? parseNumericString(goalsReportData[0]?.VALOR_INDIVIDUAL_MTI || "0")
          : 0,
      },
    ];

    setTopClients(topClient);
    setComission && setComission(totalComissionValue);
    setGoalProgress(goalProgressData);
  } catch (error) {
    console.error("Erro ao buscar dados de vendas:", error);
  } finally {
    setLoading(false);
  }
}
