'use client'

// React
import { useContext, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

// Bibliotecas
import { FaClockRotateLeft } from "react-icons/fa6";
import { FaHotel } from 'react-icons/fa';

// Dados
import highLightColor from '@/data/palettes/highlightedColor.json';

// Componentes
import Container from '@/components/ui/container';
import ToolBar from '@/components/ui/toolbar';
import ProgressBar from '@/components/ui/progressBar';
import Card from '@/components/ui/card';
import GraphicContainer from '@/components/ui/sciences/graphics/GraphicContainer';
import { CustomActiveShapePieChart } from '@/components/ui/sciences/graphics/PieChart/CustomActiveShapePieChart';
import { CustomTooltip } from '@/components/ui/sciences/toolTip';
import { InternalPieLabel } from '@/components/ui/sciences/label';
import DescriptionGraphic from '@/components/ui/sciences/description';
import BarChart from '@/components/ui/sciences/graphics/BarChart';

// Utils
import { getMonthName } from '@/utils/mask/date';
import { getEmpName } from '@/utils/mask/nameEnterprise';
import { fetchSales } from '@/utils/data/fetchData/refresh/fetchSales';
import SalesGoalsPDF from '@/utils/relatory/pdf/salesgoal';

// Tipagem
import { SellersType } from "@/types/Employees";
import { profitsFromSale, salesProgressData, topClientsPlusBuyData, topSalesData } from "@/types/sales";
import { Autocomplete, AutocompleteItem, DateValue, RangeValue } from '@nextui-org/react';
import { parseDate } from '@internationalized/date';
interface SalesProps {
    salesProgressData: salesProgressData[];
    sellersData: SellersType[];
    topSalesData: topSalesData[];
    topClientsData: topClientsPlusBuyData[];
    salesAndGoalsRelatoryData: profitsFromSale[]
    progressSalesRelatoryData: salesProgressData[]
    year: number;
    month: number;
    today: string;
}

const getLastDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
};

export default function UiSales({ salesProgressData, sellersData, topSalesData, topClientsData, salesAndGoalsRelatoryData, progressSalesRelatoryData, year, month, today }: SalesProps) {
    const [salesProgress, setSalesProgress] = useState(salesProgressData)
    const [sellers, setSellers] = useState(sellersData)
    const [topSales, setTopSales] = useState(topSalesData)
    const [topClients, setTopClients] = useState(topClientsData)
    const [sellersAndGoals, setSellersAndGoals] = useState(salesAndGoalsRelatoryData)
    const [progressSalesRelatory, setProgressSalesRelatory] = useState(progressSalesRelatoryData)
    const [emp, setEmp] = useState('1')
    const [selectSeller, setSelectSeller] = useState<string>('')
    const [date, setDate] = useState<RangeValue<DateValue>>({ start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]), end: parseDate(new Date(today).toISOString().split('T')[0]), })
    const [loading, setLoading] = useState<boolean>(false)

    const { token } = useContext(AuthContext)
    const lastDay = getLastDayOfMonth(date.end.year, date.end.month)

    const handleRefresh = async () => {
        await fetchSales({
            token,
            dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
            dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
            year: date.start.year,
            month: date.start.month,
            idSeller: selectSeller,
            emp,
            setLoading,
            setGoalProgress: setSalesProgress,
            setSellersAndGoals,
            setProgressSalesRelatory,
            setTopClients,
            setSellers
        })
    }

    const handleDateRangePicker = async (newDate: RangeValue<DateValue>) => {
        setDate(newDate)

        await fetchSales({
            token,
            dateInit: `${newDate.start.year}/${newDate.start.month}/${newDate.start.day}`,
            dateEnd: `${newDate.end.year}/${newDate.end.month}/${newDate.end.day}`,
            year: newDate.start.year,
            month: newDate.start.month,
            idSeller: selectSeller,
            emp,
            setLoading,
            setGoalProgress: setSalesProgress,
            setSellersAndGoals,
            setProgressSalesRelatory,
            setTopClients,
            setSellers
        })
    }

    const handleFilters = async (key: React.Key | null) => {
        setSelectSeller(key as string)
        setSelectSeller('')

        await fetchSales({
            token,
            dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
            dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
            idSeller: key as string,
            emp: !key && emp,
            year: !key && date.start.year,
            month: !key && date.start.month,
            setLoading,
            setGoalProgress: setSalesProgress,
            setSellersAndGoals,
            setProgressSalesRelatory,
            setTopClients,
            setSellers
        })
    }

    const handleCleanFilter = async () => {
        setDate({ start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]), end: parseDate(new Date(today).toISOString().split('T')[0]) })

        await fetchSales({
            token,
            dateInit: `${year}/${month}/01`,
            dateEnd: today,
            year,
            month,
            emp,
            setLoading,
            setGoalProgress: setSalesProgress,
            setSellersAndGoals,
            setProgressSalesRelatory,
            setTopClients,
            setSellers
        })
    }

    const generatePdf = () => {
        SalesGoalsPDF(sellersAndGoals, progressSalesRelatory, `${date.start.day}/${date.start.month}/${date.start.year}`)
    }

    return (
        <>
            <Container>
                <ToolBar title={`Metas de ${getMonthName(date.start.month)}`} handleDateRangePicker={handleDateRangePicker} handleRefreshClick={handleRefresh} handleCleanFilter={handleCleanFilter} dateRange={date} emp={emp} setEmp={setEmp} generatePDF={generatePdf}>
                    <div className="mr-auto sm:flex hidden md:mr-4 mt-2 md:w-56 small-screen:w-full">
                        <Autocomplete
                            aria-label="Filtro de vendedores"
                            placeholder="Selecione o vendedor"
                            size="sm"
                            value={selectSeller}
                            onSelectionChange={handleFilters}
                            variant="bordered"
                            defaultItems={sellers}
                            allowsCustomValue={true}
                        >
                            {(seller) => (
                                <AutocompleteItem key={seller.ID_FNC}>
                                    {seller.APELIDO_PSS}
                                </AutocompleteItem>
                            )}
                        </Autocomplete>
                    </div>
                </ToolBar>
                <div className='mr-auto mb-2 w-full sm:hidden flex w-full px-4'>
                    <Autocomplete
                        aria-label="Filtro de vendedores"
                        placeholder="Selecione o vendedor"
                        size="sm"
                        value={selectSeller}
                        onSelectionChange={handleFilters}
                        variant="bordered"
                        defaultItems={sellers}
                        allowsCustomValue={true}
                    >
                        {(seller) => (
                            <AutocompleteItem key={seller.ID_FNC}>
                                {seller.APELIDO_PSS}
                            </AutocompleteItem>
                        )}
                    </Autocomplete>
                </div>
                <ProgressBar minValue={salesProgress[0].value} maxValue={salesProgress[1].value} />
            </Container>
            <div className="w-full lg:flex ">
                <div className="lg:w-1/3">
                    <Container>
                        <div className="flex">
                            <GraphicContainer loading={false}>
                                <CustomActiveShapePieChart data={topSales} valueKey='VALOR_LIQUIDO' displayToolTip={true} ToolTipComponent={(props) => (<CustomTooltip {...props} dataKey='VENDEDOR' valueKey='VALOR_LIQUIDO' />)} label={(props) => <InternalPieLabel {...props} />} />
                            </GraphicContainer>
                            <div className="flex px-2 max-h-full justify-end items-center">
                                <div className="hidden lg:flex lg:flex-col overflow-auto">
                                    <DescriptionGraphic data={topSales} dataKey="VENDEDOR" />
                                </div>
                            </div>
                        </div>
                    </Container>
                    <Card
                        title="Meta"
                        lastDay={lastDay}
                        month={date.start.month}
                        dataInformation={[{ icon: <FaHotel className="text-sm" />, label: `Loja ${getEmpName(emp)}`, highlight: false }, { icon: <FaClockRotateLeft className="text-sm" />, label: `Agora atrás`, highlight: false }]}
                    />
                </div>
                <div className="lg:w-2/3 flex-col">
                    <Container>
                        <h2 className="font-bold p-3">Top Clientes</h2>
                        <GraphicContainer loading={false} children={<BarChart data={topClients} dataKey='VALOR_LIQUIDO' dataKeyXAxis='NOME_CLIENTE' displayXAxis={true} displayCartesianGrid={true} palette={highLightColor} displayToolTip={true} ToolTipComponent={(props) => (<CustomTooltip {...props} dataKey='NOME_CLIENTE' />)} />} />
                    </Container>
                </div>
            </div>
        </>
    )
}