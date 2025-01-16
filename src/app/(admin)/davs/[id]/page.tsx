// Componentes
import LayoutDetail from "@/components/layouts/dav/detail";
import { NotFound } from "@/components/ui/notFound";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import { davsQueries } from "@/utils/queries/dav";

// Next
import { Metadata } from "next";
import { cookies } from "next/headers";

// MetasDados
export const metadata: Metadata = {
    title: "Relatório Detalhado da Dav's",
    description: "Informação sobre documentos de vendas",
};

export default async function DetailDavsPage({ params }: { params: Promise<{ id: string }> }) {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;

    const api = setupApiClient(token)

    const { id } = await params
    const { davFinalizationDetail, obtainProductsContainedInDav } = davsQueries({ id })

    const [davDetailsResponse, davProductsResponse] = await Promise.all([
        api.post("/v1/find-db-query", { query: davFinalizationDetail }),
        api.post("/v1/find-db-query", { query: obtainProductsContainedInDav })
    ])

    if (davDetailsResponse?.data?.returnObject?.body.length === 0) {
        return (
            <NotFound href="/davs" />
        );
    }

    return (
        <LayoutDetail
            davDetailData={davDetailsResponse.data.returnObject.body}
            davProductsData={davProductsResponse.data.returnObject.body}
        />
    )
}