// Next
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";

// Bibliotecas
import { parseCookies, destroyCookie } from "nookies";

// Error
import { AuthTokenError } from "@/service/api/errors/AuthTokenError";

// Função de roles
function canAccess(role: string, pathName: string) {
  const routesRestrictedBySellers = [
    "/davs",
    "/salesbygroup",
    "/salesbybrand",
    "/billstopay",
    "/billstopay/table",
  ];

  return !(role === "vendedor" && routesRestrictedBySellers.includes(pathName));
}

export function canSSRAuth<P extends { [key: string]: any }>(
  fn: GetServerSideProps<P>
) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const { "@nextauth.token": token, "@nextauth.role": role } = cookies;

    if (!token || !role) {
      destroyCookie(ctx, "@nextauth.token");
      
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    // Verifica se o usuário pode acessar a rota
    if (!canAccess(role, ctx.resolvedUrl)) {
      return {
        redirect: {
          destination: "/sales",
          permanent: false,
        },
      };
    }

    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, "@nextauth.token");
        destroyCookie(ctx, "@nextauth.role");
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    }

    return {
      notFound: true,
    };
  };
}