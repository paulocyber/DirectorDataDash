'use client'

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Dados
import vibrantPalette from '@/data/palettes/vibrant.json';

// Tipagem
import { StockByGroup, TopProducts } from "@/types/stock";

// Utils
import { fetchSalesByGroup } from "@/utils/data/fetchData/refresh/fetchSalesByGroup";

// Recoil
import { useRecoilValue } from "recoil";
import { brandsAtom } from "@/atom/brandsAtom";

// Componentes
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import GraphicContainer from "@/components/ui/sciences/graphics/GraphicContainer";
import BarChart from "@/components/ui/sciences/graphics/BarChart"; 

// Tipagem
type DateRangeState = {
    start: string;
    end: string;
};

interface UiSalesByGroupProps {
    listStockByGroup: StockByGroup[];
    listTopProducts: TopProducts[];
    year: number;
    month: number;
    day: number;
    today: string;
    startOfWeek: string;
    endOfWeek: string;
}

export default function UiSalesByGroup({ listStockByGroup, listTopProducts, year, month, day, today, startOfWeek, endOfWeek }: UiSalesByGroupProps) {
    const [stockByGroup, setStockByGroup] = useState(listStockByGroup || [])
    const [topProducts, setTopProducts] = useState(listTopProducts || [])
    const [selectedDateRange, setSelectedDateRange] = useState<string>('day')
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<DateRangeState>({
        start: today,
        end: today
    });

    const { token } = useContext(AuthContext)
    const brands = useRecoilValue(brandsAtom)

    const handleRefresh = async () => {
        await fetchSalesByGroup({ token, dateInit: `${date.start}`, dateEnd: `${date.end}`, brands, emp: '1', setLoading, setTopProducts })
    }

    return (
        <Container>
            <ToolBar title="Vendas por grupo" handleRefreshClick={handleRefresh} />
            <GraphicContainer loading={loading} children={<BarChart data={topProducts} dataKey="VALOR_LIQUIDO" dataKeyXAxis="PRODUTO" displayXAxis={true} displayCartesianGrid={true} palette={vibrantPalette} />} />
        </Container>
    )
}