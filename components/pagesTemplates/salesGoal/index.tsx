"use client";

// Componentes
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolBar";
import ProgressBar from "@/components/ui/progressBar";
import Card from "@/components/ui/card";
import GraphicContainer from "@/components/ui/sciences/container";
import BarChart from "@/components/ui/sciences/barChart";
import { Tooltip } from "@/components/ui/sciences/toolTip";
import DescriptionGraphic from "@/components/ui/sciences/description";
import Drawer from "@/components/ui/drawer";

// React
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/providers/auth";
import { usePathname } from "next/navigation";

// Bibliotecas
import { FaHotel, FaTable } from "react-icons/fa";
import { FaClockRotateLeft, FaMoneyBillTrendUp } from "react-icons/fa6";
import { useAtom } from "jotai";
import { TiWarning } from "react-icons/ti";

// Utils
import { getMonthName } from "@/utils/mask/date";
import { formatCurrency } from "@/utils/mask/money";
import GetGroupName from "@/utils/mask/companyName";
import {
  handleCleanFilter,
  handleDateFilter,
  handleRefresh,
} from "@/utils/filters/handleFilters/salesGoals";
import SalesPdf from "@/utils/relatorys/pdf/sales";

// Data
import vibrantPalette from "@/data/pallets/vibrant.json";
import DrawerSettingsJson from "@/data/drawerSettings/sales";

// Atom
import { Companies } from "@/atom/filters/company";
import { Tables } from "@/atom/filters/tables";
import { refreshAtom } from "@/atom/isActivateRefresh";

// tipagem
import {
  ItemsCustomerBuyMore,
  ItemsProfitsFromSales,
  ItemsSalesProgress,
  ItemsTopSellers,
} from "@/types/sales";
import {
  addToast,
  DateValue,
  Link,
  RangeValue,
  useDisclosure,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { TypeFilterProps } from "@/types/filters/selecting";
interface LayoutSalesGoalsProps {
  salesProgressData: ItemsSalesProgress[];
  topSellersData?: ItemsTopSellers[];
  customerBuyMoreData?: ItemsCustomerBuyMore[];
  profitsFromSaleData?: ItemsProfitsFromSales[];
  companiesData?: TypeFilterProps[];
  seller?: string;
  valueCommissionData?: number;
  today: string;
  year: number;
  month: number;
}

const getLastDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

export function LayoutSalesGoals({
  salesProgressData,
  topSellersData,
  customerBuyMoreData,
  profitsFromSaleData,
  companiesData,
  seller,
  valueCommissionData,
  year,
  month,
  today,
}: LayoutSalesGoalsProps) {
  const [salesProgress, setSalesProgress] = useState(salesProgressData);
  const [topSellers, setTopSellers] = useState<ItemsTopSellers[]>(
    topSellersData ?? []
  );
  const [customerBuyMore, setCustomerBuyMore] = useState<
    ItemsCustomerBuyMore[]
  >(customerBuyMoreData ?? []);
  const [valueCommission, setValueComission] = useState(valueCommissionData);
  const [profitSales, setProfitSales] = useState(profitsFromSaleData);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectSellers, setSelectSellers] = useState<string>(
    seller ? seller : ""
  );
  const [selectTheCompany, setSelectTheCompany] = useAtom(Companies);
  const [activeRefresh, setActiveRefresh] = useAtom(refreshAtom);
  const [selectTables, setSelectTables] = useAtom(Tables);
  const [date, setDate] = useState<RangeValue<DateValue>>({
    start: parseDate(
      new Date(`${year}/${month}/01`).toISOString().split("T")[0]
    ),
    end: parseDate(new Date(today).toISOString().split("T")[0]),
  });

  const { token } = useContext(AuthContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const routerDrawerSettings = DrawerSettingsJson({
    companiesData,
    selectTables,
    selectTheCompany,
    setSelectTheCompany,
    setSelectTables,
  });
  const currentPath = usePathname();

  useEffect(() => {
    if (activeRefresh) {
      handleRefresh({
        token,
        date,
        id: selectSellers,
        companys: selectTheCompany,
        tables: selectTables,
        setSalesProgress,
        setProfitSales,
        setTopSellers,
        setLoading,
      });
      setActiveRefresh(false);
    }
  }, [activeRefresh]);

  useEffect(() => {
    if (selectTheCompany.length === 0 || selectTables.length === 0) {
      addToast({
        title: "Seleção pendente",
        description: "É preciso marcar empresa e tabela para continuar.",
        color: "warning",
        icon: <TiWarning />,
      });
    }
  }, [selectTheCompany, selectTables]);

  function selectingSellers(id: string) {
    setSelectSellers(id);
    handleRefresh({
      token,
      date,
      companys: selectTheCompany,
      tables: selectTables,
      id,
      setSalesProgress,
      setProfitSales,
      setValueComission,
      setTopSellers,
      setLoading,
    });
  }

  const currentDrawerSettings = routerDrawerSettings[currentPath] || {};

  function generatePdf() {
    SalesPdf({
      dateInit: `${date.start.day}/${date.start.month}/${date.start.year}`,
      dateEnd: `${date.end.day}/${date.end.month}/${date.end.year}`,
      company: GetGroupName(selectTheCompany),
      salesProgressData: salesProgress,
      profitSales: profitSales ? profitSales : [],
    });
  }

  return (
    <>
      <Container>
        <ToolBar
          title={`Metas de ${getMonthName(date.start.month)}`}
          dateRange={date}
          handleFilters={customerBuyMore.length > 0 ? undefined : onOpen}
          handleRefreshClick={() =>
            handleRefresh({
              id: customerBuyMore ? undefined : selectSellers,
              token,
              date,
              companys: selectTheCompany,
              tables: selectTables,
              seller: customerBuyMore ? selectSellers : undefined,
              setSalesProgress,
              setProfitSales:
                topSellers.length > 0 ? setProfitSales : undefined,
              setValueComission,
              setTopSellers: topSellers.length > 0 ? setTopSellers : undefined,
              setLoading,
            })
          }
          handleDateRangePicker={(newDate: RangeValue<DateValue> | null) =>
            handleDateFilter({
              id: customerBuyMore ? undefined : selectSellers,
              token,
              date: newDate,
              companys: selectTheCompany,
              tables: selectTables,
              seller: customerBuyMore ? selectSellers : undefined,
              setSalesProgress,
              setProfitSales:
                topSellers.length > 0 ? setProfitSales : undefined,
              setTopSellers: topSellers.length > 0 ? setTopSellers : undefined,
              setLoading,
              setDate,
              setValueComission,
            })
          }
          handleCleanFilter={() =>
            handleCleanFilter({
              id: customerBuyMore ? undefined : selectSellers,
              token,
              companys: selectTheCompany,
              tables: selectTables,
              seller: customerBuyMore ? selectSellers : undefined,
              setSalesProgress,
              setTopSellers: topSellers.length > 0 ? setTopSellers : undefined,
              setSelectTables,
              setSelectTheCompany,
              setId: setSelectSellers,
              setProfitSales:
                topSellers.length > 0 ? setProfitSales : undefined,
              setDate,
              setValueComission,
              setLoading,
            })
          }
          handleExportToPdf={
            customerBuyMore.length > 0 ? undefined : () => generatePdf()
          }
        />
        <div className="w-full flex-col px-4">
          <ProgressBar
            minValue={salesProgress[0].value}
            maxValue={salesProgress[1].value}
          />
          <div className="w-full flex flex-col py-3">
            <span className="text-xl font-bold text-emerald-500 dark:text-white">
              {formatCurrency(salesProgress[0].value)}
            </span>
            <p className="text-sm text-gray-700 dark:text-white">
              Acumulados da meta de{" "}
              <span className="font-bold">
                {formatCurrency(salesProgress[1].value)}
              </span>
            </p>
          </div>
        </div>
      </Container>

      <div className="w-full lg:flex ">
        <div className="lg:w-1/5">
          <Card
            title="Meta"
            lastDay={getLastDayOfMonth(date.end.year, date.end.month)}
            month={date.start.month}
            dataInformation={[
              {
                icon: <FaHotel className="text-sm" />,
                label: `${GetGroupName(selectTheCompany)}`,
                highlight: false,
              },
              {
                icon:
                  topSellers.length > 0 ? (
                    <FaTable className="text-sm" />
                  ) : (
                    <FaMoneyBillTrendUp />
                  ),
                label:
                  topSellers.length > 0
                    ? `Tabela ${selectTables}`
                    : `Comissão: ${formatCurrency(valueCommission ? valueCommission : 0)}`,
                highlight: false,
              },
              {
                icon: <FaClockRotateLeft className="text-sm" />,
                label: `Agora atrás`,
                highlight: false,
              },
            ]}
          />
        </div>

        <div className="w-full lg:w-4/5">
          <Container>
            <div className="w-full flex justify-between items-center">
              <h2 className="font-bold px-4 py-4">
                {topSellers.length > 0
                  ? "Ranking Vendas"
                  : "Ranking de cliente que mais compra"}
              </h2>
              <Link
                className="text-sm text-gray-800 hover:underline px-3"
                href="/latecustomer"
                aria-label="Visualizar clientes em atraso"
              >
                Visualizar Clientes em atraso
              </Link>
            </div>

            <div className="w-full flex">
              <div className="w-full">
                <GraphicContainer loading={loading}>
                  {topSellers.length > 0 && (
                    <BarChart
                      data={topSellers}
                      dataKey="VALOR_LIQUIDO"
                      palette={vibrantPalette}
                      displayToolTip={true}
                      displayCartesianGrid={true}
                      ToolTipComponent={(props) => (
                        <Tooltip
                          {...props}
                          dataKey="VENDEDOR"
                          valueKey="VALOR_LIQUIDO"
                        />
                      )}
                    />
                  )}
                  {customerBuyMore.length > 0 && (
                    <BarChart
                      data={customerBuyMore}
                      dataKey="VALOR_LIQUIDO"
                      palette={vibrantPalette}
                      displayToolTip={true}
                      displayCartesianGrid={true}
                      ToolTipComponent={(props) => (
                        <Tooltip
                          {...props}
                          dataKey="NOME_CLIENTE"
                          valueKey="VALOR_LIQUIDO"
                        />
                      )}
                    />
                  )}
                </GraphicContainer>
              </div>
              {topSellers.length > 0 && (
                <div className="flex-col h-[380px] w-1/6 overflow-auto rounded-lg">
                  <DescriptionGraphic
                    data={topSellers}
                    dataKey="VENDEDOR"
                    selectingKey="ID_PSS"
                    handleSelection={selectingSellers}
                  />
                </div>
              )}
            </div>
          </Container>
        </div>
      </div>
      {topSellers.length > 0 && (
        <Drawer
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          setClear={currentDrawerSettings.clear ?? (() => {})}
        >
          <currentDrawerSettings.Component {...currentDrawerSettings.props} />
        </Drawer>
      )}
    </>
  );
}
