// Next
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";

// Bibliotecas
import { parseCookies } from "nookies";

// Funcao so para convidados
export function canSSRGuest<P extends { [key: string]: any }>(
  fn: GetServerSideProps<P>
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    // Se o cara tentar acessa pagina  porem tendo login salvo sera redirecionador
    if (cookies["@nextauth.token"]) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return await fn(ctx);
  };
}
