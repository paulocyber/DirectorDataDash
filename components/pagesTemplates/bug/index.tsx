"use client";

// React
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Next
import { usePathname } from "next/navigation";

// Bibliotecas
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  DateRangePicker,
} from "@heroui/react";
import { useAtom } from "jotai";
import { useDisclosure } from "@heroui/react/";

// Componentes
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolBar";
import { Button } from "@heroui/button";
import GraphicContainer from "@/components/ui/sciences/container";
import BarChartComparison from "@/components/ui/sciences/barChartComparison";
import Drawer from "@/components/ui/drawer";
import Filters from "@/components/ui/filters";

// Utils
import {
  handleRefresh,
  handleCleanFilter,
  handleDateFilter,
} from "@/utils/filters/handleFilters/salesByBrand";

// Atoms
import { suppliers } from "@/atom/filters/suppliers";

// Dados
import DrawerSettingsJson from "@/data/drawerSettings/sales";

// Tipagem
import { ItemsdebtAndStock, ItemsSalesAndBuy } from "@/types/sales";
import { DateValue } from "@heroui/react";
import { RangeValue } from "@react-types/shared";
import { refreshAtom } from "@/atom/isActivateRefresh";
import { TypeFilterProps } from "@/types/filters/selecting";
interface LayoutSalesByBrandProps {
  salesAndBuyData: ItemsSalesAndBuy[];
  debtAndStockData: ItemsdebtAndStock[];
  suppliersData: TypeFilterProps[];
}

export default function LayoutSalesByBrand({
  salesAndBuyData,
  debtAndStockData,
  suppliersData,
}: LayoutSalesByBrandProps) {
  const [salesAndBuy, setSalesAndBuy] = useState(salesAndBuyData);
  const [debyAndStock, setDebtAndStock] = useState(debtAndStockData);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Dia");
  const [activeRefresh, setActiveRefresh] = useAtom(refreshAtom);
  const [selectSuppliers, setSelectSuppliers] = useAtom(suppliers);
  const [brands] = useAtom(suppliers);
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<RangeValue<DateValue> | null>(null);

  const { token } = useContext(AuthContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const currentPath = usePathname();
  const routerDrawerSettings = DrawerSettingsJson({
    suppliersData,
    setSelectSuppliers,
    selectSuppliers,
  });
  const currentDrawerSettings = routerDrawerSettings[currentPath];

  useEffect(() => {
    if (activeRefresh) {
      handleRefresh({
        token,
        selectedPeriod,
        brands,
        setLoading,
        setSalesAndBuy,
        setDebtAndStock,
      });
      setActiveRefresh(false);
    }
  }, [activeRefresh]);

  return (
    <>
      <Container>
        <ToolBar
          title="Vendas x Compras"
          handleRefreshClick={() =>
            handleRefresh({
              token,
              selectedPeriod,
              brands,
              setLoading,
              setSalesAndBuy,
              setDebtAndStock,
            })
          }
          handleCleanFilter={() =>
            handleCleanFilter({
              token,
              brands,
              setSelectedPeriod,
              setDate,
              setLoading,
              setDebtAndStock,
              setSalesAndBuy,
            })
          }
          handleFilters={onOpen}
        />
        <div className="w-full pb-4 flex flex-wrap justify-between items-center px-4 gap-4 my-2">
          <div className="flex flex-wrap gap-2">
            {["Dia", "Semana", "Mês", "Ano"].map((label) => (
              <Button
                key={label}
                onPress={() => {
                  setSelectedPeriod(label);
                  handleRefresh({
                    token,
                    selectedPeriod: label,
                    brands,
                    setLoading,
                    setSalesAndBuy,
                    setDebtAndStock,
                  });
                }}
                className={`font-bold h-8 px-4 text-xs ${
                  selectedPeriod === label
                    ? "bg-[#006fee] text-white"
                    : "bg-white text-gray-800 border border-gray-300"
                } rounded-md transition-colors hover:bg-[#006fee] hover:text-white min-w-[80px] md:min-w-[100px]`}
              >
                {label}
              </Button>
            ))}
            <Dropdown>
              <DropdownTrigger>
                <Button
                  onPress={() => setSelectedPeriod("Outros")}
                  className={`font-bold h-8 px-4 text-xs ${
                    selectedPeriod === "Outros"
                      ? "bg-[#006fee] text-white"
                      : "bg-white text-gray-800 border border-gray-300"
                  } rounded-md transition-colors hover:bg-[#006fee] hover:text-white min-w-[80px] md:min-w-[100px]`}
                >
                  Outros
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem isReadOnly key="RangePicker">
                  <DateRangePicker
                    aria-label="Selecionar intervalo de datas"
                    pageBehavior="single"
                    disableAnimation
                    value={date}
                    size="sm"
                    onChange={(newDate: RangeValue<DateValue> | null) =>
                      handleDateFilter({
                        date: newDate,
                        token,
                        brands,
                        setDate,
                        setLoading,
                        setDebtAndStock,
                        setSalesAndBuy,
                      })
                    }
                  />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          <div className="flex flex-wrap gap-2">
            {["À Vista", "Outros", "Todas"].map((label) => (
              <Button
                key={label}
                className={`font-bold h-8 px-4 text-xs bg-white text-gray-800 border border-gray-300 rounded-md transition-colors hover:bg-[#006fee] hover:text-white min-w-[80px] md:min-w-[100px]`}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="w-full">
          <GraphicContainer loading={loading}>
            <BarChartComparison
              data={salesAndBuy}
              xKey="MARCAS"
              dataKeyOne="VALOR_ESTOQUE"
              dataKeyTwo="VALOR_DEBITO"
              nameKeyOne="Estoque"
              nameKeyTwo="Compras"
            />
          </GraphicContainer>
        </div>
      </Container>

      <Container>
        <h1 className="font-extrabold sm:text-xl truncate py-3 px-4 text-lg text-gray-800">
          Estoque em valor X Endividamento por marca
        </h1>
        <GraphicContainer loading={loading}>
          <BarChartComparison
            data={debyAndStock}
            xKey="MARCAS"
            dataKeyOne="VALOR_ESTOQUE"
            dataKeyTwo="VALOR_DIVIDA"
            nameKeyOne="Estoque"
            nameKeyTwo="Dívida"
          />
        </GraphicContainer>
      </Container>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        setClear={currentDrawerSettings.clear}
      >
        <currentDrawerSettings.Component {...currentDrawerSettings.props} />
      </Drawer>
    </>
  );
}
