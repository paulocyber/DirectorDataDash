// Utils
import ColorSchemeController from '../../utils/ColorSchemeController'

// Tipagem
import { menuProp } from '../../models/types'

// Biblioteca
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from 'react-router-dom';
import { faChevronDown, faChevronRight, faChevronUp, faFile, faMoneyBill, faTable } from '@fortawesome/free-solid-svg-icons';

// Imagem
import logoPlayCell from "./../../assets/playcell.png"

import React, { useState } from 'react';

const SideBar = ({ showMenu, isClose }: menuProp) => {
    const [showDropDown, setshowDropDown] = useState<boolean>(false)

    const { setThemeColor, location } = ColorSchemeController()
    
    return (
        <aside
            className={`small-screen:w-60 ${setThemeColor()} fixed inset-0 my-2 ml-2 h-[calc(100vh-26px)] w-80 rounded-xl transition-transform duration-300 xl:translate-x-0 ${!showMenu && "-translate-x-80"
                }`}
        >
            <div className="relative ">
                <div className="flex items-center justify-center mt-10">
                    <motion.img
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="h-[68px] pb-2"
                        src={logoPlayCell}
                    />
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
                            ></path>
                        </svg>
                    </span>
                </button>
            </div>
            <div className="border-b mx-3.5"></div>

            <div className="m-4">
                <ul className="mb-4 flex flex-col gap-1 ">
                    <li>
                        <motion.div
                            whileHover={{
                                x: [-4, 4, -4, 0],
                                transition: { duration: 0.5 },
                            }}
                        >
                            <NavLink
                                to="/"
                                onClick={() => setshowDropDown(false)}
                                className={({ isActive }) =>
                                    isActive
                                        ? "transition duration-150 ease-in-out middle none font-sans font-semibold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg bg-white text-gray-800 shadow-md hover:shadow-lg active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"
                                        : "transition duration-150 ease-in-out undmiddle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-black/50 w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"
                                }
                                type="button"
                            >
                                <FontAwesomeIcon icon={faFile} className="w-5 h-5" />
                                <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                                    Relatório de DAVs
                                </p>
                            </NavLink>
                        </motion.div>
                    </li>

                    <li>
                        <div className="">
                            <motion.div
                                whileHover={{
                                    x: [-4, 4, -4, 0],
                                    transition: { duration: 0.5 },
                                }}
                            >
                                <NavLink
                                    to="/billstopay"
                                    onClick={() => setshowDropDown(true)}
                                    className={({ isActive }) =>
                                        isActive && location.pathname === "/billstopay"
                                            ? "flex w-full items-center justify-between transition duration-150 ease-in-out middle none font-sans font-semibold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg bg-white text-gray-800 shadow-md hover:shadow-lg active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"
                                            : "flex w-full items-center justify-between transition duration-150 ease-in-out undmiddle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-black/50 w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"
                                    }
                                    type="button"
                                >
                                    <div className='flex items-center'>
                                        <FontAwesomeIcon icon={faMoneyBill} className="w-5 h-5" />
                                        <p className="pl-3 block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                                            Contas a pagar
                                        </p>
                                    </div>
                                    <button className='z-50 w-10'>
                                        <FontAwesomeIcon icon={showDropDown ? faChevronDown : faChevronUp} className="w-4 h-4" />
                                    </button>
                                </NavLink>

                            </motion.div>


                        </div>

                        <div className={`ml-4 py-1 cursor-pointer ${!showDropDown && "hidden"}`}>
                            <motion.div
                                whileHover={{ x: 8 }}
                            >
                                <NavLink to="/billstopay/table" className={`block p-2 flex items-center font-sans leading-relaxed capitalize font-bold ${location.pathname === '/billstopay/table'
                                    ? 'bg-white text-gray-800'
                                    : 'hover:bg-black/50 text-white'
                                    } rounded-lg`}>
                                    <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-sm w-3 h-3" />
                                    <p>Table Orcamento geral</p>
                                </NavLink>

                            </motion.div>
                        </div>
                    </li>
                </ul>

                <ul className="mb-4 flex flex-col gap-1 border-t border-white medium-screen:mt-0 mt-20">
                    <li className="mx-3.5 mt-4 mb-2">
                        <p className="block antialiased font-sans text-sm leading-normal text-white font-black uppercase opacity-90">
                            autenticação
                        </p>
                    </li>

                    <div className="flex items-center gap-4 py-2 px-2 w-full flex ">
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
                        <div className="flex w-50 flex-col">
                            <h6 className="block antialiased tracking-normal font-sans text-base font-bold leading-relaxed text-white text-xm pd-2">
                                Admin
                            </h6>
                            <p className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white text-xs">
                                admin@gmail.com
                            </p>
                        </div>
                    </div>

                    <motion.div
                        whileHover={{
                            x: [-4, 4, -4, 0],
                            transition: { duration: 0.5 },
                        }}
                    >
                        <a aria-current="page" className="" href="#">
                            <button
                                className="transition duration-150 ease-in-out undmiddle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-white hover:bg-black/50 active:bg-red-800/30 w-full flex items-center gap-4 px-4 capitalize transform hover:scale-105"
                                type="button"
                            >
                                <svg
                                    width="22px"
                                    height="22px"
                                    strokeWidth="1.5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    color="#fff"
                                >
                                    <path
                                        d="M12 12H19M19 12L16 15M19 12L16 9"
                                        stroke="#fff"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                    <path
                                        d="M19 6V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V18"
                                        stroke="#fff"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                </svg>
                                <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                                    Sair
                                </p>
                            </button>
                        </a>
                    </motion.div>

                </ul>
            </div>

        </aside >
    )
}

export default SideBar