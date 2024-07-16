// Framework - Next
import { canSSRAuth } from "@/utils/permissions/canSSRAuth";
import { setupApiClient } from "@/service/api";

// Componentes
import Layout from "@/components/ui/layout";
import Cards from "@/components/ui/cards";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import { Loading } from "@/components/ui/loading";
import DescriptionGraphic from "@/components/ui/descriptionGraphic";
import PieChartComponent from "@/components/ui/sciences/pieChart";
import { BarChartComponent } from "@/components/ui/sciences/BarChart";

// Utils
import { billsToPayQueries } from "@/utils/queries/billsToPay";
import currentDate from "@/utils/CurrentDate";
import { InfoCardFromBillsToPay } from "@/utils/getFromData/infoCard/infoCardFromBillsToPay";
import { fetchData } from "@/utils/fetchData";
import { TopCostCenter } from "@/utils/filters/billsToPay/topCostCenter";
import { handleDateFilter } from "@/utils/filters/dateFilter/handleDateFilter";
import { handleCleanFilter } from "@/utils/filters/cleanFilter/handleCleanFilter";

// React
import { useState } from "react";

// Biblioteca
import { useRecoilState } from "recoil";

// Atom
import { filterDescription } from "@/atom/filterDescription";

// Tipagem
import { BillsToPayItem, BillsToPayPageProps } from "@/utils/types/billsToPay";
import { DateValue, RangeValue } from "@nextui-org/react";
import { parseDate } from '@internationalized/date';

export default function BillsToPayPage({ listBilletInOpen, listBilletPaid, listBilletExpired, listBilletPaidAndOpen }: BillsToPayPageProps) {
    const [billetOpen, setBilletOpen] = useState(listBilletInOpen || [])
    const [billetPaid, setBilletPaid] = useState(listBilletPaid || [])
    const [billetExpired, setBilletExpired] = useState(listBilletExpired || [])
    const [billetPaidAndOpen, setBilletPaidAndOpen] = useState(listBilletPaidAndOpen || [])
    const [, setFilter] = useRecoilState(filterDescription);
    const [loading, setLoading] = useState<boolean>(false)

    // Filtros
    const infoDetailCard = InfoCardFromBillsToPay({ listBilletExpired: billetExpired, listBilletInOpen: billetOpen, listBilletPaid: billetPaid })
    const { selectCostCenter, sortedCostCenters } = TopCostCenter({ billetPaidAndOpen })

    const { year, month, lastDay, adjustedMonth } = currentDate()
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    })

    const fetchBillsToPayData = async (dataInit?: string, dataEnd?: string, clear?: boolean) => {
        setLoading(true);

        const { billetInOpenMonthly, billetPaidMonthly, expiredBilletMonthly, expiredBillet, billetPaidAndOpenMonthly } = billsToPayQueries({ dataInit, dataEnd, year, month: adjustedMonth, day: lastDay });

        await fetchData({ query: billetInOpenMonthly, setData: setBilletOpen });
        await fetchData({ query: billetPaidMonthly, setData: setBilletPaid });

        if (clear) {
            await fetchData({ query: expiredBillet, setData: setBilletExpired });
        } else {
            await fetchData({ query: expiredBilletMonthly, setData: setBilletExpired });
        }
        await fetchData({ query: billetPaidAndOpenMonthly, setData: setBilletPaidAndOpen });

        setLoading(false);
    };


    const onDateChange = async (newDate: RangeValue<DateValue>) => {
        await handleDateFilter(newDate, setDate, fetchBillsToPayData, setFilter);
    };

    const clearFilter = async () => {
        await handleCleanFilter(setDate, fetchBillsToPayData, setFilter)
    }

    const refresh = async () => {
        const dataInit = `${date.start.year}/${date.start.month}/${date.start.day}`
        const dataEnd = `${date.end.year}/${date.end.month}/${date.end.day}`

        await fetchBillsToPayData(dataInit, dataEnd, true)
    }

    return (
        <Layout description="Contas a pagar">
            <Cards data={infoDetailCard} />
            <Container>
                {loading
                    ?
                    <div className="h-[400px] flex items-center justify-center">
                        <Loading />
                    </div>
                    :
                    <>
                        <ToolBar title="Contas a pagar" handleRefreshClick={refresh} date={date} handleDateFilter={onDateChange} handleCleanFilter={clearFilter} href="/billstopay/table" descriptionHref="Tebala" />
                        <div className="flex w-full sm:flex-col flex-col md:flex-col lg:flex-row">
                            <main className="p-4 lg:w-1/2 lg:w-full h-[400px]">
                                <PieChartComponent data={selectCostCenter} />
                            </main>
                            <main className="p-4 lg:w-1/2 lg:w-full h-[400px]">
                                <BarChartComponent data={selectCostCenter} />
                            </main>
                        </div>
                        <div className="w-full ">
                            <DescriptionGraphic data={sortedCostCenters} />
                        </div>
                    </>
                }
            </Container>
        </Layout>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx)
    const { year, month, day, lastDay, adjustedMonth } = currentDate()

    const dataInit = `${year}/${month}/01`
    const dataEnd = `${year}/${month}/${day}`

    const { billetInOpenMonthly, billetPaidMonthly, expiredBillet, billetPaidAndOpenMonthly } = billsToPayQueries({ dataInit, dataEnd, year, month: adjustedMonth, day: lastDay })

    const respBilletInOpen = await apiClient.post("/v1/find-db-query", { query: billetInOpenMonthly })
    const respBilletPaid = await apiClient.post("/v1/find-db-query", { query: billetPaidMonthly })
    const respBilletExpired = await apiClient.post("/v1/find-db-query", { query: expiredBillet })
    const respBilletPaidAndOpen = await apiClient.post("/v1/find-db-query", { query: billetPaidAndOpenMonthly })

    return {
        props: {
            listBilletInOpen: respBilletInOpen.data.returnObject.body,
            listBilletPaid: respBilletPaid.data.returnObject.body,
            listBilletExpired: respBilletExpired.data.returnObject.body,
            listBilletPaidAndOpen: respBilletPaidAndOpen.data.returnObject.body
        }
    }
})