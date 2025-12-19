"use client";

// React
import { useContext, useState } from "react";

// Dados
import TaxBillingInfoCard from "@/data/dataCards/taxBiling";

// Componentes
import InfoCard from "@/components/ui/InfoCard";
import ToolBar from "@/components/ui/toolBar";
import Container from "@/components/ui/container";
import DescriptionGraphic from "@/components/ui/sciences/description";
import GraphicContainer from "@/components/ui/sciences/container";
import { Tooltip } from "@/components/ui/sciences/toolTip";
import BarChart from "@/components/ui/sciences/barChart";

// Dados
import vibrantPalette from "@/data/pallets/vibrant.json";

// Utils
import {
  handleCleanFilter,
  handleRefresh,
  handleDateFilter,
} from "@/utils/filters/handleFilters/taxBiling";

// Tipagem
import { ItemsTaxInvoicing } from "@/types/TaxBiling";
import { RangeValue } from "@react-types/shared";
import { DateValue } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { AuthContext } from "@/providers/auth";
interface TaxBilingProps {
  billingByCompanyData: ItemsTaxInvoicing[];
  dateInit: string;
}

export default function LayoutTaxBiling({
  billingByCompanyData,
  dateInit,
}: TaxBilingProps) {
  const [billingByCompany, setBillingByCompany] =
    useState(billingByCompanyData);
  const [loading, setLoading] = useState<boolean>(false);
  // const [date, setDate] = useState<RangeValue<DateValue>>({
  //   start: parseDate(new Date(`${dateInit}`).toISOString().split("T")[0]),
  //   end: parseDate(new Date().toISOString().split("T")[0]),
  // });

  const infoCard = TaxBillingInfoCard({
    billingByCompanyData: billingByCompany,
  });

  const { token } = useContext(AuthContext);

  return (
    <main className="w-full">
      <InfoCard data={infoCard} />
      <Container>
        <ToolBar
          title="Faturamento"
          handleRefreshClick={
            () => console.log("ativou")
            // handleRefresh({ token, date, setLoading, setBillingByCompany })
          }
          // handleCleanFilter={() =>
          //   handleCleanFilter({
          //     token,
          //     // date,
          //     setLoading,
          //     // setDate,
          //     setBillingByCompany,
          //   })
          // }
          // handleDateRangePicker={(newDate: RangeValue<DateValue> | null) =>
          //   handleDateFilter({
          //     token,
          //     date: newDate,
          //     setLoading,
          //     setDate,
          //     setBillingByCompany,
          //   })
          // }
          // dateRange={date}
        />
        <div className="flex p-2 w-full items-center overflow-auto border-t rounded-2xl">
          <DescriptionGraphic
            data={billingByCompany}
            dataKey="EMPRESA"
            valueKey="value"
          />
        </div>
      </Container>

      <Container>
        <div className="w-full">
          <GraphicContainer loading={loading}>
            <BarChart
              data={billingByCompany}
              displayCartesianGrid={true}
              dataKey="value"
              palette={vibrantPalette}
              displayToolTip={true}
              LabelListProps={true}
              ToolTipComponent={(props) => (
                <Tooltip {...props} dataKey="EMPRESA" valueKey="value" />
              )}
            />
          </GraphicContainer>
        </div>
      </Container>
    </main>
  );
}
