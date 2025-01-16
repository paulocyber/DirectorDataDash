'use client'

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import Table from "@/components/ui/table";
import { renderCell } from "@/components/cells/davs/davProducts";

// Dados
import InfoCardFromDav from "@/data/infoCards/davs";
import collumns from "@/data/columns/dav/davProducts/columns.json"

// Biblioteca
import { IoMdArrowBack } from "react-icons/io";

// Next
import Link from "next/link";

// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { ItemsDavData, ItemsDavProductsResponse } from "@/types/dav";

interface LayoutDetailProps {
    davDetailData: ItemsDavData[];
    davProductsData: ItemsDavProductsResponse[];
}

function InfoField({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex flex-col">
            <h2 className="font-bold text-gray-700 text-sm uppercase">{label}:</h2>
            <p className="text-gray-600 font-medium text-sm">{value}</p>
        </div>
    );
}

export default function LayoutDetail({ davDetailData, davProductsData }: LayoutDetailProps) {
    const infoCard = InfoCardFromDav({ davs: davDetailData, detail: true });

    return (
        <>
            <InfoCard data={infoCard} />
            <Container>
                <div className="flex flex-col items-center w-full">
                    <div className="w-full flex justify-between items-center p-5 border-b">
                        <h1 className="font-bold text-xl text-gray-800">Detalhes da DAV</h1>
                        <Link href="/davs">
                            <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-md shadow-md text-sm">
                                <IoMdArrowBack className="w-4 h-4" />
                                <span>Voltar</span>
                            </button>
                        </Link>
                    </div>

                    <div className="w-full bg-white rounded-lg shadow p-6 mt-5">
                        {davDetailData.length === 0 ? (
                            <p className="text-gray-500 text-center">Nenhum detalhe encontrado para essa DAV.</p>
                        ) : (
                            davDetailData.map((item) => (
                                <div key={item.ID_SDS} className="mb-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-4">
                                        <InfoField label="Número da DAV" value={item.ID_SDS} />
                                        <InfoField label="Empresa" value={item.EMPRESA} />
                                        <InfoField label="Apelido" value={item.APELIDO_PSS} />
                                        <InfoField label="Tipo de venda" value={item.TIPO_VENDA_SDS} />
                                    </div>

                                    <hr className="my-4 border-gray-200" />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-4">
                                        <InfoField label="Cliente" value={item.CLIENTE} />
                                        <InfoField label="Almoxarifado" value={item.ALMOXARIFADO} />
                                        <InfoField
                                            label="Valor Desconto"
                                            value={formatCurrency(Number(item.VALOR_DESCONTO_SDS.replace(",", ".")))}
                                        />
                                        <InfoField
                                            label="Valor Troca"
                                            value={formatCurrency(Number(item.VALOR_TROCA_SDS.replace(",", ".")))}
                                        />
                                    </div>

                                    <hr className="my-4 border-gray-200" />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        <InfoField label="Data da saída" value={item.DATAHORA_SDS.split(" ")[0]} />
                                        <InfoField
                                            label="Data da finalização"
                                            value={item.DATAHORA_FINALIZACAO_SDS.split(" ")[0]}
                                        />
                                        <InfoField label="Vendedor" value={item.VENDEDOR} />
                                        <InfoField label="Status" value={item.STATUS_SDS} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Container>
            <Container>
                <div className="flex flex-col items-center w-full">
                    <div className="w-full flex justify-between items-center p-5">
                        <h1 className="font-bold text-xl text-gray-800">Produtos</h1>
                        <Link href="/davs">
                            <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-md shadow-md text-sm">
                                <IoMdArrowBack className="w-4 h-4" />
                                <span>Voltar</span>
                            </button>
                        </Link>
                    </div>
                    <Table columns={collumns} data={davProductsData} renderCell={renderCell} loading={false} />
                </div>
            </Container>
        </>
    );
}
