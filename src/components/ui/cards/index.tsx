'use client'

// Framework - Next
import { usePathname } from "next/navigation";

// Dados
import routerColors from "@/data/routerColor.json";

// Componentes
import NumberAnimation from "../animation/numberAnimation";

// React
import { ReactNode } from "react";

// Tipagem
type RouterColors = {
    [key: string]: string;
};

export default function InfoCard({ data }: { data: { icon: ReactNode; title: string; value: string }[] }) {
    const router = usePathname();

    let bgColorClass: string = '';

    const routeColors: RouterColors = routerColors;
    const routeColor = routeColors[router];

    const isDetailDavs = router.startsWith('/detaildavs/');
    bgColorClass = (routeColor === "table" || isDetailDavs) ? "bg-[#fa6602]" : "bg-blue-700";

    return (
        <div className="mt-5 px-4">
            <div className={`mb-5 grid gap-y-10 gap-x-6 md:grid-cols-2 ${data.length > 3 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}>
                {data.map((info, index) => (
                    <div key={index} className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md md:z-10">
                        <div className={`${bgColorClass} mx-4 rounded-xl overflow-hidden text-white shadow-black-500/40 shadow-lg absolute -mt-4 grid md:h-16 h-14 md:w-16 w-14 place-items-center`}>
                           {info.icon}
                        </div>
                        <div className="p-4 text-right">
                            <p className="block antialiased font-sans md:text-sm text-xs leading-normal font-normal text-blue-gray-600">
                                {info.title}
                            </p>
                            <h4 className={`block antialiased tracking-normal font-sans md:text-2xl text-xl font-semibold leading-snug ${info.title === "Valores vencidos" ? "text-red-500" : "text-blue-gray-600"}`}>
                                <NumberAnimation value={info.value} />
                            </h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}