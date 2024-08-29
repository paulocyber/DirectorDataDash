// Framework - Servidor
import { getDetailDavPageProps } from "@/utils/server/detailDavPageProps";
import Link from "next/link";

// Componentes
import PageLayout from "@/components/ui/layout";
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import Table from "@/components/ui/table";
import ItemsDavDetail from "@/components/deitailDav/itemsDavDetail";

// Dados
import { InfoCardFromDav } from "@/data/infoCard/davs";
import { columns } from "@/data/columns/dav/productsAndDav/columns"
import { renderCell } from "@/components/rowsTable/dav/products/renderCell";

// Biblioteca
import { IoMdArrowBack } from "react-icons/io";

// Utils
import { InfiniteScroll } from "@/utils/InfiniteScroll";

// React
import { useState } from "react"

// Tipagem
import { ItemsDav } from "@/utils/types/dav";
import { ItemsProducts } from "@/utils/types/products";

export default function DetailDavPage({ listDavDetail, listProductsDav }: { listDavDetail: ItemsDav[], listProductsDav: ItemsProducts[] }) {
    const [dav, setDav] = useState(listDavDetail || [])
    const [products, setProducts] = useState(listProductsDav || [])
    const [limit, setLimit] = useState(0);

    const infoDetailCard = InfoCardFromDav({ listDav: dav, detail: true })

    const fetchMore = () => {
        if (limit < listProductsDav.length) {
            setLimit(limit + 10);
        }
    };

    return (
        <PageLayout description="Relatorios dav's">
            <InfoCard data={infoDetailCard} />
            <Container>
                <div className="md:flex-col items-center justify-between w-full ">
                    <div className="pb-5 flex justify-between items-center w-full p-5">
                        <h1 className="font-bold md:text-lg text-sm">Detalhe da DAV</h1>
                        <div className="flex items-center hover:scale-[1.03] justify-center items-center md:px-3 px-1 py-1 text-sm font-medium text-white bg-blue-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                            <Link href="/davs" className="flex items-center justify-center ">
                                <IoMdArrowBack className='w-3 h-3 flex' />
                                <span className="flex mr-2 md:text-sm text-xs px-1 text-center">retorna</span>
                            </Link>
                        </div>
                    </div>
                    <div className="md:flex w-full">
                        <ItemsDavDetail dav={dav} />
                    </div>
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
                        <Table collumns={columns} data={products.slice(0, limit)} renderCell={renderCell} />
                        <InfiniteScroll fetchMore={fetchMore} />
                    </div>
                </main>
            </Container>
        </PageLayout>
    )
}

export const getServerSideProps = getDetailDavPageProps; 