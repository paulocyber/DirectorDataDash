// React
import { useState } from "react";

// NextUI
import { Autocomplete, AutocompleteItem, DateValue, RangeValue } from "@nextui-org/react";

// Components
import Container from "@/components/ui/container";
import GraphicContainer from "@/components/ui/container/graphic";
import PageLayout from "@/components/ui/layout";
import PieChart from "@/components/ui/sciences/pieChart";
import { CustomLabel } from "@/components/ui/sciences/pieChart/label/billsToPay";
import SalesTooltip from "@/components/ui/sciences/pieChart/toolTip/sales";
import ToolBar from "@/components/ui/toolbar";

// Utils
import { fetchSales } from "@/utils/fetchData/fetchSales";
import getDate from "@/utils/date/currentDate";
import { getSalesPageProps } from "@/utils/server/salesPageProps";

// Types
import { salesData } from "@/utils/types/sales";
import { Sellers } from "@/utils/types/sellers";
import { parseDate } from '@internationalized/date';

export default function SalesPage({ salesData, sellersData }: { salesData: salesData[], sellersData: Sellers[] }) {
    const [sales, setSales] = useState<salesData[]>(salesData);
    const [sellers, setSellers] = useState(sellersData);
    const [selectSeller, setSelectSeller] = useState<string>('')
    const [emp, setEmp] = useState('1');
    const [loading, setLoading] = useState<boolean>(false);

    const { year, month, today } = getDate();
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
        end: parseDate(new Date(today).toISOString().split('T')[0]),
    });

    const handleRefresh = async () => {
        await fetchSales({
            dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
            dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
            emp,
            sellers: selectSeller,
            setLoading,
            setSales
        });
    };

    const handleDateRangePicker = async (newDate: RangeValue<DateValue>) => {
        setDate(newDate);
        await fetchSales({
            dateInit: `${newDate.start.year}/${newDate.start.month}/${newDate.start.day}`,
            dateEnd: `${newDate.end.year}/${newDate.end.month}/${newDate.end.day}`,
            emp,
            sellers: selectSeller,
            setLoading,
            setSales
        });
    };

    const handleCleanFilter = async () => {
        const initialDate = {
            start: parseDate(new Date(`${year}/${month}/01`).toISOString().split('T')[0]),
            end: parseDate(new Date(today).toISOString().split('T')[0])
        };
        setDate(initialDate);
        setSelectSeller('')
        await fetchSales({
            dateInit: `${year}/${month}/01`,
            dateEnd: today,
            emp,
            setLoading,
            setSales
        });
    };

    const handleFilters = async (key: React.Key | null) => {
        setSelectSeller(key as string);

        await fetchSales({
            dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
            dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
            setLoading,
            setSales,
            emp,
            sellers: key ? key.toString() : ''
        });
    };

    return (
        <PageLayout description="Vendas e Metas">
            <Container>
                <ToolBar
                    title="Vendas e Metas"
                    handleRefreshClick={handleRefresh}
                    displayCalendar={true}
                    dateRange={date}
                    handleDateRangePicker={handleDateRangePicker}
                    handleCleanFilter={handleCleanFilter}
                    displayEmp={true}
                    setEmp={setEmp}
                    emp={emp}
                >
                    <div className="w-full sm:flex ">
                        <div className="mr-auto md:mr-4 md:mt-0 mt-2 md:w-56 small-screen:w-full">
                            <Autocomplete
                                aria-label="Filtro de vendedores"
                                placeholder="Selecione o vendedor"
                                size="sm"
                                value={selectSeller}
                                onSelectionChange={handleFilters}
                                variant="bordered"
                                defaultItems={sellers}
                                className="max-w-xs"
                                allowsCustomValue={true}
                            >
                                {(seller) => (
                                    <AutocompleteItem key={seller.ID_FNC}>
                                        {seller.APELIDO_PSS}
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>
                        </div>
                    </div>
                </ToolBar>
                <GraphicContainer loading={loading}>
                    <PieChart
                        data={sales}
                        dataKey="value"
                        displayToolTip={true}
                        ToolTipComponent={SalesTooltip}
                        label={(props) => <CustomLabel {...props} data={sales} />}
                    />
                </GraphicContainer>
            </Container>
        </PageLayout>
    );
}

export const getServerSideProps = getSalesPageProps;