// Next - framework
import { cookies } from "next/headers";

// Utils
import getDate from "@/utils/date/currentDate";

// Componentes
import UiLateCustomer from "@/components/layouts/LateCustomerPageUi";

// Biblioteca
import { setupApiClient } from "@/services/api";
import { billsToReceiveQueries } from "@/utils/queries/billsToReceive";

export default async function LateCustomerPage() {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string);
    const { year, month, yesterday } = getDate()

    const { billsToReceiveInOpen } = billsToReceiveQueries({ dateInit: `${year}/${month}/01`, dateEnd: `${year}/${month}/${yesterday}` })

    const [respReceiveInOpen] = await Promise.all([
        api.post("/v1/find-db-query", { query: billsToReceiveInOpen })
    ])

    return (
        <UiLateCustomer
            dataReceiveInOpen={respReceiveInOpen.data.returnObject.body}
            year={year}
            month={month}
            yesterday={yesterday}
            admin={true}
        />
    )
}