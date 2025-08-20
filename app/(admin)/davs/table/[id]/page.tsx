// Next
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";
import { davsQueries } from "@/utils/querys/dav";

// Componentes
import DataNotFound from "@/components/ui/dataNotFound";
import LayoutDetailDav from "@/components/pagesTemplates/davs/detail";

// Data
import { redirectMap } from "@/data/rulesByUsers";

// MetasDados
export const metadata: Metadata = {
  title: "Relatório Detalhado da Dav's",
  description: "Informação sobre documentos de vendas",
};

export default async function DetailDavPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";

  const api = setupApiClient(token);

  if (
    role !== "admin" &&
    role !== "diretoria" &&
    role !== "financeiro" &&
    Object.prototype.hasOwnProperty.call(redirectMap, role)
  ) {
    return redirect(redirectMap[role]);
  }

  const { id } = await params;
  const { davFinalizationDetail, obtainProductsContainedInDav } = davsQueries({
    id,
  });

  const [davDetailResponse, davProductsResponse] = await Promise.all([
    api.post("/v1/find-db-query", { query: davFinalizationDetail }),
    api.post("/v1/find-db-query", { query: obtainProductsContainedInDav }),
  ]);

  if (davDetailResponse?.data?.returnObject?.body.length === 0) {
    return <DataNotFound />;
  }

  return (
    <LayoutDetailDav
      davDetailData={davDetailResponse.data.returnObject.body}
      productsData={davProductsResponse.data.returnObject.body}
    />
  );
}
