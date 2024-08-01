// Components
import Container from "@/components/ui/container";
import Layout from "@/components/ui/layout";
import Cards from "@/components/ui/cards";
import { Loading } from "@/components/ui/loading";
import ToolBar from "@/components/ui/toolbar";
import TableGrid from "@/components/ui/table";
import renderCell from "@/components/ui/table/renderCell/rowsBillsToPay";

// Framework - Next
import { canSSRAuth } from "@/utils/permissions/canSSRAuth";

// Utils
import { setupApiClient } from "@/service/api";
import currentDate from "@/utils/CurrentDate";
import { billsToPayQueries } from "@/utils/queries/billsToPay";
import { InfoCardFromBillsToPay } from "@/utils/getFromData/infoCard/infoCardFromBillsToPay";
import { fetchData } from "@/utils/fetchData";
import { handleDateFilter } from "@/utils/filters/dateFilter/handleDateFilter";
import { handleCleanFilter } from "@/utils/filters/cleanFilter/handleCleanFilter";
import billsToPayPDF from "@/reports/billsTopay";
import SearchBillsToPay from "@/utils/filters/billsToPay/searchBillsToPay";

// React
import { useState } from "react";

// Dados
import { columns } from "@/data/collumnsBillsToPay"

// Biblioteca
import { useRecoilState } from "recoil";
import { CiSearch } from "react-icons/ci";

// Atom
import { filterDescription } from "@/atom/FilterDescription";

// Tipagem
import { BillsToPayPageProps } from "@/utils/types/billsToPay";
import { DateValue, RangeValue } from "@nextui-org/react";
import { parseDate } from '@internationalized/date';
import { InfiniteScroll } from "@/utils/InfiniteScroll";

export default function BillsToPayPageTable({ listBilletExpired, listBilletInOpen, listBilletPaid, listBilletPaidAndOpen }: BillsToPayPageProps) {
    const [billetOpen, setBilletOpen] = useState(listBilletInOpen || [])
    const [billetPaid, setBilletPaid] = useState(listBilletPaid || [])
    const [billetExpired, setBilletExpired] = useState(listBilletExpired || [])
    const [billetPaidAndOpen, setBilletPaidAndOpen] = useState(listBilletPaidAndOpen || [])
    const [searchFilter, setSearchFilter] = useState<string>("")
    const [, setFilter] = useRecoilState(filterDescription)
    const [loading, setLoading] = useState<boolean>(false)
    const [limit, setLimit] = useState(0);

    // Filtros
    const { year, month, yesterday, monthExpired } = currentDate()
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    })

    const fetchBillsToPayData = async (dataInit?: string, dataEnd?: string, clear?: boolean) => {
        setLoading(true);

        const { billetInOpenMonthly, billetPaidMonthly, expiredBilletMonthly, expiredBillet, billetPaidAndOpenMonthly } = billsToPayQueries({ dataInit, dataEnd, year, month: monthExpired, day: yesterday });

        const queries = [
            fetchData({ query: billetInOpenMonthly, setData: setBilletOpen }),
            fetchData({ query: billetPaidMonthly, setData: setBilletPaid }),
            fetchData({ query: clear ? expiredBillet : expiredBilletMonthly, setData: setBilletExpired }),
            fetchData({ query: billetPaidAndOpenMonthly, setData: setBilletPaidAndOpen })
        ];

        await Promise.all(queries);
        setLoading(false);
    };

    const onDateChange = async (newDate?: RangeValue<DateValue>) => {
        newDate && await handleDateFilter(newDate, setDate, fetchBillsToPayData, setFilter);
    };

    const clearFilter = async () => {
        await handleCleanFilter(setDate, fetchBillsToPayData, setFilter)
    }

    const refresh = async () => {
        const dataInit = `${date.start.year}/${date.start.month}/${date.start.day}`
        const dataEnd = `${date.end.year}/${date.end.month}/${date.end.day}`

        await fetchBillsToPayData(dataInit, dataEnd, true)
    }

    const filterSearch = SearchBillsToPay(billetPaidAndOpen, searchFilter)

    const fetchMore = () => {
        if (limit < billetPaidAndOpen.length) {
            setLimit(limit + 10);
        }
    };

    const { total, infoDetailCard, totalAmountExpired, totalAmountInOpen, totalAmountPaid, } = InfoCardFromBillsToPay({ listBilletExpired: billetExpired, listBilletInOpen: billetOpen, listBilletPaid: billetPaid, filterSearch })

    const generatePDF = () => {
        billsToPayPDF(billetPaidAndOpen, totalAmountInOpen, totalAmountExpired, totalAmountPaid, total)
    }

    return (
        < >
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
                            <ToolBar title="Contas a pagar" generatePDF={generatePDF} handleRefreshClick={refresh} date={date} handleDateFilter={onDateChange} handleCleanFilter={clearFilter} href="/billstopay" descriptionHref="Voltar" >
                                <div className="w-full">
                                    <label
                                        htmlFor="default-search"
                                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                                    >
                                        Search
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                            <CiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <input
                                            type="search"
                                            value={searchFilter}
                                            onChange={(e) => setSearchFilter(e.target.value)}
                                            id="default-search"
                                            className="block w-full md:p-2 p-1 md:ps-10 ps-10 text-sm text-black-900 border rounded-lg bg-white-50 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black"
                                            placeholder="Pesquise"
                                            required
                                        />
                                    </div>
                                </div>
                            </ToolBar>

                            <main className="flex w-full pb-6 h-[450px] flex-col px-5">
                                <div className="overflow-auto">
                                    <TableGrid collumns={columns} data={filterSearch.slice(0, limit)} renderCell={renderCell} />
                                    <InfiniteScroll fetchMore={fetchMore} />
                                </div>
                            </main>
                        </>
                    }
                </Container>
            </Layout>
        </>
    )
}



export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx)
    const { year, month, day, yesterday, monthExpired } = currentDate()

    const dataInit = `${year}/${month}/01`
    const dataEnd = `${year}/${month}/${day}`

    const { billetInOpenMonthly, billetPaidMonthly, expiredBillet, billetPaidAndOpenMonthly } = billsToPayQueries({ dataInit, dataEnd, year, month: monthExpired, day: yesterday })

    const [respBilletInOpen, respBilletPaid, respBilletExpired, respBilletPaidAndOpen] = await Promise.all([
        apiClient.post("/v1/find-db-query", { query: billetInOpenMonthly }),
        apiClient.post("/v1/find-db-query", { query: billetPaidMonthly }),
        apiClient.post("/v1/find-db-query", { query: expiredBillet }),
        apiClient.post("/v1/find-db-query", { query: billetPaidAndOpenMonthly })
    ])

    return {
        props: {
            listBilletInOpen: respBilletInOpen.data.returnObject.body,
            listBilletPaid: respBilletPaid.data.returnObject.body,
            listBilletExpired: respBilletExpired.data.returnObject.body,
            listBilletPaidAndOpen: respBilletPaidAndOpen.data.returnObject.body
        }
    }
})