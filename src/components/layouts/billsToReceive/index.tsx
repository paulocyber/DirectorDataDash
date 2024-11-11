'use client'

// React
import { ReactNode, useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Nnext - Framework
import { useRouter } from "next/navigation";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import GraphicContainer from "@/components/ui/sciences/graphics/GraphicContainer";
import { CustomActiveShapePieChart } from "@/components/ui/sciences/graphics/PieChart/CustomActiveShapePieChart";
import { CustomTooltip } from "@/components/ui/sciences/toolTip";
import { InternalPieLabel } from "@/components/ui/sciences/label";
import DescriptionGraphic from "@/components/ui/sciences/description";
import BarChart from "@/components/ui/sciences/graphics/BarChart";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

// Dados
import highLightColor from '@/data/palettes/highlightedColor.json';

// Utils
import { fetchBillsToReceive } from "@/utils/data/fetchData/refresh/fetchBillsToReceive";
import { formatCurrency } from './../../../utils/mask/money/index';

// Tipagem
import { DateValue, RangeValue, useDisclosure } from "@nextui-org/react";
import { parseDate } from '@internationalized/date';
import { BillsToReceiveData } from "@/types/billsToReceive";
import { TotalSum } from "@/utils/functionSum";
interface UiBillsToReceiveProps {
    infoCardData: { icon: ReactNode; title: string; value: string }[];
    billsToReceiveData: { name: string; value: number }[];
    clientsLate: BillsToReceiveData[];
    summaryReceive: BillsToReceiveData[];
    year: number;
    month: number;
    yesterday: number;
    today: string;
}

export default function UiBillsToReceive({ infoCardData, billsToReceiveData, clientsLate, summaryReceive, year, month, yesterday, today }: UiBillsToReceiveProps) {
    const [billsToReceive, setBillsToReceive] = useState(billsToReceiveData)
    const [infoCard, setInfoCard] = useState(infoCardData)
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<RangeValue<DateValue>>({
        start: parseDate(new Date(`${year}/${month}/${yesterday}`).toISOString().split('T')[0]),
        end: parseDate(new Date().toISOString().split('T')[0]),
    })

    const router = useRouter();
    const { token } = useContext(AuthContext)
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleRefresh = async () => {
        await fetchBillsToReceive({
            token,
            dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
            dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
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
    const handleDateRangePicker = async (newDate: RangeValue<DateValue>) => {
        setDate(newDate)

        await fetchBillsToReceive({
            token,
            dateInit: `${newDate.start.year}/${newDate.start.month}/${newDate.start.day}`,
            dateEnd: `${newDate.end.year}/${newDate.end.month}/${newDate.end.day}`,
            setBillsToReceive,
            setInfoCard,
            setLoading
        })
    }

    return (
        <>
            <Modal title="Resumo" isOpen={isOpen} onClose={onClose} width="lg" displayFooter={true} footerTitle="Total: " value={formatCurrency(TotalSum(summaryReceive, 'VALOR_PAGO_RCB'))}>
                <div className="items-center  flex-col justify-center flex w-full mb-4 border-collapse border-gray-200 dark:border-white/40">
                    <div className="w-full flex flex-col  h-[220px]">
                        {summaryReceive.map((relatory, index) => (
                            <div key={index} className="w-full items-center justify-between flex p-2 align-middle bg-transparent border-b whitespace-nowrap dark:border-white/40">
                                <div className="flex w-full flex-col">
                                    <h2 className="mb-0 text-base font-semibold dark:text-white dark:opacity-60">Mês/Ano:</h2>
                                    <span className="mb-0 text-sm leading-normal dark:text-white">{relatory.MES_ANO}</span>
                                </div>

                                <div className="flex w-full flex-col">
                                    <h2 className="mb-0 text-base font-semibold dark:text-white dark:opacity-60">Valor:</h2>
                                    <span className="mb-0 text-sm leading-normal dark:text-white">{formatCurrency(Number(relatory.VALOR_PAGO_RCB.replace(",", ".")))}</span>
                                </div>
                                <div className="flex w-1/4 flex-col">
                                    <h2 className="mb-0 text-base font-semibold dark:text-white dark:opacity-60">%:</h2>
                                    <span className="mb-0 text-sm leading-normal dark:text-white">{relatory.PORCENTAGEM} %</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
            <InfoCard data={infoCard} />
            <Container>
                <ToolBar
                    title="Contas a receber"
                    handleRefreshClick={handleRefresh}
                    handleCleanFilter={handleClearFilter}
                    dateRange={date}
                    handleDateRangePicker={handleDateRangePicker}
                    descriptionHref="Visão detalhada"
                    href="/billstoreceive/table"
                />
            </Container>

            <div className="flex flex-col lg:flex-row w-full">
                <main className="lg:w-1/3 w-full">
                    <Container>
                        <div className="w-full flex justify-between">
                            <h1 className="font-semibold py-2 px-4 text-sm md:text-lg">Recebimentos: </h1>
                            <div className="py-2 px-4">
                                <Button color="primary" onClick={() => onOpen()}>Resumo</Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <GraphicContainer loading={loading}>
                                <CustomActiveShapePieChart
                                    data={billsToReceive}
                                    valueKey="value"
                                    displayToolTip={true}
                                    ToolTipComponent={(props) => (
                                        <CustomTooltip {...props} dataKey="name" valueKey="value" />
                                    )}
                                    label={(props) => <InternalPieLabel {...props} />}
                                />
                            </GraphicContainer>
                            <div className="flex max-h-full justify-end items-center">
                                <div className="hidden lg:flex lg:flex-col overflow-auto w-full">
                                    <DescriptionGraphic data={billsToReceive} dataKey="name" />
                                </div>
                            </div>
                        </div>
                    </Container>
                </main>

                <main className="lg:w-2/3 w-full mt-4 lg:mt-0">
                    <Container>
                        <h1 className="font-semibold py-2 px-4 text-sm md:text-lg">Top clientes em atraso:</h1>
                        <div className="flex items-center justify-center">
                            <GraphicContainer loading={loading} >
                                <BarChart
                                    data={clientsLate}
                                    dataKey="RESTANTE_RCB"
                                    dataKeyXAxis="APELIDO_PSS"
                                    displayXAxis={true}
                                    displayCartesianGrid={true}
                                    palette={highLightColor}
                                    displayToolTip={true}
                                    ToolTipComponent={(props) => (
                                        <CustomTooltip {...props} dataKey="APELIDO_PSS" valueKey="RESTANTE_RCB" />
                                    )}
                                />
                            </GraphicContainer>
                        </div>
                    </Container>
                </main>
            </div>
        </>
    )
}