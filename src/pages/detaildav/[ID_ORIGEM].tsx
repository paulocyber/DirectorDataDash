// Framework
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

// React
import { useState } from "react";

// Biblioteca
import { IoMdArrowBack } from "react-icons/io";

// Rotas
import { canSSRAuth } from "@/utils/canSSRAuth";

// Api
import { setupApiClient } from "@/services/api";
import { AuthTokenError } from "@/services/erros/AuthTokenError";
import getItemFromDetailDavs from "@/utils/getData/getItemsFromDetailDavs";

// Componentes
import SideBar from "@/components/ui/menu/SideBar";
import HeaderBar from "@/components/ui/menu/HeaderBar";
import InfoCards from "@/components/ui/cards/InfoCards";
import { Main } from "@/components/ui/mainComponents/main";
import { TableProductDav } from "@/components/tables/TableDetailDav";
import { ItemsDavDetail } from "@/components/DetailDav/DetailDav";
import { getDavsProducts, getDetailDavs } from "@/utils/queries";
import currentDate from "@/utils/getCurrentDate/CurrentDate";
import { davsQueries } from "@/utils/queries/Davs";

// Tipagem
interface itemDav {
    ID_SDS: string,
    ID_EMP: string,
    EMPRESA: string,
    DATAHORA_SDS: string,
    DATAHORA_FINALIZACAO_SDS: string,
    APELIDO_PSS: string,
    CLIENTE: string,
    VENDEDOR: string,
    ALMOXARIFADO: string,
    VALOR_BRUTO_SDS: string,
    VALOR_DESCONTO_SDS: string,
    VALOR_TROCA_SDS: string,
    VALOR_LIQUIDO_SDS: string,
    TIPO_VENDA_SDS: string,
    STATUS_SDS: string
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

export type DetailDavPorp = {
    listDavFinalized?: itemDav[];
    listProductsOnDav?: productsDav[]
}

export default function DetailDav({ listDavFinalized, listProductsOnDav }: DetailDavPorp) {
    const [toggleMenuClosed, setToggleMenuClosed] = useState(false);
    const [itemsDavs, setItemsDavs] = useState(listDavFinalized || [])
    const [prodcutsDavs, setProdcutsDavs] = useState(listProductsOnDav || [])

    const { infoDetaildCard } = getItemFromDetailDavs({ listDavFinalized: itemsDavs })

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
                            <ItemsDavDetail listDavFinalized={itemsDavs} />
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
    const ID_ORIGEM = ctx.query.ID_ORIGEM as string;

    const { year, month, day } = currentDate()

    const dataInit = `${year}/${month}/${day}`
    const dataEnd = `${year}/${month}/${day}`

    const { davFinalizationDetail } = davsQueries({ dataInit, dataEnd, id: ID_ORIGEM })
    const productsContainsInDav = getDavsProducts(ID_ORIGEM)

    const api = setupApiClient(ctx);

    const respDetailDav = await api.post("/v1/find-db-query", { query: davFinalizationDetail });
    const respProductsContainsInDav = await api.post("/v1/find-db-query", { query: productsContainsInDav });

    return {
        props: {
            listDavFinalized: respDetailDav.data.returnObject.body,
            listProductsOnDav: respProductsContainsInDav.data.returnObject.body
        }
    }
});
