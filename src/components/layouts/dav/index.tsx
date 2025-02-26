'use client'

// Next
import { useRouter } from "next/navigation";

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth";

// Dados
import InfoCardFromDav from "@/data/infoCards/davs";
import columns from "@/data/columns/dav/columns.json"

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolbar";
import Table from "@/components/ui/table";
import { renderCell } from "@/components/cells/davs";
import GraphicContainer from "@/components/ui/sciences/GraphicContainer";
import PieChart from "@/components/ui/sciences/PieChart";
import { Tooltip } from "@/components/ui/sciences/toolTip";
import { ExternalPieLabel } from "@/components/ui/sciences/labelChart/ExternalPieLabel";
import DescriptionGraphic from "@/components/ui/sciences/description";

// Utils
import { handleCleanFilter, handleDateFilter, handleRefresh } from "@/utils/handlersFilters/davs";

// Tipagem
import { ItemsDavData } from "@/types/dav";
import { DateValue, RangeValue } from "@nextui-org/react";
import { parseDate } from '@internationalized/date';
import BarChart from "@/components/ui/sciences/BarChart";
import vibrantPalette from '@/data/pallets/vibrant.json';

interface LayoutDavProps {
  paymentMethodsData: { brand: string, value: number }[];
  topSellersByDebitPixData: ItemsDavData[];
  davsData: ItemsDavData[];
  today: string;
}

export default function LayoutDav({ davsData, paymentMethodsData, topSellersByDebitPixData, today }: LayoutDavProps) {
  const [davs, setDavs] = useState(davsData);
  const [paymentMethods, setPaymentMethods] = useState(paymentMethodsData);
  const [loading, setLoading] = useState<boolean>(false)
  const [date, setDate] = useState<RangeValue<DateValue>>({
    start: parseDate(new Date(today).toISOString().split('T')[0]),
    end: parseDate(new Date(today).toISOString().split('T')[0]),
  });

  const { token } = useContext(AuthContext)
  const router = useRouter()
  const infoCard = InfoCardFromDav({ davs })

  const handleDetailDav = (ID_ORIGEM: string) => {
    router.push(`/davs/${ID_ORIGEM}`)
  }

  return (
    <>
      <InfoCard data={infoCard} />
      <Container>
        <ToolBar
          title="Resumo das Vendas"
          dateRange={date}
          handleRefreshClick={() => handleRefresh({ date, token, setDavs, setPaymentMethods, setLoading })}
          handleCleanFilter={() => handleCleanFilter({ token, setDate, setDavs, setPaymentMethods, setLoading })}
          handleDateRangePicker={(newDate: RangeValue<DateValue> | null) => handleDateFilter({ token, date: newDate, setDate, setDavs, setPaymentMethods, setLoading })}
        />
        <div className="flex p-2 overflow-auto border-t rounded-lg">
          <DescriptionGraphic
            data={paymentMethodsData}
            dataKey="brand"
          />
        </div>
        {/* <Table data={davs} columns={columns} renderCell={renderCell} loading={loading} detail={handleDetailDav} /> */}
      </Container>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        <div className="w-full">
          <Container>
            <h1 className="font-bold text-xl p-2 text-gray-800">Formas de Pagamento</h1>
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
            <h1 className="font-bold text-xl p-2 text-gray-800">Melhores Vendedores nas Formas de Pagamento mais Rentáveis</h1>
            <GraphicContainer loading={loading}>
              <BarChart
                data={topSellersByDebitPixData}
                displayCartesianGrid={true}
                dataKey="VALOR_TOTAL_VENDAS"
                palette={vibrantPalette}
                displayToolTip={true}
                ToolTipComponent={(props) => (
                  <Tooltip {...props} dataKey={'VENDEDOR'} />
                )}
              />
            </GraphicContainer>
          </Container>
        </div>
      </div>
    </>
  );
}
