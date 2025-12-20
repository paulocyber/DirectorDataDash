// Bibliotecas
import axios from "axios";

export function setupApiClient(ctx?: string) {
  const api = axios.create({
    baseURL: "https://api.playcell.autotasker.com.br",
  });

  api.interceptors.request.use(
    (config) => {
      if (ctx) {
        config.headers.Authorization = `Bearer ${ctx}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
}
