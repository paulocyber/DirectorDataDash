// Framework
import { useRouter } from "next/router"
import Link from "next/link";
import Image from "next/image";

// Dados 
import routerColors from "../../../../data/routerColor/routerColors.json"

// Imagens
import SloganPlayCell from "../../../../../public/assets/playcell.png"

// React
import { useContext, useState } from "react";

// Biblioteca
import { motion } from "framer-motion";
import { CiUser } from "react-icons/ci";
import { FaTable } from "react-icons/fa6";
import { TiChartPieOutline } from "react-icons/ti";
import { IoClose, IoExitOutline } from "react-icons/io5";

// Componentes
import ActiveLink from "../activeLink";
import { AuthContext, signOut } from "@/contexts/AuthContext";

// Tipagem
import { RouterColors } from "@/utils/types/routerColors";
interface SideNavProps {
    toggleMenuState: boolean;
    Close: (value: boolean) => void;
}

export function SideNav({ toggleMenuState, Close }: SideNavProps) {
    const router = useRouter()

    let bgColorClass: string = '';

    const routeColors: RouterColors = routerColors;
    const routeColor = routeColors[router.pathname];

    if (routeColor === "table") {
        bgColorClass = "bg-[#fa6602]";
    } else {
        bgColorClass = "bg-blue-700";
    }

    const { user } = useContext(AuthContext)

    return (
        <aside className={`${bgColorClass} fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100 ${!toggleMenuState && "-translate-x-80"}`}>
            <div className="flex items-center justify-end py-2 pr-2">
                <button className="text-white xl:hidden flex" onClick={() => Close(false)}>
                    <IoClose className="w-6 h-6" />
                </button>
            </div>
            <div className="flex items-center justify-center w-full">

                <div className="flex w-full justify-center items-center">
                    <Link href="/davs">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="pb-2 w-[140px] pt-2"
                        >
                            <Image src={SloganPlayCell} alt="Logo PlayCell" quality={100} priority={true} className="w-full" />
                        </motion.div>
                    </Link>
                </div>
            </div >

            <div className="border-b border-white m-3"></div>
            <div className="m-4 h-screen">
                <ul className="mb-4 flex flex-col gap-2">
                    <li>
                        <ActiveLink href="/davs" nameLink="Relatório de DAV's">
                            <FaTable className="w-5 h-5" />
                        </ActiveLink>
                    </li>
                    <li>
                        <ActiveLink href="/billstopay" nameLink="Contas a pagar">
                            {router.pathname === '/billstopay/table' ? <FaTable className="w-5 h-5" /> : <TiChartPieOutline className="w-7 h-7" />}
                        </ActiveLink>
                    </li>
                    <li>
                        <ActiveLink href="/salesbybrand" nameLink="Vendas por marcas">
                            <TiChartPieOutline className="w-6 h-6" />
                        </ActiveLink>
                    </li>
                    <li>
                        <ActiveLink href="/salesbygroup" nameLink="Vendas por grupo">
                            <TiChartPieOutline className="w-6 h-6" />
                        </ActiveLink>
                    </li>
                    <li>
                        <ActiveLink href="/sales" nameLink="Vendas e Metas">
                            <TiChartPieOutline className="w-6 h-6" />
                        </ActiveLink>
                    </li>
                </ul>
            </div>
            <div className="w-full absolute bottom-0">
                <div className="border-b border-white m-3"></div>
                <ul className="mb-4 flex flex-col gap-1 py-2 m-4 medium-screen:mt-0">
                    <li className="mx-3.5 mb-2">
                        <p className="block antialiased font-sans text-sm leading-normal text-white font-black uppercase opacity-90">
                            autenticação
                        </p>
                    </li>
                    <div className="flex items-center justify-center gap-4 px-2 w-full">
                        <div className="rounded-full border-2 object-cover p-1">
                            <CiUser className="text-white font-bold w-6 h-6" />
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex w-50 flex-col">
                                <h6 className="block antialiased tracking-normal font-sans text-base font-bold capitalize leading-relaxed text-white text-[15px] pd-2">
                                    Name:
                                </h6>
                                <p className="block antialiased tracking-normal font-sans text-base font-semibold capitalize leading-relaxed text-white text-[13px]">
                                    {user}
                                </p>
                            </div>
                            <button className="flex transition duration-150 ease-in-out undmiddle hover:bg-white hover:text-gray-800 text-white p-2 rounded-md" onClick={() => signOut()}>
                                <IoExitOutline className="w-6 h-6 " />
                            </button>
                        </div>
                    </div>
                </ul>
            </div>
        </aside >
    )
}