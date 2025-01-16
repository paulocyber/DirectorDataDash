'use client'

// Componentes
import InfoCard from "@/components/ui/InfoCard"
import Container from "@/components/ui/container"
import ToolBar from "@/components/ui/toolBar"
import { Button } from "@/components/ui/button"
import GraphicContainer from "@/components/ui/Sciences/GraphicContainer"
import { Tooltip } from "@/components/ui/Sciences/ToolTip"
import { CustomActiveShapePieChart } from "@/components/ui/Sciences/PieChart/activeShapePieChart"
import { InternalPieLabel } from "@/components/ui/Sciences/labelChart/InternalPieLabel"
import DescriptionGraphic from "@/components/ui/Sciences/description"
import BarChart from "@/components/ui/Sciences/BarChart"
import { ContainerModal } from "@/components/containersModal/billsToReceive"
import Modal from "@/components/ui/modal"

// Dados
import InFoCardFromBillsToReceive from "@/data/infoCards/billsToReceive"
import vibrantPalette from '@/data/pallets/vibrant.json';

// React
import { useContext, useState } from "react"
import { AuthContext } from "@/contexts/auth"

// Utils
import { handleCleanFilter, handleDateFilter, handleRefresh } from "@/utils/handlersFilters/billsToReceive"

// Tipagem
import { ItemsBillsToReceiveData } from "@/types/billsToReceive"
import { DateValue, RangeValue, useDisclosure } from "@nextui-org/react"
import { parseDate } from '@internationalized/date';

interface LayoutBillsToReceiveProps {
    allBillsData: ItemsBillsToReceiveData[];
    topClientsLateData: ItemsBillsToReceiveData[];
    summaryBilletData: ItemsBillsToReceiveData[];
    summaryReceiveReleaseData: ItemsBillsToReceiveData[];
    summaryOfReceivableData: { name: string; value: number }[];
    today: string;
}

export default function LayoutBillsToReceive({ allBillsData, topClientsLateData, summaryBilletData, summaryReceiveReleaseData, summaryOfReceivableData, today }: LayoutBillsToReceiveProps) {
    const [billsToReceive, setBillsToReceive] = useState(allBillsData);
    const [summaryOfReceivable, setSummaryOfReceivableData] = useState(summaryOfReceivableData)
    const [overdueClients, setOverdueClients] = useState(topClientsLateData);
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`2023/01/01`).toISOString().split('T')[0]),
        end: parseDate(new Date(`${today}`).toISOString().split('T')[0]),
    })

    const infoCard = InFoCardFromBillsToReceive({ allBillsData: billsToReceive })

    const { token } = useContext(AuthContext)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <div className="flex flex-col">
            <Modal
                title="Contas a receber (Resumo)"
                isopen={isOpen}
                onOpenChange={onOpenChange}
                displayFooter={false}
            >
                <ContainerModal summaryBilletData={summaryBilletData} summaryReceiveReleaseData={summaryReceiveReleaseData} />
            </Modal>
            <InfoCard data={infoCard} />
            <Container>
                <ToolBar
                    title="Contas a receber"
                    descriptionHref="Visualizar em tabela"
                    href="/billstoreceive/table"
                    handleRefreshClick={() => handleRefresh({ date, token, setLoading, setBillsToReceive, setSummaryOfReceivableData, setOverdueClients })}
                    handleCleanFilter={() => handleCleanFilter({ token, setDate, setLoading, setBillsToReceive, setSummaryOfReceivableData, setOverdueClients })}
                    handleDateRangePicker={(newDate: RangeValue<DateValue> | null) => handleDateFilter({ date: newDate, token, setDate, setLoading, setBillsToReceive, setSummaryOfReceivableData, setOverdueClients })}
                    dateRange={date}
                />
            </Container>

            <div className="flex flex-col lg:flex-row w-full">
                <main className="lg:w-1/3 w-full">
                    <Container>
                        <div className="w-full flex justify-between">
                            <h1 className="font-semibold py-2 px-4 text-sm md:text-lg">Recebimentos </h1>
                            <div className="py-2 px-4">
                                <Button color="primary" onClick={() => onOpen()} >Resumo</Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-center">
                            <GraphicContainer loading={loading}>
                                <CustomActiveShapePieChart
                                    data={summaryOfReceivable}
                                    valueKey="value"
                                    displayToolTip={true}
                                    ToolTipComponent={(props) => (
                                        <Tooltip {...props} dataKey="name" valueKey="value" />
                                    )}
                                    label={(props) => <InternalPieLabel {...props} />}
                                />
                            </GraphicContainer>
                            <div className="flex max-h-full justify-end items-center">
                                <div className="hidden lg:flex lg:flex-col overflow-auto w-full">
                                    <DescriptionGraphic data={summaryOfReceivable} dataKey="name" />
                                </div>
                            </div>
                        </div>
                    </Container>
                </main>

                <main className="lg:w-2/3 w-full mt-4 lg:mt-0">
                    <Container>
                        <h1 className="font-semibold py-2 px-4 text-sm md:text-lg">Top clientes em atraso</h1>
                        <div className="flex items-center justify-center">
                            <GraphicContainer loading={loading}>
                                <BarChart
                                    data={overdueClients}
                                    dataKey="RESTANTE_RCB"
                                    dataKeyXAxis="APELIDO_PSS"
                                    displayXAxis={true}
                                    displayCartesianGrid={true}
                                    palette={vibrantPalette}
                                    displayToolTip={true}
                                    ToolTipComponent={(props) => (
                                        <Tooltip {...props} dataKey="APELIDO_PSS" valueKey="RESTANTE_RCB" />
                                    )}
                                />
                            </GraphicContainer>
                        </div>
                    </Container>
                </main>
            </div>
        </div >
    )
}