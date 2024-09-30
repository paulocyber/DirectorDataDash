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

interface FetchSales {
  token: string;
  dateInit: string;
  dateEnd: string;
  surname: string;
  setLoading: (value: boolean) => void;
  setSales: (value: SalesData[]) => void;
}

export async function fetchSales({
  token,
  dateInit,
  dateEnd,
  surname,
  setLoading,
  setSales,
}: FetchSales) {
  setLoading(true);
  const { sales } = salesQueries({
    dateInit,
    dateEnd,
    emp: "1",
    surname,
  });
  const { individualGoals } = goalsQueries({ dateInit, surname });

  let salesData: any[] = [];
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
  ];

  await Promise.all(queries);

  const salesAndGolas = [
    {
      name: "Vendas",
      value:
        parseFloat(String(salesData[0]?.VALOR_LIQUIDO).replace(",", ".")) || 0,
    }, // Usando o operador de encadeamento opcional
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

  setSales(salesAndGolas);
  setLoading(false);
}
