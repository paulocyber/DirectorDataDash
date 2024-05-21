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

// React
import { useState } from "react";
import { setupApiClient } from "@/services/api";

// Dados
import getListOfAccountsPayable from "@/utils/getData/getListOfAccountsPayable";

// Bibliotecas
import { GoSync } from "react-icons/go";
import { fetchData } from "@/data/fetchData";
import { Loading } from "@/components/ui/loadings/Loading";
import { VscTable } from "react-icons/vsc";

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

export type BillsToPayProps = {
    listOfAccountsPayable: BillToPayItem[],
    listOfUnpaidBills: BillToPayItem[],
    listPaidAndUnpaidBills: PaidAndUnpaidBillItem[]
}

export default function BillsToPay({ listOfAccountsPayable, listOfUnpaidBills, listPaidAndUnpaidBills }: BillsToPayProps) {
    const [toggleMenuClosed, setToggleMenuClosed] = useState(false);
    const [dataPaid, setDataPaid] = useState(listOfAccountsPayable || [])
    const [dataNotPaid, setDataNotPaid] = useState(listOfUnpaidBills || [])
    const [dataPaidNotPaid, setDataPaidNotPaid] = useState(listPaidAndUnpaidBills || [])
    const [loading, setLoading] = useState<boolean>(false)
    const [animation, setAnimation] = useState<boolean>(false);

    const { infoDetailCard, topCostCenter, topNameCostCenter } = getListOfAccountsPayable({ listOfAccountsPayable: dataPaid, listOfUnpaidBills: dataNotPaid, listPaidAndUnpaidBills: dataPaidNotPaid })
    let queryNotPaid = "select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, pgm.valor_desconto_pgi, pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo, pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') as contabil_pgm  from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) and pgm.data_vencimento_pgm = current_date order by pgm.data_vencimento_pgm, pgm.id_pss"
    let queryPaid = "select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, pgm.valor_desconto_pgi, pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo, pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') as contabil_pgm  from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND CAST(pgm.datahora_pagamento_pgm AS DATE) = CURRENT_DATE  order by pgm.data_vencimento_pgm, pgm.id_pss"
    let queryPaidAndNotPaid = "select pgm.valor_pgm, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo, pgm.nome_pss from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND (CAST(pgm.datahora_pagamento_pgm AS DATE) = CURRENT_DATE or CAST(pgm.data_vencimento_pgm AS DATE) = CURRENT_DATE)  order by pgm.data_vencimento_pgm, pgm.id_pss"

    const fetchPaidBills = async () => {
        setLoading(true);
        await fetchData({ query: queryPaid, setData: setDataPaid });
        setLoading(false);
    }
    const fetchUnpaidBills = async () => {
        setLoading(true);
        await fetchData({ query: queryNotPaid, setData: setDataNotPaid });
        setLoading(false);
    }
    const fetchPaidAndUnpaidBills = async () => {
        setLoading(true);
        await fetchData({ query: queryPaidAndNotPaid, setData: setDataPaidNotPaid });
        setLoading(false);
    }

    const handleRefreshClick = async () => {
        await fetchPaidBills()
        await fetchUnpaidBills()
        await fetchPaidAndUnpaidBills()
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
                                <h1 className="font-bold md:text-lg text-sm">Contas abertas: </h1>
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
                                            href="/billstopay/table"
                                            className="flex hover:scale-[1.03] justify-center items-center w-full md:px-4 px-1 py-1 text-sm font-medium text-white bg-blue-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                                        >
                                            <span className="mr-2 md:text-sm text-xs">Tabela</span>
                                            <VscTable />
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
                </div>
            </main>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx)

    let queryNotPaid = "select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, pgm.valor_desconto_pgi, pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo, pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') as contabil_pgm  from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) and pgm.data_vencimento_pgm = current_date order by pgm.data_vencimento_pgm, pgm.id_pss"
    let queryPaid = "select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, pgm.valor_desconto_pgi, pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo, pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') as contabil_pgm  from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND CAST(pgm.datahora_pagamento_pgm AS DATE) = CURRENT_DATE  order by pgm.data_vencimento_pgm, pgm.id_pss"
    let queryPaidAndNotPaid = "select pgm.valor_pgm, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo, pgm.nome_pss from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND (CAST(pgm.datahora_pagamento_pgm AS DATE) = CURRENT_DATE or CAST(pgm.data_vencimento_pgm AS DATE) = CURRENT_DATE)  order by pgm.data_vencimento_pgm, pgm.id_pss"

    const respPaid = await apiClient.post("/v1/find-db-query", { query: queryPaid })
    const respNotPaid = await apiClient.post("/v1/find-db-query", { query: queryNotPaid })
    const respPaidAndNotPaid = await apiClient.post("/v1/find-db-query", { query: queryPaidAndNotPaid })

    return {
        props: {
            listOfAccountsPayable: respPaid.data.returnObject.body,
            listOfUnpaidBills: respNotPaid.data.returnObject.body,
            listPaidAndUnpaidBills: respPaidAndNotPaid.data.returnObject.body
        },
    };
});