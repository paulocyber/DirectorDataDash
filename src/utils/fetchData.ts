// Api
import { setupApiClient } from "./../service/api";

// Tipagem
type fetchDataProps = {
  query: string;
  setData: (value: any) => void;
};

export const fetchData = async ({ query, setData }: fetchDataProps) => {
  try {
    const apiClient = setupApiClient();
    const resp = await apiClient.post("/v1/find-db-query", {
      query: query,
    });

    setData(resp.data.returnObject.body);
  } catch (err) {
    console.log("Erro ao buscar dados da API: ", err);
  }
};
