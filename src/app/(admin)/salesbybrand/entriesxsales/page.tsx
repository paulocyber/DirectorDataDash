// MetaDados
import { Metadata } from "next";
import { cookies } from "next/headers";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import getCurrentDateDetails from "@/utils/getDate";
import { StockQueries } from "@/utils/queries/stock";
import { salesQueries } from "@/utils/queries/sales";

// Imagem
import manuntencion from "../../../../../public/assets/engenheiro.png"

// Next
import Image from "next/image";

export const metadata: Metadata = {
    title: "Vendas x Estoque em valor",
    description: "Relatório de vendas por marcas e Stock",
};

export default async function EntriesXSalesPage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;
    const api = setupApiClient(token as string)

    const { today } = getCurrentDateDetails()
    const { buyHistory } = StockQueries({ dateInit: '2025/01/01', dateEnd: today, brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS'] })
    const { sellHistory } = salesQueries({ dateInit: '2025/01/01', dateEnd: today, brands: ['PEINING', 'KIMASTER', 'B-MAX', 'INOVA', 'DEVIA', 'HREBOS'] })

    const [responseBuyHistory, responseSellHistory] = await Promise.all([
        api.post("/v1/find-db-query", { query: buyHistory }),
        api.post("/v1/find-db-query", { query: sellHistory }),
    ])

    return (
        <div className="w-full max-h-screen h-full flex flex-col items-center justify-center text-center p-4">
            <Image src={manuntencion} alt="Página em Construção" width={300} height={300} />
            <h1 className="text-3xl font-bold mt-4">Página em Construção</h1>
            <p className="text-lg text-gray-600 mt-2">Estamos trabalhando para trazer novidades em breve. Fique ligado! 😶‍🌫️</p>
        </div>
    )
}