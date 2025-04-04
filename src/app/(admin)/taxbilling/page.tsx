// Utils
import { setupApiClient } from "@/services/api";
import getCurrentDateDetails from "@/utils/getDate"
import { TaxQueries } from "@/utils/queries/tax"
import { cookies } from "next/headers";

export default async function TaxBilling() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const api = setupApiClient(token as string)

    const { today, year, month } = getCurrentDateDetails()
    const { nfce, nfe } = TaxQueries({ dateInit: today, dateEnd: `${year}/${month}/01` })

    // const [responseNfce, responseNfe] = await Promise.all([

    // ])

    return (
        <h1>Teste</h1>
    )
} 