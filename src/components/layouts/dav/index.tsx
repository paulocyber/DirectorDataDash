'use client'

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth";

// Dados
import InfoCardFromDav from "@/data/infoCards/davs";
import vibrantPalette from '@/data/pallets/vibrant.json';

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import GraphicContainer from "@/components/ui/sciences/GraphicContainer";
import PieChart from "@/components/ui/sciences/PieChart";
import { Tooltip } from "@/components/ui/sciences/toolTip";
import { ExternalPieLabel } from "@/components/ui/sciences/labelChart/ExternalPieLabel";
import DescriptionGraphic from "@/components/ui/sciences/description";
import BarChart from "@/components/ui/sciences/BarChart";

// Utils
import { handleCleanFilter, handleDateFilter, handleRefresh } from "@/utils/handlersFilters/davs";

// Atom
import { useAtom } from "jotai";
import { MethodsOfPayments } from "@/atom/MethodsOfPayments";

// Next
import { redirect } from "next/navigation";

// Tipagem
import { ItemsDavData } from "@/types/dav";
import { DateValue, RangeValue } from "@heroui/react";
import { parseDate } from '@internationalized/date';
import { ItemsSalesPerMonth } from "@/types/sales";

interface LayoutDavProps {
  davsData: ItemsDavData[];
  paymentMethodsData: { brand: string, value: number }[];
  salesPerMonthData: ItemsSalesPerMonth[];
  today: string;
}

export default function LayoutDav({ davsData, paymentMethodsData, salesPerMonthData, today }: LayoutDavProps) {
  const [davs, setDavs] = useState(davsData);
  const [paymentMethods, setPaymentMethods] = useState(paymentMethodsData);
  const [salesPerMonth, setSalesPerMonth] = useState<ItemsSalesPerMonth[]>(salesPerMonthData)
  const [methods, setMethods] = useAtom(MethodsOfPayments)
  const [loading, setLoading] = useState<boolean>(false)
  const [date, setDate] = useState<RangeValue<DateValue>>({
    start: parseDate(new Date(today).toISOString().split('T')[0]),
    end: parseDate(new Date(today).toISOString().split('T')[0]),
  });

  const { token } = useContext(AuthContext)
  const infoCard = InfoCardFromDav({ davs })

  function handleSelectingPayments(payments: string) {
    setMethods([payments])

    redirect(`/davs/table?${payments}`)
  }

  return (
    <>
      <InfoCard data={infoCard} />
      <Container>
        <ToolBar
          title="Resumo das Vendas"
          dateRange={date}
          handleRefreshClick={() => handleRefresh({ date, token, setDavs, setSalesPerMonth, setPaymentMethods, setLoading })}
          handleCleanFilter={() => handleCleanFilter({ token, setDate, setDavs, setPaymentMethods, setSalesPerMonth, setLoading })}
          handleDateRangePicker={(newDate: RangeValue<DateValue> | null) => handleDateFilter({ token, date: newDate, setDate, setDavs, setPaymentMethods, setSalesPerMonth, setLoading })}
          href="/davs/table"
          descriptionHref="Visualizar em Table"
        />
        <div className="flex p-2 overflow-auto border-t rounded-lg">
          <DescriptionGraphic
            data={paymentMethodsData}
            handleSelection={handleSelectingPayments}
            dataKey="brand"
          />
        </div>
      </Container>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        <div className="w-full">
          <Container>
            <h1 className="font-semibold text-xl p-3 text-gray-800">Formas de Pagamento</h1>
            <GraphicContainer loading={loading}>
              <PieChart
                data={paymentMethods}
                dataKey="value"
                displayToolTip={true}
                ToolTipComponent={(props) => (
                  <Tooltip {...props} dataKey={'brand'} valueKey="value" />
                )}
                label={(props) => (
                  <ExternalPieLabel {...props} data={paymentMethods} />
                )}
              />
            </GraphicContainer>
          </Container>
        </div>

        <div className="w-full">
          <Container>
            <h1 className="font-semibold text-xl p-3 text-gray-800">Evolução das vendas por mês</h1>
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
                  <Tooltip {...props} dataKey={'MES_ANO'} valueKey="VALOR_LIQUIDO_SDS" />
                )}
              />
            </GraphicContainer>
          </Container>
        </div>
      </div>
    </>
  );
}
