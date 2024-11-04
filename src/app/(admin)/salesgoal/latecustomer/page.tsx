// Next - framework
import { cookies } from "next/headers";

// Utils
import getDate from "@/utils/date/currentDate";

// Componentes
import UiLateCustomer from "@/components/layouts/LateCustomerPageUi";

// Biblioteca
import { setupApiClient } from "@/services/api";
import { billsToReceiveQueries } from "@/utils/queries/billsToReceive";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Relatório de clientes em atrasos",
    description: "Informações sobre vendas e metas",
};

export default async function LateCustomerPage() {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string);
    const { year, monthExpired, yesterday } = getDate()

    const { billsToReceiveInOpen } = billsToReceiveQueries({ dateInit: `${year}/${monthExpired}/01`, dateEnd: `${year}/${monthExpired}/${yesterday}` })

    const [respReceiveInOpen] = await Promise.all([
        api.post("/v1/find-db-query", { query: billsToReceiveInOpen })
    ])

    return (
        <UiLateCustomer
            dataReceiveInOpen={respReceiveInOpen.data.returnObject.body}
            year={year}
            month={monthExpired}
            yesterday={yesterday}
            admin={true}
        />
    )
}