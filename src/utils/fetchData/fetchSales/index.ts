// Bibliotecas
import { toast } from "react-toastify";

// Utils
import { salesQueries } from "@/utils/queries/sales";
import { goalsQueries } from "@/utils/queries/goals";
import { fetchData } from "..";

// Tipagem
type SalesData = {
  name: string;
  value: number;
};
type CommissionData = {
  COMISSAO: string;
  VENDEDOR: string;
};

interface FetchSales {
  token: string;
  dateInit: string;
  dateEnd: string;
  surname: string;
  setLoading: (value: boolean) => void;
  setComission: (value: number) => void;
  setSales: (value: SalesData[]) => void;
}

export async function fetchSales({
  token,
  dateInit,
  dateEnd,
  surname,
  setLoading,
  setComission,
  setSales,
}: FetchSales) {
  setLoading(true);
  
  const { sales } = salesQueries({
    dateInit,
    dateEnd,
    emp: "1, 2, 3",
    surname,
  });
  const { individualGoals } = goalsQueries({ dateInit, surname });
  const { commissionPerSalesPerson } = salesQueries({
    dateInit,
    dateEnd,
    surname
  });

  let salesData: any[] = [];
  let commision: any[] = [];
  let goalsData: any[] = [];

  const queries = [
    fetchData({
      ctx: token,
      query: sales,
      setData: (data) => (salesData = data),
    }),
    fetchData({
      ctx: token,
      query: individualGoals,
      setData: (data) => (goalsData = data),
    }),
    fetchData({
      ctx: token,
      query: commissionPerSalesPerson,
      setData: (data) => (commision = data),
    }),
  ];

  await Promise.all(queries);

  const salesAndGolas = [
    {
      name: "Vendas",
      value:
        parseFloat(String(salesData[0]?.VALOR_LIQUIDO).replace(",", ".")) || 0,
    },
    {
      name: "Metas",
      value: goalsData[0]?.VALOR_INDIVIDUAL_MTI
        ? parseFloat(
            String(goalsData[0].VALOR_INDIVIDUAL_MTI).replace(",", ".")
          )
        : 0,
    },
  ];

  if (salesAndGolas[1].value === 0) {
    toast.error("Não possui metas para esse mês 😞");
  }

  const commissionSum = commision.reduce(
    (total: number, item: CommissionData) => {
      const commissionValue = parseFloat(item.COMISSAO.replace(",", "."));
      return total + (isNaN(commissionValue) ? 0 : commissionValue);
    },
    0
  );

  setSales(salesAndGolas);
  setComission(commissionSum);
  setLoading(false);
}
