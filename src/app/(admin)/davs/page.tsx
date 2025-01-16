// Next
import { cookies } from "next/headers";
import { Metadata } from "next";

// Biblioteca
import { setupApiClient } from "@/services/api";

// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { davsQueries } from "@/utils/queries/dav";

// Componentes
import LayoutDav from "@/components/layouts/dav";

export const metadata: Metadata = {
    title: "Relatório das Dav's",
    description: "Informação sobre documentos de vendas",
};

export default async function DavPage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;

    const api = setupApiClient(token)
    const { today } = getCurrentDateDetails()

    const { davFinished } = davsQueries({ dateInit: today, dateEnd: today })

    const davResponse = await api.post("/v1/find-db-query", { query: davFinished });

    return (
        <LayoutDav davsData={davResponse.data.returnObject.body} today={today} />
    )
}