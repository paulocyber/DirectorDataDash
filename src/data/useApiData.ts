import { useEffect, useState } from "react";

// Bibliotecas
import axios, { CancelTokenSource } from "axios";

// Tipagem
import { apiDataProps } from "../models/types";

// http://192.168.15.36:3000/v1/find-db-query
export const UseApiData = ({ query }: apiDataProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  useEffect(() => {
    let source: CancelTokenSource | null = null;

    const fetchData = async () => {
      setLoading(true);
      try {
        const resp = await axios.post(
          "http://192.168.15.128:5000/v1/find-db-query",
          {
            query: query,
          }
        );
        setData(resp.data.returnObject.body);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };
    fetchData();

    return () => {
      if (source) {
        source.cancel("Cleanup: Component unmounted or query changed");
      }
    };
  }, [query, refreshCount]);

  const handleRefresh = () => {
    setRefreshCount((prevCount) => prevCount + 1); // Incrementa o contador de atualização quando o botão de atualização é clicado
  };

  return { data, loading, handleRefresh };
};
