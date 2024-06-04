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

// React
import { useEffect, useState } from "react";

// Rota
import { canSSRAuth } from "@/utils/canSSRAuth";

// Api
import { setupApiClient } from "@/services/api";

// Tipagem
import { BillsToPayProps } from "..";

// Dados
import getListOfAccountsPayable from "@/utils/getData/getListOfAccountsPayable";
import { fetchData } from "@/data/fetchData";
import { accountsPayableOpenedDaily, accountsPayablePaidDaily, accountsPayablePaidInOpenDaily, getBillExpiredMonthly } from "@/utils/queries";
import currentDate from "@/utils/getCurrentDate/CurrentDate";

// Recoil
import { useRecoilState } from "recoil";

// Atom
import { filterDescription } from "@/atom/FilterDescription";

export default function BillsToPayTable({ listBilletPaid, listBilletInOpen, listBilletPaidAndInOpen, listBilletExpired }: BillsToPayProps) {
    const [toggleMenuClosed, setToggleMenuClosed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const [animation, setAnimation] = useState<boolean>(false);

    // Dados
    const [billetPaidData, setBilletPaidData] = useState(listBilletPaid || [])
    const [billetInOpenData, setBilletInOpenData] = useState(listBilletInOpen || [])
    const [billetPaidInOpenData, setBilletPaidInOpenData] = useState(listBilletPaidAndInOpen || [])
    const [billetExpiredData, setBilletExpiredData] = useState(listBilletExpired || [])

    // Filtros
    const [filter, setFilter] = useRecoilState(filterDescription)

    const { infoDetailCard } = getListOfAccountsPayable({ listBilletPaid: billetPaidData, listBilletInOpen: billetInOpenData, listBilletPaidAndInOpen: billetPaidInOpenData, listBilletExpired: billetExpiredData })

    const billetInOpen = accountsPayableOpenedDaily()
    const paidBills = accountsPayablePaidDaily()
    const paidAndUnpaidBills = accountsPayablePaidInOpenDaily()

    const fetchItemsBillsToPay = async () => {
        setLoading(true);
        await fetchData({ query: billetInOpen, setData: setBilletInOpenData })
        await fetchData({ query: paidBills, setData: setBilletPaidData })
        await fetchData({ query: paidAndUnpaidBills, setData: setBilletPaidInOpenData })
        setLoading(false)
    }

    // Limpa Filtro
    useEffect(() => {
        setFilter([]);
    }, []);

    // Refresh
    const handleRefreshClick = async () => {
        await fetchItemsBillsToPay();
    }

    return (
        <>
            <Head>
                <title>Contas a Pagar</title>
            </Head>
            <SideBar showMenu={toggleMenuClosed} isClose={setToggleMenuClosed} />
            <main className="bg-[#edf3fb] flex flex-col w-full ">
                <HeaderBar />
                <div className="md:ml-auto md:mx-0 xl:w-[80%] xl:w-[69%] md:flex flex-col w-full h-screen">
                    <InfoCards data={infoDetailCard} />
                    <Main>
                        <div className="md:flex items-center justify-between w-full ">
                            <div className="pb-5 flex justify-between items-center w-full p-5">
                                <h1 className="font-bold md:text-lg text-sm">Contas a Pagar</h1>
                                <div className="flex justify-between items-center">
                                    <div className="px-2">
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
                                    <div className="px-2">
                                        <Link
                                            href="/billstopay"
                                            className="flex hover:scale-[1.03] justify-center items-center w-full md:px-4 px-1 py-1 text-sm font-medium text-white bg-blue-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                                        >
                                            <span className="mr-2 md:text-sm text-xs">Voltar</span>
                                            <IoMdArrowRoundBack />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {loading ?
                            <div className="p-4 md:w-full flex items-center justify-center h-[400px]">
                                <Loading />
                            </div>
                            :
                            <TableBillsToPay itemsPaidAndUnpaidBills={billetPaidInOpenData} />}
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