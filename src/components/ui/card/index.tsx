// Componentes
import { Button } from "../button";
import Container from "../container";

// Bibliotecas
import { IoIosArrowDown } from "react-icons/io";
import { FaFlag } from "react-icons/fa";

// Utils
import { getMonthName } from "@/utils/mask/date";

// Tipagem
interface CardProps {
    title: string;
    month: number;
    lastDay: number;
    dataInformation: { icon: React.ReactNode; label: string; highlight: boolean }[];
}

export default function Card({ title, month, lastDay, dataInformation }: CardProps) {
    return (
        <Container>
            <div className="w-full flex px-4 justify-between items-center p-2">
                <div>
                    <h2 className="font-bold">{title}</h2>
                </div>
                <div>
                    <Button startContent={<IoIosArrowDown />} className="bg-transparent" size="sm" />
                </div>
            </div>

            <div className="w-full">
                <div className="flex w-full px-4 pb-3 items-center">
                    <FaFlag className="text-sm" />
                    <span className="pl-3 text-sm flex truncate ">
                        01 de {getMonthName(month)} -
                        <p className="text-sm pl-2 truncate">
                            {lastDay} de {getMonthName(month)}
                        </p>
                    </span>
                </div>
                {dataInformation.map((item, index) => (
                    <div key={index} className={`flex px-4 pb-3 items-center ${item.highlight && 'font-bold'}`}>
                        {item.icon}
                        <span className="pl-3 text-sm flex">{item.label}</span>
                    </div>
                ))}
            </div>
        </Container>
    )
}