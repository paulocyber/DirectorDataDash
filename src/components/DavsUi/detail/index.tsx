'use client'

// React
import { ReactNode, useState } from "react";

// Componentes
import InfoCard from "@/components/ui/cards";
import Container from "@/components/ui/container";
import Table from "@/components/ui/table";
import { renderCell } from "@/components/ui/renderCell/davs/detail";

// Utils
import { formatCurrency } from "@/utils/mask/money";

// Biblioteca
import { IoMdArrowBack } from "react-icons/io";

// Dados
import columns from "@/data/collumns/davs/detail/columns.json"

// Framework - next
import Link from "next/link";

// Tipagem
import { ItemsDav, ProductsDav } from "@/utils/types/davs";
interface LayoutProps {
    listDav: ItemsDav[];
    products: ProductsDav[]
    infoCard: { icon: ReactNode; title: string; value: string }[]
}

export default function Layout({ listDav, products, infoCard }: LayoutProps) {
    const [dav, setDav] = useState(listDav || [])
    const [productsInDav, setProductsInDav] = useState(products || [])
    const [infoCardData, setInfoCardData] = useState(infoCard || [])

    return (
        <>
            <InfoCard data={infoCardData} />
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
                        <div
                            className="bg-white  rounded-xl w-[90%] mx-auto pb-5"
                        >
                            {dav.map((item, index) => (
                                <div key={index} className="">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 ">
                                        <div className="">
                                            <h2 className="font-bold text-gray-600 text-base uppercase">
                                                Número da DAV:
                                            </h2>
                                            <p className="text-gray-600 font-semibold text-sm">
                                                {item.ID_SDS}
                                            </p>
                                        </div>

                                        <div className="">
                                            <h2 className="font-bold text-gray-600 text-base uppercase">
                                                Empresa:
                                            </h2>
                                            <p className="text-gray-600 font-semibold text-sm">
                                                {item.EMPRESA}
                                            </p>
                                        </div>

                                        <div className="">
                                            <h2 className="font-bold text-gray-600 text-base uppercase">
                                                Apelido:
                                            </h2>
                                            <p className="text-gray-600 font-semibold text-sm">
                                                {item.APELIDO_PSS}
                                            </p>
                                        </div>


                                        <div className="">
                                            <h2 className="font-bold text-gray-600 text-base uppercase">
                                                Tipo de venda:
                                            </h2>
                                            <p className="text-gray-600 font-semibold text-sm">
                                                {item.TIPO_VENDA_SDS}
                                            </p>
                                        </div>

                                        <div className="">
                                            <h2 className="font-bold text-gray-600 text-base uppercase">
                                                Cliente:
                                            </h2>
                                            <p className="text-gray-600 font-semibold text-sm">
                                                {item.CLIENTE}
                                            </p>
                                        </div>


                                    </div>

                                    <div className="border-b w-full my-3"></div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
                                        <div className="">
                                            <h2 className="font-bold text-gray-600 text-base uppercase">
                                                Almoxarifado:
                                            </h2>
                                            <p className="text-gray-600 font-semibold text-sm">
                                                {item.ALMOXARIFADO}
                                            </p>
                                        </div>


                                        <div className="">
                                            <h2 className="font-bold text-gray-600 text-base uppercase">
                                                Valor Desconto:
                                            </h2>
                                            <p className="text-gray-600 font-semibold text-sm">
                                                {formatCurrency(Number(item.VALOR_DESCONTO_SDS.replace(",", ".")))}
                                            </p>
                                        </div>

                                        <div className="">
                                            <h2 className="font-bold text-gray-600 text-base uppercase">
                                                Valor Trocar:
                                            </h2>
                                            <p className="text-gray-600 font-semibold text-sm">
                                                {formatCurrency(Number(item.VALOR_TROCA_SDS.replace(",", ".")))}
                                            </p>
                                        </div>

                                        <div className="">
                                            <h2 className="font-bold text-gray-600 text-base uppercase">
                                                Data da saída:
                                            </h2>
                                            <p className="text-gray-600 font-semibold text-sm">
                                                {item.DATAHORA_SDS.split(' ')[0]}
                                            </p>
                                        </div>

                                        <div className="">
                                            <h2 className="font-bold text-gray-600 text-base uppercase">
                                                Data da finalização:
                                            </h2>
                                            <p className="text-gray-600 font-semibold text-sm">
                                                {item.DATAHORA_FINALIZACAO_SDS.split(' ')[0]}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="border-b w-full my-3"></div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
                                        <div className="">
                                            <h2 className="font-bold text-gray-600 text-base uppercase">
                                                Vendedor:
                                            </h2>
                                            <p className="text-gray-600 font-semibold text-sm">
                                                {item.VENDEDOR}
                                            </p>
                                        </div>


                                        <div className="">
                                            <h2 className="font-bold text-gray-600 text-base uppercase">
                                                Status:
                                            </h2>
                                            <p className="text-gray-600 font-semibold text-sm">
                                                {item.STATUS_SDS}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                <Table collumns={columns} data={products} renderCell={renderCell} loading={false} />
            </Container>
            </>
    )
}