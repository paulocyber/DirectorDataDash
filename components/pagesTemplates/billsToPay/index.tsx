"use client";

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Dados
import BilletsInfoCard from "@/data/dataCards/billsToPay";
import vibrantPalette from "@/data/pallets/vibrant.json";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolBar";
import DescriptionGraphic from "@/components/ui/sciences/description";
import PieChartComponent from "@/components/ui/sciences/pieChart";
import { ExternalPieLabel } from "@/components/ui/sciences/label";
import GraphicContainer from "@/components/ui/sciences/container";
import { Tooltip } from "@/components/ui/sciences/toolTip";
import BarChart from "@/components/ui/sciences/barChart";

// Utils
import {
  FilterSelecting,
  HandleSelectionFilters,
} from "@/utils/filters/selection";
import {
  handleCleanFilter,
  handleDateFilter,
  handleRefresh,
} from "@/utils/filters/handleFilters/billsToPay";

// Tipagem
import { ItemsBillsToPay } from "@/types/billsToPay";
import { DateValue, RangeValue } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { ItemsFilterSelecting } from "@/types/filters/selecting";
interface LayouBillsToPayProps {
  allBilletsData: ItemsBillsToPay[];
  openBilletsData: ItemsBillsToPay[];
  paidBilletsData: ItemsBillsToPay[];
  overdueBilletData: ItemsBillsToPay[];
  year: number;
  month: number;
}

export default function LayoutBillsToPay({
  allBilletsData,
  openBilletsData,
  paidBilletsData,
  overdueBilletData,
  year,
  month,
}: LayouBillsToPayProps) {
  const [allBillets, setAllBillets] = useState(allBilletsData);
  const [openBillets, setOpenBillets] = useState(openBilletsData);
  const [paidBillets, setPaidBillets] = useState(paidBilletsData);
  const [overdueBillets, setOverdueBillets] = useState(overdueBilletData);
  const [selectingCostsCenters, setSelectingCostsCenters] = useState<
    ItemsFilterSelecting[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [, setClear] = useState<boolean>(false);
  const [date, setDate] = useState<RangeValue<DateValue>>({
    start: parseDate(
      new Date(`${year}/${month}/01`).toISOString().split("T")[0]
    ),
    end: parseDate(new Date().toISOString().split("T")[0]),
  });

  const infoCard = BilletsInfoCard({
    openBillets,
    overdueBillets,
    paidBillets,
    costCenterFilter: selectingCostsCenters,
  });
  const handleCostsCentersFilter = HandleSelectionFilters({
    selections: selectingCostsCenters,
    setSelections: setSelectingCostsCenters,
  });

  const { token } = useContext(AuthContext);
  const { selectGroup: costsCenters } = FilterSelecting({
    data: allBillets,
    primaryKey: "CENTRO_CUSTO",
    secondaryKey: "VALOR_PGM",
    extraKey: "NOME_PSS",
    showExtraKey: true,
    sortDescending: true,
    limit: 10,
  });
  const { selectGroup } = FilterSelecting({
    data: allBillets,
    primaryKey: "CENTRO_CUSTO",
    secondaryKey: "VALOR_PGM",
    extraKey: "NOME_PSS",
    showExtraKey: true,
    sortDescending: true,
    filter: selectingCostsCenters,
    limit: 10,
  });

  return (
    <main className="w-full">
      <InfoCard data={infoCard} />
      <section className="py-8">
        <Container>
          <ToolBar
            title="Resumo do Contas a Pagar"
            handleRefreshClick={() =>
              handleRefresh({
                token,
                date,
                clear: true,
                setLoading,
                setAllBillets,
                setOpenBillets,
                setPaidBillets,
                setOverdueBillets,
              })
            }
            handleDateRangePicker={(newDate: RangeValue<DateValue> | null) =>
              handleDateFilter({
                token,
                date: newDate,
                clear: false,
                setLoading,
                setDate,
                setAllBillets,
                setOpenBillets,
                setPaidBillets,
                setOverdueBillets,
              })
            }
            handleCleanFilter={() =>
              handleCleanFilter({
                token,
                date,
                setLoading,
                setClear,
                setDate,
                setAllBillets,
                setOpenBillets,
                setOverdueBillets,
                setPaidBillets,
                setCostsCenters: setSelectingCostsCenters,
              })
            }
            descriptionHref="Visualizar em Tabela"
            href="/billstopay/table"
            dateRange={date}
          />
          <div className="flex p-2 w-full items-center overflow-auto border-t rounded-2xl">
            <DescriptionGraphic
              data={costsCenters}
              dataKey="description"
              valueKey="value"
              handleSelection={handleCostsCentersFilter}
            />
          </div>
        </Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          <div className="w-full">
            <Container>
              <GraphicContainer loading={loading}>
                <PieChartComponent
                  data={selectGroup}
                  dataKey="value"
                  displayToolTip={true}
                  ToolTipComponent={(props) => (
                    <Tooltip {...props} dataKey="groupedDescription" />
                  )}
                  label={(props) => (
                    <ExternalPieLabel {...props} data={selectGroup} />
                  )}
                />
              </GraphicContainer>
            </Container>
          </div>

          <div className="w-full">
            <Container>
              <GraphicContainer loading={loading}>
                <BarChart
                  data={selectGroup}
                  displayCartesianGrid={true}
                  dataKey="value"
                  palette={vibrantPalette}
                  displayToolTip={true}
                  ToolTipComponent={(props) => (
                    <Tooltip {...props} dataKey="groupedDescription" />
                  )}
                />
              </GraphicContainer>
            </Container>
          </div>
        </div>
      </section>
    </main>
  );
}
