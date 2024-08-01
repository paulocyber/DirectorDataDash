// Biblioteca
import { DateRangePicker, DateValue, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiOutlinePieChart } from "react-icons/ai";
import { VscTable } from "react-icons/vsc";
import { RiFormatClear } from "react-icons/ri";
import { GoSync } from "react-icons/go";
import { ImFilePdf } from "react-icons/im";

// Componentes
import { Btn } from "../button";

// Framework - next
import { useRouter } from "next/router";
import Link from "next/link";

// Utils

// React
import { ReactNode, useState } from "react";

// Tipagem
import { RangeValue } from '@nextui-org/react';
interface ToolBarProps {
    title: string;
    handleRefreshClick: () => void;
    date?: RangeValue<DateValue>;
    handleDateFilter?: (date?: RangeValue<DateValue>, isDate?: string) => Promise<void>;
    handleCleanFilter?: () => void;
    href?: string;
    descriptionHref?: string;
    children?: ReactNode;
    generatePDF?: () => void;
    formOfPayment?: boolean
}

export default function ToolBar({ title, handleRefreshClick, date, handleDateFilter, handleCleanFilter, href, descriptionHref, children, generatePDF, formOfPayment }: ToolBarProps) {
    const [animation, setAnimation] = useState<boolean>(false)
    const [activateButton, setActivateButton] = useState<string>('day');

    const dropDown = false
    const router = useRouter();

    const secoundPart = router.pathname.split("/")[2];
    const routerTable = secoundPart === "table";

    return (
        <div className="md:flex items-center justify-between w-full ">
            <div className="pb-5 flex justify-between items-center w-full p-5">
                <div className="flex  items-center">
                    <h1 className="font-bold md:text-lg text-sm pr-5">{title} </h1>
                    {!date &&
                        <div className="flex space-x-4">
                            <Btn onClick={() => { handleDateFilter?.(undefined, 'day'), setActivateButton('day') }} color={activateButton === 'day' ? "primary" : undefined} className={activateButton != 'day' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="md">Dia</Btn>
                            <Btn onClick={() => { handleDateFilter?.(undefined, 'week'), setActivateButton('week') }} color={activateButton === 'week' ? "primary" : undefined} className={activateButton != 'week' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="md">Semana</Btn>
                            <Btn onClick={() => { handleDateFilter?.(undefined, 'month'), setActivateButton('month') }} color={activateButton === 'month' ? "primary" : undefined} className={activateButton != 'month' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="md">Mês</Btn>
                            <Btn onClick={() => { handleDateFilter?.(undefined, 'year'), setActivateButton('year') }} color={activateButton === 'year' ? "primary" : undefined} className={activateButton != 'year' ? "font-bold bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" : undefined} size="md">Ano</Btn>
                        </div>
                    }
                </div>
                <div className="flex justify-between items-center">
                    {children}
                    <div className="px-2">
                        {date &&
                            <DateRangePicker
                                aria-label="filtro de data"
                                classNames={{ inputWrapper: "bg-blue-700 hover:bg-blue-700 text-white focus-within:hover:bg-white-500", base: "text-white", innerWrapper: "py-[0.2em] text-white", segment: "text-white", selectorIcon: "text-center text-white", }}
                                value={date}
                                onChange={handleDateFilter}
                            />}
                        {formOfPayment &&
                            <div className="flex space-x-4">
                                <Btn color="primary" className="font-bold" size="sm">Avista</Btn>
                                <Btn className="bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" size="sm">outros</Btn>
                                <Btn className="bg-white text-gray-800 border border-gray-400 font-bold hover:bg-[#006fee] hover:text-white" size="sm">Todos</Btn>
                            </div>
                        }
                    </div>
                    <div className="px-2">
                        <Dropdown classNames={{ base: "top-1 right-2", content: "w-full", trigger: `hover:bg-blue-700 p-1 rounded-md hover:text-white transition duration-300 ease-in-out ${dropDown ? "bg-blue-700 aria-expanded:opacity-100 text-white" : ""}`, backdrop: "w-10" }}>
                            <DropdownTrigger>
                                <button>
                                    <BiDotsHorizontalRounded className="text-3xl" />
                                </button>
                            </DropdownTrigger>
                            <DropdownMenu variant="faded" aria-label="Dropdown menu with icons" disabledKeys={[`${!href && 'homeback'}`]}>
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
                                    id="href"
                                    key="homeback"
                                    startContent={routerTable ? <AiOutlinePieChart className="text-lg" /> : <VscTable className="text-lg" />}
                                    className={!href ? 'hidden' : `flex justify-center items-center text-sm font-medium py-2`}
                                    textValue="tabela"
                                    endContent={<Link href={href ? href : ''} className="md:text-sm text-xs w-full">{descriptionHref}</Link>}
                                />
                                <DropdownItem
                                    startContent={<RiFormatClear className="text-lg" />}
                                    className="flex justify-center items-center w-full text-sm font-medium py-2"
                                    onClick={handleCleanFilter}
                                    textValue="limpa filtro"
                                    endContent={<span className="md:text-sm text-xs w-full">Limpa filtro</span>}
                                />
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
            </div>
        </div>
    )
}