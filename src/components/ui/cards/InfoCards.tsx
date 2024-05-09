// Framework
import { useRouter } from "next/router";

// Dados
import routerColors from "../../../data/routerColors.json"

// Tipagem
interface data {
    data: { icon: React.ElementType; title: string; value: string }[];
}

import { RouterColors } from "../menu/SideBar";

export default function InfoCards({ data }: data) {
    const router = useRouter();

    let bgColorClass: string = '';

    // Atribua os dados do JSON a uma variável para acessá-los
    const routeColors: RouterColors = routerColors;

    // Obtenha a cor da rota atual
    const routeColor = routeColors[router.pathname];
    if (routeColor === "table") {
        bgColorClass = "bg-[#fa6602]";
    } else {
        bgColorClass = "bg-[#fa6602]";
    }

    return (
        <div className="mt-5">
            <div className={`mb-5 grid gap-y-10 gap-x-6 md:grid-cols-2 ${data.length > 3 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}>
                {data.map((info, index) => (
                    <div key={index} className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md md:z-10">
                        <div className={`${bgColorClass} mx-4 rounded-xl overflow-hidden text-white shadow-black-500/40 shadow-lg absolute -mt-4 grid md:h-16 h-14 md:w-16 w-14 place-items-center`}>
                            {/* <FontAwesomeIcon icon={info.icon} className="w-5 h-5" /> */}
                            < info.icon className="w-5 h-5"/>
                            
                        </div>
                        <div className="p-4 text-right">
                            <p className="block antialiased font-sans md:text-sm text-xs leading-normal font-normal text-blue-gray-600">
                                {info.title}
                            </p>
                            <h4 className="block antialiased tracking-normal font-sans md:text-2xl text-xl font-semibold leading-snug text-blue-gray-900">
                                {info.value}
                            </h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
