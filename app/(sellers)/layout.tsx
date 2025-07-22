// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// React
import { ReactNode } from "react";

// Utils

// Componentes
import Layout from "@/components/ui/layout";
import Unauthorized from "@/components/ui/unauthorized/page";

// Config
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import { Metadata } from "next";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";

export const metadata: Metadata = {
  title: "Relatório de vendas",
  description: "Informações sobre vendas e metas",
};

export default async function SalesRouter({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";
  const active = (await cookieStore).get("@nextauth.active")?.value || "";
  const api = setupApiClient(token);

  if (!token) redirect("/");

  if (!["vendedor", "vendedora"].includes(role)) redirect("/");

  if (active === "false") {
    return <Unauthorized />;
  }

  return (
    <div
      className={clsx(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}
    >
      <Layout role={role}>{children}</Layout>
    </div>
  );
}
