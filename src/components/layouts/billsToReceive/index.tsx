'use client'

// React
import { ReactNode } from "react";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import GraphicContainer from "@/components/ui/sciences/graphics/GraphicContainer";
import { CustomActiveShapePieChart } from "@/components/ui/sciences/graphics/PieChart/CustomActiveShapePieChart";

// Tipagem
import { BillsToReceiveData } from "@/types/billsToReceive";

interface UiBillsToReceiveProps {
    infoCard: { icon: ReactNode; title: string; value: string }[];
    billsToReceiveData: { name: string; value: number }[];
}

export default function UiBillsToReceive({ infoCard, billsToReceiveData }: UiBillsToReceiveProps) {

    return (
        <>
            <InfoCard data={infoCard} />
            <Container>
                <ToolBar title="Contas a receber" handleRefreshClick={() => console.log("Ativou")} />
                <GraphicContainer loading={false}>
                    <CustomActiveShapePieChart data={billsToReceiveData} valueKey="value" displayToolTip />
                </GraphicContainer>
            </Container>
        </>
    )
}