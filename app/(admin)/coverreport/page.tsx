// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";

// Dados
import { redirectMap } from "@/data/rulesByUsers";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";
import { davsQueries } from "@/utils/querys/dav";
import getCurrentDateDetails from "@/utils/getDate";

// Componentes
import LayoutCoverReport from "@/components/pagesTemplates/coverreport";

export const metadata: Metadata = {
  title: "Relatório das Capas",
  description: "Informação sobre documentos de vendas",
};

export default async function CoverReport() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";

  if (
    role !== "admin" &&
    role !== "diretoria" &&
    role !== "estoque" &&
    Object.prototype.hasOwnProperty.call(redirectMap, role)
  ) {
    return redirect(redirectMap[role]);
  }

  const api = setupApiClient(token);

  const { today } = getCurrentDateDetails();
  const { davFinished } = davsQueries({
    dateInit: today,
    dateEnd: today,
    companys: ["4"],
  });

  const coverSalesData = await api.post("/v1/find-db-query", {
    query: davFinished,
  });

  return (
    <LayoutCoverReport
      today={today}
      coverSalesData={coverSalesData.data.returnObject.body}
    />
  );
}
