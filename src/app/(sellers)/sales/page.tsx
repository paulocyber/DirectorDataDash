// Biblioteca
import { setupApiClient } from "@/service/api"

// Utils
import { salesQueries } from "@/utils/queries/sales"
import { goalsQueries } from "@/utils/queries/goals";
import getDate from "@/utils/currentDate"

// React
import getUserName from "@/utils/getUserName";

// Next - Framework
import { cookies } from "next/headers"

// Componentes
import Layout from "@/components/SellersUi/Layout";

// Tipagem
import { Metadata } from "next";
type CommissionData = {
    COMISSAO: string;
    VENDEDOR: string;
};

// Next - framework
import { topClientsPlusBuyData } from "@/utils/types/sales";

// MetaDados
export const metadata: Metadata = {
    title: "Relatório de vendas",
    description: "Informações sobre vendas e metas",
};

export default async function SalesPage() {
    const cookieStore = cookies();
    const token = cookieStore.get('@nextauth.token')?.value;

    const api = setupApiClient(token as string)

    const { year, month, today } = getDate()
    const user = await getUserName(token as string);

    const { sales, commissionPerSalesPerson } = salesQueries({ dateInit: `${year}/${month}/01`, dateEnd: today, emp: "1, 2, 3", surname: user })
    const { individualGoals } = goalsQueries({ dateInit: `${year}/${month}/01`, surname: user })
    const { topClientsPlusBuy } = salesQueries({ dateInit: today, dateEnd: today, surname: user })

    const [respSales, respGoals, respComission, respTopClientsPlusBuy] = await Promise.all([
        api.post("/v1/find-db-query", { query: sales }),
        api.post("/v1/find-db-query", { query: individualGoals }),
        api.post("/v1/find-db-query", { query: commissionPerSalesPerson }),
        api.post("/v1/find-db-query", { query: topClientsPlusBuy })
    ]);

    const commissionSum = respComission.data.returnObject.body.reduce((total: number, item: CommissionData) => {
        const commissionValue = parseFloat(item.COMISSAO.replace(",", "."));
        return total + (isNaN(commissionValue) ? 0 : commissionValue);
    }, 0);

    const salesAndGolas = [
        {
            name: "Vendas",
            value: respSales.data.returnObject.body[0].VALOR_LIQUIDO
                ? parseFloat(String(respSales.data.returnObject.body[0].VALOR_LIQUIDO).replace(",", "."))
                : 0
        },
        {
            name: "Metas",
            value: respGoals.data.returnObject.body.length > 0 && respGoals.data.returnObject.body[0].VALOR_INDIVIDUAL_MTI
                ? parseFloat(String(respGoals.data.returnObject.body[0].VALOR_INDIVIDUAL_MTI).replace(",", "."))
                : 0
        }
    ];

    const topClients = respTopClientsPlusBuy.data.returnObject.body.map((client: topClientsPlusBuyData) => ({
        ID_VENDEDOR: client.ID_VENDEDOR,
        ID_CLIENTE: client.ID_CLIENTE,
        NOME_CLIENTE: client.NOME_CLIENTE,
        VALOR_LIQUIDO: parseFloat(client.VALOR_LIQUIDO as string) 
    }));
console.log("Query: ", sales)
    return (
        <Layout
            salesAndGolas={salesAndGolas}
            month={month}
            year={year}
            today={today}
            commision={commissionSum}
            topClients={topClients}
        />
    )
}