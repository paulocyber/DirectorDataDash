// Biblioteca
import { DateInput, DateRangePicker, DateValue, RangeValue } from "@nextui-org/react";

// Componentes
import OptionsToolBar from "../dropDown/toolBar";
import { Input } from "../input";
import { Button } from "../button";

// Biblioteca
import { CiSearch } from "react-icons/ci";

// React

// Tipagem
import { getLocalTimeZone, today } from "@internationalized/date";
interface ToolBarProps {
    title: string;
    displayCalendar?: boolean;
    displayInputSearch?: boolean;
    displayBtnDate?: boolean;
    displayFormOfPayment?: boolean;
    descriptionHref?: string;
    selectedDateRange?: string;
    href?: string;
    setFilterSearch?: (value: string) => void;
    searchFilter?: string;
    dateRange?: RangeValue<DateValue>;
    handleDateRangePicker?: (date: RangeValue<DateValue>) => void;
    handleDate?: (date: string) => void;
    handleRefreshClick: () => void;
    handleCleanFilter?: () => void;
    generatePDF?: () => void;
}

export default function ToolBar({ title, displayCalendar, handleDateRangePicker, dateRange, handleDate, href, descriptionHref, handleRefreshClick, handleCleanFilter, displayInputSearch, setFilterSearch, generatePDF, displayBtnDate, selectedDateRange, displayFormOfPayment, searchFilter }: ToolBarProps) {
    return (
        <div className="sm:flex items-center justify-between w-full ">
            <div className="flex justify-between items-center w-full">
                <div className="flex w-full items-center p-4">
                    <div className="flex w-full items-center">
                        <div className="w-full">
                            <h1 className="font-bold md:text-lg text-sm">{title} </h1>
                        </div>
                        {/* Botao do data */}
                        {displayBtnDate &&
                            <div className="flex w-full items-center pl-2 space-x-4">
                                <Button onClick={() => { handleDate && handleDate('day') }} color={selectedDateRange === 'day' ? "primary" : undefined} className={selectedDateRange != 'day' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="md">Dia</ Button>
                                <Button onClick={() => { handleDate && handleDate('week') }} color={selectedDateRange === 'week' ? "primary" : undefined} className={selectedDateRange != 'week' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="md">Semana</Button>
                                <Button onClick={() => { handleDate && handleDate('month') }} color={selectedDateRange === 'month' ? "primary" : undefined} className={selectedDateRange != 'month' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="md">Mês</Button>
                                <Button onClick={() => { handleDate && handleDate('month yesterday') }} color={selectedDateRange === 'month yesterday' ? "primary" : undefined} className={selectedDateRange != 'month yesterday' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="md">Mês Passado</Button>
                                <Button onClick={() => { handleDate && handleDate('year') }} color={selectedDateRange === 'year' ? "primary" : undefined} className={selectedDateRange != 'year' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="md">Ano</Button>
                                {/* <DateInput
                                    label="Inicio"
                                    // minValue={today(getLocalTimeZone())}
                                    defaultValue={today(getLocalTimeZone()).subtract({ days: 1 })}
                                    className="pb-2 text-gray-800"
                                    color="default"
                                    classNames={{
                                        inputWrapper: "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-transparent focus-within:hover:bg-transparent",
                                        innerWrapper: "text-gray-800 group-data:text-gray-800",
                                        input: "text-gray-800 ",
                                        segment: "text-gray-800 ",
                                        base: "text-gray-800",
                                        description: "text-gray-800",
                                        errorMessage: "text-gray-800",
                                        helperWrapper: "text-gray-800",
                                        label: "text-gray-800",
                                    }}
                                    size="sm"
                                /> */}
                            </div>
                        }
                    </div>
                    <div className="flex justify-end px-2 sm:hidden flex">
                        <OptionsToolBar descriptionHref={descriptionHref} href={href} handleRefreshClick={handleRefreshClick} handleCleanFilter={handleCleanFilter} generatePDF={generatePDF} />

                    </div>

                </div>
            </div>
            <div className="w-full flex  justify-end">

                <div className="px-2 flex sm:pb-0 pb-5">
                    {displayInputSearch &&
                        <div className="w-full sm:flex hidden">
                            <div className="mr-auto md:mr-4 md:mt-0 mt-2 md:w-56 small-screen:w-full">
                                <Input size="sm" value={searchFilter && searchFilter} onClear={() => setFilterSearch && setFilterSearch('')} onChange={(e) => setFilterSearch && setFilterSearch(e.target.value)} placeholder="Digite alguma coisa" startContent={<CiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />} />
                            </div>
                        </div>
                    }
                    {displayCalendar &&
                        <DateRangePicker
                            aria-label="filtro de data"
                            size="sm"
                            classNames={{
                                inputWrapper: "bg-blue-700 hover:bg-blue-700 text-white focus-within:hover:bg-white-500",
                                base: "text-white",
                                innerWrapper: "py-[0.2em] text-white",
                                segment: "text-white",
                                selectorIcon: "text-center text-white",
                            }}
                            value={dateRange}
                            onChange={handleDateRangePicker}
                        />
                    }
                    {/* Forma de Pagamento */}
                    {displayFormOfPayment &&
                        <div className="flex space-x-4">
                            <Button color="primary" className="font-bold" size="sm">Avista</Button>
                            <Button className="bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" size="sm">outros</Button>
                            <Button className="bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" size="sm">Todos</Button>
                        </div>
                    }
                </div>
            </div>
            <div className="hidden sm:flex px-2">
                <OptionsToolBar
                    descriptionHref={descriptionHref}
                    href={href}
                    handleRefreshClick={handleRefreshClick}
                    handleCleanFilter={handleCleanFilter}
                    generatePDF={generatePDF}
                    displayInputSearch={displayInputSearch}
                    setFilterSearch={setFilterSearch}
                    searchFilter={searchFilter}
                />
            </div>

        </div>
    )
}