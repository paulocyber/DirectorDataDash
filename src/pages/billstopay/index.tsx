// Framework
import Head from "next/head";

// Rota Privada
import { canSSRAuth } from "@/utils/canSSRAuth";

// Componentes
import SideBar from "@/components/ui/menu/SideBar";
import { Main } from "@/components/ui/mainComponents/main";
import HeaderBar from "@/components/ui/menu/HeaderBar";
import InfoCards from "@/components/ui/cards/InfoCards";
import { MainScience } from "@/components/ui/mainComponents/MainScience";
import { PieChartComponent } from "@/components/Science/pieChart/PieChartComponent";
import { BarChartComponent } from "@/components/Science/barChart/BarChartComponent";
import { Loading } from "@/components/ui/loadings/Loading";
import { Options } from "@/components/ui/dropDown/Options";

// React
import React, { useState } from "react";

// Utils
import { setupApiClient } from "@/services/api";
import { billsToPayQueries } from "@/utils/queries/billsToPay";
import currentDate from "@/utils/getCurrentDate/CurrentDate";
import getBillsToPay from "@/utils/getData/getBillsToPay";
import topCostCenter from "@/utils/filters/billsToPay/topCoscenter";

// Dados
import { fetchData } from "@/data/fetchData";

// Bibliotecas
import { DateRangePicker } from "@nextui-org/date-picker";
import { DateValue, RangeValue } from "@nextui-org/calendar";
import { parseDate } from "@internationalized/date";
import { useRecoilState } from "recoil";

// Atom
import { filterDescription } from "@/atom/FilterDescription";

// Tipagem
interface BillToPayItem {
    VALOR_PGM: string,
    CENTRO_CUSTO: string,
    VALOR_PAGO_PGM: string,
    NOME_PSS: string
}

interface BilletPaidAndInOpen {
    VALOR_PGM: string,
    CENTRO_CUSTO: string,
    NOME_PSS: string,
    STATUS_PGM: string,
    DATA_VENCIMENTO_PGM: string,
    DESCRICAO_PGM: string,
    GRUPO_CENTRO: string,
    NUMERO_DOCUMENTO_PGM: string,
    DESCRICAO_FRM: string
}

interface ExpiredBillItem {
    RESTANTE_PGM: string,
    CENTRO_CUSTO: string,
}

export type BillsToPayProps = {
    listBilletPaid: BillToPayItem[],
    listBilletInOpen: BillToPayItem[],
    listBilletPaidAndInOpen: BilletPaidAndInOpen[],
    listBilletExpired?: ExpiredBillItem[]
}

export default function BillsToPay({ listBilletPaid, listBilletInOpen, listBilletPaidAndInOpen, listBilletExpired }: BillsToPayProps) {
    const [toggleMenuClosed, setToggleMenuClosed] = useState(false);
    const [loading, setLoading] = useState<boolean>(false)
    const [animation, setAnimation] = useState<boolean>(false);
    const [dropDown, setDropDown] = useState<boolean>(false)

    // Dados
    const [billetPaidData, setBilletPaidData] = useState(listBilletPaid || [])
    const [billetInOpenData, setBilletInOpenData] = useState(listBilletInOpen || [])
    const [billetPaidInOpenData, setBilletPaidInOpenData] = useState(listBilletPaidAndInOpen || [])
    const [billetExpiredData, setBilletExpiredData] = useState(listBilletExpired || [])

    const { today, year, month, day } = currentDate()

    // Filtro
    const [date, setDate] = React.useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    });
    const [, setFilter] = useRecoilState(filterDescription)

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

    const { infoDetailCard } = getBillsToPay({ listBilletPaid: billetPaidData, listBilletInOpen: billetInOpenData, listBilletPaidAndInOpen, listBilletExpired: billetExpiredData })

    const { sortedCostCenters, selectCostCenter } = topCostCenter({ listBilletPaidAndInOpen: billetPaidInOpenData })

    const handleRefreshClick = async () => {
        setDropDown(false)
        await fetchItemsBillsToPays()
    }

    const handleClearFilter = async () => {
        setFilter([])
        setDate({ start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]), end: parseDate(new Date().toISOString().split('T')[0]) })
        setDropDown(false)
        await fetchItemsBillsToPays(true);
    }


    const handleDateChange = (newDate: RangeValue<DateValue>) => {
        setDate(newDate);
        fetchItemsBillsToPays();
    };

    return (
        <>
            <Head>
                <title>Contas a Pagar</title>
            </Head>
            <SideBar showMenu={toggleMenuClosed} isClose={setToggleMenuClosed} />
            <main onClick={() => setDropDown(false)} className="bg-[#edf3fb] flex flex-col w-full ">
                <HeaderBar />
                <div onClick={() => setDropDown(false)} className="md:ml-auto md:mx-0 xl:w-[80%] xl:w-[69%] md:flex flex-col w-full h-screen">
                    <InfoCards data={infoDetailCard} />
                    <Main >
                        <div onClick={() => setDropDown(false)} className="md:flex items-center justify-between w-full ">
                            <div className="pb-5 flex justify-between items-center w-full p-5">
                                <h1 className="font-bold md:text-lg text-sm">Contas abertas: </h1>
                                <div className="flex justify-between items-center">
                                    <div className="px-2">
                                        <DateRangePicker
                                            aria-label="filtro de data"
                                            classNames={{ inputWrapper: "bg-blue-700 hover:bg-blue-700 text-white focus-within:hover:bg-white-500", base: "text-white", innerWrapper: "py-[0.2em] text-white", segment: "text-white", selectorIcon: "text-center text-white", }}
                                            value={date}
                                            onChange={handleDateChange}
                                        />
                                    </div>
                                    <div className="px-2">
                                        <Options href="/billstopay/table" descriptionHref="tabela" dropDown={dropDown} setDropDown={setDropDown} handleRefreshClick={handleRefreshClick} animation={animation} setAnimation={setAnimation} handleClearFilter={handleClearFilter} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {loading ?
                            <div className="p-4 md:w-full flex items-center justify-center h-[400px]">
                                <Loading />
                            </div>
                            :
                            <>
                                <MainScience data={sortedCostCenters}>
                                    <div className="p-4 md:w-1/2 h-[400px]">
                                        <PieChartComponent data={selectCostCenter} />
                                    </div>
                                    <div className="p-4 md:w-1/2 h-[400px]">
                                        <BarChartComponent data={selectCostCenter} />
                                    </div>
                                </MainScience>
                            </>
                        }
                    </Main>
                </div >
            </main >
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

    const { billetInOpenMonthly, billetPaidMonthly, expiredBillet, billetPaidAndOpenMonthly } = billsToPayQueries({ dateInit, dateEnd, year, month, day, todayDateStarted, todayDateEnd })

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

