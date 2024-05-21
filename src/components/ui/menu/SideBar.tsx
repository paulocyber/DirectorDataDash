// Framework
import { useRouter } from "next/router";
import Link from "next/link";

// Dados
import routerColors from "../../../data/routerColors.json";

// Imagem
import logoPlayCell from "../../../../public/assets/playcell.png"
import Image from "next/image";

// Componentes
import { AnimatedImg } from "../animated/motionImg";
import { MotionMenu } from "../animated/motionMenu";

// Bibliotecas
import { GrDocumentText } from "react-icons/gr";
import { IoExitOutline } from "react-icons/io5";
import { AuthContext, signOut } from "@/contexts/AuthContext";
import { GiTakeMyMoney } from "react-icons/gi";

// React
import React, { useContext } from "react";

// Tipagem
export interface MenuProps {
    showMenu?: boolean;
    isClose?: (value: boolean) => void;
    isOpen?: (value: boolean) => void;
}

export interface RouterColors {
    [key: string]: string;
}

export default function SideBar({ showMenu, isClose }: MenuProps) {
    const router = useRouter();

    let bgColorClass: string = '';

    // Atribua os dados do JSON a uma variável para acessá-los
    const routeColors: RouterColors = routerColors;

    // Obtenha a cor da rota atual
    const routeColor = routeColors[router.pathname];

    if (routeColor === "table") {
        bgColorClass = "bg-[#fa6602]";
    } else {
        bgColorClass = "bg-blue-700";
    }

    const { user } = useContext(AuthContext)

    return (
        <aside
            className={`${bgColorClass} fixed inset-0 my-2 ml-2 h-[calc(100vh-26px)] w-20 2xl:w-80 xl:w-[20%] rounded-xl transition-transform duration-300 xl:translate-x-0 ${!showMenu && "-translate-x-80"
                }`}
        >
            <div className="relative ">
                <div className="flex items-center justify-center mt-10">
                    <AnimatedImg
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="pb-2 w-[140px] "
                    >
                        <Image src={logoPlayCell} alt="logo da PlayCell" priority/>
                    </AnimatedImg>
                </div>
                <button
                    onClick={() => isClose && isClose(false)}
                    className="middle mr-3 none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-black/50 active:bg-white/30 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
                    type="button"
                >
                    <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            className="h-5 w-5 text-white"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            >
                            </path>
                        </svg>
                    </span>
                </button>
            </div>
            <div className="m-4 border-t py-3.5 h-screen">
                <ul className="mb-4 flex flex-col gap-1">
                    <li>
                        <MotionMenu hoverAnimation={{ scale: 1.0, transition: { duration: 0.3 } }}>
                            <Link href="/" className={router.pathname === '/davsummaryreport' || router.pathname.split('/')[1] === 'detaildav' ? "transition duration-150 ease-in-out middle none font-sans font-semibold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg bg-white text-gray-800 shadow-md hover:shadow-lg active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105" : "transition duration-150 ease-in-out undmiddle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-black/50 w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"}>
                                <GrDocumentText className="w-5 h-5" />
                                <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                                    Relatório de DAVs
                                </p>
                            </Link>
                        </MotionMenu>
                    </li>

                    <li>
                        <MotionMenu hoverAnimation={{ scale: 1.0, transition: { duration: 0.3 } }}>
                            <Link href="/billstopay" className={router.pathname === '/billstopay' || router.pathname === '/billstopay/table' ? "transition duration-150 ease-in-out middle none font-sans font-semibold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg bg-white text-gray-800 shadow-md hover:shadow-lg active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105" : "transition duration-150 ease-in-out undmiddle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-black/50 w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"}>
                                <GiTakeMyMoney className="w-7 h-7" />
                                <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                                    Contas a pagar
                                </p>
                            </Link>
                        </MotionMenu>
                    </li>
                </ul>
            </div>

            <div className="w-full absolute bottom-0 py-2">
                <ul className="mb-4 flex flex-col gap-1 border-t border-white medium-screen:mt-0 mt-20">
                    <li className="mx-3.5 mt-4 mb-2">
                        <p className="block antialiased font-sans text-sm leading-normal text-white font-black uppercase opacity-90">
                            autenticação
                        </p>
                    </li>

                    <div className="flex items-center gap-4 py-2 px-2 w-full flex">
                        <div className="rounded-full border-2 object-cover p-2">
                            <svg
                                width="26px"
                                height="26px"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                color="#fff"
                            >
                                <path
                                    d="M5 20V19C5 15.134 8.13401 12 12 12V12C15.866 12 19 15.134 19 19V20"
                                    stroke="#fff"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>
                                <path
                                    d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                                    stroke="#fff"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>
                            </svg>

                        </div>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex w-50 flex-col">
                                <h6 className="block antialiased tracking-normal font-sans text-base font-bold capitalize leading-relaxed text-white text-xm pd-2">
                                    Name:
                                </h6>
                                <p className="block antialiased tracking-normal font-sans text-base  font-semibold capitalize leading-relaxed text-white text-sm">
                                    {user?.username}
                                </p>

                            </div>
                            <button className="flex hover:bg-white hover:text-gray-800 text-white p-2 rounded-md" onClick={() => signOut()}>
                                <IoExitOutline className="w-6 h-6 " />
                            </button>
                        </div>
                    </div>
                </ul>
            </div>
        </aside>
    );
};
