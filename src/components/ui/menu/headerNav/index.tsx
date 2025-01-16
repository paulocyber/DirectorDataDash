// Next
import { usePathname } from "next/navigation"

// Dados
import routerColors from '@/data/router/routerColor.json';

// Biblioteca
import { FaBell, FaUserCircle } from "react-icons/fa";
import { PiGearSixFill } from "react-icons/pi";

// React
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth";
import { RxHamburgerMenu } from "react-icons/rx";

// Tipagem
type RouterColorsItems = {
    [key: string]: string
}

interface HeraderNavProps {
    open: (value: boolean) => void;
    openModal?: () => void;
    toogleMenuState: boolean;
}

export function HeaderNav({ open, toogleMenuState, openModal }: HeraderNavProps) {
    const router = usePathname();

    let colorClass: string = '';

    const routeColors: RouterColorsItems = routerColors;

    const isDetailDavs = router.startsWith('/davs/') && router.split('/').length === 3;

    const routeColor = routeColors[router];
    colorClass = (routeColor === "table" || isDetailDavs)
        ? "bg-[#fa6602]"
        : "bg-gradient-to-b from-blue-600 to-blue-800";

    const firstPart = router.split("/")[1];
    const secondPart = router.split("/")[2];

    const { user } = useContext(AuthContext)

    return (
        <div className="p-4 xl:ml-[19em] 2xl:ml-72">
            <nav className={`w-full ${colorClass} text-white shadow-md rounded-xl px-4 py-3 transition-all`} >
                <div className="flex justify-between md:items-center gap-6">

                    <div className="capitalize">
                        <nav>
                            <ol className="flex flex-wrap items-center gap-2 text-sm">
                                <li className="text-gray-300 hover:text-white transition">
                                    Dashboard
                                </li>
                                <span>/</span>
                                <li className="text-gray-300 hover:text-white transition">
                                    {firstPart}
                                </li>
                                {secondPart && (
                                    <>
                                        <span>/</span>
                                        <li className="text-gray-300 hover:text-white transition">
                                            {secondPart}
                                        </li>
                                    </>
                                )}
                            </ol>
                        </nav>
                        <h6 className="text-lg font-semibold">{firstPart}</h6>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex w-full">
                            <div className="flex space-x-3 items-center">
                                <button
                                    className="hidden lg:flex items-center gap-2 text-sm font-bold text-white hover:underline"
                                    type="button"
                                >
                                    <FaUserCircle className="h-5 w-5" />
                                    <span className="w-12 truncate">{user}</span>
                                </button>

                                <button
                                    onClick={openModal}
                                    className={`flex justify-center items-center md:w-10 w-8 md:h-10 h-8 rounded-lg bg-gray-100/10 hover:bg-gray-200/20 transition ${!openModal && 'cursor-default'}`}
                                    type="button"
                                >
                                    <PiGearSixFill className="h-5 w-5 text-white" />
                                </button>

                                <button
                                    className="flex justify-center items-center md:w-10 w-8 md:h-10 h-8 rounded-lg bg-gray-100/10 hover:bg-gray-200/20 transition"
                                    type="button"
                                >
                                    <FaBell className="h-5 w-5 text-white" />
                                </button>

                                <button
                                    className="flex justify-center items-center md:w-10 w-8 md:h-10 h-8 rounded-lg bg-gray-100/10 hover:bg-gray-200/20 lg:hidden transition"
                                    type="button"
                                >
                                    <FaUserCircle className="h-5 w-5 text-white" />
                                </button>

                                <button onClick={() => open(true)} className={`${toogleMenuState ? 'bg-blue-700' : 'hover:bg-blue-700'} relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-full text-xs text-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 grid xl:hidden`}>
                                    <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                        <RxHamburgerMenu className="h-6 w-6 text-white" />
                                    </span>
                                </button>
                            </div>


                        </div>
                    </div>
                </div>

            </nav>
        </div>
    )
}