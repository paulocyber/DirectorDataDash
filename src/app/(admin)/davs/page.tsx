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
import { ItemsDavData } from "@/types/dav";

export const metadata: Metadata = {
    title: "Relatório das Dav's",
    description: "Informação sobre documentos de vendas",
};

export default async function DavPage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const role = (await cookieStore).get('@nextauth.role')?.value || "";

    if (!token || ['estoque'].includes(role) || ['rh'].includes(role)) {
        redirect('/salesbybrand')
    }

    if (!token || ['rh'].includes(role)) {
        redirect('/salesgoal')
    }

    const api = setupApiClient(token)
    const { today } = getCurrentDateDetails()

    const { davFinished, topSellersByDebitPix } = davsQueries({ dateInit: today, dateEnd: today })

    const [davResponse, topSellersByDebitPixResponse] = await Promise.all([
        api.post("/v1/find-db-query", { query: davFinished }),
        api.post("/v1/find-db-query", { query: topSellersByDebitPix }),
    ])

    const sortedPaymentMethods = groupSumBy(
        davResponse.data.returnObject.body,
        { key: 'FORMAPAGAMENTO', valueKey: 'VALOR_LIQUIDO_SDS' }
    ).sort((a, b) => b.value - a.value);

    const convertedTopDebitPixSellers = convertFieldsToNumber<ItemsDavData>(
        topSellersByDebitPixResponse.data.returnObject.body,
        ['TOTAL_VENDAS']
    ).sort((a, b) => (b as any).TOTAL_VENDAS - (a as any).TOTAL_VENDAS)

    return (
        <LayoutDav
            davsData={davResponse.data.returnObject.body}
            topSellersByDebitPixData={convertedTopDebitPixSellers}
            paymentMethodsData={sortedPaymentMethods}
            today={today}
        />
    )
}