// Framework
import { GetServerSidePropsContext } from "next";

// Error
import { AuthTokenError } from "./errors/error";

// Biblioteca
import { parseCookies } from "nookies";
import axios, { AxiosError } from "axios";

export function setupApiClient(ctx?: GetServerSidePropsContext) {
  let cookies = parseCookies(ctx);

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
      } else {
        return Promise.reject(new AuthTokenError());
      }

      return Promise.reject(err);
    }
  );

  return api;
}
