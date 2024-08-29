// Bibliotecas
import { Autocomplete, AutocompleteItem, DateRangePicker, DateValue, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, RangeValue } from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import { ImFilePdf } from "react-icons/im";
import { FaStore } from "react-icons/fa6";
import { VscTable } from "react-icons/vsc";
import { GoSync } from "react-icons/go";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { RiFormatClear } from "react-icons/ri";
import { AiOutlinePieChart } from "react-icons/ai";

// Reat
import { ReactNode, useState } from "react";

// Framework - Next
import Link from "next/link";

// Componentes
import { Input } from "../input";
import { Button } from "../button";
import OptionsToolBar from "../dropDown/toolBar";

// Tipagem
import { getLocalTimeZone, today } from "@internationalized/date";
interface ToolBarProps {
    title: string;
    displayCalendar?: boolean;
    displayInputSearch?: boolean;
    displayBtnDate?: boolean;
    displayFormOfPayment?: boolean;
    displayEmp?: boolean;
    descriptionHref?: string;
    selectedDateRange?: string;
    href?: string;
    searchFilter?: string;
    dateRange?: RangeValue<DateValue>;
    emp?: string;
    children?: ReactNode;
    setFilterSearch?: (value: string) => void;
    setEmp?: (value: string) => void;
    handleDateRangePicker?: (date: RangeValue<DateValue>) => void;
    handleDate?: (date: string) => void;
    handleRefreshClick: () => void;
    handleCleanFilter?: () => void;
    generatePDF?: () => void;
}

const dateButtons = [
    { label: "Dia", value: "day" },
    { label: "Semana", value: "week" },
    { label: "Mês", value: "month" },
    { label: "Ano", value: "year" },
];

export default function ToolBar({
    title,
    displayCalendar,
    handleDateRangePicker,
    dateRange,
    handleDate,
    href,
    descriptionHref,
    handleRefreshClick,
    handleCleanFilter,
    displayInputSearch,
    setFilterSearch,
    generatePDF,
    displayBtnDate,
    selectedDateRange,
    displayFormOfPayment,
    searchFilter,
    displayEmp,
    setEmp,
    emp,
    children
}: ToolBarProps) {
    const [animation, setAnimation] = useState<Boolean>(false)

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
                </div>
            </div>
            <div className="w-full flex justify-end">
                <div className="px-2 flex sm:pb-0 pb-5">
                    {children}
                    {displayInputSearch && (
                        <div className="w-full sm:flex hidden">
                            <div className="mr-auto md:mr-4 md:mt-0 mt-2 md:w-56 small-screen:w-full">
                                <Input
                                    size="sm"
                                    value={searchFilter}
                                    onClear={() => setFilterSearch && setFilterSearch('')}
                                    onChange={(e) => setFilterSearch && setFilterSearch(e.target.value)}
                                    placeholder="Digite alguma coisa"
                                    startContent={<CiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                                />
                            </div>
                        </div>
                    )}
                    {displayCalendar && (
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
                    )}
                    {displayFormOfPayment && (
                        <div className="flex space-x-4">
                            <Button color="primary" className="font-bold" size="sm">Avista</Button>
                            <Button className="bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" size="sm">Outros</Button>
                            <Button className="bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" size="sm">Todos</Button>
                        </div>
                    )}
                </div>
            </div>
            <div className="hidden sm:flex px-2">
                <Dropdown classNames={{ base: "top-1 right-2", content: "w-full", trigger: `hover:bg-blue-700 p-1 rounded-md hover:text-white transition duration-300 ease-in-out `, backdrop: "w-10" }}>
                    <DropdownTrigger>
                        <button>
                            <BiDotsHorizontalRounded className="text-3xl" />
                        </button>
                    </DropdownTrigger>
                    <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
                        <DropdownItem
                            isReadOnly
                            startContent={<CiSearch className="text-lg" />}
                            className={displayInputSearch ? 'hidden' : `flex justify-center items-center w-full text-sm font-medium py-2 sm:hidden`}
                            textValue="Filtro de pesquisa"
                            endContent={<Input size="sm" className="w-full" onClear={() => setFilterSearch && setFilterSearch('')} onChange={(e) => setFilterSearch && setFilterSearch(e.target.value)} placeholder="Digite alguma coisa" />}
                        />
                        <DropdownItem
                            startContent={<GoSync className={animation ? "animate-spin text-lg" : "text-lg"} />}
                            onMouseEnter={() => setAnimation(true)}
                            onMouseLeave={() => setAnimation(false)}
                            className="flex justify-center items-center text-sm font-medium py-2"
                            textValue="atualizar"
                            onClick={handleRefreshClick}
                            endContent={<span className="md:text-sm text-xs w-full">Atualizar</span>}
                        />
                        <DropdownItem
                            isReadOnly
                            startContent={<FaStore className="text-lg" />}
                            className={displayEmp ? "flex justify-center items-center w-full text-sm font-medium py-2" : "hidden"}
                            textValue="lojas"
                            children={
                                <Autocomplete aria-label="Filtro de empresas" selectedKey={emp} onSelectionChange={(key) => {
                                    if (setEmp) {
                                        if (key) {
                                            setEmp(key.toString());
                                        } else {
                                            setEmp('');
                                        }
                                    }
                                }} value={emp} className="w-full" size="sm">
                                    <AutocompleteItem key="1">PlayCell</AutocompleteItem>
                                    <AutocompleteItem key="2">Play Personalizados</AutocompleteItem>
                                    <AutocompleteItem key="3">Play Up</AutocompleteItem>
                                </Autocomplete>
                            }
                        />
                        <DropdownItem
                            startContent={<RiFormatClear className="text-lg" />}
                            className="flex justify-center items-center w-full text-sm font-medium py-2"
                            onClick={handleCleanFilter}
                            textValue="limpa filtro"
                            endContent={<span className="md:text-sm text-xs w-full">Limpa filtro</span>}
                        />
                        <DropdownItem
                            id="href"
                            key="homeback"
                            startContent={descriptionHref === 'Grafico' ? <AiOutlinePieChart className="text-lg" /> : <VscTable className="text-lg" />}
                            className={!href ? 'hidden' : `flex justify-center items-center text-sm font-medium py-2`}
                            textValue="tabela"
                            endContent={<Link href={href ? href : ''} className="md:text-sm text-xs w-full">{descriptionHref}</Link>}
                        />
                        {/* Gerador de pdf */}
                        <DropdownItem
                            startContent={<ImFilePdf className="text-lg" />}
                            className={!generatePDF ? "hidden" : "flex justify-center items-center w-full text-sm font-medium py-2"}
                            onClick={generatePDF}
                            textValue="Gerar PDF"
                            endContent={<span className="md:text-sm text-xs w-full">Gerar PDF</span>}
                        />
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
}