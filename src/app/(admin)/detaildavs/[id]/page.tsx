// Biblioteca
import Layout from '@/components/DavsUi/detail';
import { setupApiClient } from '@/service/api';
import { davsQueries } from '@/utils/queries/davs';

// Framework - next
import { cookies } from 'next/headers';
import { Metadata } from 'next';

// Dados
import InfoCardFromDav from '@/data/infoCard/davs';

// MetasDados
export const metadata: Metadata = {
    title: "Relatório Detalhado da Dav's",
    description: "Informação sobre documentos de vendas",
};

export default async function DetailDavsPage({ params }: { params: { id: string } }) {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string)
    const { davFinalizationDetail, obtainProductsContainedInDav } = davsQueries({ id: params.id })

    const respDavs = await api.post("/v1/find-db-query", { query: davFinalizationDetail })
    const respProdcuts = await api.post("/v1/find-db-query", { query: obtainProductsContainedInDav })
    const infoCard = InfoCardFromDav({ listDav: respDavs.data.returnObject.body, detail: true })

    return (
        <Layout listDav={respDavs.data.returnObject.body} products={respProdcuts.data.returnObject.body} infoCard={infoCard} />
    )
}