// Framework - Servidor
import { canSSRAuth } from "@/utils/permissions/canSSRAuth"

// Utils
import { billsToReceive } from "@/utils/queries/billsToReceive"
import { setupApiClient } from "@/service/api"
import currentDate from "@/utils/CurrentDate"
import { InfoCardFromBillsToReceive } from "@/utils/getFromData/infoCard/infoCardFromBillsToReceive"
import { fetchData } from "@/utils/fetchData"
import { TopLateCustomers } from "@/utils/filters/billsToReceive/topLateCustomers"

// Componentes
import Layout from "@/components/ui/layout"
import Container from "@/components/ui/container"
import Cards from "@/components/ui/cards"
import ToolBar from "@/components/ui/toolbar"
import DescriptionGraphic from "@/components/ui/descriptionGraphic/descriptionBillsToReceive"
import { SimpleBarChart } from "@/components/ui/sciences/SimpleBarChart"

// React
import { useState } from "react"

// Tipagem
import { BillsToReceiveProps } from "@/utils/types/billsToReceive"
import { SelectionDescription } from "@/utils/types/selectionDescription"

export default function BillsToReceive({ listBillsToReceivePaid, listBillsToReciveOpen, listBillsToReciveOverdue }: BillsToReceiveProps) {
    const [billsPay, setBillsPay] = useState(listBillsToReceivePaid || [])
    const [billsOpen, setBillsOpen] = useState(listBillsToReciveOpen || [])
    const [lateBills, setLateBills] = useState(listBillsToReciveOverdue || [])
    const [loading, setLoading] = useState<boolean>(false)
    const [filterSelection, setFilterSelection] = useState<SelectionDescription[]>([])

    // Filtros
    const { yesterday, monthExpired, year, today } = currentDate()
    const lateCustomers = TopLateCustomers({ lateBills })

    const infoDetailCard = InfoCardFromBillsToReceive({ billsPay, billsOpen, lateBills })

    const fetchBillsToReceive = async (dataInit: string, dataEnd: string, clear: boolean) => {
        setLoading(true)

        const { billsToReceivePaid, billsToReceiveOpen, billsToReceiveLateBills } = billsToReceive({ dataInit, dataEnd, day: yesterday, month: monthExpired, year })

        const queries = [
            fetchData({ query: billsToReceivePaid, setData: setBillsPay }),
            fetchData({ query: billsToReceiveOpen, setData: setBillsOpen }),
            fetchData({ query: billsToReceiveLateBills, setData: setLateBills }),
        ]

        await Promise.all(queries)
        setLoading(false)
    }

    const refresh = async () => {
        await fetchBillsToReceive(today, today, false)
    }

    return (
        <Layout description="Contas a pagar">
            <Cards data={infoDetailCard} />
            <Container>
                <ToolBar title="Contas a receber" handleRefreshClick={refresh} />
                <main className="flex w-full h-[450px] flex-col px-5 ">
                    <SimpleBarChart data={lateCustomers}/>
                </main>
                <div className="w-full">
                    <DescriptionGraphic data={lateCustomers} filterSelection={filterSelection} setFilterSelection={setFilterSelection} />
                </div>
            </Container>
        </Layout>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx)
    const { today, yesterday, monthExpired, year } = currentDate()

    const { billsToReceivePaid, billsToReceiveOpen, billsToReceiveLateBills } = billsToReceive({ dataInit: today, dataEnd: today, day: yesterday, month: monthExpired, year })

    const [respBillsToReceivepaid, respBillsToReceiveOpen, respBillsToReceiveLateBills] = await Promise.all([
        apiClient.post("/v1/find-db-query", { query: billsToReceivePaid }),
        apiClient.post("/v1/find-db-query", { query: billsToReceiveOpen }),
        apiClient.post("/v1/find-db-query", { query: billsToReceiveLateBills })
    ])

    return {
        props: {
            listBillsToReceivePaid: respBillsToReceivepaid.data.returnObject.body,
            listBillsToReciveOpen: respBillsToReceiveOpen.data.returnObject.body,
            listBillsToReciveOverdue: respBillsToReceiveLateBills.data.returnObject.body
        }
    }
})