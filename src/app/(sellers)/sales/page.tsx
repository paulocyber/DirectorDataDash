//Next
import { setupApiClient } from "@/services/api";
import { Metadata } from "next";
import { cookies } from "next/headers";

// Utils
import { salesQueries } from "@/utils/queries/sales";
import { goalsQueries } from "@/utils/queries/goals";
import { calculateTotalByKey } from "@/utils/functions/sumValues";
import { convertFieldsToNumber, parseNumericString } from "@/utils/convertStringToNumber";
import getCurrentDateDetails from "@/utils/getDate";

// Componentes
import LayoutSellers from "@/components/layouts/sellers";

// Tipagem
import { ItemsTopClientsPlusBuyData } from "@/types/sales";
type ItemsComission = {
    COMISSAO: string;
    VENDEDOR: string;
}

export const metadata: Metadata = {
    title: "Relatório de vendas e metas",
    description: "Informações sobre vendas",
};

export default async function SellerPage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;

    const api = setupApiClient(token)
    const { year, month, today } = getCurrentDateDetails()

    const user = await api.post('/v1/auth/validate', { token })
    const { sales, commissionPerSalesPerson } = salesQueries({ dateInit: `${year}/${month}/01`, dateEnd: today, sellerSurname: user.data.returnObject.body.username, company: ["1, 2, 3, 4, 5"] })
    const { individualGoals } = goalsQueries({ dateInit: `${year}/${month}/01`, sellerSurname: user.data.returnObject.body.username, company: ["1, 2, 3, 4, 5"], year, month })
    const { topClientsPlusBuy } = salesQueries({ dateInit: today, dateEnd: today, sellerSurname: user.data.returnObject.body.username, company: ["1, 2, 3, 4, 5"] })

    const [salesReportData, commissionReportData, goalsReportData, topClientsPurchaseData] = await Promise.all([
        api.post("/v1/find-db-query", { query: sales }),
        api.post("/v1/find-db-query", { query: commissionPerSalesPerson }),
        api.post("/v1/find-db-query", { query: individualGoals }),
        api.post("/v1/find-db-query", { query: topClientsPlusBuy }),
    ])

    const totalCommissionValue = calculateTotalByKey<ItemsComission>(
        commissionReportData.data.returnObject.body,
        (item) => item.COMISSAO
    );

    const valorIndividualMti = goalsReportData?.data?.returnObject?.body?.[0]?.VALOR_INDIVIDUAL_MTI ?? 0;

    const goalProgressData = [
        { name: "Vendas", value: salesReportData ? parseNumericString(salesReportData.data.returnObject.body[0].VALOR_LIQUIDO) : 0 },
        { name: "Metas", value: parseNumericString(valorIndividualMti) }
    ]

    const topClientsSummary = convertFieldsToNumber<ItemsTopClientsPlusBuyData>(
        topClientsPurchaseData.data.returnObject.body,
        ['VALOR_LIQUIDO']
    )

    return (
        <LayoutSellers
            goalProgressData={goalProgressData}
            topClientsData={topClientsSummary}
            totalCommission={totalCommissionValue}
            month={month}
            year={year}
            today={today}
        />
    )
}