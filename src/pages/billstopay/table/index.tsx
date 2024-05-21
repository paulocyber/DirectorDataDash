// Framwork
import Head from "next/head";

// Componentes
import SideBar from "@/components/ui/menu/SideBar";
import HeaderBar from "@/components/ui/menu/HeaderBar";
import InfoCards from "@/components/ui/cards/InfoCards";
import { Main } from "@/components/ui/mainComponents/main";
import { IoMdArrowRoundBack } from "react-icons/io";

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
import { GoSync } from "react-icons/go";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { filterDescription } from "@/atom/FilterDescription";
import { TableBillsToPay } from "@/components/tables/TableBillsToPay";

export default function BillsToPayTable({ listOfAccountsPayable, listOfUnpaidBills, listPaidAndUnpaidBills }: BillsToPayProps) {
    const [toggleMenuClosed, setToggleMenuClosed] = useState(false);
    const [dataPaid, setDataPaid] = useState(listOfAccountsPayable || [])
    const [dataNotPaid, setDataNotPaid] = useState(listOfUnpaidBills || [])
    const [dataPaidNotPaid, setDataPaidNotPaid] = useState(listPaidAndUnpaidBills || [])
    const [animation, setAnimation] = useState<boolean>(false);
    const [filter, setFilter] = useRecoilState(filterDescription)
console.log("Dados: ", listPaidAndUnpaidBills)
    const { infoDetailCard } = getListOfAccountsPayable({ listOfAccountsPayable: dataPaid, listOfUnpaidBills: dataNotPaid, listPaidAndUnpaidBills: dataPaidNotPaid })

    // Limpa Filtro
    useEffect(() => {
        setFilter([]);
    }, []);


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
                                            // onClick={handleRefreshClick}
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

                        <TableBillsToPay itemsPaidAndUnpaidBills={listPaidAndUnpaidBills}/>
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
    let queryPaidAndNotPaid = "select 'N' as selecionado, pgm.id_pgm, pgm.id_pss, pgm.numero_documento_pgm, pgm.valor_pgm, coalesce(pgm.valor_pago_pgm,0) valor_pago_pgm, pgm.restante_pgm, pgm.valor_acrescimos_pgi, pgm.valor_desconto_pgi, pgm.qtde_pagamentos_pgi, pgm.status_pgm, pgm.id_frm, pgm.descricao_frm, pgm.numero_cheque_pgm, pgm.numero_nota_pgm, pgm.conta_ctb, pgm.data_vencimento_pgm, cast(pgm.datahora_lancamento_pgm as date) datahora_lancamento_pgm, cast(pgm.datahora_pagamento_pgm as date) datahora_pagamento_pgm, pgm.apelido_pss, pgm.nome_pss, pgm.cnpj_pss, pgm.sigla_emp, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo, pgm.id_gps||' - '||pgm.nome_gps as grupos_pessoas, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.boleto_recebido_pgm, pgm.id_emp, pgm.descricao_pgm, iif(pgm.contabil_pgm is true, 'SIM', 'NAO') as contabil_pgm  from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11,12,13) AND (CAST(pgm.datahora_pagamento_pgm AS DATE) = CURRENT_DATE or CAST(pgm.data_vencimento_pgm AS DATE) = CURRENT_DATE) order by pgm.data_vencimento_pgm, pgm.id_pss"

    const respPaid = await apiClient.post("/v1/find-db-query", { query: queryPaid })
    const respNotPaid = await apiClient.post("/v1/find-db-query", { query: queryNotPaid })
    const respPaidAndNotPaid = await apiClient.post("/v1/find-db-query", { query: queryPaidAndNotPaid })

    return {
        props: {
            listOfAccountsPayable: respPaid.data.returnObject.body,
            listOfUnpaidBills: respNotPaid.data.returnObject.body,
            listPaidAndUnpaidBills: respPaidAndNotPaid.data.returnObject.body
        }
    }
});