// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Bibliotecas 
import { setupApiClient } from "@/services/api";

// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { davsQueries } from "@/utils/queries/dav";

// Componentes
import LayoutDavTable from "@/components/layouts/dav/table";

export default async function TableDavPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const role = (await cookieStore).get('@nextauth.role')?.value || "";
    const paymentMethod = Object.keys((await searchParams))

    if (!token || ['estoque'].includes(role)) {
        redirect('/salesbybrand')
    }

    if (!token || ['rh'].includes(role)) {
        redirect('/salesgoal')
    }

    const api = setupApiClient(token)
    const { today } = getCurrentDateDetails()

    const { davFinished } = davsQueries({ dateInit: today, dateEnd: today, formsOfPayments: paymentMethod.length > 0 ? paymentMethod : undefined })

    const [davResponse] = await Promise.all([
        api.post("/v1/find-db-query", { query: davFinished }),
    ])

    return (
        <LayoutDavTable
            davsData={davResponse.data.returnObject.body}
            today={today}
        />
    )
}