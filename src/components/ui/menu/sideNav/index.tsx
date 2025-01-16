// Imagem
import slogan from "../../../../../public/assets/playcell.png";

// Dados
import routerColors from "@/data/router/routerColor.json";

// Next
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Biblioteca
import { IoClose } from "react-icons/io5";
import { IoChevronDown, IoChevronUp } from "react-icons/io5"; // Importando as setas
import { motion } from 'framer-motion';
import { ActiveLink } from "../activeLink";

// React
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth";
import { TbArrowsUpRight } from "react-icons/tb";

// Tipagem
type RouterColorsItems = {
    [key: string]: string;
};

interface SideNavProps {
    toggleMenuState: boolean;
    close: (value: boolean) => void;
    routes: { name: string; path: string; icon: string; children?: { name: string; path: string; icon: string }[] }[];
}

export function SideNav({ toggleMenuState, close, routes }: SideNavProps) {
    const router = usePathname();

    const [openSubMenu, setOpenSubMenu] = useState<Record<string, boolean>>({}); // Estado para controlar a visibilidade dos submenus

    let colorClass: string = '';

    const { signOut } = useContext(AuthContext);

    const routeColors: RouterColorsItems = routerColors;

    const isDetailDavs = router.startsWith('/davs/') && router.split('/').length === 3;

    const routeColor = routeColors[router];
    colorClass = (routeColor === "table" || isDetailDavs)
        ? "bg-[#fa6602]"
        : "bg-gradient-to-b from-blue-600 to-blue-800";

    return (
        <aside className={`${colorClass} fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-64 rounded-xl transition-all ease-in-out duration-300 xl:translate-x-0 border border-blue-gray-100 ${!toggleMenuState && "-translate-x-80"}`}>
            <div className="flex items-center justify-end py-2 pr-2">
                <button className="text-white xl:hidden flex hover:bg-blue-500 p-2 rounded-full" onClick={() => close(false)}>
                    <IoClose className="w-6 h-6" />
                </button>
            </div>

            <div className="flex items-center justify-center w-full">
                <div className="flex py-2 w-full justify-center items-center">
                    <Link href="/davs">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Image src={slogan} alt="Logo PlayCell" quality={80} priority={true} className="w-28" />
                        </motion.div>
                    </Link>
                </div>
            </div>

            <div className="border-b border-white m-3"></div>

            <div className="m-4 max-h-[calc(100vh-268px)] overflow-y-auto scrollable">
                <ul className="mb-4 flex flex-col gap-4">
                    {routes.map((route, index) => (
                        <li className="space-y-2" key={index}>
                            <ActiveLink content={route.name} href={route.path} icon={route.icon} />
                            {route.children && route.children.length > 0 && (
                                <div className="pl-1 w-full">
                                    {route.children.map((child, childIndex) => (
                                        <section key={childIndex} className="flex w-full items-center">
                                            <TbArrowsUpRight className="text-white mx-2 text-xl" />
                                            <ActiveLink content={child.name} href={child.path} icon={child.icon} />
                                        </section>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>


            <div className="w-full absolute bottom-0 mt-auto z-50 py-4 border-t border-white">
                <div className="flex items-center justify-center text-white hover:text-blue-200 cursor-pointer transition-all">
                    <button onClick={signOut} className="flex items-center space-x-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        <span className="text-sm font-medium">Sair do sistema</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
