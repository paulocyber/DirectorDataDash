// Img
import sloganPlayCell from "@/public/img/playcell.png";

// Framework
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Dados
import routerColors from "@/data/routerColor.json";

// Bibliotecas
import { IoClose, IoExitOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { FaTable } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { TiChartPieOutline } from "react-icons/ti";

// Componentes
import { ActiveLink } from "./ActiveLink";

// React
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Tipagem
type RouterColors = {
    [key: string]: string;
};

interface SideNavProps {
    toggleMenuState: boolean;
    Close: (value: boolean) => void;
    routes: { name: string, path: string }[];
}

// Mapeamento de ícones
const iconMap: { [key: string]: JSX.Element } = {
    '/davs': <FaTable className="w-5 h-5" />,
    '/salesbybrand': <TiChartPieOutline className="w-7 h-7" />,
    '/salesbygroup': <TiChartPieOutline className="w-7 h-7" />,
    '/salesgoal': <TiChartPieOutline className="w-7 h-7" />,
    '/billstopay/table': <FaTable className="w-5 h-5" />,
};

export function SideNav({ toggleMenuState, Close, routes }: SideNavProps) {
    const router = usePathname();

    let bgColorClass: string = '';

    const routeColors: RouterColors = routerColors;
    const routeColor = routeColors[router];
    const isDetailDavs = router.startsWith('/detaildavs/');
    bgColorClass = (routeColor === "table" || isDetailDavs) ? "bg-[#fa6602]" : "bg-blue-700";

    const table = (router === "/billstopay/table" && 'tabela')
    
    const { user, signOut } = useContext(AuthContext)

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
                            <Image src={sloganPlayCell} alt="Logo PlayCell" quality={100} priority={true} className="w-full" />
                        </motion.div>
                    </Link>
                </div>
            </div>

            <div className="border-b border-white m-3"></div>
            <div className="m-4 h-screen">
                <ul className="mb-4 flex flex-col gap-2">
                    {routes.map((route) => (
                        <li key={route.path}>
                            <ActiveLink
                                href={route.path}
                                content={route.name}
                                children={
                                    route.path === '/davs' ? (
                                        <FaTable className="w-5 h-5" />
                                    ) : route.path === '/salesbybrand' ? (
                                        <TiChartPieOutline className="w-7 h-7" />
                                    ) : route.path === '/salesbygroup' ? (
                                        <TiChartPieOutline className="w-7 h-7" />
                                    ) : route.path === '/salesgoal' ? (
                                        <TiChartPieOutline className="w-7 h-7" />
                                    ) : table === 'tabela' ? (
                                        <FaTable className="w-5 h-5" />
                                    ) : (
                                        <TiChartPieOutline className="w-7 h-7" />
                                    )
                                }
                            />
                        </li>
                    ))}
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
        </aside>
    );
}