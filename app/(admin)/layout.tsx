// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// React
import { ReactNode } from "react";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";
import { formOfPaymentsQueries } from "@/utils/querys/paymentMethod";
import { companiesQueries } from "@/utils/querys/companies";
import { CostCentersQueries } from "@/utils/querys/costCenters";
import { PeopleQueries } from "@/utils/querys/peoples";
import { suppliersQueries } from "@/utils/querys/suppliers";

// Componentes
import Layout from "@/components/ui/layout";
import Unauthorized from "@/components/ui/unauthorized/page";

// Config
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Relatório de vendas",
  description: "Informações sobre vendas e metas",
};

export default async function AdminRouter({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";
  const active = (await cookieStore).get("@nextauth.ativo")?.value || "";
  const api = setupApiClient(token);

  if (!token) {
    redirect("/");
  }

  if (["vendedor", "vendedora"].includes(role)) redirect("/sales");

  if (active === "false") {
    return <Unauthorized />;
  }

  const formOfPayments = formOfPaymentsQueries();
  const suppliers = suppliersQueries();
  const peoples = PeopleQueries();
  const companies = companiesQueries();
  const costCenters = CostCentersQueries();

  const [
    paymentMethodData,
    companiesResponse,
    costCentersResponse,
    peoplesResponse,
    suppliersResponse,
  ] = await Promise.all([
    api.post("/v1/find-db-query", { query: formOfPayments }),
    api.post("/v1/find-db-query", { query: companies }),
    api.post("/v1/find-db-query", { query: costCenters }),
    api.post("/v1/find-db-query", { query: peoples }),
    api.post("/v1/find-db-query", { query: suppliers }),
  ]);

  return (
    <div
      className={clsx(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}
    >
      <Layout
        role={role}
        paymentMethodData={paymentMethodData.data.returnObject.body}
        companiesData={companiesResponse.data.returnObject.body}
        costCentersData={costCentersResponse.data.returnObject.body}
        peoplesData={peoplesResponse.data.returnObject.body}
        suppliersData={suppliersResponse.data.returnObject.body}
      >
        {children}
      </Layout>
    </div>
  );
}
