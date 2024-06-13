// Framwork
import Head from "next/head";
import Link from "next/link";

// Componentes
import SideBar from "@/components/ui/menu/SideBar";
import HeaderBar from "@/components/ui/menu/HeaderBar";
import InfoCards from "@/components/ui/cards/InfoCards";
import { Main } from "@/components/ui/mainComponents/main";
import { TableBillsToPay } from "@/components/tables/TableBillsToPay";
import { Loading } from "@/components/ui/loadings/Loading";

// Biblioteca
import { IoMdArrowRoundBack } from "react-icons/io";
import { GoSync } from "react-icons/go";
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@nextui-org/dropdown";
import { FaFilter } from "react-icons/fa6";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { RiFormatClear } from "react-icons/ri";

// React
import React, { useEffect, useMemo, useState } from "react";

// Rota
import { canSSRAuth } from "@/utils/canSSRAuth";

// Api
import { setupApiClient } from "@/services/api";

// Tipagem
import { BillsToPayProps } from "..";

// Dados
import getListOfAccountsPayable from "@/utils/getData/getListOfAccountsPayable";
import { fetchData } from "@/data/fetchData";

// Utils
import { accountsPayableOpenedDaily, accountsPayablePaidDaily, accountsPayablePaidInOpenDaily, accountsPayablePaidInOpenMonthly, accountsPayablePaidMonthly, getBillExpiredMonthly } from "@/utils/queries";
import currentDate from "@/utils/getCurrentDate/CurrentDate";

// Recoil
import { useRecoilState } from "recoil";

// Atom
import { filterDescription } from "@/atom/FilterDescription";
import InputAutoComplete from "@/components/ui/Autocomplete/InputAutoComplete";
import { Autocomplete, AutocompleteItem, AutocompleteSection } from "@nextui-org/autocomplete";
import { DateRangePicker } from "@nextui-org/date-picker";
import { DateValue, RangeValue } from "@nextui-org/calendar";
import { parseDate } from '@internationalized/date';

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

    // Filtros
    const [filter, setFilter] = useRecoilState(filterDescription)
    const [date, setDate] = React.useState<RangeValue<DateValue>>({
        start: parseDate(new Date().toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    });

    const { year } = currentDate()

    const billetInOpen = accountsPayableOpenedDaily(year)
    const paidBills = accountsPayablePaidDaily()
    const paidAndUnpaidBills = accountsPayablePaidInOpenDaily()

    const fetchItemsBillsToPay = async () => {
        const { today } = currentDate()

        setLoading(true);
        await fetchData({ query: billetInOpen, setData: setBilletInOpenData })


        const start = new Date(date.start.year, date.start.month - 1, date.start.day);
        const end = new Date(date.end.year, date.end.month - 1, date.end.day);

        const startIsToday = start.toDateString() === today.toDateString();
        const endIsToday = end.toDateString() === today.toDateString();

        if (!startIsToday || !endIsToday) {
            const formatDateInit = `${date.start.year}-${date.start.month}-${date.start.day}`
            const formatDateEnd = `${date.end.year}-${date.end.month}-${date.end.day}`

            const paidAndUnpaidBills = accountsPayablePaidInOpenMonthly(formatDateInit, formatDateEnd)
            const paidBills = accountsPayablePaidMonthly(formatDateInit, formatDateEnd)

            await fetchData({ query: paidAndUnpaidBills, setData: setBilletPaidInOpenData })
            await fetchData({ query: paidBills, setData: setBilletPaidData })

            // console.log("Query paga: ", paidBills)
        } else {
            await fetchData({ query: paidBills, setData: setBilletPaidData })
            await fetchData({ query: paidAndUnpaidBills, setData: setBilletPaidInOpenData })

            // console.log("Query paga: ", paidBills)
        }
        setLoading(false)
    }
    const { infoDetailCard } = getListOfAccountsPayable({ listBilletPaid: billetPaidData, listBilletInOpen: billetInOpenData, listBilletPaidAndInOpen: billetPaidInOpenData, listBilletExpired: billetExpiredData })
    // console.log("Pagos: ", billetPaidData)
    // Limpa Filtro
    useEffect(() => {
        setFilter([]);
    }, []);

    useEffect(() => {
        fetchItemsBillsToPay();
    }, [date]);

    // Refresh
    const handleRefreshClick = async () => {
        await fetchItemsBillsToPay();
    }

    const accountsPayableFilter = useMemo(() => {
        return billetPaidInOpenData.filter(data => {
            const grupoCentro = data.GRUPO_CENTRO?.toLowerCase();
            const filterDescription = filter[0]?.description?.toLowerCase();
            return grupoCentro && filterDescription && grupoCentro.startsWith(filterDescription);
        });
    }, [billetPaidInOpenData, filter]);

    const uniqueGrupoCentroItems = billetPaidInOpenData.filter((item, index, self) => {
        return self.findIndex(obj => obj.GRUPO_CENTRO === item.GRUPO_CENTRO) === index;
    });

    const handleClearFilter = () => {
        setFilter([])
        setDate({ start: parseDate(new Date().toISOString().split('T')[0]), end: parseDate(new Date().toISOString().split('T')[0]) })
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
                                        <Autocomplete
                                            variant="bordered"
                                            placeholder="Selecione centro de custo"
                                            className="w-full"
                                            scrollShadowProps={{
                                                isEnabled: false,
                                            }}
                                            inputValue={filter[0]?.description || ""}
                                            onInputChange={(value) => setFilter([{ description: value, color: "", id: 0 }])}
                                            defaultItems={uniqueGrupoCentroItems}
                                            aria-label="Centro de Custo"
                                            isRequired
                                        >
                                            <AutocompleteSection
                                                title="Centro de Custo"
                                                classNames={{
                                                    heading: "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small",
                                                }}
                                            >
                                                {uniqueGrupoCentroItems.map((natureOfTheCost, index) => (<AutocompleteItem key={index}>{natureOfTheCost.GRUPO_CENTRO}</AutocompleteItem>))}
                                            </AutocompleteSection>
                                        </Autocomplete>
                                    </div>
                                    <div className="px-2 flex">
                                        <DateRangePicker
                                            aria-label="filtro de data"
                                            classNames={{ inputWrapper: "bg-blue-700 hover:bg-blue-700 text-white focus-within:hover:bg-white-500", base: "text-white", innerWrapper: "py-[0.2em] text-white", segment: "text-white", selectorIcon: "text-center text-white", }}
                                            value={date}
                                            onChange={setDate}
                                        />
                                    </div>
                                    <Dropdown classNames={{ base: "top-1", trigger: `hover:bg-blue-700 p-1 rounded-md hover:text-white transition duration-300 ease-in-out ${dropDown ? "bg-blue-700 aria-expanded:opacity-100 text-white" : ""}` }}>
                                        <DropdownTrigger onClick={() => setDropDown(!dropDown)} >
                                            <button>
                                                <BiDotsHorizontalRounded className="text-3xl" />
                                            </button>
                                        </DropdownTrigger>
                                        <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
                                            <DropdownItem
                                                startContent={<GoSync className={animation ? "animate-spin" : ""} />}
                                                onMouseEnter={() => setAnimation(true)}
                                                onMouseLeave={() => setAnimation(false)}
                                                onClick={() => { handleRefreshClick(); setDropDown(false) }}
                                                className="flex justify-center items-center w-full text-sm font-medium py-2"
                                                textValue="atualizar"
                                            >
                                                <span className="mr-2 md:text-sm text-xs">Atualizar</span>
                                            </DropdownItem>

                                            <DropdownItem
                                                startContent={<IoMdArrowRoundBack />}
                                                className="flex justify-center items-center w-full text-sm font-medium py-2 hover:bg-gray-100"
                                                textValue="filtro"
                                                onClick={() => setDropDown(false)}
                                                isReadOnly
                                            >
                                                <Link href="/billstopay">
                                                    <span className="mr-2 md:text-sm text-xs">Voltar</span>
                                                </Link>
                                            </DropdownItem>
                                            <DropdownItem
                                                startContent={<RiFormatClear />}
                                                onClick={() => { handleClearFilter(); setDropDown(false) }}
                                                className="flex justify-center items-center w-full text-sm font-medium py-2"
                                                textValue="atualizar"
                                            >
                                                <span className="mr-2 md:text-sm text-xs">Limpa Filtro</span>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                        {loading ?
                            <div className="p-4 md:w-full flex items-center justify-center h-[400px]">
                                <Loading />
                            </div>
                            :
                            <TableBillsToPay itemsPaidAndUnpaidBills={filter[0]?.description === undefined ? billetPaidInOpenData : accountsPayableFilter} />}
                    </Main>
                </div>
            </main>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx)

    const { year, month, day } = currentDate()

    const startIsToday = true
    const endIsToday = true

    const billetInOpen = accountsPayableOpenedDaily(year)
    const paidBills = accountsPayablePaidDaily()
    const paidAndUnpaidBills = accountsPayablePaidInOpenDaily()
    const expiredBills = getBillExpiredMonthly(year, month, day, startIsToday, endIsToday)

    const respBillsInOpen = await apiClient.post("/v1/find-db-query", { query: billetInOpen })
    const respBillsInPayed = await apiClient.post("/v1/find-db-query", { query: paidBills })
    const respPaidAndNotPaid = await apiClient.post("/v1/find-db-query", { query: paidAndUnpaidBills })
    const respExpiredBills = await apiClient.post("/v1/find-db-query", { query: expiredBills })

    return {
        props: {
            listBilletInOpen: respBillsInOpen.data.returnObject.body,
            listBilletPaid: respBillsInPayed.data.returnObject.body,
            listBilletPaidAndInOpen: respPaidAndNotPaid.data.returnObject.body,
            listBilletExpired: respExpiredBills.data.returnObject.body
        },
    };
});