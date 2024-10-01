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
type CommissionData = {
    VALOR_COMISSAO: string;
    VENDEDOR: string;
};

// Next - framework
import { Metadata } from "next";

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

    const { sales, commissionPerSalesPerson } = salesQueries({ dateInit: `${year}/${month}/01`, dateEnd: today, emp: "1", surname: user })
    const { individualGoals } = goalsQueries({ dateInit: `${year}/${month}/01`, surname: user })

    const [respSales, respGoals, respComission] = await Promise.all([
        api.post("/v1/find-db-query", { query: sales }),
        api.post("/v1/find-db-query", { query: individualGoals }),
        api.post("/v1/find-db-query", { query: commissionPerSalesPerson })
    ]);

    const commissionSum = respComission.data.returnObject.body.reduce((total: number, item: CommissionData) => {
        const commissionValue = parseFloat(item.VALOR_COMISSAO.replace(",", "."));
        return total + (isNaN(commissionValue) ? 0 : commissionValue);
    }, 0);
    
    const salesAndGolas = [
        { 
            name: "Vendas", 
            value: respSales.data.returnObject.body.lenght > 0 && respSales.data.returnObject.body[0].VALOR_LIQUIDO
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

    return (
        <Layout
            salesAndGolas={salesAndGolas}
            month={month}
            year={year}
            today={today}
            commision={commissionSum}
        />
    )
}