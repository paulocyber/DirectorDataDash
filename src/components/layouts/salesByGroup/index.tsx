'use client'

// Componentes
import ToolBar from "@/components/ui/toolbar";
import Container from "@/components/ui/container";
import GraphicContainer from "@/components/ui/sciences/GraphicContainer";
import BarChart from "@/components/ui/sciences/BarChart";

// Dados
import vibrantPalette from '@/data/pallets/vibrant.json';

// Tipagem
import { ItemsTopProducts } from "@/types/stock";
interface LayoutSalesByGroupProps {
    topProducts: ItemsTopProducts[]
}

export default function LayoutSalesByGroup({ topProducts }: LayoutSalesByGroupProps) {
    return (
        <Container>
            <ToolBar
                title="Vendas por grupo"
                handleRefreshClick={() => console.log("Ativou")}
                handleCleanFilter={() => console.log("Ativou")}
            />
            <GraphicContainer loading={false}>
                <BarChart data={topProducts} dataKey="VALOR_LIQUIDO" dataKeyXAxis="PRODUTO" displayXAxis={true} displayCartesianGrid={true} palette={vibrantPalette} />
            </GraphicContainer>
        </Container>
    )
}