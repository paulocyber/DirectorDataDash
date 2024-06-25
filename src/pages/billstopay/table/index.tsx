// Framwork
import Head from "next/head";

// Componentes
import SideBar from "@/components/ui/menu/SideBar";
import HeaderBar from "@/components/ui/menu/HeaderBar";
import InfoCards from "@/components/ui/cards/InfoCards";
import { Main } from "@/components/ui/mainComponents/main";
import { TableBillsToPay } from "@/components/tables/TableBillsToPay";
import { Loading } from "@/components/ui/loadings/Loading";
import { Options } from "@/components/ui/dropDown/Options";
import { billsToPayQueries } from "@/utils/queries/billsToPay";
import { Search } from '@/components/ui/input/input';

// Biblioteca
import { DateRangePicker } from "@nextui-org/date-picker";
import { DateValue, RangeValue } from "@nextui-org/calendar";
import { parseDate } from '@internationalized/date';

// Dados
import { fetchData } from "@/data/fetchData";

// React
import React, { useState } from "react";

// Rota
import { canSSRAuth } from "@/utils/canSSRAuth";

// Api
import { setupApiClient } from "@/services/api";

// Tipagem
import { BillsToPayProps } from "..";

// Utils
import currentDate from "@/utils/getCurrentDate/CurrentDate";
import getBillsToPay from "@/utils/getData/getBillsToPay";

export default function BillsToPayTable({ listBilletPaid, listBilletInOpen, listBilletPaidAndInOpen, listBilletExpired }: BillsToPayProps) {
    const [toggleMenuClosed, setToggleMenuClosed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const [animation, setAnimation] = useState<boolean>(false);
    const [dropDown, setDropDown] = useState<boolean>(false)

    // Dados
    const [billetPaidData, setBilletPaidData] = useState(listBilletPaid || [])
    const [billetInOpenData, setBilletInOpenData] = useState(listBilletInOpen || [])
    const [billetPaidInOpenData, setBilletPaidInOpenData] = useState(listBilletPaidAndInOpen || [])
    const [billetExpiredData, setBilletExpiredData] = useState(listBilletExpired || [])

    const { today, day, year, month } = currentDate()

    // Filtros
    const [date, setDate] = React.useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    });
    const [searchFilter, setSearchFilter] = useState<string>("")

    const filteredItems = billetPaidInOpenData.filter((item) => {
        return (
            item.DATA_VENCIMENTO_PGM.toLowerCase().includes(searchFilter.toLowerCase()) ||
            item.VALOR_PGM.toString().toLowerCase().includes(searchFilter.toLowerCase()) ||
            item.NUMERO_DOCUMENTO_PGM.toLowerCase().includes(searchFilter.toLowerCase()) ||
            item.GRUPO_CENTRO.toLowerCase().includes(searchFilter.toLowerCase()) ||
            item.NOME_PSS.toLowerCase().includes(searchFilter.toLowerCase()) ||
            item.CENTRO_CUSTO.toLowerCase().includes(searchFilter.toLowerCase()) ||
            item.DESCRICAO_FRM.toLowerCase().includes(searchFilter.toLowerCase())
        );
    });

    const fetchItemsBillsToPays = async (clear?: boolean) => {
        const dataInit = new Date(date.start.year, date.start.month - 1, date.start.day);
        const dateEnd = new Date(date.end.year, date.end.month - 1, date.end.day);

        // Verificar se data e atual
        const todayDateStarted = dataInit.toDateString() === today.toDateString();
        const todayDateEnd = dateEnd.toDateString() === today.toDateString();

        const formatDateInit = `${date.start.year}/${date.start.month}/${date.start.day}`
        const formatDateEnd = `${date.end.year}/${date.end.month}/${date.end.day}`

        setLoading(true)

        // Querys
        const { billetInOpenMonthly, billetPaidMonthly, expiredBillet, expiredBilletMonthly, billetPaidAndOpenMonthly } = billsToPayQueries({ dateInit: formatDateInit, dateEnd: formatDateEnd, year, month: date.start.month, day, todayDateStarted, todayDateEnd })

        // Puxar dados
        await fetchData({ query: billetInOpenMonthly, setData: setBilletInOpenData })
        await fetchData({ query: billetPaidMonthly, setData: setBilletPaidData })

        if (clear) {
            await fetchData({ query: expiredBillet, setData: setBilletExpiredData })
        } else {
            await fetchData({ query: expiredBilletMonthly, setData: setBilletExpiredData })
        }

        await fetchData({ query: billetPaidAndOpenMonthly, setData: setBilletPaidInOpenData })

        setLoading(false)
    }

    const { infoDetailCard } = getBillsToPay({ listBilletPaid: billetPaidData, listBilletInOpen: billetInOpenData, listBilletPaidAndInOpen, listBilletExpired: billetExpiredData, filteredItems })

    // Refresh
    const handleRefreshClick = async () => {
        setDropDown(false)
        await fetchItemsBillsToPays()
    }

    const handleClearFilter = async () => {
        setDate({ start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]), end: parseDate(new Date().toISOString().split('T')[0]) })
        setDropDown(false)
        await fetchItemsBillsToPays(true);
    }

    return (
        <>
            <Head>
                <title>Contas a Pagar</title>
            </Head>
            <SideBar showMenu={toggleMenuClosed} isClose={setToggleMenuClosed} />
            <main onClick={() => setDropDown(false)} className="bg-[#edf3fb] flex flex-col w-full ">
                <HeaderBar />
                <div className="md:ml-auto md:mx-0 xl:w-[80%] xl:w-[69%] md:flex flex-col w-full h-screen">
                    <InfoCards data={infoDetailCard} />
                    <Main>
                        <div className="md:flex items-center justify-between w-full ">
                            <div className="pb-5 flex justify-between items-center w-full p-5">
                                <h1 className="font-bold md:text-lg text-sm">Contas a Pagar</h1>
                                <div className="flex justify-between items-center">
                                    <div className="px-2 flex">
                                        <Search placeholder="Procurar" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />
                                    </div>
                                    <div className="px-2 flex">
                                        <DateRangePicker
                                            aria-label="filtro de data"
                                            classNames={{ inputWrapper: "bg-blue-700 hover:bg-blue-700 text-white focus-within:hover:bg-white-500", base: "text-white", innerWrapper: "py-[0.2em] text-white", segment: "text-white", selectorIcon: "text-center text-white", }}
                                            value={date}
                                            onChange={setDate}
                                        />
                                    </div>
                                    <Options href="/billstopay" descriptionHref="Voltar" dropDown={dropDown} setDropDown={setDropDown} handleRefreshClick={handleRefreshClick} animation={animation} setAnimation={setAnimation} handleClearFilter={handleClearFilter} />
                                </div>
                            </div>
                        </div>
                        {loading ?
                            <div className="p-4 md:w-full flex items-center justify-center h-[400px]">
                                <Loading />
                            </div>
                            :
                            <TableBillsToPay itemsPaidAndUnpaidBills={filteredItems} />
                        }
                    </Main>
                </div>
            </main>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx)

    const { year, month, day } = currentDate()

    const dateInit = `${year}/${month}/01`
    const dateEnd = `${year}/${month}/${day}`

    const todayDateStarted = true
    const todayDateEnd = true

    // querys 
    const { billetInOpenMonthly, billetPaidMonthly, billetPaidAndOpenMonthly, expiredBillet } = billsToPayQueries({ dateInit, dateEnd, year, month, day, todayDateStarted, todayDateEnd })

    const respBillsInOpen = await apiClient.post("/v1/find-db-query", { query: billetInOpenMonthly })
    const respBillsInPayed = await apiClient.post("/v1/find-db-query", { query: billetPaidMonthly })
    const respPaidAndNotPaid = await apiClient.post("/v1/find-db-query", { query: billetPaidAndOpenMonthly })
    const respExpiredBills = await apiClient.post("/v1/find-db-query", { query: expiredBillet })

    return {
        props: {
            listBilletInOpen: respBillsInOpen.data.returnObject.body,
            listBilletPaid: respBillsInPayed.data.returnObject.body,
            listBilletPaidAndInOpen: respPaidAndNotPaid.data.returnObject.body,
            listBilletExpired: respExpiredBills.data.returnObject.body
        },
    };
});