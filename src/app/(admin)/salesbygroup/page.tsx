// Next
import { cookies } from "next/headers";
import { Metadata } from "next";

// Bibliotecas
import { setupApiClient } from "@/services/api";

// Utils
import { StockQueries } from "@/utils/queries/stock";

// Componentes
import LayoutSalesByGroup from "@/components/layouts/salesByGroup";

export const metadata: Metadata = {
    title: "Relatório de vendas por grupo",
    description: "Informação sobre sade das vendas do produto",
};

export default async function SalesByGroupPage() {
    const cookieStore = cookies();
    const token = (await cookieStore).get('@nextauth.token')?.value;

    const api = setupApiClient(token as string)

    const { stockByGroup } = StockQueries({
       groups: ['PELICULA', 'FOSCA 3D PELICULA',
            'PELICULAS DE CAMERA', 'PELICULA CERAMICA FOSCA PRIV', 'PELICULA 3D PRIVACIDADE', 'PELICULA 3D FINA', 'PELICULAS PLAY UP', 'CAPAS', 'SUA CAPA', 'CAPA ORIGINAL', 'CAPA RIGIDA LISA', 'CAPA SOFT', 'CAPA TRANSPARANTE',
            'CAPAS DIVERSAS', 'CAPA RIGIDA FOSCA', 'CAPA REVESTIDA', 'CAPA REVESTIDA MAGSAFE', 'CAPA AVELUDADO', 'CAPA SPACE 2', 'CAPA SAPECE', 'ACRILICA']
    })

    const [responseStockByGroup] = await Promise.all([
        api.post("/v1/find-db-query", { query: stockByGroup }),
    ])
    
    return (
        <>Teste</>
        // <LayoutSalesByGroup topProducts={topProducts} />
    )
}