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
import { useState } from "react";

// Api
import { setupApiClient } from "@/services/api";
import getItemsFromDavs from "@/utils/getData/getItemsFromDavs";
import { fetchData } from "@/data/fetchData";

// Biblioteca
import { GoSync } from "react-icons/go";
import { Loading } from "./../../components/ui/loadings/Loading";

// Query
import { getDavs } from "@/utils/queries";

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
    dav?: string
}

export default function DavSummaryReport({ listDav, dav }: listPorp) {
    const [toggleMenuClosed, setToggleMenuClosed] = useState(false);
    const [itemsDavs, setItemsDavs] = useState(listDav || [])
    const [animation, setAnimation] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)

    const { infoDetaildCard } = getItemsFromDavs({ listDav: itemsDavs })

    const fetchItemsDavs = async () => {
        setLoading(true)
        if (dav !== undefined) {
            await fetchData({ query: dav, setData: setItemsDavs })
        }
        setLoading(false)
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
                <div className="md:ml-auto md:mx-0 xl:w-[80%] xl:w-[69%] md:flex flex-col w-full h-screen">
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

    const dav = getDavs()

    const resp = await apiClient.post("/v1/find-db-query", { query: dav });

    return {
        props: {
            listDav: resp.data.returnObject.body,
            dav
        },
    };
});