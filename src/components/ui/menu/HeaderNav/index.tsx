// Next Framework
import { useRouter } from "next/router";

// Dados 
import routerColors from "../../../../data/routerColor/routerColors.json"

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Biblioteca
import { CiSearch } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { PiGearSixFill } from "react-icons/pi";

// Utils
import { truncateString } from "@/utils/mask/truncateString";

// Tipagem
import { RouterColors } from "@/utils/types/routerColors";

export function HeaderNav() {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const router = useRouter();

    let bgColorClass: string = '';

    const routeColors: RouterColors = routerColors;
    const routeColor = routeColors[router.pathname];

    if (routeColor === "table") {
        bgColorClass = "bg-[#fa6602]";
    } else {
        bgColorClass = "bg-blue-700";
    }

    const firstPart = router.pathname.split("/")[1];
    const secondPart = router.pathname.split("/")[2];

    const { user } = useContext(AuthContext)

    return (
        <div className="p-4 xl:ml-[19em] 2xl:ml-80">
            <nav className={`block w-full max-w-full ${bgColorClass} text-white shadow-none rounded-xl transition-all px-3 py-2 overflow-auto`}>
                <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
                    <div className="capitalize">
                        <nav className="w-max">
                            <ol className="flex z-50 flex-wrap items-center w-full bg-opacity-60 rounded-md bg-transparent p-0 transition-all">
                                <li className="flex items-center text-blue-gray-900 antialiased font-sans text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-light-blue-500">
                                    <p className="block antialiased leading-relaxed text-inherit capitalize font-sans text-sm leading-normal text-white font-normal  transition-all hover:font-bold ">
                                        dashboard
                                    </p>

                                    <span className="text-white-500 text-sm antialiased font-sans font-normal leading-normal mx-2 pointer-events-none select-none">
                                        /
                                    </span>
                                </li>
                                <li className=" flex items-center text-white-900 antialiased font-sans text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-white-500">
                                    <p className="block antialiased font-sans text-sm leading-normal text-blue-white-900 font-normal">
                                        {firstPart}
                                    </p>
                                    <span className="text-white-500 text-sm antialiased font-sans font-normal leading-normal mx-2 pointer-events-none select-none">
                                        {secondPart && "/"}
                                    </span>
                                </li>
                            </ol>
                        </nav>
                        <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white-900">
                            {firstPart}
                        </h6>
                    </div>
                    <div className="flex items-center small-screen:flex-col">
                        <div className="mr-auto md:mr-4 md:mt-0 mt-2 md:w-56 small-screen:w-full">
                            <label
                                htmlFor="default-search"
                                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                            >
                                Search
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <CiSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <input
                                    type="search"
                                    id="default-search"
                                    className="block w-full md:p-2 p-1 md:ps-10 ps-10 text-sm text-black-900 border rounded-lg bg-white-50 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black"
                                    placeholder="Search Mockups, Logos..."
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex ">
                            <button onClick={() => setIsOpen(true)} className="hover:bg-blue-700 relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-full text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 grid xl:hidden">
                                <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                    <RxHamburgerMenu className="h-6 w-6 text-white" />
                                </span>
                            </button>

                            <a href="#">
                                <button
                                    className="middle none font-sans font-bold center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 hidden items-center gap-1 px-4 xl:flex"
                                    type="button"
                                >
                                    <FaUserCircle className="h-5 w-5 text-white" />
                                    <p className="font-sans font-bold center text-white">{truncateString(user, 5)}</p>
                                </button>

                                <button
                                    className="relative flex items-center middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 grid xl:hidden"
                                    type="button"
                                >
                                    <FaUserCircle className="h-5 w-5 text-white" />
                                </button>
                            </a>

                            <button
                                className="hover: relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-white hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30"
                                type="button"
                            >
                                <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                    <PiGearSixFill className="h-5 w-5 text-blue-gray-500" />
                                </span>
                            </button>

                            <button
                                className="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-white hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30"
                                type="button"
                            >
                                <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                    <FaBell className="h-5 w-5 text-blue-gray-500" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav >
        </div >
    )
}