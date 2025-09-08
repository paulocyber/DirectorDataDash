"use client";

// React
import { useContext, useState } from "react";

// Data
import BilletsInfoCard from "@/data/dataCards/billsToReceive";

// Providers
import { AuthContext } from "@/providers/auth";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolBar";
import { CustomActiveShapePieChart } from "@/components/ui/sciences/shapePieChart";
import { Tooltip } from "@/components/ui/sciences/toolTip";
import { InternalPieLabel } from "@/components/ui/sciences/label";
import GraphicContainer from "@/components/ui/sciences/container";
import DescriptionGraphic from "@/components/ui/sciences/description";
import BarChart from "@/components/ui/sciences/barChart";

// Dados
import vibrantPalette from "@/data/pallets/vibrant.json";

// Utils
import {
  handleDateFilter,
  handleRefresh,
} from "@/utils/filters/handleFilters/billsToReceive";
import { handleCleanFilter } from "@/utils/filters/handleFilters/billsToReceive";

// Tipagem
import { ItemsBillsToReceive } from "@/types/billsToReceive";
import { RangeValue } from "@react-types/shared";
import { DateValue, useDisclosure } from "@heroui/react";
import { parseDate } from "@internationalized/date";
interface LayoutBillsToReceiveProps {
  allBilletsData: ItemsBillsToReceive[];
  topClientsLateData: ItemsBillsToReceive[];
  summaryBilletData: ItemsBillsToReceive[];
  summaryReceiveReleaseData: ItemsBillsToReceive[];
  summaryOfReceivableData: { name: string; value: number }[];
  today: string;
}

export default function LayoutBillsToReceive({
  allBilletsData,
  topClientsLateData,
  summaryBilletData,
  summaryOfReceivableData,
  summaryReceiveReleaseData,
  today,
}: LayoutBillsToReceiveProps) {
  const [billsToReceive, setBillsToReceive] = useState(allBilletsData);
  const [summaryOfReceivable, setSummaryOfReceivableData] = useState(
    summaryOfReceivableData
  );
  const [overdueClients, setOverdueClients] = useState(topClientsLateData);
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<RangeValue<DateValue>>({
    start: parseDate(new Date(`2023/01/01`).toISOString().split("T")[0]),
    end: parseDate(new Date(`${today}`).toISOString().split("T")[0]),
  });

  const infoCard = BilletsInfoCard({ allBilletsData: billsToReceive });

  const { token } = useContext(AuthContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <main className="w-full">
      <InfoCard data={infoCard} />
      <section className="py-8">
        <Container>
          <ToolBar
            title="Resumo do Contas a Pagar"
            descriptionHref="Visualizar em tabela"
            href="/billstoreceive/table"
            handleRefreshClick={() =>
              handleRefresh({
                date,
                token,
                setLoading,
                setBillsToReceive,
                setSummaryOfReceivableData,
                setOverdueClients,
              })
            }
            handleCleanFilter={() =>
              handleCleanFilter({
                token,
                setDate,
                setLoading,
                setBillsToReceive,
                setSummaryOfReceivableData,
                setOverdueClients,
              })
            }
            handleDateRangePicker={(newDate: RangeValue<DateValue> | null) =>
              handleDateFilter({
                date: newDate,
                token,
                setDate,
                setLoading,
                setBillsToReceive,
                setSummaryOfReceivableData,
                setOverdueClients,
              })
            }
            dateRange={date}
          />
        </Container>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          <div className="w-full">
            <Container>
              <div className="w-full flex justify-between">
                <h1 className="font-semibold py-2 px-4 text-sm md:text-lg">
                  Recebimentos{" "}
                </h1>
                <div className="py-2 px-4">
                  {/* <Button color="primary" onClick={() => onOpen()}>
                    Resumo
                  </Button> */}
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
                    <DescriptionGraphic
                      data={summaryOfReceivable}
                      dataKey="name"
                    />
                  </div>
                </div>
              </div>
            </Container>
          </div>

          <div className="w-full">
            <Container>
              <h1 className="font-semibold py-2 px-4 text-sm md:text-lg">
                Clientes em atraso
              </h1>

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
                    // ToolTipComponent={(props) => (
                    //   <Tooltip
                    //     {...props}
                    //     dataKey="APELIDO_PSS"
                    //     valueKey="RESTANTE_RCB"
                    //   />
                    // )}
                  />
                </GraphicContainer>
              </div>
            </Container>
          </div>
        </div>
      </section>
    </main>
  );
}
