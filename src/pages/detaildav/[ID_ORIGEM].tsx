// Framework
import { useRouter } from "next/router";
import Head from "next/head";

// React
import { useEffect, useState } from "react";

// Biblioteca
import { canSSRAuth } from "@/utils/canSSRAuth";

// Api
import { setupApiClient } from "@/services/api";
import { AuthTokenError } from "@/services/erros/AuthTokenError";
import getItemFromDetailDavs from "@/utils/getData/getItemsFromDetailDavs";
import SideBar from "@/components/ui/menu/SideBar";
import HeaderBar from "@/components/ui/menu/HeaderBar";
import InfoCards from "@/components/ui/cards/InfoCards";
import { Main } from "@/components/ui/mainComponents/main";
import { GoSync } from "react-icons/go";
import { TableProductDav } from "@/components/tables/TableDetailDav";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";
import { ItemsDavDetail } from "@/components/DetailDav/DetailDav";

// Tipagem
interface itemDav {
    ID_PSS: string,
    ID_FRM: string,
    ID_EMP: string,
    ID_RCB: string,
    SIGLA_EMP: string,
    N_DAV: string,
    ID_ORIGEM: string,
    DATAHORA_LANCAMENTO_RCB: string,
    DATAHORA_PAGAMENTO_RCB: string,
    DATA_VENCIMENTO_RCB: string,
    ATRASO_RCB: string,
    VALOR_RCB: string,
    JUROS_RCB: string,
    MULTA_RCB: string,
    RESTANTE_RCB: string,
    RESTANTE_SEM_JUROS_RCB: string,
    VALOR_PAGO_RCB: string,
    NOME_PSS: string,
    APELIDO_PSS: string,
    ID_FNC: string,
    VENDEDOR: string,
    STATUS_RCB: string,
    FORMA_PAGAMENTO: string,
    VALOR_ACRESCIMOS_RCI: string,
    VALOR_DESCONTO_RCI: string,
    DESCRICAO_RCB: string
}

interface productsDav {
    CODIGO_PRD: string,
    DESCRICAO_PRD: string,
    REFERENCIA_PRD: string,
    QTDE_SDI: string,
    VALOR_BRUTO_SDI: string,
    VALOR_DESCONTO_SDI: string,
    VALOR_ACRESCIMO_SDI: string,
    VALOR_LIQUIDO_SDI: string,
    PERC_DESCONTO_SDI: string,
    STATUS_SDI: string,
    DESCRICAO_ALM: string,
    ITEM_PROMOCAO_SDI: string,
    QTDE_DISPONIVEL_SDI: string
}

export type listPorp = {
    listDav?: itemDav[];
    prodcutsDav?: productsDav[]
}

export default function DetailDav({ listDav, prodcutsDav }: listPorp) {
    const [toggleMenuClosed, setToggleMenuClosed] = useState(false);
    const [itemsDavs, setItemsDavs] = useState(listDav || [])
    const [prodcutsDavs, setProdcutsDavs] = useState(prodcutsDav || [])

    const router = useRouter();

    const { ID_ORIGEM } = router.query;

    const { infoDetaildCard } = getItemFromDetailDavs({ listDav: itemsDavs })
    
    return (
        <>
            <Head>
                <title>Detalhe Dav's</title>
            </Head>
            <SideBar showMenu={toggleMenuClosed} isClose={setToggleMenuClosed} />
            <main className="bg-[#edf3fb] flex flex-col w-full h-screen overflow-auto">
                <HeaderBar />
                <div className="md:ml-auto md:mx-0 xl:w-[82%] md:flex flex-col w-full px-3 h-screen">
                    <InfoCards data={infoDetaildCard} />
                    <Main>
                        <div className="md:flex items-center justify-between w-full ">
                            <div className="pb-5 flex justify-between items-center w-full p-5">
                                <h1 className="font-bold md:text-lg text-sm">Detalhe da DAV</h1>
                                <div className="flex items-center hover:scale-[1.03] justify-center items-center md:px-3 px-1 py-1 text-sm font-medium text-white bg-blue-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                                    <Link href="/" className="flex items-center justify-center ">
                                        <IoMdArrowBack className='w-3 h-3 flex' />
                                        <span className="flex mr-2 md:text-sm text-xs px-1 text-center">retorna</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="md:flex w-full">
                            <ItemsDavDetail listDav={itemsDavs} />
                        </div>
                    </Main>
                    <Main>
                        <div className="md:flex items-center justify-between w-full ">
                            <div className="pb-5 flex justify-between items-center w-full p-5">
                                <h1 className="font-bold md:text-lg text-sm">Produtos da DAV</h1>
                                <div className="flex items-center hover:scale-[1.03] justify-center items-center md:px-3 px-1 py-1 text-sm font-medium text-white bg-blue-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                                    <Link href="/" className="flex items-center justify-center ">
                                        <IoMdArrowBack className='w-3 h-3 flex' />
                                        <span className="flex mr-2 md:text-sm text-xs px-1 text-center">retorna</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="md:flex w-full">
                            <TableProductDav prodcutsDav={prodcutsDavs} />
                        </div>
                    </Main>
                </div>
            </main>
        </>
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const { ID_ORIGEM } = ctx.query;

    // Primeira query para obter os detalhes do DAV
    let query1 = `select a.id_pss, a.id_frm, a.id_emp, a.id_rcb, a.sigla_emp, a.numero_documento_rcb as n_dav, a.id_origem, a.datahora_lancamento_rcb, a.datahora_pagamento_rcb, a.data_vencimento_rcb, a.atraso_rcb, a.valor_rcb, a.juros_rcb, a.multa_rcb, iif(a.restante_rcb < 0.00,0.00,a.restante_rcb) as restante_rcb, a.restante_sem_juros_rcb, a.valor_pago_rcb, a.nome_pss as nome_pss, a.apelido_pss, a.id_fnc, a.nome_fnc as vendedor, a.status_rcb, a.descricao_frm as forma_pagamento,  a.valor_acrescimos_rci, a.valor_desconto_rci, a.descricao_rcb from v_recebimentos a where a.id_emp in(4,1,2,3,5,6,7,8,9,10,11) and a.status_rcb in('1','4') and a.status_pss = 'A' and coalesce(a.insolvente_rcb,'N') = 'N' and EXTRACT(YEAR FROM a.data_vencimento_rcb) = EXTRACT(YEAR FROM CURRENT_DATE) and a.ID_ORIGEM = '${ID_ORIGEM}' order by a.id_emp, a.data_vencimento_rcb, nome_pss`;

    // Segunda query para obter os itens do DAV
    let query2 = `select iif(prv.referencia_prv is null, prd.codigo_prd, prv.codigo_prv) as codigo_prd, prd.descricao_prd, prd.referencia_prd, sdi.qtde_sdi,  sdi.valor_bruto_sdi, sdi.valor_desconto_sdi, sdi.valor_acrescimo_sdi, sdi.valor_liquido_sdi, sdi.perc_desconto_sdi, sdi.status_sdi, alm.descricao_alm, sdi.item_promocao_sdi, sdi.qtde_disponivel_sdi from saidas_itens sdi inner join produtos prd on prd.id_prd = sdi.id_prd inner join empresas emp on emp.id_emp = sdi.id_emp inner join almoxarifados alm on alm.id_alm = sdi.id_alm left join v_funcionarios fnc on fnc.id_pss = sdi.id_pss left join cores crs on crs.id_crs = prd.id_crs left join produtos_variacoes prv on (prv.id_prd = sdi.id_prd and prv.codigo_prv = sdi.codigo_prv and prv.id_prv = sdi.id_prv and sdi.id_gri = prv.id_gri) left join ambientes amb on amb.id_amb = sdi.id_amb left join tabelas_precos tbp on tbp.id_tbp = sdi.id_tbp left join tipos_separacao tsp on tsp.id_tsp = sdi.id_tsp where sdi.id_sds = ${ID_ORIGEM} and prd.tipo_prd in('R', 'S', 'P') and sdi.id_item_sdi > 0 and sdi.produtopai_kit_sdi is false order by id_item_sdi, id_prd_composto, id_sequenciainsumokit_sdi`;

    const api = setupApiClient(ctx);

    try {
        // Faz a primeira requisição para obter os detalhes do DAV
        const response1 = await api.post("/v1/find-db-query", { query: query1 });

        // Faz a segunda requisição para obter os itens do DAV
        const response2 = await api.post("/v1/find-db-query", { query: query2 });
        // console.log("Dados: ", response2.data.returnObject.body)
        return {
            props: {
                listDav: response1.data.returnObject.body,
                prodcutsDav: response2.data.returnObject.body
            }
        };
    } catch (error) {
        if (error instanceof AuthTokenError) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        } else {
            console.error("Erro ao buscar dados:", error);
            return {
                redirect: {
                    destination: '/error-page',
                    permanent: false,
                },
            };
        }
    }
});
