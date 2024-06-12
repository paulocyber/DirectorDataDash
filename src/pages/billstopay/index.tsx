// Framework
import Head from "next/head";
import Link from "next/link";

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

// React
import React, { useEffect, useState } from "react";

// Utils
import { setupApiClient } from "@/services/api";

// Dados
import getListOfAccountsPayable from "@/utils/getData/getListOfAccountsPayable";
import { fetchData } from "@/data/fetchData";

// Bibliotecas
import { GoSync } from "react-icons/go";
import { VscTable } from "react-icons/vsc";
import { DateRangePicker } from "@nextui-org/date-picker";
import { DateValue, RangeValue } from "@nextui-org/calendar";
import { parseDate } from "@internationalized/date";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { RiFormatClear } from "react-icons/ri";
import { useRecoilState } from "recoil";
import { filterDescription } from "@/atom/FilterDescription";
import { Router } from "next/router";
import currentDate from "@/utils/getCurrentDate/CurrentDate";
import { accountsPayableOpenedDaily, accountsPayablePaidDaily, accountsPayablePaidMonthly, accountsPaybleOpenedMonthly, getBillExpiredMonthly, accountsPayablePaidInOpenDaily, accountsPayablePaidInOpenMonthly } from "@/utils/queries";

// Tipagem
interface BillToPayItem {
    SELECIONADO: string,
    ID_PGM: string,
    ID_PSS: string,
    NUMERO_DOCUMENTO_PGM: string,
    VALOR_PGM: string,
    VALOR_PAGO_PGM: string,
    RESTANTE_PGM: string,
    VALOR_ACRESCIMOS_PGI: string,
    VALOR_DESCONTO_PGI: string,
    QTDE_PAGAMENTOS_PGI: string,
    STATUS_PGM: string,
    ID_FRM: string,
    DESCRICAO_FRM: string,
    NUMERO_CHEQUE_PGM: string,
    NUMERO_NOTA_PGM: string,
    CONTA_CTB: string,
    DATA_VENCIMENTO_PGM: string,
    DATAHORA_LANCAMENTO_PGM: string,
    DATAHORA_PAGAMENTO_PGM: string,
    APELIDO_PSS: string,
    NOME_PSS: string,
    CNPJ_PSS: string,
    SIGLA_EMP: string,
    CENTRO_CUSTO: string,
    GRUPOS_PESSOAS: string,
    GRUPO_CENTRO: string,
    BOLETO_RECEBIDO_PGM: string,
    ID_EMP: string,
    DESCRICAO_PGM: string,
    CONTABIL_PGM: string
}

interface PaidAndUnpaidBillItem {
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
}

export type BillsToPayProps = {
    listBilletPaid: BillToPayItem[],
    listBilletInOpen: BillToPayItem[],
    listBilletPaidAndInOpen: PaidAndUnpaidBillItem[],
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

    // Filtro
    const [date, setDate] = React.useState<RangeValue<DateValue>>({
        start: parseDate(new Date().toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    });
    const [filter, setFilter] = useRecoilState(filterDescription)

    const { infoDetailCard, topCostCenter, topNameCostCenter } = getListOfAccountsPayable({ listBilletPaid: billetPaidData, listBilletInOpen: billetInOpenData, listBilletPaidAndInOpen: billetPaidInOpenData, listBilletExpired: billetExpiredData })

    const formatDateInit = `${date.start.year}/${date.start.month}/${date.start.day}`
    const formatDateEnd = `${date.end.year}/${date.end.month}/${date.end.day}`

    const billetInOpen = accountsPaybleOpenedMonthly(formatDateInit, formatDateEnd)
    const paidBills = accountsPayablePaidMonthly(formatDateInit, formatDateEnd)
    const paidAndUnpaidBills = accountsPayablePaidInOpenMonthly(formatDateInit, formatDateEnd)

    const fetchItemsBillsToPay = async () => {
        const { today, year, month, day } = currentDate()
        const start = new Date(date.start.year, date.start.month - 1, date.start.day);
        const end = new Date(date.end.year, date.end.month - 1, date.end.day);

        const startIsToday = start.toDateString() === today.toDateString();
        const endIsToday = end.toDateString() === today.toDateString();

        setLoading(true);
        await fetchData({ query: billetInOpen, setData: setBilletInOpenData })
        await fetchData({ query: paidBills, setData: setBilletPaidData })
        await fetchData({ query: paidAndUnpaidBills, setData: setBilletPaidInOpenData })
// console.log("Query boletos pagos: ", paidBills)
        const formatDateInit = `${date.start.year}-${date.start.month}-${date.start.day}`
        const formatDateEnd = `${date.end.year}-${date.end.month}-${date.end.day}`

        const expiredBills = getBillExpiredMonthly(year, month, day, startIsToday, endIsToday, formatDateInit, formatDateEnd)

        await fetchData({ query: expiredBills, setData: setBilletExpiredData })
        setLoading(false)
    }

    const handleRefreshClick = async () => {
        await fetchItemsBillsToPay()
    }

    const handleClearFilter = () => {
        setFilter([])
        setDate({ start: parseDate(new Date().toISOString().split('T')[0]), end: parseDate(new Date().toISOString().split('T')[0]) })
    }

    useEffect(() => {
        fetchItemsBillsToPay();
    }, [date]);

    useEffect(() => {
        setFilter([]);
    }, []);

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
                                            onChange={setDate}
                                        />
                                    </div>
                                    <div className="px-2">
                                        <Dropdown classNames={{ base: "top-1", trigger: `hover:bg-blue-700 p-1 rounded-md hover:text-white transition duration-300 ease-in-out ${dropDown ? "bg-blue-700 aria-expanded:opacity-100 text-white" : ""}` }}>
                                            <DropdownTrigger onClick={() => setDropDown(!dropDown)} >
                                                <button>
                                                    <BiDotsHorizontalRounded className="text-3xl" />
                                                </button>
                                            </DropdownTrigger>
                                            <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
                                                <DropdownItem
                                                    onClick={handleRefreshClick}
                                                    startContent={<GoSync className={animation ? "animate-spin" : ""} />}
                                                    onMouseEnter={() => setAnimation(true)}
                                                    onMouseLeave={() => setAnimation(false)}
                                                    className="flex justify-center items-center w-full text-sm font-medium py-2"
                                                    textValue="atualizar"
                                                >
                                                    <span className="mr-2 md:text-sm text-xs">Atualizar</span>
                                                </DropdownItem>
                                                <DropdownItem
                                                    startContent={<Link href="/billstopay/table"><VscTable /></Link>}
                                                    className="flex justify-center items-center text-sm font-medium py-2"
                                                    textValue="tabela"
                                                >
                                                    <Link href="/billstopay/table" className="mr-2 md:text-sm text-xs w-full">Tabela</Link>
                                                </DropdownItem>
                                                <DropdownItem
                                                    startContent={<RiFormatClear />}
                                                    className="flex justify-center items-center w-full text-sm font-medium py-2"
                                                    onClick={handleClearFilter}
                                                    textValue="limpa filtro"
                                                >
                                                    <span className="mr-2 md:text-sm text-xs">Limpa filtro</span>
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
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
                                <MainScience data={topNameCostCenter}>
                                    <div className="p-4 md:w-1/2 h-[400px]">
                                        <PieChartComponent data={topCostCenter} />
                                    </div>
                                    <div className="p-4 md:w-1/2 h-[400px]">
                                        <BarChartComponent data={topCostCenter} />
                                    </div>
                                </MainScience>
                            </>}

                    </Main>
                </div >
            </main >
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx)

    const { year, month, day } = currentDate()

    const startIsToday = false
    const endIsToday = false

    const billetInOpen = accountsPayableOpenedDaily()
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

