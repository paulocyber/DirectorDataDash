'use client'

// Componentes
import ToolBar from "@/components/ui/toolbar";
import Container from "@/components/ui/container";
import GraphicContainer from '@/components/ui/sciences/GraphicContainer';
import PieChart from "@/components/ui/sciences/PieChart";
import { Tooltip } from "@/components/ui/sciences/toolTip";
import DescriptionGraphic from "@/components/ui/sciences/description";
import { ExternalPieLabel } from "@/components/ui/sciences/labelChart/ExternalPieLabel";

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth";

// Utils
import { handleRefresh } from "@/utils/handlersFilters/salesByGroup";

// Tipagem
interface LayoutSalesByGroupProps {
    currentSalesData: { brand: string, value: number }[]
    lastSalesData: { brand: string, value: number }[]
}

export default function LayoutSalesByGroup({ currentSalesData, lastSalesData }: LayoutSalesByGroupProps) {
    const [currentSales, setCurrentSalesData] = useState(currentSalesData)
    const [lastSales, setLastSalesData] = useState(currentSalesData)
    const [loading, setLoading] = useState<boolean>(false)

    const { token } = useContext(AuthContext)

    return (
        <div className="w-full flex flex-col">
            <Container>
                <ToolBar
                    title="Estoque por grupos"
                    handleRefreshClick={() => handleRefresh({ token, setLoading, setCurrentSalesData, setLastSalesData })}
                    handleCleanFilter={() => handleRefresh({ token, setLoading, setCurrentSalesData, setLastSalesData })}
                />
            </Container>
            <div className="w-full lg:flex ">
                <div className="w-full">
                    <Container>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Mês Atual</h2>
                            <GraphicContainer loading={loading}>
                                <div className="flex-col flex items-center justify-center w-[102px] overflow-auto">
                                    <DescriptionGraphic data={lastSalesData} dataKey="brand" />
                                </div>
                                <PieChart
                                    data={currentSales}
                                    dataKey="value"
                                    displayToolTip={true}
                                    ToolTipComponent={(props) => (
                                        <Tooltip {...props} dataKey='brand' valueKey="value" />
                                    )}
                                    label={(props) => (
                                        <ExternalPieLabel {...props} data={currentSales} />
                                    )}
                                />
                            </GraphicContainer>
                        </div>
                    </Container>
                </div>

                <div className="w-full">
                    <Container>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Mês Passado</h2>
                            <GraphicContainer loading={loading}>
                                <div className="flex-col flex items-center justify-center w-[102px] overflow-auto">
                                    <DescriptionGraphic data={lastSales} dataKey="brand" />
                                </div>
                                <PieChart
                                    data={lastSales}
                                    dataKey="value"
                                    displayToolTip={true}
                                    ToolTipComponent={(props) => (
                                        <Tooltip {...props} dataKey='brand' valueKey="value" />
                                    )}
                                    label={(props) => (
                                        <ExternalPieLabel {...props} data={lastSales} />
                                    )}
                                />
                            </GraphicContainer>
                        </div>
                    </Container>
                </div>
            </div>
        </div >
    )
}