// Biblioteca
import axios from "axios";

export function setupApiClient(ctx?: string) {
  const api = axios.create({
    baseURL: "https://sistema-suporte-play-uljpe.ondigitalocean.app",
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
