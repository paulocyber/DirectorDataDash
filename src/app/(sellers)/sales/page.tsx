// Next
import { cookies } from "next/headers";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import getDate from "@/utils/date/currentDate";
import getUserName from "@/utils/data/getUser";
import { salesQueries } from "@/utils/queries/sales";
import { goalsQueries } from "@/utils/queries/goals";
import { sumValues } from "@/utils/data/sumValue";
import { convertStringToNumber, convertToNumeric } from "@/utils/convertToNumeric";

// Componentes
import UiSellers from "@/components/layouts/sellersUi";

// Tipagem
import { topClientsPlusBuyData } from "@/types/sales";
type CommissionData = {
    COMISSAO: string;
    VENDEDOR: string;
};

export default async function SalesPage() {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string)
    const { year, month, today } = getDate()
    const user = await getUserName(token as string);

    const { sales, commissionPerSalesPerson } = salesQueries({ dateInit: `${year}/${month}/01`, dateEnd: today, emp: "1, 2, 3", sellersSurname: user })
    const { individualGoals } = goalsQueries({ dateInit: `${year}/${month}/01`, sellersSurname: user, emp: "1, 2, 3" })
    const { topClientsPlusBuy } = salesQueries({ dateInit: today, dateEnd: today, sellersSurname: user, emp: "1, 2, 3" })

    const [respSales, respGoals, respComission, respTopClientsPlusbuy] = await Promise.all([
        api.post("/v1/find-db-query", { query: sales }),
        api.post("/v1/find-db-query", { query: individualGoals }),
        api.post("/v1/find-db-query", { query: commissionPerSalesPerson }),
        api.post("/v1/find-db-query", { query: topClientsPlusBuy })
    ])

    const commissionValue = sumValues<CommissionData>(respComission.data.returnObject.body, item => item.COMISSAO);

    const goalProgress = [
        {
            name: "Vendas",
            value: respSales.data.returnObject.body[0]?.VALOR_LIQUIDO ? convertStringToNumber(respSales.data.returnObject.body[0].VALOR_LIQUIDO) : 0
        },
        {
            name: "Metas",
            value: respGoals.data.returnObject.body.length > 0 && respGoals.data.returnObject.body[0].VALOR_INDIVIDUAL_MTI 
                ? convertStringToNumber(respGoals.data.returnObject.body[0].VALOR_INDIVIDUAL_MTI) 
                : 0
        }
    ]

    const topClients = convertToNumeric<topClientsPlusBuyData>(
        respTopClientsPlusbuy.data.returnObject.body,
        ['VALOR_LIQUIDO']
    )

    return (
        <UiSellers
            goalProgressData={goalProgress}
            topClientsData={topClients}
            valueComission={commissionValue}
            year={year}
            month={month}
            today={today}
        />
    )
}