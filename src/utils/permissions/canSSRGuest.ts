// Framework
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";

// Bibliotecas
import { parseCookies } from "nookies";

export function canSSRGuest<P extends { [key: string]: any }>(
  fn: GetServerSideProps<P>
) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    // Se o usuário estiver logado, redireciona para "/davs"
    if (cookies["@nextauth.token"] && cookies["@nextauth.role"]) {
      
      // if(cookies["@nextauth.role"]) {
      //   return {
      //     redirect: {
      //       destination: "/sales",
      //       permanent: false,
      //     },.
      //   };
      // }

      return {
        redirect: {
          destination: "/davs",
          permanent: false,
        },
      };
    }

    

    return await fn(ctx);
  };
}