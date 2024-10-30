'use client'

// React
import { ReactNode, useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import GraphicContainer from "@/components/ui/sciences/graphics/GraphicContainer";
import { CustomActiveShapePieChart } from "@/components/ui/sciences/graphics/PieChart/CustomActiveShapePieChart";
import { CustomTooltip } from "@/components/ui/sciences/toolTip";
import { InternalPieLabel } from "@/components/ui/sciences/label";
import DescriptionGraphic from "@/components/ui/sciences/description";

// Utils
import { fetchBillsToReceive } from "@/utils/data/fetchData/refresh/fetchBillsToReceive";
import getDate from "@/utils/date/currentDate";

// Tipagem
interface UiBillsToReceiveProps {
    infoCardData: { icon: ReactNode; title: string; value: string }[];
    billsToReceiveData: { name: string; value: number }[];
}

export default function UiBillsToReceive({ infoCardData, billsToReceiveData }: UiBillsToReceiveProps) {
    const [billsToReceive, setBillsToReceive] = useState(billsToReceiveData)
    const [infoCard, setInfoCard] = useState(infoCardData)
    const [loading, setLoading] = useState<boolean>(false)

    const { token } = useContext(AuthContext)
    const { year, month, yesterday, today } = getDate()
    const handleRefresh = async () => {
        await fetchBillsToReceive({
            token,
            dateInit: `${year}/${month}/${yesterday}`,
            dateEnd: today,
            setBillsToReceive,
            setInfoCard,
            setLoading
        })
    }
    const handleClearFilter = async () => {
        await fetchBillsToReceive({
            token,
            dateInit: `${year}/${month}/${yesterday}`,
            dateEnd: today,
            setBillsToReceive,
            setInfoCard,
            setLoading
        })
    }

    return (
        <>
            <InfoCard data={infoCard} />
            <Container>
                <ToolBar title="Contas a receber" handleRefreshClick={handleRefresh} handleCleanFilter={handleClearFilter} />
                <main className="w-full flex items-center justify-center">
                    <div className="flex w-1/2">
                        <GraphicContainer loading={loading}>
                            <CustomActiveShapePieChart
                                data={billsToReceive}
                                valueKey="value"
                                displayToolTip={true}
                                ToolTipComponent={(props) => (<CustomTooltip {...props}
                                    dataKey="name" valueKey="value" />)}
                                label={(props) => <InternalPieLabel {...props} />}
                            />
                        </GraphicContainer>
                        <div className="flex max-h-full justify-end items-center">
                            <div className="hidden w-full lg:flex lg:flex-col overflow-auto">
                                <DescriptionGraphic data={billsToReceive} dataKey="name" />
                            </div>
                        </div>
                    </div>
                </main>
            </Container>
        </>
    )
}