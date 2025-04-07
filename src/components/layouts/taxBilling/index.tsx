'use client'

// React
import { useContext, useState } from "react"
import { AuthContext } from "@/contexts/auth";

// Componentes
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import InfoCard from "@/components/ui/InfoCard";
import GraphicContainer from "@/components/ui/sciences/GraphicContainer";
import BarChart from "@/components/ui/sciences/BarChart";
import { Tooltip } from "@/components/ui/sciences/toolTip";
import DescriptionGraphic from "@/components/ui/sciences/description";

// Data
import InfoCardFromTax from "@/data/infoCards/taxBilling";
import vibrantPalette from '@/data/pallets/vibrant.json';

// Utils
import { handleRefresh, handleDateFilter, handleCleanFilter } from "@/utils/handlersFilters/taxBiling";

// Tipagem
import { ItemsTaxInvoicing } from "@/types/tax"
import { RangeValue } from "@heroui/react";
import { DateValue, parseDate } from "@internationalized/date";
interface TaxtBillingProsp {
    taxInvoicingData: ItemsTaxInvoicing[];
    dateInit: string;
    dateEnd: string;
}

export default function LayoutTaxBilling({ taxInvoicingData, dateInit, dateEnd }: TaxtBillingProsp) {
    const [taxInvoicing, setTaxInvoicing] = useState(taxInvoicingData)
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${dateInit}`).toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    })

    const inforCard = InfoCardFromTax({ taxInvoicing })

    const { token } = useContext(AuthContext)

    return (
        <div className="flex flex-col">
            <InfoCard data={inforCard} />
            <Container>
                <ToolBar
                    title="Faturamento"
                    handleRefreshClick={() => handleRefresh({ date, token, setLoading, setTaxInvoicing })}
                    handleCleanFilter={() => handleCleanFilter({ token, setLoading, setDate, setTaxInvoicing })}
                    handleDateRangePicker={(newDate: RangeValue<DateValue> | null) => handleDateFilter({ date: newDate, token, setLoading, setDate, setTaxInvoicing })}
                    dateRange={date}
                />
                <div className="flex p-2 overflow-auto border-t rounded-lg">
                    <DescriptionGraphic
                        data={taxInvoicing}
                        dataKey="brand"
                    />
                </div>
            </Container>

            <Container>
                <div className="w-full">
                    <GraphicContainer loading={loading}>
                        <BarChart
                            data={taxInvoicing}
                            displayCartesianGrid={true}
                            dataKey="value"
                            palette={vibrantPalette}
                            displayToolTip={true}
                            LabelListProps={true}
                            ToolTipComponent={(props) => (
                                <Tooltip {...props} dataKey='brand' valueKey="value" />
                            )}
                        />
                    </GraphicContainer>
                </div>
            </Container>
        </div>
    )
}