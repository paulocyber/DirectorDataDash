// Utils
import { canSSRAuth } from "@/utils/canSSRAuth"
import currentDate from "@/utils/getCurrentDate/CurrentDate";
import getItemsFromDavs from "@/utils/getData/getItemsFromDavs";

// Framework
import Head from "next/head"

// Componentes
import SideBar from "@/components/ui/menu/SideBar";
import InfoCards from "@/components/ui/cards/InfoCards";
import HeaderBar from "@/components/ui/menu/HeaderBar";
import { Main } from "@/components/ui/mainComponents/main";
import { TableDav } from "@/components/tables/TableDav";
import { Loading } from "./../../components/ui/loadings/Loading";

// React
import React, { useState } from "react";

// Api
import { setupApiClient } from "@/services/api";
import { fetchData } from "@/data/fetchData";

// Biblioteca
import { GoSync } from "react-icons/go";
import { DateValue, RangeValue } from "@nextui-org/calendar";
import { parseDate } from '@internationalized/date';
import { DateRangePicker } from "@nextui-org/date-picker";

// Query
import { davsQueries } from "@/utils/queries/Davs";

// Tipagem
interface itemDav {
    ID_SDS: string,
    EMPRESA: string,
    DATAHORA_SDS: string,
    DATAHORA_FINALIZACAO_SDS: string,
    APELIDO_PSS: string,
    CLIENTE: string,
    VENDEDOR: string,
    ALMOXARIFADO: string,
    VALOR_BRUTO_SDS: string,
    VALOR_TROCA_SDS: string,
    VALOR_LIQUIDO_SDS: string,
    TIPO_VENDA_SDS: string,
    STATUS_SDS: string
}

export type listPorp = {
    listDav: itemDav[];
    dav?: string
}

export default function DavSummaryReport({ listDav, dav }: listPorp) {
    const [toggleMenuClosed, setToggleMenuClosed] = useState(false);
    const [itemsDavs, setItemsDavs] = useState(listDav || [])
    const [animation, setAnimation] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)

    const { infoDetaildCard } = getItemsFromDavs({ listDav: itemsDavs })

    // Filtro
    const [date, setDate] = React.useState<RangeValue<DateValue>>({
        start: parseDate(new Date().toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    });

    const fetchItemDavs = async () => {
        setLoading(true)

        const { year, month, day } = currentDate()

        const dataInit = `${date.start.year}/${date.start.month}/${date.start.day}`
        const dataEnd = `${date.end.year}/${date.end.month}/${date.end.day}`

        const { davFinished } = davsQueries({ dataInit, dataEnd })

        await fetchData({ query: davFinished, setData: setItemsDavs })

        setLoading(false)
    }

    const handleRefreshClick = async () => {
        await fetchItemDavs();
    }

    const handleDateChange = async (newDate: RangeValue<DateValue>) => {
        setDate(newDate);
        await fetchItemDavs();
    };

    return (
        <>
            <Head>
                <title>Relatório  Dav's</title>
            </Head>
            <SideBar showMenu={toggleMenuClosed} isClose={setToggleMenuClosed} />
            <main className="bg-[#edf3fb] flex flex-col w-full ">
                <HeaderBar />
                <div className="md:ml-auto md:mx-0 xl:w-[80%] xl:w-[69%] md:flex flex-col w-full h-screen">
                    <InfoCards data={infoDetaildCard} />
                    <Main>
                        <div className="md:flex items-center justify-between w-full ">
                            <div className="pb-5 flex justify-between items-center w-full p-5">
                                <h1 className="font-bold md:text-lg text-sm">Relatório Diário</h1>
                                <div className="flex justify-between items-center">
                                    <div className="px-2">
                                        {/* <DateRangePicker
                                            aria-label="filtro de data"
                                            classNames={{ inputWrapper: "bg-blue-700 hover:bg-blue-700 text-white focus-within:hover:bg-white-500", base: "text-white", innerWrapper: "py-[0.2em] text-white", segment: "text-white", selectorIcon: "text-center text-white", }}
                                            value={date}
                                            onChange={handleDateChange}
                                        /> */}
                                    </div>

                                    <button
                                        onMouseEnter={() => setAnimation(true)}
                                        onMouseLeave={() => setAnimation(false)}
                                        onClick={handleRefreshClick}
                                        className="flex hover:scale-[1.03] justify-center items-center w-full md:px-3 px-1 py-1 text-sm font-medium text-white bg-blue-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                                    >
                                        <span className="mr-2 md:text-sm text-xs">Atualizar</span>
                                        <GoSync className={animation ? "animate-spin" : ""} />
                                    </button>
                                </div>

                            </div>
                        </div>
                        <div className="md:flex w-full">
                            {loading ? <div className="w-full flex items-center justify-center h-[450px]"><Loading /></div> : <TableDav listDav={itemsDavs} />}
                        </div>
                    </Main>
                </div>
            </main>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx);

    const { year, month, day } = currentDate()

    const dataInit = `${year}/${month}/${day}`
    const dataEnd = `${year}/${month}/${day}`

    const { davFinished } = davsQueries({ dataInit, dataEnd })

    const resp = await apiClient.post("/v1/find-db-query", { query: davFinished });

    return {
        props: {
            listDav: resp.data.returnObject.body
        },
    };
});