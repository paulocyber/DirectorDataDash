// Framework - Next
import { Metadata } from "next";
import { cookies } from "next/headers";

// Biblioteca
import { setupApiClient } from '@/services/api';

// Utils
import getDate from "@/utils/date/currentDate";
import { davsQueries } from "@/utils/queries/davs"

// Compononentes
import UiDav from "@/components/layouts/davsUi";

// Dados
import InfoCardFromDav from "@/data/infoCard/davs";

// MetasDados
export const metadata: Metadata = {
    title: "Relatório das Dav's",
    description: "Informação sobre documentos de vendas",
};

export default async function DavsPage() {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string)
    const { today } = getDate()

    const { davFinished } = davsQueries({ dateInit: today, dateEnd: today });

    const respDavs = await api.post("/v1/find-db-query", { query: davFinished })
    const infoCard = InfoCardFromDav({listDav: respDavs.data.returnObject.body})

    return (
        <UiDav listDav={respDavs.data.returnObject.body} infoCard={infoCard} today={today}/>
    )
}