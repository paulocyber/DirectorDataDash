'use client'

// Componentes
import Container from "@/components/ui/container";
import BarChart from "@/components/ui/sciences/BarChart";
import GraphicContainer from "@/components/ui/sciences/GraphicContainer";
import ToolBar from "@/components/ui/toolbar";
import { Button } from "@/components/ui/button";
import BarChartComparison from "@/components/ui/sciences/BarChart/BarChartComparison";

// Dados
import highLightColor from "@/data/pallets/highLigh.json"

// React
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/auth";

// Utils
import { handleCleanFilter, handleDateFilter, handleRefresh } from "@/utils/handlersFilters/salesByBrand";

// Atom
import { suppliersAtoms } from "@/atom/suppliers";

// Biblioteca
import { DateRangePicker, DateValue, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, RangeValue } from "@nextui-org/react";
import { useAtom } from "jotai";

// Tipagem
import { ItemsSalesByBuy } from "@/types/salesByBrand";
import { ItemsStockByBrand } from "@/types/stock";

interface SalesByBrandProps {
    salesByBrandData: ItemsSalesByBuy[];
    stockAndDebtData: ItemsStockByBrand[];
}

export default function LayoutSalesByBrand({ salesByBrandData, stockAndDebtData }: SalesByBrandProps) {
    const [brandSales, setBrandSales] = useState(salesByBrandData);
    const [brandStockAndDebt, setBrandStockAndDebt] = useState(stockAndDebtData);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedPeriod, setSelectedPeriod] = useState<string>('Dia');
    const [brands] = useAtom(suppliersAtoms)
    const [date, setDate] = useState<RangeValue<DateValue> | null>(null);

    const { token } = useContext(AuthContext)

    return (
        <>
            <Container>
                <ToolBar
                    title="Vendas x Compras"
                    handleRefreshClick={() => handleRefresh({ selectedPeriod, token, brands, setLoading, setBrandSales, setBrandStockAndDebt })}
                    handleCleanFilter={() => handleCleanFilter({ token, brands, setSelectedPeriod, setLoading, setBrandSales, setBrandStockAndDebt })}
                />

                <div className="w-full flex flex-wrap justify-between items-center px-4 gap-4 my-2">
                    <div className="flex flex-wrap gap-2">
                        {["Dia", "Semana", "Mês", "Ano"].map((label) => (
                            <Button
                                key={label}
                                onPress={() => { setSelectedPeriod(label); handleRefresh({ selectedPeriod: label, token, brands, setLoading, setBrandSales, setBrandStockAndDebt }) }}
                                className={`font-bold h-8 px-4 text-xs ${selectedPeriod === label
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
                                    className={`font-bold h-8 px-4 text-xs ${selectedPeriod === "Outros"
                                        ? "bg-[#006fee] text-white"
                                        : "bg-white text-gray-800 border border-gray-300"
                                        } rounded-md transition-colors hover:bg-[#006fee] hover:text-white min-w-[80px] md:min-w-[100px]`}

                                >
                                    Outros
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem isReadOnly key='RangePicker'>
                                    <DateRangePicker
                                        aria-label="filtro de data"
                                        size="sm"
                                        classNames={{
                                            inputWrapper: `bg-blue-700 hover:bg-blue-700 text-white focus-within:hover:bg-white-500`,
                                            innerWrapper: "py-[0.2em] text-white ",
                                            segment: "text-white",
                                            selectorIcon: "text-center text-white",
                                        }}
                                        value={date}
                                        onChange={(newDate: RangeValue<DateValue> | null) => handleDateFilter({ date: newDate, token, brands, setDate, setLoading, setBrandSales, setBrandStockAndDebt })}
                                    />
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {["À Vista", "Outros", "Todas"].map((label) => (
                            <Button key={label} className={`font-bold h-8 px-4 text-xs bg-white text-gray-800 border border-gray-300 rounded-md transition-colors hover:bg-[#006fee] hover:text-white min-w-[80px] md:min-w-[100px]`}>
                                {label}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="w-full px-4">
                    <GraphicContainer loading={loading}>
                        <BarChartComparison data={brandSales} xKey="brand" dataKeyOne="valueSales" dataKeyTwo="buyValue" nameKeyOne="Vendas" nameKeyTwo="Compras" />
                        {/* <BarChart
                            data={brandSales}
                            dataKey="value"
                            dataKeyXAxis="brand"
                            displayXAxis={true}
                            displayCartesianGrid={true}
                            palette={highLightColor}
                            LabelListProps={true}
                        /> */}
                    </GraphicContainer>
                </div>
            </Container>
            <Container>
                <h1 className="font-bold md:text-lg text-sm py-3 px-4">Estoque em valor X Endividamento por marca</h1>
                <GraphicContainer loading={loading}>
                    <BarChartComparison data={brandStockAndDebt} xKey="brand" dataKeyOne="valueInStock" dataKeyTwo="debtValue" nameKeyOne="Estoque" nameKeyTwo="Dívida" />
                </GraphicContainer>
            </Container>
        </>
    );
}