// Next
import { cookies } from "next/headers";
import { Metadata } from "next";
import { redirect } from "next/navigation";

// Biblioteca
import { setupApiClient } from "@/services/api";

// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { davsQueries } from "@/utils/queries/dav";
import { groupSumBy } from "@/utils/filters/groupSumBy";

// Componentes
import LayoutDav from "@/components/layouts/dav";
import { convertFieldsToNumber } from "@/utils/convertStringToNumber";

// Tipagem
import { salesQueries } from "@/utils/queries/sales";
import { ItemsSalesPerMonth } from "@/types/sales";

export const metadata: Metadata = {
    title: "Relatório das Dav's",
    description: "Informação sobre documentos de vendas",
};

export default async function DavPage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const role = (await cookieStore).get('@nextauth.role')?.value || "";

    if (!token || ['estoque'].includes(role)) {
        redirect('/salesbybrand')
    }

    if (!token || ['rh'].includes(role)) {
        redirect('/salesgoal')
    }

    if (!token || ['Fiscal'].includes(role)) {
        redirect('/taxbilling')
    }

    const api = setupApiClient(token)
    const { today, year } = getCurrentDateDetails()

    const { davFinished } = davsQueries({ dateInit: today, dateEnd: today })
    const { salesPerMonth } = salesQueries({ dateInit: `${year}/01/01`, dateEnd: today })

    const [davResponse, salesPerMOnthResponse] = await Promise.all([
        api.post("/v1/find-db-query", { query: davFinished }),
        api.post("/v1/find-db-query", { query: salesPerMonth }),
    ])

    const sortedPaymentMethods = groupSumBy(
        davResponse.data.returnObject.body,
        { key: 'FORMAPAGAMENTO', valueKey: 'VALOR_LIQUIDO_SDS' }
    ).sort((a, b) => b.value - a.value);

    const convertedSalesPerMonth = convertFieldsToNumber<ItemsSalesPerMonth>(
        salesPerMOnthResponse.data.returnObject.body,
        ['VALOR_LIQUIDO_SDS']
    ).sort((a, b) => (b as any).MES_ANO - (a as any).MES_ANO)

    return (
        <LayoutDav
            davsData={davResponse.data.returnObject.body}
            salesPerMonthData={convertedSalesPerMonth}
            paymentMethodsData={sortedPaymentMethods}
            today={today}
        />
    )
}