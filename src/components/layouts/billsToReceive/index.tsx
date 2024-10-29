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
    const { year, month, yesterday } = getDate()
    const handleRefresh = async () => {
        await fetchBillsToReceive({
            token,
            dateInit: `${year}/${month}/${yesterday}`,
            dateEnd: `${year}/${month}/${yesterday}`,
            setBillsToReceive,
            setInfoCard,
            setLoading
        })
    }
    const filteredBillsToReceive = billsToReceive.filter(bill => bill.value > 0);
    return (
        <>
            <InfoCard data={infoCard} />
            <Container>
                <ToolBar title="Contas a receber" handleRefreshClick={handleRefresh} />
                <GraphicContainer loading={false}>
                    <CustomActiveShapePieChart
                        data={filteredBillsToReceive}
                        valueKey="value"
                        displayToolTip={true}
                        ToolTipComponent={(props) => (<CustomTooltip {...props}
                            dataKey="name" valueKey="value" />)}
                        label={(props) => <InternalPieLabel {...props} />}
                    />
                </GraphicContainer>
            </Container>
        </>
    )
}