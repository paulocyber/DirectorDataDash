'use client';

// Next
import { usePathname } from "next/navigation";

// Componentes
import NumberAnimation from "../animation/numberAnimation";

// Dados
import routerColors from "@/data/router/routerColor.json";

// React
import { ReactNode } from "react";

// Tipagem
type RouterColors = {
    [key: string]: string;
};

export default function InfoCard({ data }: { data: { icon: ReactNode; title: string; value: string }[] }) {
    const router = usePathname();

    const routeColors: RouterColors = routerColors;
    const routeColor = routeColors[router];

    const isDetailDavs = router.startsWith('/davs/') && router.split('/').length === 3;
    const bgColorClass = (routeColor === "table" || isDetailDavs) ? "bg-[#fa6602]" : "bg-blue-700";

    return (
        <div className="my-6">
            <div
                className={`grid gap-y-8 gap-x-8 md:grid-cols-2 ${data.length > 3 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}
            >
                {data.map((info, index) => (
                    <div
                        key={index}
                        className="relative flex flex-col rounded-lg bg-white text-gray-800 shadow-md transition hover:shadow-lg hover:-translate-y-1"
                    >
                        <div
                            className={`${bgColorClass} absolute -top-5 left-5 text-white flex h-16 w-16 items-center justify-center rounded-full shadow-md`}
                        >
                            {info.icon}
                        </div>
                        <div className="p-5 pt-12">
                            <p className="text-sm font-medium text-gray-500">{info.title}</p>
                            <h4
                                className={`mt-2 text-xl font-bold ${info.title === "Valores vencidos" || info.title === "Total de Valores Atrasados"
                                    ? "text-red-500"
                                    : "text-gray-800"
                                    }`}
                            >
                                <NumberAnimation value={info.value} />
                            </h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
