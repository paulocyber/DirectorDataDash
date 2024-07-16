// Componentes
import Layout from "@/components/ui/layout";
import currentDate from "@/utils/CurrentDate";
import Cards from "@/components/ui/cards";
import Container from "@/components/ui/container";
import TableGrid from "@/components/ui/table";

// Next - Framework
import { canSSRAuth } from "@/utils/permissions/canSSRAuth";
import Link from "next/link";

// Utils
import { davsQueries } from "@/utils/queries/davs";
import { setupApiClient } from "@/service/api";
import { formatCurrency } from '@/utils/masks/formatCurrency';

// Biblioteca
import { IoMdArrowBack } from "react-icons/io";

// Dados
import { columns } from "@/data/collumnsProductsDav"

// React
import { useState } from "react";

// Tipagem
import { ItemsDav } from "@/utils/types/listDav";
import { InfoCardFromDav } from "@/utils/getFromData/infoCard/infoCardFromDav";
import ItemsDavDetail from "@/components/ItemsDavDetail";
import { InfiniteScroll } from "@/utils/InfiniteScroll";
type productsDav = {
    CODIGO_PRD: string;
    ID_SDS: string;
    DESCRICAO_PRD: string;
    REFERENCIA_PRD: string;
    QTDE_SDI: string;
    VALOR_BRUTO_SDI: string;
    VALOR_DESCONTO_SDI: string;
    VALOR_ACRESCIMO_SDI: string;
    VALOR_LIQUIDO_SDI: string;
    PERC_DESCONTO_SDI: string;
    STATUS_SDI: string;
    DESCRICAO_ALM: string;
    ITEM_PROMOCAO_SDI: string;
    QTDE_DISPONIVEL_SDI: string;
}
interface DetailDavPageProps {
    listDavDetail: ItemsDav[]
    listProductsDav: productsDav[]
}

export default function DetailDavPage({ listDavDetail, listProductsDav }: DetailDavPageProps) {
    const [detailDav, setDetailDav] = useState(listDavDetail || [])
    const [productsContainDav, setProductsContainDav] = useState(listProductsDav || [])
    const [limit, setLimit] = useState(0);

    const infoDetailCard = InfoCardFromDav({ listDav: detailDav, detail: true })

    const renderCell = (item: productsDav, columnKey: string) => {
        switch (columnKey) {
            case "codigodoproduto":
                return item.CODIGO_PRD;
            case "produto":
                return item.DESCRICAO_PRD;
            case "promoção":
                return item.ITEM_PROMOCAO_SDI ? "Não" : "Sim";
            case "desconto":
                return item.PERC_DESCONTO_SDI
            case "quantidadedisponivel":
                return item.QTDE_DISPONIVEL_SDI
            case "quantidadedasaida":
                return item.QTDE_SDI
            case "valordoacrescimo":
                return item.VALOR_ACRESCIMO_SDI
            case "valorbruto":
                return formatCurrency(Number(item.VALOR_BRUTO_SDI.replace(",", ".")))
            case "valordesconto":
                return formatCurrency(Number(item.VALOR_DESCONTO_SDI.replace(",", ".")))
            case "valorliquido":
                return formatCurrency(Number(item.VALOR_LIQUIDO_SDI.replace(",", ".")))
            default:
                return null;
        }
    };

    const fetchMore = () => {
        if (limit < listProductsDav.length) {
            setLimit(limit + 10);
        }
    };

    return (
        <Layout description="Detalhe das dav's">
            <Cards data={infoDetailCard} />
            <Container>
                <div className="md:flex items-center justify-between w-full ">
                    <div className="pb-5 flex justify-between items-center w-full p-5">
                        <h1 className="font-bold md:text-lg text-sm">Detalhe da DAV</h1>
                        <div className="flex items-center hover:scale-[1.03] justify-center items-center md:px-3 px-1 py-1 text-sm font-medium text-white bg-blue-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                            <Link href="/davs" className="flex items-center justify-center ">
                                <IoMdArrowBack className='w-3 h-3 flex' />
                                <span className="flex mr-2 md:text-sm text-xs px-1 text-center">retorna</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="md:flex w-full">
                    <ItemsDavDetail listDavDetail={detailDav} />
                </div>
            </Container>
            <Container>
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
                <main className="flex w-full pb-6 h-[450px] flex-col px-5">
                    <div className="overflow-auto">
                        <TableGrid collumns={columns} data={productsContainDav.slice(0, limit)} renderCell={renderCell} />
                        <InfiniteScroll fetchMore={fetchMore} />
                    </div>
                </main>
            </Container>
        </Layout>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupApiClient(ctx)
    const id = ctx.query.id as string;

    const { date } = currentDate()
    const { davFinalizationDetail, obtainProductsContainedInDav } = davsQueries({ dataInit: date, dataEnd: date, id })

    const respDav = await apiClient.post("/v1/find-db-query", { query: davFinalizationDetail })
    const respProductsContainDav = await apiClient.post("/v1/find-db-query", { query: obtainProductsContainedInDav })

    return {
        props: {
            listDavDetail: respDav.data.returnObject.body,
            listProductsDav: respProductsContainDav.data.returnObject.body
        }
    }
})