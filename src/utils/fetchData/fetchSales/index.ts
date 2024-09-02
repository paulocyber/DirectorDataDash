// Utils
import { salesQueries } from "@/utils/queries/sales";
import { fetchData } from "../fetchData";
import { goalsQueries } from "@/utils/queries/goals";

// Tipagem
import { salesData } from "@/utils/types/sales";
interface FetchSales {
  setLoading: (value: boolean) => void;
  setSales: (value: salesData[]) => void;
  dateInit: string;
  dateEnd: string;
  emp?: string;
  sellers?: string ;
}

export async function fetchSales({
  setLoading,
  setSales,
  dateInit,
  dateEnd,
  emp,
  sellers,
}: FetchSales) {
  setLoading(true);

  let goalsData: any[] = [];
  let salesData: any[] = [];

  const sales = salesQueries({ dateInit, dateEnd, emp, sellers });
  const { storeGoals, individualGoals } = goalsQueries({ id: sellers });

  const queries = [
    fetchData({ query: sales, setData: (data) => (salesData = data) }),
    fetchData({ query: sellers ? individualGoals : storeGoals, setData: (data) => (goalsData = data) }),
  ];

  await Promise.all(queries);

  const totalSalesValue = salesData.reduce((acc: number, sale: any) => {
    return acc + parseFloat(sale.VALOR_LIQUIDO);
  }, 0);

  const data = [
    { name: "Vendas", value: totalSalesValue },
    { name: "Metas", value: sellers? parseFloat(goalsData[0].VALOR_INDIVIDUAL_MTI) : parseFloat(goalsData[0].VALOR_MTA) },
  ];

  setSales(data);
  setLoading(false);
}
