// Bibliotecas
import { toast } from "react-toastify";

// Utils
import { salesQueries } from "@/utils/queries/sales";
import { goalsQueries } from "@/utils/queries/goals";
import { fetchData } from "..";
import getDate from "@/utils/currentDate";

// Tipagem
import { topClientsPlusBuyData } from "@/utils/types/sales";
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
  setClients: (value: topClientsPlusBuyData[]) => void;
  setSales: (value: SalesData[]) => void;
}

export async function fetchSales({
  token,
  dateInit,
  dateEnd,
  surname,
  setLoading,
  setComission,
  setClients,
  setSales,
}: FetchSales) {
  setLoading(true);
  
  const { today } = getDate()

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
  const { topClientsPlusBuy } = salesQueries({ dateInit: today, dateEnd: today, surname});

  let salesData: any[] = [];
  let clientsData: any[] = [];
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
    fetchData({
      ctx: token,
      query: topClientsPlusBuy,
      setData: (data) => (clientsData = data),
    })
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

  const topClients = clientsData.map((client) => ({
    ID_VENDEDOR: client.ID_VENDEDOR,
    ID_CLIENTE: client.ID_CLIENTE,
    NOME_CLIENTE: client.NOME_CLIENTE,
    VALOR_LIQUIDO: parseFloat(client.VALOR_LIQUIDO as string) 
}));

  setSales(salesAndGolas);
  setComission(commissionSum);
  setClients(topClients);
  setLoading(false);
}
