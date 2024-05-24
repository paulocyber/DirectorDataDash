// Biblioteca
import { parseCookies } from "nookies";
import axios, { AxiosError } from "axios";

// Error
import { AuthTokenError } from "./erros/AuthTokenError";

// Framework
import { GetServerSidePropsContext } from "next";


export function setupApiClient(ctx?: GetServerSidePropsContext) {
  let cookies = parseCookies(ctx);

  //   http://200.233.186.22:3000 http://192.168.15.36:3000 http://192.168.15.36:3000 https://sistema-suporte-play-uljpe.ondigitalocean.app

  const api = axios.create({
    baseURL: "https://sistema-suporte-play-uljpe.ondigitalocean.app",
    headers: {
      Authorization: `Bearer ${cookies["@nextauth.token"]}`,
    },
  });

  api.interceptors.response.use(
    (resp) => {
      return resp;
    },
    (err: AxiosError) => {
      if (err.response?.status === 401) {
        // Função para deslogar
      } else {
        return Promise.reject(new AuthTokenError());
      }
// a
      return Promise.reject(err);
    }
  );

  return api;
}
