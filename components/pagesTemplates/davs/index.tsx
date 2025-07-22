"use client";

// Dados
import DavInfoCard from "@/data/dataCards/dav";
import vibrantPalette from "@/data/pallets/vibrant.json";

// Utils
import {
  handleCleanFilter,
  handleDateFilter,
  handleRefresh,
} from "@/utils/filters/handleFilters/davs";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolBar";
import DescriptionGraphic from "@/components/ui/sciences/description";
import GraphicContainer from "@/components/ui/sciences/container";
import PieChartComponent from "@/components/ui/sciences/pieChart";
import { Tooltip } from "@/components/ui/sciences/toolTip";
import { ExternalPieLabel } from "@/components/ui/sciences/label";
import BarChart from "@/components/ui/sciences/barChart";

// Next
import { redirect } from "next/navigation";

// Bibliotecas
import { useAtom } from "jotai";
import { MethodsOfPayments } from "@/atom/filters/davs";

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Tipagem
import { ItemsDavData } from "@/types/davs";
import type { DateValue } from "@internationalized/date";
import { parseDate } from "@internationalized/date";
import { RangeValue } from "@react-types/shared";
import { useTopLoader } from "nextjs-toploader";
import { ItemsSalesPerMonth } from "@/types/sales";
interface LayoutDavProps {
  davsData: ItemsDavData[];
  paymentMethodsData: { FORMA_PGMT: string; value: number }[];
  salesPerMonthData: ItemsSalesPerMonth[];
  today: string;
}

export default function LayoutDav({
  davsData,
  paymentMethodsData,
  salesPerMonthData,
  today,
}: LayoutDavProps) {
  const [davs, setDavs] = useState(davsData);
  const [salesByPaymentMethod, setSalesByPaymentMethod] =
    useState(paymentMethodsData);
  const [salesPerMonth, setSalesPerMonth] = useState(salesPerMonthData);
  const [, setMethods] = useAtom(MethodsOfPayments);
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<RangeValue<DateValue>>({
    start: parseDate(new Date(today).toISOString().split("T")[0]),
    end: parseDate(new Date(today).toISOString().split("T")[0]),
  });

  const { token } = useContext(AuthContext);
  const infoCard = DavInfoCard({ davs });
  const loader = useTopLoader();

  function handleSelectingPayments(payments: string) {
    setMethods([payments]);

    loader.start();
    redirect(`/davs/table?${payments}`);
  }

  return (
    <main className="w-full">
      <InfoCard data={infoCard} />
      <section className="py-8">
        <Container>
          <ToolBar
            title="Relatório dav's"
            dateRange={date}
            handleRefreshClick={() =>
              handleRefresh({
                date,
                token,
                setDavs,
                setSalesByPaymentMethod,
                setSalesPerMonth,
                setLoading,
              })
            }
            handleDateRangePicker={(newDate: RangeValue<DateValue> | null) =>
              handleDateFilter({
                token,
                date: newDate,
                setDate,
                setDavs,
                setSalesByPaymentMethod,
                setSalesPerMonth,
                setLoading,
              })
            }
            handleCleanFilter={() =>
              handleCleanFilter({
                token,
                setDate,
                setDavs,
                setSalesByPaymentMethod,
                setSalesPerMonth,
                setLoading,
              })
            }
            href="/davs/table"
            descriptionHref="Visualizar em Table"
          />
          <div className="flex p-2 w-full items-center overflow-auto border-t rounded-2xl">
            <DescriptionGraphic
              data={salesByPaymentMethod}
              dataKey="FORMA_PGMT"
              handleSelection={handleSelectingPayments}
            />
          </div>
        </Container>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          <div className="w-full">
            <Container>
              <h1 className="font-extrabold text-xl p-3 text-gray-900">
                Formas de Pagamento
              </h1>
              <GraphicContainer loading={loading}>
                <PieChartComponent
                  data={salesByPaymentMethod}
                  dataKey="value"
                  displayToolTip={true}
                  ToolTipComponent={(props) => (
                    <Tooltip
                      {...props}
                      dataKey={"FORMA_PGMT"}
                      valueKey="value"
                    />
                  )}
                  label={(props) => (
                    <ExternalPieLabel {...props} data={salesByPaymentMethod} />
                  )}
                />
              </GraphicContainer>
            </Container>
          </div>

          <div className="w-full">
            <Container>
              <h1 className="font-extrabold text-xl p-3 text-gray-900">
                Evolução das vendas por mês
              </h1>
              <GraphicContainer loading={loading}>
                <BarChart
                  data={salesPerMonth}
                  displayCartesianGrid={true}
                  dataKey="VALOR_LIQUIDO_SDS"
                  displayXAxis={true}
                  dataKeyXAxis="MES_ANO"
                  palette={vibrantPalette}
                  displayToolTip={true}
                  ToolTipComponent={(props) => (
                    <Tooltip
                      {...props}
                      dataKey={"MES_ANO"}
                      valueKey="VALOR_LIQUIDO_SDS"
                    />
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
