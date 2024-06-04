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
    listOfAccountsPayable: BillToPayItem[],
    listOfUnpaidBills: BillToPayItem[],
    listPaidAndUnpaidBills: PaidAndUnpaidBillItem[],
    listExpiredBills?: ExpiredBillItem[]
}

export default function BillsToPay({ listOfAccountsPayable, listOfUnpaidBills, listPaidAndUnpaidBills, listExpiredBills }: BillsToPayProps) {
    const [toggleMenuClosed, setToggleMenuClosed] = useState(false);
    const [dataPaid, setDataPaid] = useState(listOfAccountsPayable || [])
    const [dataNotPaid, setDataNotPaid] = useState(listOfUnpaidBills || [])
    const [dataPaidNotPaid, setDataPaidNotPaid] = useState(listPaidAndUnpaidBills || [])
    const [dataListExpiredBills, setDataListExpiredBills] = useState(listExpiredBills || [])
    const [loading, setLoading] = useState<boolean>(false)
    const [animation, setAnimation] = useState<boolean>(false);
    const [date, setDate] = React.useState<RangeValue<DateValue>>({
        start: parseDate(new Date().toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    });
    const [dropDown, setDropDown] = useState<boolean>(false)
    const [filter, setFilter] = useRecoilState(filterDescription)

    const { infoDetailCard, topCostCenter, topNameCostCenter } = getListOfAccountsPayable({ listOfAccountsPayable: dataPaid, listOfUnpaidBills: dataNotPaid, listPaidAndUnpaidBills: dataPaidNotPaid, listExpiredBills: dataListExpiredBills })


    const fetchItemsBillsToPay = async () => {
        const today = new Date();
        const start = new Date(date.start.year, date.start.month - 1, date.start.day);
        const end = new Date(date.end.year, date.end.month - 1, date.end.day);

        const startIsToday = start.toDateString() === today.toDateString();
        const endIsToday = end.toDateString() === today.toDateString();

        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        setLoading(true);
        const responseNotPaid = await fetch(`/api/bills-to-pay?query=notPaid&start=${start.toISOString()}&end=${end.toISOString()}`);
        const dataNotPaid = await responseNotPaid.json();
        setDataNotPaid(dataNotPaid);

        const responsePaid = await fetch(`/api/bills-to-pay?query=paid&start=${start.toISOString()}&end=${end.toISOString()}`);
        const dataPaid = await responsePaid.json();
        setDataPaid(dataPaid);

        const responsePaidAndNotPaid = await fetch(`/api/bills-to-pay?query=paidAndNotPaid&start=${start.toISOString()}&end=${end.toISOString()}`);
        const dataPaidAndNotPaid = await responsePaidAndNotPaid.json();
        setDataPaidNotPaid(dataPaidAndNotPaid);

        if (!startIsToday || !endIsToday) {
            const responseExpiredBills = await fetch(`/api/bills-to-pay?query=expiredBills&start=${start.toISOString()}&end=${end.toISOString()}`);
            const dataExpiredBills = await responseExpiredBills.json();
            setDataListExpiredBills(dataExpiredBills);
        } else {
            const responseExpiredBills = await fetch(`/api/bills-to-pay?query=expiredBills&start=${year}-01-01&end=${year}-${month}-${day - 1}`);
            const dataExpiredBills = await responseExpiredBills.json();
            setDataListExpiredBills(dataExpiredBills);
        }
        setLoading(false);
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

    return (
        <>
            <Head>
                <title>Contas a Pagar</title>
            </Head>
            <SideBar showMenu={toggleMenuClosed} isClose={setToggleMenuClosed} />
            <main className="bg-[#edf3fb] flex flex-col w-full ">
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

                                    {/* <div className="px-2">
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
                                            href="/billstopay/table"
                                            className="flex hover:scale-[1.03] justify-center items-center w-full md:px-4 px-1 py-1 text-sm font-medium text-white bg-blue-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                                        >
                                            <span className="mr-2 md:text-sm text-xs">Tabela</span>
                                            <VscTable />
                                        </Link>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        {!loading ?
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
                            </>
                            }
                    </Main>
                </div >
            </main >
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx);

    const { start, end } = ctx.query;

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const startDate = start || `${year}-${month}-${day}`;
    const endDate = end || `${year}-${month}-${day}`;

    let queryNotPaid = `select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, pgm.valor_desconto_pgi, pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo, pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') as contabil_pgm  from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND CAST(pgm.data_vencimento_pgm AS DATE) BETWEEN '${startDate}' AND '${endDate}' order by pgm.data_vencimento_pgm, pgm.id_pss`;

    let queryPaid = `select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, pgm.valor_desconto_pgi, pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo, pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') as contabil_pgm  from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND CAST(pgm.datahora_pagamento_pgm AS DATE) BETWEEN '${startDate}' AND '${endDate}' order by pgm.data_vencimento_pgm, pgm.id_pss`;

    let queryPaidAndNotPaid = `select pgm.valor_pgm, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo, pgm.nome_pss from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) and (pgm.data_vencimento_pgm between date '${startDate}' and date '${endDate}' or pgm.datahora_pagamento_pgm between date '${startDate}' and date '${endDate}') order by pgm.data_vencimento_pgm, pgm.id_pss`;

    let queryForExpiredBills = `select pgm.restante_pgm from v_pagamentos pgm where pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND CAST(pgm.data_vencimento_pgm AS DATE) BETWEEN '${startDate}' AND '${endDate}' AND CAST(pgm.datahora_lancamento_pgm AS DATE) BETWEEN '2022-12-01' AND CURRENT_DATE and pgm.status_pgm = 1 or pgm.status_pgm = 4 order by pgm.data_vencimento_pgm, pgm.id_pss`;

    const respPaid = await apiClient.post("/v1/find-db-query", { query: queryPaid });
    const respNotPaid = await apiClient.post("/v1/find-db-query", { query: queryNotPaid });
    const respPaidAndNotPaid = await apiClient.post("/v1/find-db-query", { query: queryPaidAndNotPaid });
    const respExpiredBills = await apiClient.post("/v1/find-db-query", { query: queryForExpiredBills });

    return {
        props: {
            listOfAccountsPayable: respPaid.data.returnObject.body,
            listOfUnpaidBills: respNotPaid.data.returnObject.body,
            listPaidAndUnpaidBills: respPaidAndNotPaid.data.returnObject.body,
            listExpiredBills: respExpiredBills.data.returnObject.body
        },
    };
});


