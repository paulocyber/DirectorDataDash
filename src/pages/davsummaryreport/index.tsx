// Utils
import { canSSRAuth } from "@/utils/canSSRAuth"

// Framework
import Head from "next/head"

// Componentes
import SideBar from "@/components/ui/menu/SideBar";
import InfoCards from "@/components/ui/cards/InfoCards";
import HeaderBar from "@/components/ui/menu/HeaderBar";
import { Main } from "@/components/ui/mainComponents/main";
import { TableDav } from "@/components/tables/TableDav";

// React
import { useEffect, useState } from "react";

// Api
import { setupApiClient } from "@/services/api";
import getItemsFromDavs from "@/utils/getData/getItemsFromDavs";

// Biblioteca
import { GoSync } from "react-icons/go";
import { Loading } from "./../../components/ui/loadings/Loading";
import { parseCookies } from "nookies";
import axios from "axios";
import { headers } from "next/headers";

// Tipagem
interface itemDav {
    ID_EMP: string;
    ID_RCB: string;
    SIGLA_EMP: string;
    N_DAV: string;
    ID_ORIGEM: string;
    DATAHORA_LANCAMENTO_RCB: string;
    DATAHORA_PAGAMENTO_RCB: string;
    DATA_VENCIMENTO_RCB: string;
    ATRASO_RCB: string;
    VALOR_RCB: string;
    JUROS_RCB: string;
    MULTA_RCB: string;
    RESTANTE_RCB: string;
    RESTANTE_SEM_JUROS_RCB: string;
    VALOR_PAGO_RCB: string;
    NOME_PSS: string;
    APELIDO_PSS: string;
    ID_FNC: string;
    VENDEDOR: string;
    STATUS_RCB: string;
    FORMA_PAGAMENTO: string;
    VALOR_ACRESCIMOS_RCI: string;
    VALOR_DESCONTO_RCI: string;
    DESCRICAO_RCB: string;
}

export type listPorp = {
    listDav: itemDav[];
}

export default function DavSummaryReport({ listDav }: listPorp) {
    const [toggleMenuClosed, setToggleMenuClosed] = useState(false);
    const [itemsDavs, setItemsDavs] = useState(listDav || [])
    const [animation, setAnimation] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)

    const { infoDetaildCard } = getItemsFromDavs({ listDav: itemsDavs })

    const fetchItemsDavs = async () => {
        setLoading(true)

        try {
            const cookies = parseCookies();
            const token = cookies['@nextauth.token'];

            let query = `select a.id_pss, a.id_frm, a.id_emp, a.id_rcb, a.sigla_emp, a.numero_documento_rcb as n_dav, a.id_origem, a.datahora_lancamento_rcb, a.datahora_pagamento_rcb, a.data_vencimento_rcb, a.atraso_rcb, a.valor_rcb, a.juros_rcb, a.multa_rcb, iif(a.restante_rcb < 0.00,0.00,a.restante_rcb)as restante_rcb, a.restante_sem_juros_rcb, a.valor_pago_rcb, a.nome_pss as nome_pss, a.apelido_pss, a.id_fnc, a.nome_fnc as vendedor, a.status_rcb, a.descricao_frm as forma_pagamento,  a.valor_acrescimos_rci, a.valor_desconto_rci, a.descricao_rcb from v_recebimentos a where a.id_emp in(4,1,2,3,5,6,7,8,9,10,11) and a.status_rcb in('1','4') and a.status_pss = 'A' and coalesce(a.insolvente_rcb,'N') = 'N' and (EXTRACT(YEAR FROM a.data_vencimento_rcb) = EXTRACT(YEAR FROM CURRENT_DATE) and EXTRACT(MONTH FROM a.data_vencimento_rcb) = EXTRACT(MONTH FROM CURRENT_DATE) and EXTRACT(DAY FROM a.data_vencimento_rcb) = EXTRACT(DAY FROM CURRENT_DATE) or EXTRACT(YEAR FROM a.datahora_lancamento_rcb) = EXTRACT(YEAR FROM CURRENT_DATE) and EXTRACT(MONTH FROM a.datahora_lancamento_rcb) = EXTRACT(MONTH FROM CURRENT_DATE) and EXTRACT(DAY FROM a.datahora_lancamento_rcb) = EXTRACT(DAY FROM CURRENT_DATE)) order by a.id_emp, a.data_vencimento_rcb, nome_pss`;

            const resp = await axios.post('https://sistema-suporte-play-uljpe.ondigitalocean.app/v1/find-db-query', {
                query
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // console.log("Dados: ", resp.data.returnObject.body)

            setItemsDavs(resp.data.returnObject.body)
        } catch (err) {
            console.log("Erro ao buscar dados da API: ", err)
        } finally {
            setLoading(false)
        }
    }

    const handleRefreshClick = async () => {
        await fetchItemsDavs();
    }

    return (
        <>
            <Head>
                <title>Relatório  Dav's</title>
            </Head>
            <SideBar showMenu={toggleMenuClosed} isClose={setToggleMenuClosed} />
            <main className="bg-[#edf3fb] flex flex-col w-full ">
                <HeaderBar />
                <div className="md:ml-auto md:mx-0 xl:w-[82%] md:flex flex-col w-full px-3 h-screen">
                    <InfoCards data={infoDetaildCard} />
                    <Main>
                        <div className="md:flex items-center justify-between w-full ">
                            <div className="pb-5 flex justify-between items-center w-full p-5">
                                <h1 className="font-bold md:text-lg text-sm">Relatório Diário</h1>
                                <div className="flex justify-between items-center">
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

    let query = `select a.id_pss, a.id_frm, a.id_emp, a.id_rcb, a.sigla_emp, a.numero_documento_rcb as n_dav, a.id_origem, a.datahora_lancamento_rcb, a.datahora_pagamento_rcb, a.data_vencimento_rcb, a.atraso_rcb, a.valor_rcb, a.juros_rcb, a.multa_rcb, iif(a.restante_rcb < 0.00,0.00,a.restante_rcb)as restante_rcb, a.restante_sem_juros_rcb, a.valor_pago_rcb, a.nome_pss as nome_pss, a.apelido_pss, a.id_fnc, a.nome_fnc as vendedor, a.status_rcb, a.descricao_frm as forma_pagamento,  a.valor_acrescimos_rci, a.valor_desconto_rci, a.descricao_rcb from v_recebimentos a where a.id_emp in(4,1,2,3,5,6,7,8,9,10,11) and a.status_rcb in('1','4') and a.status_pss = 'A' and coalesce(a.insolvente_rcb,'N') = 'N' and (EXTRACT(YEAR FROM a.data_vencimento_rcb) = EXTRACT(YEAR FROM CURRENT_DATE) and EXTRACT(MONTH FROM a.data_vencimento_rcb) = EXTRACT(MONTH FROM CURRENT_DATE) and EXTRACT(DAY FROM a.data_vencimento_rcb) = EXTRACT(DAY FROM CURRENT_DATE) or EXTRACT(YEAR FROM a.datahora_lancamento_rcb) = EXTRACT(YEAR FROM CURRENT_DATE) and EXTRACT(MONTH FROM a.datahora_lancamento_rcb) = EXTRACT(MONTH FROM CURRENT_DATE) and EXTRACT(DAY FROM a.datahora_lancamento_rcb) = EXTRACT(DAY FROM CURRENT_DATE)) order by a.id_emp, a.data_vencimento_rcb, nome_pss`;

    const resp = await apiClient.post("/v1/find-db-query", { query });

    // console.log("Dados em array: ", resp.data.returnObject.body)
    return {
        props: {
            listDav: resp.data.returnObject.body
        },
    };
});